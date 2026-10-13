import "server-only";
import { FinishReason, GoogleGenAI, Modality, ThinkingLevel, type GenerateContentResponse } from "@google/genai";
import { env } from "@/lib/env";
import { PROVIDER_TIMEOUT_MS } from "../http";
import { ProviderError, type PortraitProvider, type ProviderInput, type ProviderOutput } from "../types";

/**
 * Google Gemini image model ("Nano Banana"), called directly with a Google AI Studio API key.
 * Fallback provider (different vendor from OpenAI, so it survives an OpenAI refusal or outage).
 * Verified against the official docs and `@google/genai` 2.28 types (Oct 2026):
 *   https://ai.google.dev/gemini-api/docs/image-generation
 *   https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1
 *   https://ai.google.dev/gemini-api/docs/pricing
 *
 * Model: `gemini-nano-banana-2.1` (Nano Banana 2.1, stable, Oct 2026), Google's recommended image
 * model; it replaces `gemini-3.1-flash-image`. $0.0504 per 2K image (+ ~$0.002 input, plus thinking
 * tokens). Paid tier only: the API key's project needs billing (prepaid credit) in AI Studio.
 * Override with GEMINI_IMAGE_MODEL.
 *
 * API: Google's image docs now use the Interactions API (`POST /v1beta/interactions`, GA June 2026;
 * SDK `ai.interactions.create`), which is the default here. `generateContent` is "legacy" but "remains
 * fully supported"; set GEMINI_API=generate-content to use it (`responseModalities` + `imageConfig`,
 * image in `inlineData`). If Interactions answers 404 for the model, we retry once via generateContent.
 *
 * Output: 3:4 at AI_IMAGE_RESOLUTION (default "2K" = 1792x2400; uppercase K is required). The
 * image format isn't selectable on the Gemini API (JPEG or PNG); toPrintMaster() stores PNG.
 * Thinking: 2.1 always thinks (default "medium"); GEMINI_THINKING_LEVEL = minimal | medium | high.
 * Privacy: `store: false` so Google doesn't keep the interaction (default would retain it 55 days).
 */
const DEFAULT_MODEL = "gemini-nano-banana-2.1";

let client: GoogleGenAI | null = null;
function getClient() {
  if (!client) client = new GoogleGenAI({ apiKey: env.geminiApiKey });
  return client;
}

const resolution = () => process.env.AI_IMAGE_RESOLUTION?.trim().toUpperCase() || "2K";
const thinkingLevel = () => {
  const v = process.env.GEMINI_THINKING_LEVEL?.trim().toLowerCase();
  return v === "minimal" || v === "low" || v === "medium" || v === "high" ? v : undefined;
};

/** Words Google uses when a request or output is blocked on content-policy grounds. */
const REFUSAL = /safety|blocked|prohibited|policy|harm|sensitive|responsible ai/i;

function statusOf(err: unknown): number | undefined {
  const e = err as { status?: unknown; statusCode?: unknown };
  const s = typeof e.status === "number" ? e.status : typeof e.statusCode === "number" ? e.statusCode : undefined;
  return s;
}

function toProviderError(err: unknown): ProviderError {
  const raw = err instanceof Error ? err.message : String(err);
  const message = raw.replace(/\s+/g, " ").replace(/^\d{3} /, "").slice(0, 300);
  const status = statusOf(err);
  if (err instanceof Error && (err.name === "AbortError" || /aborted/i.test(raw))) {
    return new ProviderError("gemini", "timed out (request aborted)");
  }
  let hint = "";
  if (status === 400 && /api key/i.test(raw)) hint = " (check GEMINI_API_KEY)";
  else if (status === 403) hint = " (check GEMINI_API_KEY and that the Generative Language API is enabled)";
  else if (status === 429) hint = " (rate limit, or no prepaid credit left: aistudio.google.com → Billing)";
  return new ProviderError("gemini", `${status ? `HTTP ${status}: ` : ""}${message}${hint}`, REFUSAL.test(raw) && status === 400);
}

/** Interactions API (what Google's image docs use). */
async function viaInteractions(model: string, prompt: string, input: ProviderInput, signal: AbortSignal): Promise<ProviderOutput> {
  const thinking = thinkingLevel();
  const interaction = await getClient().interactions.create(
    {
      model,
      input: [
        { type: "image", mime_type: input.mime, data: input.imageBytes.toString("base64") },
        { type: "text", text: prompt },
      ],
      response_format: { type: "image", aspect_ratio: "3:4", image_size: resolution() },
      ...(thinking ? { generation_config: { thinking_level: thinking } } : {}),
      store: false,
    },
    { signal, maxRetries: 0 },
  );

  const image = interaction.output_image;
  if (image?.data) {
    return { bytes: Buffer.from(image.data, "base64"), mime: image.mime_type || "image/png", model };
  }

  // No image: collect every reason Google gave (interaction errors, step errors, text reply).
  const stepErrors = (interaction.steps ?? [])
    .map((s) => (s.type === "model_output" && s.error ? s.error.message : undefined))
    .filter(Boolean);
  const errors = (interaction.errors ?? []).map((e) => [e.code, e.message].filter(Boolean).join(" "));
  const text = interaction.output_text?.trim();
  const detail = [`status ${interaction.status}`, ...errors, ...stepErrors, text ? `model said: ${text}` : ""]
    .filter(Boolean)
    .join("; ")
    .slice(0, 400);
  // A text-only answer, or a completed interaction with nothing in it, is how the model declines.
  const refused = REFUSAL.test(detail) || (interaction.status === "completed" && errors.length === 0);
  throw new ProviderError("gemini", `No image returned (${detail})`, refused);
}

const BLOCKED_FINISH = new Set<string>([
  FinishReason.SAFETY,
  FinishReason.IMAGE_SAFETY,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.IMAGE_PROHIBITED_CONTENT,
  FinishReason.BLOCKLIST,
  FinishReason.SPII,
  FinishReason.RECITATION,
  FinishReason.IMAGE_RECITATION,
]);

/** generateContent (legacy, still supported). */
async function viaGenerateContent(model: string, prompt: string, input: ProviderInput, signal: AbortSignal): Promise<ProviderOutput> {
  const thinking = thinkingLevel();
  const res: GenerateContentResponse = await getClient().models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ inlineData: { mimeType: input.mime, data: input.imageBytes.toString("base64") } }, { text: prompt }],
      },
    ],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
      imageConfig: { aspectRatio: "3:4", imageSize: resolution() },
      ...(thinking ? { thinkingConfig: { thinkingLevel: thinking.toUpperCase() as ThinkingLevel } } : {}),
      abortSignal: signal,
      httpOptions: { timeout: PROVIDER_TIMEOUT_MS },
    },
  });

  const candidate = res.candidates?.[0];
  // The model may emit interim "thought" images; the final image is the last non-thought one.
  const parts = (candidate?.content?.parts ?? []).filter((p) => !p.thought);
  const image = parts.findLast((p) => p.inlineData?.data)?.inlineData;
  if (image?.data) return { bytes: Buffer.from(image.data, "base64"), mime: image.mimeType || "image/png", model };

  const blockReason = res.promptFeedback?.blockReason;
  const finish = candidate?.finishReason;
  const text = parts.map((p) => p.text ?? "").join(" ").trim();
  const detail = [blockReason && `blocked: ${blockReason}`, finish && `finish: ${finish}`, text && `model said: ${text}`]
    .filter(Boolean)
    .join("; ")
    .slice(0, 400);
  const refused = Boolean(blockReason) || (finish ? BLOCKED_FINISH.has(finish) : false) || REFUSAL.test(text) || !finish || finish === FinishReason.STOP;
  throw new ProviderError("gemini", `No image returned (${detail || "empty response"})`, refused);
}

export const gemini: PortraitProvider = {
  id: "gemini",
  configured: () => Boolean(env.geminiApiKey),
  model: () => process.env.GEMINI_IMAGE_MODEL?.trim() || DEFAULT_MODEL,
  family: () => "google",

  async generate(input, signal) {
    const model = this.model();
    // One user turn: identity rules first, then the style brief (works the same on both APIs).
    const prompt = `${input.system}\n\n${input.prompt}`;
    const useGenerateContent = process.env.GEMINI_API?.trim().toLowerCase() === "generate-content";
    try {
      if (useGenerateContent) return await viaGenerateContent(model, prompt, input, signal);
      try {
        return await viaInteractions(model, prompt, input, signal);
      } catch (err) {
        // 404 = model/endpoint not served by Interactions for this key: try the legacy API once.
        if (statusOf(err) !== 404 || signal.aborted) throw err;
        console.warn(`[ai] gemini: Interactions returned 404 for ${model}; retrying via generateContent`);
        return await viaGenerateContent(model, prompt, input, signal);
      }
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      throw toProviderError(err);
    }
  },
};
