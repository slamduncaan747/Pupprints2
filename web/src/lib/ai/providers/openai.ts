import "server-only";
import OpenAI, { APIError, APIUserAbortError, toFile } from "openai";
import { env } from "@/lib/env";
import { PROVIDER_TIMEOUT_MS } from "../http";
import { ProviderError, type PortraitProvider } from "../types";

/**
 * OpenAI GPT Image, called directly: Images API edit endpoint (`POST /v1/images/edits`, SDK `images.edit`).
 * Primary provider. Verified against the official docs and the `openai` SDK 7.32 types (Oct 2026):
 *   https://developers.openai.com/api/docs/guides/image-generation
 *   https://developers.openai.com/api/docs/models/gpt-image-2.5-flare
 *
 * Model: `gpt-image-2.5-flare` (alias of `gpt-image-2.5-flare-2026-09-08`), OpenAI's fast GPT Image 2.5
 * variant. `gpt-image-2.5-sunburst` (OPENAI_IMAGE_MODEL) edits more precisely but runs ~1.5–2× slower.
 *
 * Settings (override with env vars):
 * - Size: GPT Image 2.x takes any WIDTHxHEIGHT (multiples of 16, ≤3840 px edge), so we ask for a true 3:4
 *   `1536x2048` (3.1 MP, below the 2560x1440 "experimental" pixel count). gpt-image-1.x only offers
 *   fixed sizes, so it gets the 2:3 portrait `1024x1536`. OPENAI_IMAGE_SIZE overrides.
 * - Quality: `high` on GPT Image 2.5. 2.5 rescaled its tiers (low/medium/high/xhigh/max = 16/24/48/64/96
 *   in OpenAI's token calculator); 2.5 `high` produces the same number of output tokens as GPT Image 2
 *   `medium`. At 1536x2048 that is 2,223 output tokens = $0.067 (+ ~$0.01 for the input photo), ~20–30 s.
 *   `medium` is 556 tokens = $0.017 and ~5–10 s faster. OPENAI_IMAGE_QUALITY = low | medium | high
 *   (| xhigh | max on 2.5 only). Older models default to `medium` (GPT Image 2 `high` takes ~2 min).
 * - Identity: GPT Image 2.x always reads input images at high fidelity. The docs say to omit
 *   `input_fidelity` for them ("the API doesn't allow changing it"; the SDK only lists it for
 *   gpt-image-1 / 1.5), so we send `input_fidelity: "high"` to gpt-image-1 / 1.5 only.
 * - `background: "opaque"` + PNG: every portrait must fill the canvas edge to edge for printing.
 */
const DEFAULT_MODEL = "gpt-image-2.5-flare";

type Quality = "low" | "medium" | "high" | "xhigh" | "max" | "auto";
const QUALITIES: readonly Quality[] = ["low", "medium", "high", "xhigh", "max", "auto"];

let client: OpenAI | null = null;
function getClient() {
  // Retries are the provider chain's job (it falls back to Gemini), so the SDK must not retry.
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 });
  return client;
}

/** Request settings for a model id (exported for the smoke script's log line). */
export function openaiImageSettings(model: string) {
  const v25 = model.startsWith("gpt-image-2.5");
  const flexibleSize = model.startsWith("gpt-image-2"); // gpt-image-2, its snapshot, and 2.5-*
  const v1 = model.startsWith("gpt-image-1");

  const sizeEnv = process.env.OPENAI_IMAGE_SIZE?.trim();
  const size = sizeEnv && /^(\d+x\d+|auto)$/.test(sizeEnv) ? sizeEnv : flexibleSize ? "1536x2048" : "1024x1536";

  let quality: Quality = v25 ? "high" : "medium";
  const qEnv = process.env.OPENAI_IMAGE_QUALITY?.trim().toLowerCase() as Quality | undefined;
  if (qEnv && QUALITIES.includes(qEnv)) quality = qEnv;
  if (!v25 && (quality === "xhigh" || quality === "max")) quality = "high"; // only 2.5 has xhigh/max

  // gpt-image-1-mini only supports "low"; 2.x rejects the parameter (always high fidelity).
  const inputFidelity = v1 && !model.includes("mini") ? ("high" as const) : undefined;

  return { size, quality, inputFidelity };
}

/** Map SDK errors to ProviderError; `refused` marks a moderation block (retrying GPT Image won't help). */
function toProviderError(err: unknown): ProviderError {
  if (err instanceof APIUserAbortError) return new ProviderError("openai", "timed out (request aborted)");
  if (err instanceof APIError) {
    const body = (err.error ?? {}) as { code?: string; type?: string; moderation_details?: { moderation_stage?: string } };
    const code = err.code ?? body.code ?? "";
    const message = err.message.replace(/\s+/g, " ").replace(/^\d{3} /, "").slice(0, 300);
    if (code === "moderation_blocked" || /moderation_blocked|safety system/i.test(message)) {
      const stage = body.moderation_details?.moderation_stage;
      return new ProviderError("openai", `content policy refusal${stage ? ` at ${stage}` : ""}: ${message}`, true);
    }
    let hint = "";
    if (err.status === 401) hint = " (check OPENAI_API_KEY)";
    else if (err.status === 403 && /verif/i.test(message))
      hint = " (verify the organization: platform.openai.com/settings/organization/general → Verify Organization)";
    else if (code === "insufficient_quota" || /billing|quota/i.test(message)) hint = " (add credit: platform.openai.com/settings/organization/billing)";
    return new ProviderError("openai", `HTTP ${err.status ?? "?"}${code ? ` ${code}` : ""}: ${message}${hint}`);
  }
  return new ProviderError("openai", err instanceof Error ? err.message : String(err));
}

export const openai: PortraitProvider = {
  id: "openai",
  configured: () => Boolean(env.openaiApiKey),
  model: () => process.env.OPENAI_IMAGE_MODEL?.trim() || DEFAULT_MODEL,
  family: () => "openai",

  async generate(input, signal) {
    const model = this.model();
    const { size, quality, inputFidelity } = openaiImageSettings(model);
    const ext = input.mime === "image/png" ? "png" : input.mime === "image/webp" ? "webp" : "jpg";
    const image = await toFile(input.imageBytes, `dog.${ext}`, { type: input.mime });

    let res;
    try {
      res = await getClient().images.edit(
        {
          model,
          image,
          prompt: `${input.system}\n\n${input.prompt}`,
          n: 1,
          size,
          quality,
          background: "opaque",
          output_format: "png",
          ...(inputFidelity ? { input_fidelity: inputFidelity } : {}),
        },
        { signal, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 },
      );
    } catch (err) {
      throw toProviderError(err);
    }
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) throw new ProviderError("openai", "No image in response");
    const format = res.output_format ?? "png";
    return { bytes: Buffer.from(b64, "base64"), mime: `image/${format}`, model };
  },
};
