import "server-only";
import OpenAI from "openai";
import { GATEWAY_BASE_URL, gatewayApiKey, gatewayConfigured } from "./providers/gateway";
import type { ImageFile } from "./types";

/**
 * Identity notes: before the image model runs, a fast vision model looks at the customer's photos
 * and writes down exactly what makes this dog this dog (coat colours by area, each marking and
 * its side, eye colour, ears). Image models follow explicit words far more reliably than they
 * read small details off a photo, so the notes go into the portrait prompt.
 *
 * Fail-open: no gateway, an error or a slow answer just means no notes. Costs well under a cent.
 * AI_DESCRIBE=off disables it; AI_DESCRIBE_MODEL overrides the model (comma-separated, in order).
 */
const DEFAULT_MODELS = ["google/gemini-3-flash", "google/gemini-2.5-flash", "openai/gpt-5-mini"];
const TIMEOUT_MS = 12_000;

const INSTRUCTIONS = `You are briefing a portrait artist who must paint this exact dog so its owner recognises it at once. All the photos show the same dog.
Write 6 to 9 short lines of plain, specific facts, one topic per line, in this order:
Breed or mix, build and age cues (for example a grey muzzle).
Coat: length and texture, and the exact colours by area (head, ears, muzzle, chest, legs).
Markings: every blaze, mask, spot, patch, ticking or white area, with its exact position and which side (the dog's left or right).
Eyes: colour of each eye (say "both dark brown" if they match; only mention a difference if one is really there), shape and rims.
Ears: shape, size, how they are carried, and colour.
Muzzle and nose: length, shape, nose colour, lips or jowls.
Head shape and expression.
Rules: describe only the dog itself, never its pose or head angle, the background, people, collar, toys or the photo itself. Judge colours as they would look in even daylight: ignore tinted or dim lighting. If something is not visible, leave it out rather than guess. No introduction, no headings, no bullet symbols.`;

export async function describeDog(images: ImageFile[], signal?: AbortSignal): Promise<string | null> {
  if (process.env.AI_DESCRIBE?.trim().toLowerCase() === "off" || !gatewayConfigured() || images.length === 0) return null;
  const models = (process.env.AI_DESCRIBE_MODEL ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const list = models.length ? models : DEFAULT_MODELS;
  const started = Date.now();
  let client: OpenAI;
  try {
    client = new OpenAI({ apiKey: await gatewayApiKey(), baseURL: GATEWAY_BASE_URL, timeout: TIMEOUT_MS, maxRetries: 0 });
  } catch {
    return null;
  }
  const content = [
    { type: "text" as const, text: INSTRUCTIONS },
    ...images.map((f) => ({
      type: "image_url" as const,
      image_url: { url: `data:${f.mime};base64,${f.bytes.toString("base64")}` },
    })),
  ];
  for (const model of list) {
    const remaining = TIMEOUT_MS - (Date.now() - started);
    if (remaining < 2_000) break;
    try {
      const res = await client.chat.completions.create(
        { model, messages: [{ role: "user", content }], max_tokens: 500, temperature: 0.2 },
        { signal, timeout: remaining, maxRetries: 0 },
      );
      const text = res.choices?.[0]?.message?.content;
      const notes = typeof text === "string" ? text.trim() : "";
      if (notes.length > 40) {
        console.info(`[ai] identity notes from ${model} in ${Date.now() - started}ms`);
        return notes.slice(0, 1500);
      }
    } catch (err) {
      console.warn(`[ai] describe with ${model} failed: ${err instanceof Error ? err.message.slice(0, 200) : err}`);
    }
  }
  return null;
}
