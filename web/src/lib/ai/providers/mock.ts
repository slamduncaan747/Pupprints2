import "server-only";
import sharp from "sharp";
import { STYLE_MAP } from "@/lib/catalog";
import { type PortraitProvider } from "../types";

/**
 * Development-only mock: returns the uploaded photo with a painterly treatment tinted by the
 * style's swatch color, so the whole flow can be tested without API keys or spend.
 * Active only when AI_MOCK=1 AND NODE_ENV !== "production".
 */
export function mockEnabled() {
  return process.env.AI_MOCK === "1" && process.env.NODE_ENV !== "production";
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new Error("aborted"));
    });
  });
}

export const mock: PortraitProvider = {
  id: "mock",
  configured: mockEnabled,
  model: () => "mock-painterly-v1",
  family: () => "mock",

  async generate(input, signal) {
    const W = 1200;
    const H = 1600;
    const swatch = STYLE_MAP[input.style]?.swatch ?? "#7a2e2a";

    const base = await sharp(input.imageBytes)
      .autoOrient()
      .resize({ width: W, height: H, fit: "cover", position: "attention" })
      .median(7) // flattens detail into soft "brush" patches
      .modulate({ saturation: 1.15, brightness: 1.03 })
      .toBuffer();

    // Wash the scene in the style's color, then darken the edges like an old-master varnish.
    const wash = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect width="100%" height="100%" fill="${swatch}" fill-opacity="0.55"/>
    </svg>`);
    const vignette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <radialGradient id="v" cx="50%" cy="40%" r="72%">
          <stop offset="40%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#140c06" stop-opacity="0.78"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`);

    const bytes = await sharp(base)
      .composite([
        { input: wash, blend: "soft-light" },
        { input: vignette, blend: "over" },
      ])
      .sharpen({ sigma: 1 })
      .png()
      .toBuffer();

    const delay = Number(process.env.AI_MOCK_DELAY_MS ?? 4000);
    if (delay > 0) await sleep(delay, signal);
    return { bytes, mime: "image/png", model: this.model() };
  },
};
