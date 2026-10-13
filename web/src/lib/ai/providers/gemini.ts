import "server-only";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/env";
import { PROVIDER_TIMEOUT_MS } from "../http";
import { ProviderError, type PortraitProvider } from "../types";

/**
 * Google direct (cheapest at scale) via the Interactions API, which Google's image docs now use.
 * Default `gemini-nano-banana-2.1` (Nano Banana 2.1: $0.0504 per 2K image, Oct 2026 pricing page).
 * `gemini-3-pro-image` (Nano Banana Pro) ranks lower on editing and costs ~2.5×.
 * Override with GEMINI_IMAGE_MODEL. Note: "2K" must use an uppercase K.
 */
const DEFAULT_MODEL = "gemini-nano-banana-2.1";

let client: GoogleGenAI | null = null;
function getClient() {
  if (!client) client = new GoogleGenAI({ apiKey: env.geminiApiKey });
  return client;
}

export const gemini: PortraitProvider = {
  id: "gemini",
  configured: () => Boolean(env.geminiApiKey),
  model: () => process.env.GEMINI_IMAGE_MODEL || DEFAULT_MODEL,
  family: () => "google",

  async generate(input, signal) {
    const model = this.model();
    let interaction;
    try {
      interaction = await getClient().interactions.create(
        {
          model,
          system_instruction: input.system,
          input: [
            { type: "text", text: input.prompt },
            { type: "image", mime_type: input.mime, data: input.imageBytes.toString("base64") },
          ],
          response_format: {
            type: "image",
            aspect_ratio: "3:4",
            image_size: process.env.AI_IMAGE_RESOLUTION || "2K",
          },
          store: false,
        },
        { timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0, fetchOptions: { signal } },
      );
    } catch (err) {
      const msg = (err as Error).message ?? String(err);
      throw new ProviderError("gemini", msg, /safety|blocked|policy|prohibited/i.test(msg));
    }

    const data = interaction.output_image?.data;
    if (!data) {
      const text = interaction.output_text?.slice(0, 160);
      throw new ProviderError("gemini", `No image returned${text ? ` (${text})` : ""}`, true);
    }
    return {
      bytes: Buffer.from(data, "base64"),
      mime: interaction.output_image?.mime_type || "image/png",
      model,
    };
  },
};
