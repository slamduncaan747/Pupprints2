import "server-only";
import fs from "node:fs";
import path from "node:path";
import { FORMAT_SHOWCASE } from "@/lib/offer";
import type { ProductType } from "@/lib/catalog";

/**
 * The campaign: art-directed scenes of our example Royal portrait (web/public/campaign/), made as
 * product mockups of a real sample. They are never customer photos, so every alt says "example".
 *
 * The files arrive from a separate pipeline and some may never exist, so every entry names a
 * fallback that is already in web/public/samples. Resolve with `campaign(key)` (server only): it
 * returns the campaign file when it is in web/public and the fallback otherwise, so pages render
 * correctly before, during and after the assets land. Components that need a different layout
 * for the fallback (a 16:9 hero vs a 4:5 portrait) read `live`.
 */

export type Photo = { src: string; width: number; height: number; alt: string };
export type CampaignAsset = Photo & { fallback: Photo };

/** Every sample portrait is 4:5, 1200×1500. */
const PORTRAIT = { width: 1200, height: 1500 } as const;
const ROYAL: Photo = { src: FORMAT_SHOWCASE.src, ...PORTRAIT, alt: "Example portrait in The Royal style" };

export const CAMPAIGN = {
  heroWide: {
    src: "/campaign/hero-wide.webp",
    width: 2400,
    height: 1350,
    alt: "Example portrait in The Royal style, shown as a framed print on a limewashed wall above an oak console",
    fallback: ROYAL,
  },
  heroTall: {
    src: "/campaign/hero-tall.webp",
    width: 1200,
    height: 1500,
    alt: "Example portrait in The Royal style, shown as a framed print on a limewashed wall",
    fallback: ROYAL,
  },
  formatCanvas: {
    src: "/campaign/format-canvas.webp",
    ...PORTRAIT,
    alt: "Example portrait in The Royal style, shown as a gallery canvas above a linen sofa",
    fallback: ROYAL,
  },
  formatFramed: {
    src: "/campaign/format-framed.webp",
    ...PORTRAIT,
    alt: "Example portrait in The Royal style, shown as an oak-framed print on a travertine mantel",
    fallback: ROYAL,
  },
  formatPrint: {
    src: "/campaign/format-print.webp",
    ...PORTRAIT,
    alt: "Example portrait in The Royal style, shown as an unframed fine art print on a table with tissue paper",
    fallback: ROYAL,
  },
  formatDigital: {
    src: "/campaign/format-digital.webp",
    ...PORTRAIT,
    alt: "Example portrait in The Royal style, shown as a digital file on a phone",
    fallback: ROYAL,
  },
  gift: {
    src: "/campaign/gift.webp",
    ...PORTRAIT,
    alt: "Example portrait in The Royal style, shown as a framed print half-unwrapped from tissue in a gift box",
    fallback: { src: "/samples/gallery-3.webp", ...PORTRAIT, alt: "Example portrait of a cavapoo in the Watercolor style" },
  },
  dogAndPortrait: {
    src: "/campaign/dog-and-portrait.webp",
    width: 1800,
    height: 1200,
    alt: "Illustrative scene: a golden retriever lying on the floor beneath a framed example portrait",
    fallback: { src: "/samples/gallery-1.webp", ...PORTRAIT, alt: "Example portrait of a golden retriever in the Old Master style" },
  },
  galleryWall: {
    src: "/campaign/gallery-wall.webp",
    width: 1800,
    height: 1200,
    alt: "Three example portraits in different styles, framed and hung along a pale hallway",
    fallback: ROYAL,
  },
  heirloom: {
    src: "/campaign/heirloom.webp",
    ...PORTRAIT,
    alt: "Example portrait in The Royal style on a matching ceramic ornament",
    fallback: ROYAL,
  },
} as const satisfies Record<string, CampaignAsset>;

export type CampaignKey = keyof typeof CAMPAIGN;

/** The scene that shows each format, all of the same portrait. */
export const FORMAT_SCENE: Record<ProductType, CampaignKey> = {
  canvas: "formatCanvas",
  framed: "formatFramed",
  poster: "formatPrint",
  digital: "formatDigital",
};

/**
 * Campaign files present when the app was built, baked in by next.config.ts. On Vercel the
 * regenerating (ISR) function can't see web/public (it's served from the CDN, not the function's
 * disk), so without this list a page would drop its campaign images at its first revalidation.
 */
const BUILT = new Set(
  (process.env.PP_CAMPAIGN_FILES ?? "")
    .split(",")
    .filter(Boolean)
    .map((name) => `/campaign/${name}`),
);

const PUBLIC_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "public");

function present(src: string): boolean {
  if (BUILT.has(src)) return true;
  try {
    return fs.existsSync(path.join(PUBLIC_DIR, src.slice(1)));
  } catch {
    return false;
  }
}

export type ResolvedPhoto = Photo & { key: CampaignKey; live: boolean };

/** The campaign file for `key` when it exists in web/public, otherwise its fallback sample. */
export function campaign(key: CampaignKey): ResolvedPhoto {
  const asset: CampaignAsset = CAMPAIGN[key];
  if (present(asset.src)) {
    return { key, live: true, src: asset.src, width: asset.width, height: asset.height, alt: asset.alt };
  }
  return { key, live: false, ...asset.fallback };
}

/** True when every one of `keys` is live (e.g. all four format scenes, so a row never mixes looks). */
export function campaignLive(...keys: CampaignKey[]): boolean {
  return keys.every((k) => present(CAMPAIGN[k].src));
}

/** All four format scenes are in place: format rows show the scenes instead of the drawn mockups. */
export function formatScenesLive(): boolean {
  return campaignLive(...Object.values(FORMAT_SCENE));
}
