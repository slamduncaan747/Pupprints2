/**
 * Derived commerce facts for marketing pages (prices, shipping windows, holiday cutoffs).
 * Everything here is computed from @/lib/catalog so copy never drifts from what checkout charges.
 */
import {
  ADDONS,
  PRODUCTS,
  SHIPPING_RATES,
  type FrameColor,
  type Product,
  type ProductType,
  type Variant,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

export const PHYSICAL_PRODUCTS = PRODUCTS.filter((p) => p.type !== "digital");
export const DIGITAL_PRODUCT = PRODUCTS.find((p) => p.type === "digital");

export const SHIP_REGIONS = "the US and Canada";
/** Flat Canadian shipping per order, e.g. "$9.95". US shipping is free on every order. */
export const CANADA_SHIPPING_LABEL = formatPrice(SHIPPING_RATES.CA);
export const US_SHIPPING_FREE = SHIPPING_RATES.US === 0;

export const ADDON_LINE = joinWordsOr(ADDONS.map((a) => `${a.name.toLowerCase()} (${formatPrice(a.price)})`));

function joinWordsOr(words: string[]) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} or ${words[words.length - 1]}`;
}

export function isPhysical(p: Product) {
  return p.type !== "digital";
}

export function fromPrice(p: Product) {
  return Math.min(...p.variants.map((v) => v.price));
}

export function toPrice(p: Product) {
  return Math.max(...p.variants.map((v) => v.price));
}

/** "3–7 business days" (or "Instant" for digital). */
export function shipWindow(p: Product) {
  const [min, max] = p.shipDays;
  if (max === 0) return "Instant";
  return min === max ? `${min} business days` : `${min}–${max} business days`;
}

export const PHYSICAL_SHIP_MIN = Math.min(...PHYSICAL_PRODUCTS.map((p) => p.shipDays[0]));
export const PHYSICAL_SHIP_MAX = Math.max(...PHYSICAL_PRODUCTS.map((p) => p.shipDays[1]));
export const PHYSICAL_SHIP_WINDOW = `${PHYSICAL_SHIP_MIN}–${PHYSICAL_SHIP_MAX} business days`;

export const FRAME_LABELS: Record<FrameColor, string> = {
  black: "Black",
  white: "White",
  oak: "Natural oak",
};

/** Human label for product-type URLs (/shop/[type]). */
export const PRODUCT_SLUG_LABEL: Record<ProductType, string> = {
  digital: "Digital file",
  poster: "Fine art print",
  framed: "Framed print",
  canvas: "Gallery canvas",
};

export function variantDims(v: Variant) {
  if (!v.widthIn) return null;
  const cm = (n: number) => Math.round(n * 2.54);
  return { inches: `${v.widthIn} × ${v.heightIn} in`, cm: `${cm(v.widthIn)} × ${cm(v.heightIn)} cm` };
}

/** Where a size tends to work in a home, based on its area. */
export function sizeUse(v: Variant) {
  const area = v.widthIn * v.heightIn;
  if (!area) return "Screens, sharing and printing at home";
  if (area <= 100) return "Desks, shelves and gallery walls";
  if (area <= 200) return "Side tables, hallways and small walls";
  if (area <= 450) return "Above a console, bed or sofa";
  return "A statement wall";
}

/* ------------------------------------------------------------------ */
/* Price bands for gift guides                                         */
/* ------------------------------------------------------------------ */

export type PricedItem = { product: Product; variant: Variant };

export const ALL_ITEMS: PricedItem[] = PRODUCTS.flatMap((product) =>
  product.variants.map((variant) => ({ product, variant })),
).sort((a, b) => a.variant.price - b.variant.price);

export function itemLabel({ product, variant }: PricedItem) {
  return product.type === "digital" ? product.name : `${variant.label} ${product.name.toLowerCase()}`;
}

export const PRICE_BANDS: { title: string; note: string; min: number; max: number }[] = [
  { title: "Under $60", note: "Thoughtful, easy and instantly giftable", min: 0, max: 5999 },
  { title: "$60 to $100", note: "The sweet spot for most gifts", min: 6000, max: 10000 },
  { title: "$100 and up", note: "Statement pieces, ready to hang", min: 10001, max: Number.MAX_SAFE_INTEGER },
];

export function itemsInBand(min: number, max: number) {
  return ALL_ITEMS.filter((i) => i.variant.price >= min && i.variant.price <= max);
}

/** The best items (one per product type) a gift amount fully covers. US shipping is free. */
export function itemsCoveredBy(amountCents: number, limit = 2) {
  return ALL_ITEMS.filter((i) => i.variant.price <= amountCents)
    .sort((a, b) => b.variant.price - a.variant.price)
    .filter((item, idx, arr) => arr.findIndex((x) => x.product.type === item.product.type) === idx)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Holiday guidance                                                    */
/* ------------------------------------------------------------------ */

function utcDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

export function formatDay(isoDate: string, opts: { weekday?: boolean; long?: boolean } = {}) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: opts.weekday ? (opts.long ? "long" : "short") : undefined,
    month: opts.long ? "long" : "short",
    day: "numeric",
  }).format(utcDate(isoDate));
}

/**
 * Christmas 2026 guidance (set by the team, not computed): order physical pieces by Dec 12 for
 * standard US delivery before Christmas. Canada is our own conservative assumption (a week earlier,
 * for cross-border transit from US print facilities). Gift Reveal works any time up to Dec 25.
 */
export const CHRISTMAS_2026 = {
  usCutoff: "2026-12-12",
  canadaCutoff: "2026-12-05",
  revealUntil: "2026-12-25",
};

export const CHRISTMAS_US_CUTOFF = formatDay(CHRISTMAS_2026.usCutoff, { long: true }); // "December 12"
export const CHRISTMAS_US_CUTOFF_FULL = formatDay(CHRISTMAS_2026.usCutoff, { weekday: true, long: true }); // "Saturday, December 12"
export const CHRISTMAS_CA_CUTOFF = formatDay(CHRISTMAS_2026.canadaCutoff, { long: true });

export function joinWords(words: string[]) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}
