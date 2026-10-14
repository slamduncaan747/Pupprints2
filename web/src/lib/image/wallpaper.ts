import "server-only";
import sharp from "sharp";

/** The Free Phone Portrait: phone resolution only (the print-quality file stays the $29 product). */
export const WALLPAPER = { width: 1080, height: 1920 } as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Crop a portrait master to a 9:16 phone wallpaper (1080×1920 JPEG, no watermark, no metadata).
 *
 * Masters are 3:4 or 2:3, i.e. wider than 9:16, so the full height is kept and the columns are
 * chosen: centered on the subject that sharp's attention strategy finds in the upper two-thirds
 * (where the dog's head is), blended halfway toward the center so a busy background can't pull
 * the crop off balance. A master taller than 9:16 keeps its full width and centers the window on
 * its upper third.
 */
export async function renderPhoneWallpaper(input: Buffer): Promise<Buffer> {
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const W = meta.autoOrient?.width ?? meta.width ?? 0;
  const H = meta.autoOrient?.height ?? meta.height ?? 0;
  if (!W || !H) throw new Error("Could not read the portrait's dimensions");
  const ratio = WALLPAPER.width / WALLPAPER.height;

  let region = { left: 0, top: 0, width: W, height: H };
  if (W / H > ratio) {
    const width = Math.min(W, Math.round(H * ratio));
    const band = Math.max(1, Math.round((H * 2) / 3));
    let focusX = W / 2;
    try {
      const { info } = await sharp(input, { failOn: "none" })
        .autoOrient()
        .extract({ left: 0, top: 0, width: W, height: band })
        .resize({ width, height: band, fit: "cover", position: sharp.strategy.attention })
        .raw()
        .toBuffer({ resolveWithObject: true });
      const found = info as typeof info & { attentionX?: number; cropOffsetLeft?: number };
      if (typeof found.attentionX === "number") focusX = found.attentionX;
      else if (typeof found.cropOffsetLeft === "number") focusX = -found.cropOffsetLeft + width / 2;
    } catch {
      // keep it centered
    }
    const centered = (W - width) / 2;
    const onSubject = focusX - width / 2;
    region = { left: Math.round(clamp((centered + onSubject) / 2, 0, W - width)), top: 0, width, height: H };
  } else if (W / H < ratio) {
    const height = Math.min(H, Math.round(W / ratio));
    region = { left: 0, top: Math.round(clamp(H / 3 - height / 2, 0, H - height)), width: W, height };
  }

  return sharp(input, { failOn: "none" })
    .autoOrient()
    .extract(region)
    .resize(WALLPAPER.width, WALLPAPER.height, { fit: "fill", kernel: "lanczos3" })
    .toColourspace("srgb")
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
}
