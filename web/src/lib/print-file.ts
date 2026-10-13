import "server-only";
import sharp, { type Sharp } from "sharp";
import { createFalClient, type FalClient } from "@fal-ai/client";
import { findAddon, findVariant } from "@/lib/catalog";
import { env } from "@/lib/env";
import { BUCKETS, requireDb } from "@/lib/supabase/server";
import {
  getOrder,
  itemsOf,
  updateOrder,
  webImagePath,
  type DigitalFileEntry,
  type OrderItem,
  type PrintFileEntry,
  type PrintFiles,
} from "@/lib/orders";

/**
 * Print-file pipeline: crop the clean master to each product's exact aspect ratio (biased
 * upward to keep the head), upscale to the print size, and store JPEGs in the private
 * `portraits` bucket:
 *   print/<orderId>/<itemIndex>.jpg      one per physical line item
 *   digital/<orderId>/<generationId>.jpg the customer's hi-res file (≥3000px long edge)
 *   web/<generationId>.jpg               clean ~1600px image for the reveal / success page
 *
 * Upscaling: fal Topaz "High Fidelity V2" (faithful, face_enhancement off) when FAL_KEY is set;
 * PRINT_UPSCALER=seedvr uses the budget SeedVR2 model, PRINT_UPSCALER=none forces local.
 * Fallback is sharp lanczos3 + a mild unsharp mask.
 */

/** Target resolution for wall art. 200 DPI looks sharp at viewing distance; 24×36 lands at 4800×7200. */
export const PRINT_DPI = 200;
/** Long-edge cap for the front of a wall print (keeps memory + file size sane). */
export const MAX_FRONT_LONG_EDGE = 7200;
/**
 * Gallery-wrap depth for Printful canvas (catalog product 3 is 1.25″ thick). The canvas file
 * carries a mirrored band of this width on every side so the whole composition stays on the
 * front and no fur or face wraps around the edge. Verify against
 * GET https://api.printful.com/mockup-generator/printfiles/3 with your key before launch; set
 * CANVAS_WRAP_IN=0 to send front-only files if Printful's canvas print file excludes the wrap.
 */
export const CANVAS_WRAP_IN = (() => {
  const v = Number(process.env.CANVAS_WRAP_IN ?? "1.25");
  return Number.isFinite(v) && v >= 0 && v <= 3 ? v : 1.25;
})();
export const DIGITAL_MIN_LONG_EDGE = 3000;
export const DIGITAL_MAX_LONG_EDGE = 6000;
export const WEB_LONG_EDGE = 1600;
/** Faithful upscalers top out at 4×. */
const MAX_UPSCALE = 4;

export type PrintSpec =
  | { kind: "wall"; widthIn: number; heightIn: number; dpi: number; wrapIn: number; frontW: number; frontH: number; pxW: number; pxH: number }
  | { kind: "mug"; dpi: number; pxW: number; pxH: number }
  | { kind: "ornament"; dpi: number; pxW: number; pxH: number };

/** Printful 11oz mug print area: 9″ × 3.5″ (2700×1050 @ 300 DPI). The portrait is printed on both sides. */
const MUG_SPEC: PrintSpec = { kind: "mug", dpi: 300, pxW: 2700, pxH: 1050 };
/** Printful 2-sided ceramic ornament (product 900, 3″ circle): square file, same design both sides. */
const ORNAMENT_SPEC: PrintSpec = { kind: "ornament", dpi: 400, pxW: 1200, pxH: 1200 };

export function printSpecFor(variantId: string, opts: { wrapIn?: number } = {}): PrintSpec | null {
  if (variantId === "addon-mug") return MUG_SPEC;
  if (variantId === "addon-ornament") return ORNAMENT_SPEC;
  if (findAddon(variantId)) return null;
  const found = findVariant(variantId);
  if (!found || found.product.type === "digital") return null;
  const { widthIn, heightIn } = found.variant;
  const dpi = Math.min(PRINT_DPI, Math.floor(MAX_FRONT_LONG_EDGE / Math.max(widthIn, heightIn)));
  const wrapIn = found.product.type === "canvas" ? (opts.wrapIn ?? CANVAS_WRAP_IN) : 0;
  const frontW = Math.round(widthIn * dpi);
  const frontH = Math.round(heightIn * dpi);
  const wrapPx = Math.round(wrapIn * dpi);
  return { kind: "wall", widthIn, heightIn, dpi, wrapIn, frontW, frontH, pxW: frontW + 2 * wrapPx, pxH: frontH + 2 * wrapPx };
}

/**
 * Largest crop of `ratio` (w/h) inside w×h: centered horizontally, and placed at `upwardBias`
 * of the spare height vertically (0.5 = centered, lower = closer to the top, keeps the head).
 */
export function cropBox(w: number, h: number, ratio: number, upwardBias = 0.38) {
  let cw = w;
  let ch = Math.round(w / ratio);
  if (ch > h) {
    ch = h;
    cw = Math.min(w, Math.round(h * ratio));
  }
  return {
    left: Math.max(0, Math.round((w - cw) / 2)),
    top: Math.max(0, Math.round((h - ch) * upwardBias)),
    width: cw,
    height: ch,
  };
}

/** Upscale factor the source needs (relative to its current size) to fill this spec. */
export function requiredScale(srcW: number, srcH: number, spec: PrintSpec): number {
  if (spec.kind === "wall") {
    const box = cropBox(srcW, srcH, spec.widthIn / spec.heightIn);
    return spec.frontW / box.width;
  }
  if (spec.kind === "mug") {
    const box = cropBox(srcW, srcH, 0.8);
    return Math.round(spec.pxH * 0.9) / box.height;
  }
  const box = cropBox(srcW, srcH, 1, 0.3);
  return spec.pxW / box.width;
}

function finishJpeg(img: Sharp, dpi: number, quality = 92) {
  return img
    .toColourspace("srgb")
    .withMetadata({ density: dpi })
    .withIccProfile("srgb")
    .jpeg({ quality, chromaSubsampling: "4:4:4" })
    .toBuffer({ resolveWithObject: true });
}

async function dims(input: Buffer) {
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const w = meta.autoOrient?.width ?? meta.width ?? 0;
  const h = meta.autoOrient?.height ?? meta.height ?? 0;
  if (!w || !h) throw new Error("Could not read image dimensions");
  return { w, h };
}

/**
 * Render one print file from a (possibly already upscaled) source image. Pure: no I/O.
 * Wall art: exact-ratio crop → lanczos3 resize → mild unsharp mask → mirrored canvas wrap.
 */
export async function renderPrintImage(source: Buffer, spec: PrintSpec): Promise<{ buffer: Buffer; width: number; height: number }> {
  const { w, h } = await dims(source);
  const base = () => sharp(source, { failOn: "none", limitInputPixels: false }).autoOrient();

  if (spec.kind === "wall") {
    const box = cropBox(w, h, spec.widthIn / spec.heightIn);
    const scale = spec.frontW / box.width;
    let img = base()
      .extract(box)
      .resize(spec.frontW, spec.frontH, { fit: "fill", kernel: "lanczos3" });
    if (scale > 1.05) img = img.sharpen({ sigma: 0.7, m1: 0.6, m2: 1.4 });
    const wrapPx = Math.round((spec.pxW - spec.frontW) / 2);
    if (wrapPx > 0) {
      // Resize first (materialize), then mirror the edges into the wrap band.
      const front = await img.toBuffer();
      img = sharp(front, { limitInputPixels: false }).extend({
        top: wrapPx,
        bottom: wrapPx,
        left: wrapPx,
        right: wrapPx,
        extendWith: "mirror",
      });
    }
    const { data, info } = await finishJpeg(img, spec.dpi);
    return { buffer: data, width: info.width, height: info.height };
  }

  if (spec.kind === "mug") {
    const tileH = Math.round(spec.pxH * 0.9);
    const tileW = Math.round(tileH * 0.8);
    const tile = await base()
      .extract(cropBox(w, h, 0.8))
      .resize(tileW, tileH, { fit: "fill", kernel: "lanczos3" })
      .toBuffer();
    const top = Math.round((spec.pxH - tileH) / 2);
    // Two copies so the portrait faces out for both left- and right-handed drinkers.
    const img = sharp({ create: { width: spec.pxW, height: spec.pxH, channels: 3, background: "#ffffff" } }).composite([
      { input: tile, left: Math.round(spec.pxW * 0.25 - tileW / 2), top },
      { input: tile, left: Math.round(spec.pxW * 0.75 - tileW / 2), top },
    ]);
    const { data, info } = await finishJpeg(img, spec.dpi);
    return { buffer: data, width: info.width, height: info.height };
  }

  const img = base()
    .extract(cropBox(w, h, 1, 0.3))
    .resize(spec.pxW, spec.pxH, { fit: "fill", kernel: "lanczos3" });
  const { data, info } = await finishJpeg(img, spec.dpi);
  return { buffer: data, width: info.width, height: info.height };
}

/** The customer's hi-res file: long edge clamped to [3000, 6000]. */
export async function renderDigitalImage(source: Buffer): Promise<{ buffer: Buffer; width: number; height: number }> {
  const { w, h } = await dims(source);
  const long = Math.max(w, h);
  const target = Math.min(DIGITAL_MAX_LONG_EDGE, Math.max(DIGITAL_MIN_LONG_EDGE, long));
  let img = sharp(source, { failOn: "none", limitInputPixels: false }).autoOrient();
  if (target !== long) {
    img = img.resize({ width: w >= h ? target : undefined, height: h > w ? target : undefined, kernel: "lanczos3" });
    if (target > long * 1.05) img = img.sharpen({ sigma: 0.7, m1: 0.6, m2: 1.4 });
  }
  const { data, info } = await finishJpeg(img, 300);
  return { buffer: data, width: info.width, height: info.height };
}

export async function renderWebImage(source: Buffer): Promise<Buffer> {
  return sharp(source, { failOn: "none", limitInputPixels: false })
    .autoOrient()
    .resize({ width: WEB_LONG_EDGE, height: WEB_LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .toColourspace("srgb")
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}

/* ------------------------------------------------------------------ */
/* Upscaling                                                           */
/* ------------------------------------------------------------------ */

let fal: FalClient | null = null;

function upscalerChoice(): "topaz" | "seedvr" | "lanczos" {
  const pref = (process.env.PRINT_UPSCALER ?? "topaz").toLowerCase();
  if (!env.falKey || pref === "none" || pref === "lanczos") return "lanczos";
  return pref === "seedvr" ? "seedvr" : "topaz";
}

/**
 * Upscale `master` by ~`factor` with an AI upscaler when configured. Returns the master
 * unchanged (lanczos happens in renderPrintImage) when no upscaler is configured, the factor
 * is small, or the upscaler fails.
 */
export async function upscaleMaster(
  master: Buffer,
  sourceUrl: () => Promise<string>,
  factor: number,
): Promise<{ buffer: Buffer; upscaler: string }> {
  const choice = upscalerChoice();
  const f = Math.min(MAX_UPSCALE, Math.ceil(factor * 10) / 10);
  if (choice === "lanczos" || f <= 1.1) return { buffer: master, upscaler: "lanczos3" };
  try {
    fal ??= createFalClient({ credentials: env.falKey });
    const imageUrl = await sourceUrl();
    const result =
      choice === "seedvr"
        ? await fal.subscribe("fal-ai/seedvr/upscale/image", {
            input: { image_url: imageUrl, upscale_mode: "factor", upscale_factor: f, output_format: "png" },
            logs: false,
          })
        : await fal.subscribe("fal-ai/topaz/upscale/image", {
            input: {
              image_url: imageUrl,
              model: "High Fidelity V2",
              upscale_factor: f,
              // Defaults to true and is tuned for human faces; it can distort dog faces.
              face_enhancement: false,
              output_format: "png",
            },
            logs: false,
          });
    const url = (result.data as { image?: { url?: string } } | undefined)?.image?.url;
    if (!url) throw new Error("upscaler returned no image");
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`downloading upscaled image: HTTP ${res.status}`);
    return { buffer: Buffer.from(await res.arrayBuffer()), upscaler: `${choice}@${f}x` };
  } catch (err) {
    console.error("[print-file] AI upscale failed, falling back to lanczos3", err instanceof Error ? err.message : err);
    return { buffer: master, upscaler: "lanczos3 (ai-fallback)" };
  }
}

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */

type GenerationRow = { id: string; full_path: string | null; status: string; pet_name: string | null };

async function download(path: string): Promise<Buffer> {
  const { data, error } = await requireDb().storage.from(BUCKETS.portraits).download(path);
  if (error || !data) throw new Error(`Could not download portraits/${path}: ${error?.message}`);
  return Buffer.from(await data.arrayBuffer());
}

async function upload(path: string, bytes: Buffer) {
  const { error } = await requireDb()
    .storage.from(BUCKETS.portraits)
    .upload(path, bytes, { contentType: "image/jpeg", upsert: true, cacheControl: "3600" });
  if (error) throw new Error(`Could not store portraits/${path}: ${error.message}`);
}

async function exists(path: string): Promise<boolean> {
  const { data } = await requireDb().storage.from(BUCKETS.portraits).exists(path);
  return Boolean(data);
}

async function loadGeneration(id: string): Promise<GenerationRow> {
  const { data, error } = await requireDb()
    .from("generations")
    .select("id, full_path, status, pet_name")
    .eq("id", id)
    .maybeSingle<GenerationRow>();
  if (error || !data) throw new Error(`Generation ${id} not found`);
  if (!data.full_path) throw new Error(`Generation ${id} has no full-resolution file`);
  return data;
}

/** Clean ~1600px JPEG for display (reveal, success page, emails). Created lazily. */
export async function ensureWebImage(generationId: string, master?: Buffer): Promise<string> {
  const path = webImagePath(generationId);
  if (await exists(path)) return path;
  const src = master ?? (await download((await loadGeneration(generationId)).full_path as string));
  await upload(path, await renderWebImage(src));
  return path;
}

/**
 * Build every print file + digital file for an order and save the paths in
 * orders.print_files. Skips work that is already done unless `force` is set.
 */
export async function preparePrintFiles(orderId: string, opts: { force?: boolean } = {}): Promise<PrintFiles> {
  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  const items = itemsOf(order);
  const existing = order.print_files;
  const physicalCount = items.filter((i) => printSpecFor(i.variantId)).length;
  const generations = [...new Set(items.map((i) => i.generationId))];
  if (
    !opts.force &&
    existing &&
    existing.items.length === physicalCount &&
    existing.digital.length === generations.length &&
    !existing.errors?.length
  ) {
    return existing;
  }

  const out: PrintFiles = {
    version: 1,
    generatedAt: new Date().toISOString(),
    upscaler: "",
    items: [],
    digital: [],
    errors: [],
  };
  const upscalers = new Set<string>();

  // One generation at a time keeps peak memory to a single upscaled master.
  for (const generationId of generations) {
    try {
      const gen = await loadGeneration(generationId);
      const master = await download(gen.full_path as string);
      const { w, h } = await dims(master);
      const genItems = items
        .map((item, index) => ({ item, index, spec: printSpecFor(item.variantId) }))
        .filter((x): x is { item: OrderItem; index: number; spec: PrintSpec } => x.item.generationId === generationId && x.spec !== null);

      const need = Math.max(
        DIGITAL_MIN_LONG_EDGE / Math.max(w, h),
        ...genItems.map(({ spec }) => requiredScale(w, h, spec)),
      );
      const fullPath = gen.full_path as string;
      const { buffer: source, upscaler } = await upscaleMaster(
        master,
        async () => {
          const { data, error } = await requireDb().storage.from(BUCKETS.portraits).createSignedUrl(fullPath, 60 * 15);
          if (error || !data) throw new Error(`sign failed: ${error?.message}`);
          return data.signedUrl;
        },
        need,
      );
      upscalers.add(upscaler);

      for (const { item, index, spec } of genItems) {
        const rendered = await renderPrintImage(source, spec);
        const path = `print/${orderId}/${index}.jpg`;
        await upload(path, rendered.buffer);
        const entry: PrintFileEntry = {
          index,
          variantId: item.variantId,
          frameColor: item.frameColor,
          path,
          width: rendered.width,
          height: rendered.height,
          dpi: spec.dpi,
        };
        if (spec.kind === "wall" && spec.wrapIn > 0) entry.wrapIn = spec.wrapIn;
        out.items.push(entry);
      }

      const digital = await renderDigitalImage(source);
      const digitalPath = `digital/${orderId}/${generationId}.jpg`;
      await upload(digitalPath, digital.buffer);
      const d: DigitalFileEntry = { generationId, path: digitalPath, width: digital.width, height: digital.height };
      out.digital.push(d);

      await ensureWebImage(generationId, master).catch((err) => console.error("[print-file] web image failed", err));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[print-file] generation failed", generationId, message);
      out.errors?.push(`${generationId}: ${message}`);
    }
  }

  out.items.sort((a, b) => a.index - b.index);
  out.upscaler = [...upscalers].join(", ") || "none";
  if (!out.errors?.length) delete out.errors;
  await updateOrder(orderId, { print_files: out });
  return out;
}

/** Signed URLs for an order's print files (Printful downloads them; admin links). */
export async function signPrintFiles(files: PrintFiles, expiresIn = 7 * 24 * 60 * 60) {
  const paths = [...files.items.map((f) => f.path), ...files.digital.map((d) => d.path)];
  if (paths.length === 0) return new Map<string, string>();
  const { data, error } = await requireDb().storage.from(BUCKETS.portraits).createSignedUrls(paths, expiresIn);
  if (error || !data) throw new Error(`Could not sign print files: ${error?.message}`);
  const map = new Map<string, string>();
  for (const row of data) if (row.path && row.signedUrl) map.set(row.path, row.signedUrl);
  return map;
}
