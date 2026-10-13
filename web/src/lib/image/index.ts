import "server-only";
import sharp, { type Metadata } from "sharp";
import { glyphMarkup, measureGlyphs } from "./glyphs";

/** Longest edge we keep for customer uploads (matches the client-side resize). */
export const UPLOAD_MAX_EDGE = 2048;
/** Smallest short edge we accept; below this a portrait can't look good. */
export const UPLOAD_MIN_EDGE = 256;
/**
 * Largest decoded size we accept for an upload (~ a 48 MP phone photo with headroom). A few KB
 * of PNG can declare 16k×16k pixels (≈1 GB decoded), so check the header before decoding.
 */
export const UPLOAD_MAX_PIXELS = 64_000_000;
/** Longest edge of the public, watermarked preview. */
export const PREVIEW_MAX_EDGE = 1100;

export type ImageErrorCode = "unsupported_type" | "too_small" | "unreadable";

export class ImageError extends Error {
  code: ImageErrorCode;
  constructor(code: ImageErrorCode, message: string) {
    super(message);
    this.name = "ImageError";
    this.code = code;
  }
}

export type ImageResult = { bytes: Buffer; width: number; height: number; mime: string };

/** Formats sharp can decode in our build (prebuilt libvips has no HEIC decoder). */
const DECODABLE = new Set(["jpeg", "png", "webp", "gif", "avif", "tiff"]);

/**
 * Normalize a customer upload: decode, rotate per EXIF, flatten transparency onto white,
 * cap the long edge, strip all metadata (GPS etc.) and re-encode as a high-quality JPEG.
 */
export async function normalizeUpload(input: Buffer): Promise<ImageResult & { originalFormat: string }> {
  let meta: Metadata;
  try {
    meta = await sharp(input, { failOn: "none" }).metadata();
  } catch {
    throw new ImageError("unreadable", "We couldn't read that image. Please choose a JPG or PNG photo.");
  }
  const format = meta.format ?? "unknown";
  if (format === "heif" && !(meta.compression === "av1")) {
    throw new ImageError(
      "unsupported_type",
      "iPhone HEIC photos aren't supported yet. Please choose a JPG or PNG, or take a screenshot of the photo and upload that.",
    );
  }
  if (!DECODABLE.has(format) && format !== "heif") {
    throw new ImageError("unsupported_type", "Please upload a JPG, PNG or WebP photo.");
  }
  if (!meta.width || !meta.height || meta.width * meta.height > UPLOAD_MAX_PIXELS) {
    throw new ImageError("unreadable", "That image is too large to process. Please choose a regular photo (under 60 megapixels).");
  }

  const { data, info } = await sharp(input, { failOn: "none", animated: false, limitInputPixels: UPLOAD_MAX_PIXELS })
    .autoOrient()
    .resize({ width: UPLOAD_MAX_EDGE, height: UPLOAD_MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .toColourspace("srgb")
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer({ resolveWithObject: true });

  if (Math.min(info.width, info.height) < UPLOAD_MIN_EDGE) {
    throw new ImageError(
      "too_small",
      "This photo is too small to make a portrait. Please choose a larger or original-size photo.",
    );
  }
  return { bytes: data, width: info.width, height: info.height, mime: "image/jpeg", originalFormat: format };
}

/** Convert any provider output into a lossless sRGB PNG (the print master). */
export async function toPrintMaster(input: Buffer): Promise<ImageResult> {
  const { data, info } = await sharp(input, { failOn: "none" })
    .autoOrient()
    .toColourspace("srgb")
    .png({ compressionLevel: 8, adaptiveFiltering: true })
    .toBuffer({ resolveWithObject: true });
  return { bytes: data, width: info.width, height: info.height, mime: "image/png" };
}

/**
 * Center-crop an image to a target aspect ratio (e.g. 4:5 for 8×10, 2:3 for 24×36).
 * Uses sharp's attention strategy so the dog's face stays in frame.
 */
export async function cropToRatio(
  input: Buffer,
  ratioW: number,
  ratioH: number,
  format: "png" | "jpeg" = "png",
): Promise<ImageResult> {
  const meta = await sharp(input).metadata();
  const w = meta.autoOrient?.width ?? meta.width ?? 0;
  const h = meta.autoOrient?.height ?? meta.height ?? 0;
  if (!w || !h) throw new ImageError("unreadable", "Could not read image dimensions");
  const target = ratioW / ratioH;
  let cw = w;
  let ch = Math.round(w / target);
  if (ch > h) {
    ch = h;
    cw = Math.round(h * target);
  }
  let pipeline = sharp(input).autoOrient().resize({ width: cw, height: ch, fit: "cover", position: "attention" });
  pipeline = format === "png" ? pipeline.png() : pipeline.jpeg({ quality: 92, mozjpeg: true });
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return { bytes: data, width: info.width, height: info.height, mime: format === "png" ? "image/png" : "image/jpeg" };
}

/* ------------------------------------------------------------------ */
/* Watermarked preview                                                 */
/* ------------------------------------------------------------------ */

const WATERMARK_TEXT = "PUP PRINTS · PREVIEW";

/**
 * Build an SVG overlay with a tasteful diagonal, repeating "PUP PRINTS · PREVIEW" watermark.
 * Each line is drawn twice — a soft dark halo and a light core — so it stays legible on both
 * light (watercolor) and dark (old-master) portraits without shouting.
 */
export function watermarkSvg(width: number, height: number): string {
  const unitWidth = measureGlyphs(WATERMARK_TEXT);
  const capHeight = Math.max(11, Math.round(Math.min(width, height) * 0.024)); // px
  const scale = capHeight / 10;
  const textW = unitWidth * scale;
  const gapX = capHeight * 8;
  const tileW = textW + gapX;
  const tileH = capHeight * 11;
  const strokeW = 1.15; // in glyph units → scales with text
  const { strokes, dots } = glyphMarkup(WATERMARK_TEXT);

  const line = (dx: number, dy: number) => `
    <g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${scale.toFixed(4)})">
      <g fill="none" stroke="#1b1814" stroke-opacity="0.13" stroke-width="${(strokeW * 2.6).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${strokes}</g>
      <g fill="#1b1814" fill-opacity="0.13">${dots.replace(/r="0.95"/g, 'r="1.7"')}</g>
      <g fill="none" stroke="#ffffff" stroke-opacity="0.46" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round">${strokes}</g>
      <g fill="#ffffff" fill-opacity="0.46">${dots}</g>
    </g>`;

  // Two staggered lines per tile so the pattern reads as a brick layout.
  const tile = line(0, capHeight) + line(tileW / 2, capHeight + tileH / 2);

  // Small, crisp mark in the bottom-right corner.
  const badgeCap = Math.max(10, Math.round(capHeight * 0.9));
  const badgeScale = badgeCap / 10;
  const badgeText = "FREE PREVIEW";
  const badgeW = measureGlyphs(badgeText) * badgeScale;
  const padX = badgeCap * 1.3;
  const padY = badgeCap * 0.95;
  const bw = badgeW + padX * 2;
  const bh = badgeCap + padY * 2;
  const bx = width - bw - Math.round(width * 0.03);
  const by = height - bh - Math.round(width * 0.03);
  const badge = glyphMarkup(badgeText);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="wm" patternUnits="userSpaceOnUse" width="${tileW.toFixed(1)}" height="${tileH.toFixed(1)}" patternTransform="rotate(-28)">
      ${tile}
      ${line(-tileW / 2, capHeight + tileH / 2)}
    </pattern>
  </defs>
  <rect x="${-width}" y="${-height}" width="${width * 3}" height="${height * 3}" fill="url(#wm)"/>
  <g>
    <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bh / 2).toFixed(1)}" fill="#1b1814" fill-opacity="0.55"/>
    <g transform="translate(${(bx + padX).toFixed(1)} ${(by + padY).toFixed(1)}) scale(${badgeScale.toFixed(4)})" fill="none" stroke="#faf6ef" stroke-opacity="0.95" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${badge.strokes}</g>
  </g>
</svg>`;
}

/**
 * Downscale a portrait and composite the watermark. Output is a progressive JPEG
 * (small, universally supported, and what the public `previews` bucket stores).
 */
export async function makeWatermarkedPreview(input: Buffer, maxEdge = PREVIEW_MAX_EDGE): Promise<ImageResult> {
  const resized = await sharp(input, { failOn: "none" })
    .autoOrient()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .toColourspace("srgb")
    .toBuffer({ resolveWithObject: true });

  const { width, height } = resized.info;
  const overlay = Buffer.from(watermarkSvg(width, height));
  const { data, info } = await sharp(resized.data)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer({ resolveWithObject: true });
  return { bytes: data, width: info.width, height: info.height, mime: "image/jpeg" };
}
