import "server-only";
import OpenAI, { toFile } from "openai";
import { env } from "@/lib/env";
import { PROVIDER_TIMEOUT_MS } from "../http";
import { ProviderError, type PortraitProvider } from "../types";

/**
 * OpenAI GPT Image via the Images edit endpoint (direct, last-resort fallback).
 * Default `gpt-image-2.5-flare`: per docs/research/ai-tech.md it keeps the original framing best,
 * while Sunburst tends to re-pose and add unrequested text. Override with OPENAI_IMAGE_MODEL.
 */
const DEFAULT_MODEL = "gpt-image-2.5-flare";

let client: OpenAI | null = null;
function getClient() {
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 });
  return client;
}

type Quality = "low" | "medium" | "high" | "xhigh" | "max" | "auto";

export const openai: PortraitProvider = {
  id: "openai",
  configured: () => Boolean(env.openaiApiKey),
  model: () => process.env.OPENAI_IMAGE_MODEL || DEFAULT_MODEL,
  family: () => "openai",

  async generate(input, signal) {
    const model = this.model();
    const gen1 = model.startsWith("gpt-image-1");
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
          // gpt-image-1.x only offers fixed sizes (2:3); 2.x takes any multiple-of-16 size, so ask for true 3:4.
          size: gen1 ? "1024x1536" : "1152x1536",
          quality: (process.env.OPENAI_IMAGE_QUALITY as Quality) || "high",
          output_format: "png",
          ...(gen1 ? { input_fidelity: "high" as const } : {}),
        },
        { signal },
      );
    } catch (err) {
      const msg = (err as Error).message ?? String(err);
      throw new ProviderError("openai", msg, /moderation|safety|policy/i.test(msg));
    }
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) throw new ProviderError("openai", "No image in response");
    return { bytes: Buffer.from(b64, "base64"), mime: "image/png", model };
  },
};
