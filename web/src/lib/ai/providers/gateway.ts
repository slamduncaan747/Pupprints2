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
 * Model ids are `creator/model`. AI_GATEWAY_IMAGE_MODEL is a comma-separated list tried in order;
 * a model the account can't use (the free tier excludes some) is skipped and remembered, so the
 * next request goes straight to the first one that works. OpenAI models use the Images edit
 * endpoint; Google's Gemini image models use chat completions with image output.
 */
const BASE_URL = "https://ai-gateway.vercel.sh/v1";
const DEFAULT_MODELS = [
  "openai/gpt-image-2.5-flare",
  "google/gemini-3.1-flash-image",
  "openai/gpt-image-2",
  "google/gemini-3-pro-image",
  "openai/gpt-image-1.5",
  "google/gemini-2.5-flash-image",
  "google/gemini-3.1-flash-lite-image",
  "openai/gpt-image-1-mini",
];

function models(): string[] {
  const fromEnv = (process.env.AI_GATEWAY_IMAGE_MODEL ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_MODELS;
}

/** Models this account was refused, for the life of the server instance. */
const noAccess = new Set<string>();

/** Credentials for the gateway: AI_GATEWAY_API_KEY, else the deployment's OIDC token. */
export async function gatewayApiKey(): Promise<string> {
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
    const out = new ProviderError("gateway", `${unavailable ? "unavailable: " : ""}HTTP ${err.status ?? "?"}: ${message}`);
    (out as ProviderError & { noModelAccess?: boolean }).noModelAccess = /do not have access to this model|model.*not (available|found)/i.test(message);
    return out;
  }
  return new ProviderError("gateway", err instanceof Error ? err.message : String(err));
}

async function editWithOpenAi(client: OpenAI, model: string, input: Parameters<PortraitProvider["generate"]>[0], signal: AbortSignal) {
  const { size, quality, inputFidelity } = openaiImageSettings(model.replace(/^[^/]+\//, ""));
  const ext = input.mime === "image/png" ? "png" : input.mime === "image/webp" ? "webp" : "jpg";
  const dog = await toFile(input.imageBytes, `dog.${ext}`, { type: input.mime });
  const extras = await Promise.all(
    (input.extraImages ?? []).map((f, i) => toFile(f.bytes, `dog-more-${i + 1}.jpg`, { type: f.mime })),
  );
  const swatch = input.styleRef ? [await toFile(input.styleRef.bytes, "example-portrait.jpg", { type: input.styleRef.mime })] : [];
  const files = [dog, ...extras, ...swatch];
  const image = files.length === 1 ? dog : files;
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
  return Buffer.from(b64, "base64");
}

async function editWithChat(client: OpenAI, model: string, input: Parameters<PortraitProvider["generate"]>[0], signal: AbortSignal) {
  const dataUrl = `data:${input.mime};base64,${input.imageBytes.toString("base64")}`;
  const res = await client.chat.completions.create(
    {
      model,
      messages: [
        { role: "system", content: input.system },
        {
          role: "user",
          content: [
            { type: "text", text: `${input.prompt}\n\nOutput one image only, in a 3:4 portrait format (taller than wide).` },
            { type: "image_url", image_url: { url: dataUrl } },
            ...(input.extraImages ?? []).map((f) => ({
              type: "image_url",
              image_url: { url: `data:${f.mime};base64,${f.bytes.toString("base64")}` },
            })),
            ...(input.styleRef
              ? [{ type: "image_url", image_url: { url: `data:${input.styleRef.mime};base64,${input.styleRef.bytes.toString("base64")}` } }]
              : []),
          ],
        },
      ],
      modalities: ["text", "image"],
      stream: false,
    } as unknown as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
    { signal, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 },
  );
  const message = res.choices?.[0]?.message as { images?: { image_url?: { url?: string } }[] } | undefined;
  const url = message?.images?.[0]?.image_url?.url ?? "";
  const b64 = url.startsWith("data:") ? url.slice(url.indexOf(",") + 1) : "";
  if (!b64) throw new ProviderError("gateway", "No image in response");
  return Buffer.from(b64, "base64");
}

export const GATEWAY_BASE_URL = BASE_URL;

/** True when the gateway can be called (key set, or running on Vercel). */
export function gatewayConfigured(): boolean {
  return (
    process.env.AI_GATEWAY?.trim().toLowerCase() !== "off" &&
    Boolean(process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL === "1")
  );
}

export const gateway: PortraitProvider = {
  id: "gateway",
  configured: () =>
    process.env.AI_GATEWAY?.trim().toLowerCase() !== "off" &&
    Boolean(process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL === "1"),
  model: () => models().find((m) => !noAccess.has(m)) ?? models()[0],
  family: function () {
    return this.model().startsWith("google/") ? "google" : "openai";
  },

  async generate(input, signal) {
    let last: ProviderError | null = null;
    let client: OpenAI;
    try {
      client = new OpenAI({ apiKey: await gatewayApiKey(), baseURL: BASE_URL, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 });
    } catch (err) {
      throw toProviderError(err);
    }
    for (const model of models()) {
      if (noAccess.has(model)) continue;
      try {
        const bytes = model.startsWith("openai/")
          ? await editWithOpenAi(client, model, input, signal)
          : await editWithChat(client, model, input, signal);
        return { bytes, mime: "image/png", model };
      } catch (err) {
        last = toProviderError(err);
        if ((last as ProviderError & { noModelAccess?: boolean }).noModelAccess) {
          noAccess.add(model);
          console.warn(`[ai] gateway: no access to ${model}, trying the next model`);
          continue;
        }
        throw last;
      }
    }
    throw last ?? new ProviderError("gateway", "unavailable: no usable model");
  },
};
