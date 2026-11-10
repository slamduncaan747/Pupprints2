import opentype from "opentype.js";
import sharp from "sharp";
import { LETTERING_FONT_WOFF_BASE64 } from "./lettering-font";

/**
 * Name lettering for the Modern styles: the dog's name in small, widely spaced capitals,
 * centred near the top of the portrait. The letters are drawn as vector outlines from an
 * embedded font, so they never depend on system fonts and are never left to the image model.
 */

let cachedFont: opentype.Font | null = null;
function font(): opentype.Font {
  if (!cachedFont) {
    const buf = Buffer.from(LETTERING_FONT_WOFF_BASE64, "base64");
    cachedFont = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return cachedFont;
}

/** Longest name we letter; longer ones are left off rather than shrunk to nothing. */
export const LETTERING_MAX_CHARS = 18;

/** The name as it will be lettered (capitals, supported characters only), or null if nothing usable. */
export function letteringText(name: string | null | undefined): string | null {
  if (!name) return null;
  const f = font();
  const cleaned = [...name.normalize("NFC").trim().toUpperCase()]
    .filter((ch) => ch === " " || f.charToGlyphIndex(ch) > 0)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned || cleaned.length > LETTERING_MAX_CHARS) return null;
  return cleaned;
}

/** SVG overlay with the lettering, sized for a `width`×`height` portrait. */
export function letteringSvg(text: string, width: number, height: number, color: string): string {
  const f = font();
  const size = height * 0.034; // font size in px; capitals come out at about 2.4% of the height
  const tracking = size * 0.34;
  const scale = size / f.unitsPerEm;
  const glyphs = [...text].map((ch) => f.charToGlyph(ch));
  const advances = glyphs.map((g) => (g.advanceWidth ?? f.unitsPerEm * 0.3) * scale);
  let total = advances.reduce((a, b) => a + b, 0) + tracking * (glyphs.length - 1);
  // Never wider than 70% of the portrait: tighten long names instead of running to the edges.
  const fit = Math.min(1, (width * 0.7) / total);
  total *= fit;
  let x = (width - total) / 2;
  const baseline = height * 0.11; // low enough to survive the 8×10 crop and a frame lip
  const paths: string[] = [];
  glyphs.forEach((g, i) => {
    paths.push(g.getPath(x, baseline, size * fit).toPathData(2));
    x += (advances[i] + tracking) * fit;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${paths.join(" ")}" fill="${color}" fill-opacity="0.9"/></svg>`;
}

/** With a name, the dog's head must start no higher than this fraction of the height. */
const HEADROOM_FOR_NAME = 0.17;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Flat-ground styles: image models land near the ground color we ask for, never on it, and
 * they don't reliably leave room above the head. This makes the ground exactly `ground`
 * (pixels close to the model's own ground are shifted, with a soft falloff so fur edges stay
 * smooth) and, when `headroom` > 0, scales the dog down onto the flat ground until its head
 * starts at least that fraction of the height from the top.
 */
export async function prepareGround(input: Buffer, ground: string, headroom: number): Promise<Buffer> {
  const { data, info } = await sharp(input, { failOn: "none" })
    .autoOrient()
    .flatten({ background: ground })
    .toColourspace("srgb")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels < 3) return input;
  const target = hexToRgb(ground);

  // The model's ground: median of two patches in the top corners.
  const patch = Math.max(4, Math.round(width * 0.04));
  const samples: number[][] = [[], [], []];
  for (let y = 0; y < patch; y++) {
    for (let x = 0; x < patch; x++) {
      for (const px of [x, width - 1 - x]) {
        const i = (y * width + px) * channels;
        for (let c = 0; c < 3; c++) samples[c].push(data[i + c]);
      }
    }
  }
  const bg = samples.map((v) => v.sort((a, b) => a - b)[v.length >> 1]);
  // Corners that are far from the color we asked for mean this isn't a flat-ground result: leave it.
  if (Math.hypot(bg[0] - target[0], bg[1] - target[1], bg[2] - target[2]) > 70) return input;

  const NEAR = 14; // fully ground
  const FAR = 44; // fully subject
  const rowSubject = new Uint32Array(height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
      if (d >= FAR) {
        rowSubject[y]++;
        continue;
      }
      const w = d <= NEAR ? 1 : (FAR - d) / (FAR - NEAR);
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.max(0, Math.min(255, Math.round(data[i + c] + (target[c] - bg[c]) * w)));
      }
    }
  }
  const corrected = sharp(data, { raw: { width, height, channels } });

  let headTop = 0;
  while (headTop < height && rowSubject[headTop] < width * 0.01) headTop++;
  const top = headTop / height;
  if (!headroom || top >= headroom || headTop >= height) return corrected.png().toBuffer();

  // Scale the picture down, anchored bottom-centre, and fill the freed margin with flat ground.
  const scale = Math.max(0.72, (1 - headroom - 0.01) / (1 - top));
  const w2 = Math.round(width * scale);
  const h2 = Math.round(height * scale);
  const small = await corrected.resize(w2, h2, { kernel: "lanczos3" }).png().toBuffer();
  return sharp({ create: { width, height, channels: 3, background: ground } })
    .composite([{ input: small, left: Math.round((width - w2) / 2), top: height - h2 }])
    .png()
    .toBuffer();
}

/**
 * Composite the name onto a finished portrait. Returns the input untouched when there is no
 * usable name. The ink is dark on light grounds and off-white on dark ones, judged from the
 * strip of background the lettering sits on.
 */
export async function addNameLettering(
  input: Buffer,
  name: string | null | undefined,
  ground?: string,
): Promise<Buffer> {
  const text = letteringText(name);
  if (ground) input = await prepareGround(input, ground, text ? HEADROOM_FOR_NAME : 0);
  if (!text) return input;
  const base = sharp(input, { failOn: "none" }).autoOrient();
  const { data, info } = await base.clone().toColourspace("srgb").png().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const strip = await sharp(data)
    .extract({
      left: Math.round(width * 0.2),
      top: Math.round(height * 0.075),
      width: Math.round(width * 0.6),
      height: Math.max(1, Math.round(height * 0.045)),
    })
    .greyscale()
    .stats();
  const light = strip.channels[0].mean > 120;
  const overlay = Buffer.from(letteringSvg(text, width, height, light ? "#2a2825" : "#f4f1ea"));
  return sharp(data).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
}
