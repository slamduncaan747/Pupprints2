import opentype from "opentype.js";
import sharp from "sharp";
import { LETTERING_FONT_WOFF_BASE64 } from "./lettering-font";

/**
 * Name lettering: the dog's name in small, widely spaced capitals, centred near the top of the
 * portrait. The letters are drawn as vector outlines from an embedded font, so they never depend
 * on system fonts and are never left to the image model.
 *
 * Flat-ground styles (Modern, Modern Sage) pass their `ground`: the background is made exactly
 * that color and the dog is moved down if needed, so the name always fits. Every other style is
 * lettered only when the background where the name sits is calm (nameStripIsCalm); if the head
 * reaches into it the portrait is left without a name rather than printed over the dog.
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

/** Where the letters go on a `width`×`height` portrait. */
function layout(text: string, width: number, height: number) {
  const f = font();
  const size = height * 0.034; // font size in px; capitals come out at about 2.4% of the height
  const tracking = size * 0.34;
  const scale = size / f.unitsPerEm;
  const glyphs = [...text].map((ch) => f.charToGlyph(ch));
  const advances = glyphs.map((g) => (g.advanceWidth ?? f.unitsPerEm * 0.3) * scale);
  const natural = advances.reduce((a, b) => a + b, 0) + tracking * (glyphs.length - 1);
  // Never wider than 70% of the portrait: tighten long names instead of running to the edges.
  const fit = Math.min(1, (width * 0.7) / natural);
  const baseline = height * 0.11; // low enough to survive the 8×10 crop and a frame lip
  return { glyphs, advances, tracking, size, fit, total: natural * fit, baseline };
}

/** SVG overlay with the lettering, sized for a `width`×`height` portrait. */
export function letteringSvg(text: string, width: number, height: number, color: string): string {
  const { glyphs, advances, tracking, size, fit, total, baseline } = layout(text, width, height);
  let x = (width - total) / 2;
  const paths: string[] = [];
  glyphs.forEach((g, i) => {
    paths.push(g.getPath(x, baseline, size * fit).toPathData(2));
    x += (advances[i] + tracking) * fit;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${paths.join(" ")}" fill="${color}" fill-opacity="0.9"/></svg>`;
}

/**
 * The strip of the portrait the name sits on, with breathing room: the letters plus 8% of the
 * width at each side and about a line of space above and below. In pixels.
 */
export function nameStrip(text: string, width: number, height: number) {
  const { total, baseline, size } = layout(text, width, height);
  const w = Math.min(width, Math.round(total + width * 0.16));
  const top = Math.max(0, Math.round(baseline - size * 0.72 - height * 0.025));
  const bottom = Math.min(height, Math.round(baseline + height * 0.025));
  return { left: Math.round((width - w) / 2), top, width: w, height: Math.max(1, bottom - top) };
}

/** A strip is calm when its greyscale standard deviation is at most this (0–255 scale)... */
export const NAME_STRIP_MAX_STDEV = 16;
/** ...and at most this share of its pixels differ from the strip's median by more than NAME_STRIP_OUTLIER_DELTA. */
export const NAME_STRIP_MAX_OUTLIERS = 0.03;
export const NAME_STRIP_OUTLIER_DELTA = 40;

export type NameStripStats = { mean: number; stdev: number; outliers: number };

/**
 * Greyscale statistics of the strip where `text` would be lettered. Paper grain, canvas weave and
 * soft washes give a low spread; an ear or the top of the head gives a high one, or a patch of
 * pixels far from the background (outliers).
 */
export async function nameStripStats(input: Buffer, text: string): Promise<NameStripStats> {
  const base = sharp(input, { failOn: "none" }).autoOrient();
  // Extract from a decoded buffer: sharp's own stats() ignores extract() and reads the whole image.
  const { data: full, info } = await base.toColourspace("srgb").png().toBuffer({ resolveWithObject: true });
  const { data } = await sharp(full)
    .extract(nameStrip(text, info.width, info.height))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hist = new Uint32Array(256);
  let sum = 0;
  let sumSq = 0;
  for (const v of data) {
    hist[v]++;
    sum += v;
    sumSq += v * v;
  }
  const n = data.length || 1;
  const mean = sum / n;
  let median = 0;
  for (let seen = 0; median < 256; median++) {
    seen += hist[median];
    if (seen >= n / 2) break;
  }
  let far = 0;
  for (let v = 0; v < 256; v++) if (Math.abs(v - median) > NAME_STRIP_OUTLIER_DELTA) far += hist[v];
  return { mean, stdev: Math.sqrt(Math.max(0, sumSq / n - mean * mean)), outliers: far / n };
}

/** True when the name can be set on this background without printing over the dog. */
export function nameStripIsCalm(stats: NameStripStats): boolean {
  return stats.stdev <= NAME_STRIP_MAX_STDEV && stats.outliers <= NAME_STRIP_MAX_OUTLIERS;
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
 * Composite the name onto a finished portrait. `lettered` says whether it was: false when there is
 * no usable name, or when a style without a flat `ground` has the dog's head where the name would
 * sit (the portrait is then returned as it came). The ink is dark on light backgrounds and
 * off-white on dark ones, judged from the strip the lettering sits on.
 */
export async function letterName(
  input: Buffer,
  name: string | null | undefined,
  ground?: string,
): Promise<{ bytes: Buffer; lettered: boolean; stats?: NameStripStats }> {
  const text = letteringText(name);
  if (ground) input = await prepareGround(input, ground, text ? HEADROOM_FOR_NAME : 0);
  if (!text) return { bytes: input, lettered: false };
  const stats = await nameStripStats(input, text);
  if (!ground && !nameStripIsCalm(stats)) return { bytes: input, lettered: false, stats };
  const { data, info } = await sharp(input, { failOn: "none" })
    .autoOrient()
    .toColourspace("srgb")
    .png()
    .toBuffer({ resolveWithObject: true });
  const overlay = Buffer.from(letteringSvg(text, info.width, info.height, stats.mean > 120 ? "#2a2825" : "#f4f1ea"));
  const bytes = await sharp(data).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
  return { bytes, lettered: true, stats };
}

/** letterName, returning only the image. */
export async function addNameLettering(
  input: Buffer,
  name: string | null | undefined,
  ground?: string,
): Promise<Buffer> {
  return (await letterName(input, name, ground)).bytes;
}
