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

/**
 * Composite the name onto a finished portrait. Returns the input untouched when there is no
 * usable name. The ink is dark on light grounds and off-white on dark ones, judged from the
 * strip of background the lettering sits on.
 */
export async function addNameLettering(input: Buffer, name: string | null | undefined): Promise<Buffer> {
  const text = letteringText(name);
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
