import "server-only";
import sharp from "sharp";
import { env } from "@/lib/env";
import { errorMessage, PROVIDER_TIMEOUT_MS } from "./http";
import { buildStylePrompt, PORTRAIT_SYSTEM_PROMPT } from "./prompt";
import { fal, falGpt } from "./providers/fal";
import { gemini } from "./providers/gemini";
import { mock, mockEnabled } from "./providers/mock";
import { openai } from "./providers/openai";
import { replicate } from "./providers/replicate";
import {
  AiUnavailableError,
  GenerationFailedError,
  ProviderError,
  type GeneratePortraitInput,
  type GeneratePortraitResult,
  type ModelFamily,
  type PortraitProvider,
  type ProviderAttempt,
} from "./types";

export * from "./types";
export { buildPortraitPrompt, buildStylePrompt, PORTRAIT_SYSTEM_PROMPT } from "./prompt";

const REGISTRY: Record<string, PortraitProvider> = {
  fal,
  "fal-gpt": falGpt,
  replicate,
  gemini,
  openai,
  mock,
};

/** Don't start another provider unless at least this much of the deadline remains. */
const MIN_ATTEMPT_MS = 12_000;

/**
 * Providers that will be tried, in order. Follows AI_PROVIDER_ORDER (ids: fal, replicate, fal-gpt,
 * gemini, openai) and skips any without credentials. The dev mock (AI_MOCK=1, never in
 * production) goes first when enabled.
 */
export function configuredProviders(): PortraitProvider[] {
  const order = mockEnabled() ? ["mock", ...env.aiProviderOrder] : env.aiProviderOrder;
  const seen = new Set<string>();
  const list: PortraitProvider[] = [];
  for (const id of order) {
    const p = REGISTRY[id];
    if (!p || seen.has(id) || !p.configured()) continue;
    seen.add(id);
    list.push(p);
  }
  return list;
}

/** True when at least one provider (or the dev mock) can generate. */
export function aiAvailable() {
  return configuredProviders().length > 0;
}

/**
 * Generate a portrait, walking the provider chain until one succeeds.
 * - A timeout/HTTP/outage failure moves on to the next provider.
 * - A content-policy refusal skips every remaining provider running the same model family
 *   (fal and Replicate both proxy Google for Nano Banana).
 * Throws AiUnavailableError (nothing configured) or GenerationFailedError (all failed).
 */
export async function generatePortrait(input: GeneratePortraitInput): Promise<GeneratePortraitResult> {
  const providers = configuredProviders();
  if (providers.length === 0) throw new AiUnavailableError();

  const prompt = buildStylePrompt(input.style);
  const deadline = input.deadline ?? Date.now() + PROVIDER_TIMEOUT_MS;
  const attempts: ProviderAttempt[] = [];
  const refusedFamilies = new Set<ModelFamily>();

  for (const provider of providers) {
    if (refusedFamilies.has(provider.family())) continue;
    const remaining = deadline - Date.now();
    if (attempts.length > 0 && remaining < MIN_ATTEMPT_MS) break;

    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.max(1_000, Math.min(PROVIDER_TIMEOUT_MS, remaining)));
    try {
      const out = await provider.generate(
        {
          imageUrl: input.imageUrl,
          imageBytes: input.imageBytes,
          mime: input.mime,
          system: PORTRAIT_SYSTEM_PROMPT,
          prompt,
          style: input.style,
        },
        controller.signal,
      );
      const meta = await sharp(out.bytes).metadata();
      if (!meta.width || !meta.height) throw new Error("Provider returned an unreadable image");
      attempts.push({ provider: provider.id, model: out.model, ok: true, ms: Date.now() - started });
      return {
        bytes: out.bytes,
        mime: out.mime,
        provider: provider.id,
        model: out.model,
        width: meta.width,
        height: meta.height,
        attempts,
      };
    } catch (err) {
      const error = controller.signal.aborted ? "timed out" : errorMessage(err);
      if (err instanceof ProviderError && err.refused) refusedFamilies.add(provider.family());
      attempts.push({ provider: provider.id, model: provider.model(), ok: false, ms: Date.now() - started, error });
      console.error(`[ai] ${provider.id} (${provider.model()}) failed after ${Date.now() - started}ms: ${error}`);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new GenerationFailedError(attempts);
}
