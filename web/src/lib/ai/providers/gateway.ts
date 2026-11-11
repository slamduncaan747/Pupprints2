import "server-only";
import OpenAI, { APIError, APIUserAbortError, toFile } from "openai";
import { getVercelOidcToken } from "@vercel/oidc";
import { PROVIDER_TIMEOUT_MS } from "../http";
import { ProviderError, type PortraitProvider } from "../types";
import { openaiImageSettings } from "./openai";

/**
 * Vercel AI Gateway: the same GPT Image edit call as the direct OpenAI provider, sent to the
 * gateway's OpenAI-compatible endpoint (`POST https://ai-gateway.vercel.sh/v1/images/edits`).
 *
 * It needs no pasted key on Vercel: a deployment authenticates with its own OIDC token, and
 * usage is billed to the Vercel team's AI Gateway credits. `AI_GATEWAY_API_KEY` works anywhere
 * (and takes precedence). `AI_GATEWAY=off` disables the provider.
 *
 * Model ids are `creator/model` (AI_GATEWAY_IMAGE_MODEL, default `openai/gpt-image-2.5-flare`).
 */
const BASE_URL = "https://ai-gateway.vercel.sh/v1";
const DEFAULT_MODEL = "openai/gpt-image-2.5-flare";

async function apiKey(): Promise<string> {
  const key = process.env.AI_GATEWAY_API_KEY?.trim();
  if (key) return key;
  try {
    return await getVercelOidcToken();
  } catch (err) {
    throw new ProviderError("gateway", `unavailable: no AI Gateway credentials (${err instanceof Error ? err.message : err})`);
  }
}

function toProviderError(err: unknown): ProviderError {
  if (err instanceof ProviderError) return err;
  if (err instanceof APIUserAbortError) return new ProviderError("gateway", "timed out (request aborted)");
  if (err instanceof APIError) {
    const message = err.message.replace(/\s+/g, " ").replace(/^\d{3} /, "").slice(0, 300);
    if (/moderation_blocked|safety system|content policy/i.test(message)) {
      return new ProviderError("gateway", `content policy refusal: ${message}`, true);
    }
    // No credits, gateway not enabled for the team, or OIDC rejected: this provider can't serve anyone.
    const unavailable = err.status === 401 || err.status === 402 || err.status === 403 || /credit|billing|quota|payment/i.test(message);
    return new ProviderError("gateway", `${unavailable ? "unavailable: " : ""}HTTP ${err.status ?? "?"}: ${message}`);
  }
  return new ProviderError("gateway", err instanceof Error ? err.message : String(err));
}

export const gateway: PortraitProvider = {
  id: "gateway",
  configured: () =>
    process.env.AI_GATEWAY?.trim().toLowerCase() !== "off" &&
    Boolean(process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL === "1"),
  model: () => process.env.AI_GATEWAY_IMAGE_MODEL?.trim() || DEFAULT_MODEL,
  family: () => "openai",

  async generate(input, signal) {
    const model = this.model();
    const { size, quality, inputFidelity } = openaiImageSettings(model.replace(/^[^/]+\//, ""));
    const ext = input.mime === "image/png" ? "png" : input.mime === "image/webp" ? "webp" : "jpg";
    try {
      const client = new OpenAI({ apiKey: await apiKey(), baseURL: BASE_URL, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 });
      const image = await toFile(input.imageBytes, `dog.${ext}`, { type: input.mime });
      const res = await client.images.edit(
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
        } as Parameters<OpenAI["images"]["edit"]>[0],
        { signal, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 },
      );
      const b64 = (res as { data?: { b64_json?: string }[] }).data?.[0]?.b64_json;
      if (!b64) throw new ProviderError("gateway", "No image in response");
      return { bytes: Buffer.from(b64, "base64"), mime: "image/png", model };
    } catch (err) {
      throw toProviderError(err);
    }
  },
};
