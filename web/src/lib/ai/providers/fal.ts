import "server-only";
import { createFalClient, type FalClient } from "@fal-ai/client";
import { env } from "@/lib/env";
import { dataUri, fetchImageBytes } from "../http";
import { ProviderError, type ModelFamily, type PortraitProvider, type ProviderInput } from "../types";

/**
 * fal.ai adapters (verified against fal's live API pages, Oct 2026). Optional: used only when FAL_KEY
 * is set, after the direct OpenAI and Gemini providers in the default AI_PROVIDER_ORDER.
 *
 * - `fal`     → `google/nano-banana-2.1/edit` (Nano Banana 2.1; ~$0.06 per 2K image)
 * - `fal-gpt` → `openai/gpt-image-2.5/flare/edit` (different vendor, survives Google refusals/outages)
 *
 * Override with FAL_IMAGE_MODEL / FAL_FALLBACK_MODEL. Input shapes for Nano Banana, GPT Image,
 * FLUX.2 and FLUX.1 Kontext endpoints are all handled.
 */
const PRIMARY_MODEL = "google/nano-banana-2.1/edit";
const FALLBACK_MODEL = "openai/gpt-image-2.5/flare/edit";

/** Ask fal not to keep our customers' photos/results around (docs/research/ai-tech.md §7.2). */
const PRIVACY_HEADERS = {
  "X-Fal-Object-Lifecycle-Preference": JSON.stringify({ expiration_duration_seconds: 3600 }),
  "X-Fal-Store-IO": "0",
};

let client: FalClient | null = null;
function getClient() {
  if (!client) client = createFalClient({ credentials: env.falKey });
  return client;
}

function familyOf(model: string): ModelFamily {
  if (/gpt-image|openai/.test(model)) return "openai";
  if (/flux|kontext/.test(model)) return "bfl";
  return "google";
}

function buildInput(model: string, input: ProviderInput, imageUrl: string): Record<string, unknown> {
  if (/nano-banana|gemini/.test(model)) {
    return {
      prompt: input.prompt,
      system_prompt: input.system,
      image_urls: [imageUrl],
      aspect_ratio: "3:4",
      resolution: process.env.AI_IMAGE_RESOLUTION || "2K",
      output_format: "png",
      num_images: 1,
      thinking_level: "medium",
      safety_tolerance: "4",
      limit_generations: true,
    };
  }
  const prompt = `${input.system}\n\n${input.prompt}`;
  if (/gpt-image/.test(model)) {
    return {
      prompt,
      image_urls: [imageUrl],
      image_size: { width: 1536, height: 2048 },
      quality: process.env.FAL_GPT_QUALITY || "medium",
      output_format: "png",
      num_images: 1,
    };
  }
  if (/kontext/.test(model)) {
    return { prompt, image_url: imageUrl, aspect_ratio: "3:4", output_format: "png", safety_tolerance: "2", num_images: 1 };
  }
  // FLUX.2 family
  return { prompt, image_urls: [imageUrl], image_size: { width: 1536, height: 2048 }, output_format: "png", safety_tolerance: "2" };
}

const REFUSAL = /safety|policy|moderation|blocked|nsfw|content|prohibited/i;

async function run(id: "fal" | "fal-gpt", model: string, input: ProviderInput, signal: AbortSignal) {
  const imageUrl = input.imageUrl ?? dataUri(input.imageBytes, input.mime);
  let data: { images?: { url?: string; content_type?: string }[] } | undefined;
  try {
    const result = await getClient().subscribe(model, {
      input: buildInput(model, input, imageUrl),
      abortSignal: signal,
      logs: false,
      startTimeout: 30,
      headers: PRIVACY_HEADERS,
    });
    data = result.data as typeof data;
  } catch (err) {
    const body = (err as { body?: unknown }).body;
    const detail = `${(err as Error).message ?? err}${body ? ` ${JSON.stringify(body).slice(0, 300)}` : ""}`;
    throw new ProviderError(id, detail, REFUSAL.test(detail));
  }
  const image = data?.images?.[0];
  if (!image?.url) throw new ProviderError(id, "No image in response (possibly filtered)", true);
  const { bytes, mime } = await fetchImageBytes(image.url, signal);
  return { bytes, mime: image.content_type || mime, model };
}

export const fal: PortraitProvider = {
  id: "fal",
  configured: () => Boolean(env.falKey),
  model: () => process.env.FAL_IMAGE_MODEL || PRIMARY_MODEL,
  family() {
    return familyOf(this.model());
  },
  generate(input, signal) {
    return run("fal", this.model(), input, signal);
  },
};

export const falGpt: PortraitProvider = {
  id: "fal-gpt",
  configured: () => Boolean(env.falKey),
  model: () => process.env.FAL_FALLBACK_MODEL || FALLBACK_MODEL,
  family() {
    return familyOf(this.model());
  },
  generate(input, signal) {
    return run("fal-gpt", this.model(), input, signal);
  },
};
