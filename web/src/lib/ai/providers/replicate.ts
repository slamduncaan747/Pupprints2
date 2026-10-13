import "server-only";
import Replicate from "replicate";
import { env } from "@/lib/env";
import { dataUri, fetchImageBytes } from "../http";
import { ProviderError, type PortraitProvider, type ProviderInput } from "../types";

/**
 * Replicate — same Nano Banana 2.1 model as our primary, on a different provider
 * (input schema per docs/research/ai-tech.md §5.2: `image_input[]`, `aspect_ratio`, `resolution`).
 * Override with REPLICATE_IMAGE_MODEL; FLUX.2 (`input_images[]`) and FLUX Kontext (`input_image`)
 * shapes are handled too.
 */
const DEFAULT_MODEL = "google/nano-banana-2.1";

let client: Replicate | null = null;
function getClient() {
  if (!client) client = new Replicate({ auth: env.replicateToken, useFileOutput: false });
  return client;
}

function firstUrl(output: unknown): string | undefined {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return firstUrl(output[0]);
  if (output && typeof output === "object") {
    const o = output as { url?: unknown; output?: unknown };
    if (typeof o.url === "string") return o.url;
    if (o.output) return firstUrl(o.output);
  }
  return undefined;
}

function buildInput(model: string, input: ProviderInput, imageUrl: string) {
  const prompt = `${input.system}\n\n${input.prompt}`;
  if (/nano-banana|gemini/.test(model)) {
    return {
      prompt,
      image_input: [imageUrl],
      aspect_ratio: "3:4",
      resolution: process.env.AI_IMAGE_RESOLUTION || "2K",
      output_format: "png",
    };
  }
  if (/kontext/.test(model)) {
    return { prompt, input_image: imageUrl, aspect_ratio: "3:4", output_format: "png", safety_tolerance: 2 };
  }
  return { prompt, input_images: [imageUrl], aspect_ratio: "3:4", output_format: "png", safety_tolerance: 2 };
}

export const replicate: PortraitProvider = {
  id: "replicate",
  configured: () => Boolean(env.replicateToken),
  model: () => process.env.REPLICATE_IMAGE_MODEL || DEFAULT_MODEL,
  family() {
    const m = this.model();
    return /flux|kontext/.test(m) ? "bfl" : "google";
  },

  async generate(input, signal) {
    const model = this.model() as `${string}/${string}`;
    const imageUrl = input.imageUrl ?? dataUri(input.imageBytes, input.mime);
    let output: unknown;
    try {
      output = await getClient().run(model, {
        input: buildInput(model, input, imageUrl),
        signal,
        wait: { mode: "block", timeout: 60 },
      });
    } catch (err) {
      const msg = (err as Error).message ?? String(err);
      throw new ProviderError("replicate", msg, /safety|policy|flagged|sensitive|nsfw/i.test(msg));
    }
    const url = firstUrl(output);
    if (!url) throw new ProviderError("replicate", "No image in response (possibly filtered)", true);
    const { bytes, mime } = await fetchImageBytes(url, signal);
    return { bytes, mime, model };
  },
};
