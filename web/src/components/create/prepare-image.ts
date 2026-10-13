"use client";

/**
 * Decode, orient and downscale a photo in the browser before upload.
 * Vercel caps request bodies at 4.5 MB, phone photos are often 5–12 MB, and re-encoding
 * also strips EXIF (GPS location) before the photo ever leaves the device.
 */

export const MAX_EDGE = 2048;
const MAX_UPLOAD_BYTES = 4_200_000;

export class PrepareError extends Error {
  code: "heic" | "unreadable" | "not_image";
  constructor(code: "heic" | "unreadable" | "not_image", message: string) {
    super(message);
    this.name = "PrepareError";
    this.code = code;
  }
}

export type PreparedImage = { blob: Blob; width: number; height: number; small: boolean };

export function isHeic(file: File) {
  return /hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      // fall through to <img>, which some browsers (older Safari) decode more formats with
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/jpeg", quality),
  );
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (file.type && !file.type.startsWith("image/") && !isHeic(file)) {
    throw new PrepareError("not_image", "That file isn't a photo. Please choose a JPG or PNG image.");
  }

  let decoded: Awaited<ReturnType<typeof decode>>;
  try {
    decoded = await decode(file);
  } catch {
    if (isHeic(file)) {
      throw new PrepareError(
        "heic",
        "This looks like an iPhone HEIC photo, which this browser can't open. Please choose a JPG or PNG — or take a screenshot of the photo and upload that.",
      );
    }
    throw new PrepareError("unreadable", "We couldn't open that photo. Please try a different JPG or PNG.");
  }

  const { source, width, height, close } = decoded;
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    close();
    throw new PrepareError("unreadable", "Your browser couldn't process this photo. Please try another one.");
  }
  ctx.fillStyle = "#ffffff"; // flatten transparent PNGs
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  close();

  let blob = await toBlob(canvas, 0.85);
  if (blob.size > MAX_UPLOAD_BYTES) blob = await toBlob(canvas, 0.72);
  return { blob, width: w, height: h, small: Math.min(width, height) < 800 };
}
