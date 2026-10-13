/**
 * Catalog-derived strings for content. Articles and breed pages use these instead of
 * hardcoding prices, sizes or style names, so copy can never drift from checkout.
 */
import {
  ADDONS,
  PRODUCT_MAP,
  PRODUCTS,
  SHIPPING_RATES,
  STYLE_MAP,
  findVariant,
  type ProductType,
  type StyleSlug,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

/** Catalog style name, e.g. "royal" -> "The Royal". */
export function styleName(slug: StyleSlug) {
  return STYLE_MAP[slug].name;
}

/** Inline link to a style landing page, in article inline syntax. */
export function styleLink(slug: StyleSlug, label?: string) {
  return `[${label ?? styleName(slug)}](/styles/${slug})`;
}

/** Inline link that opens the creator with a style preselected. */
export function tryLink(slug: StyleSlug, label: string) {
  return `[${label}](/create?style=${slug})`;
}

/** Lowest price of a product type, formatted ("$59"). */
export function fromPrice(type: ProductType) {
  return formatPrice(Math.min(...PRODUCT_MAP[type].variants.map((v) => v.price)));
}

/** Highest price of a product type, formatted. */
export function toPrice(type: ProductType) {
  return formatPrice(Math.max(...PRODUCT_MAP[type].variants.map((v) => v.price)));
}

/** Price of one variant by SKU id ("canvas-16x20"), formatted. Throws on unknown ids so typos fail loudly at build. */
export function priceOf(variantId: string) {
  const found = findVariant(variantId);
  if (!found) throw new Error(`Unknown variant: ${variantId}`);
  return formatPrice(found.variant.price);
}

/** "8×10\", 12×16\", 16×20\" and 24×36\"" for a product type. */
export function sizeList(type: ProductType) {
  const labels = PRODUCT_MAP[type].variants.map((v) => v.label);
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

/** Ship window for a product type ("5–9 business days"). */
export function shipWindow(type: ProductType) {
  const [min, max] = PRODUCT_MAP[type].shipDays;
  if (max === 0) return "instantly";
  return min === max ? `${min} business days` : `${min}–${max} business days`;
}

/** All unique physical sizes across the catalog, smallest first ("8×10\""...). */
export const ALL_SIZES = Array.from(
  new Map(
    PRODUCTS.filter((p) => p.type !== "digital")
      .flatMap((p) => p.variants)
      .map((v) => [v.label, v] as const),
  ).values(),
).sort((a, b) => a.widthIn * a.heightIn - b.widthIn * b.heightIn);

export const ORNAMENT = ADDONS.find((a) => a.id === "addon-ornament");
export const MUG = ADDONS.find((a) => a.id === "addon-mug");

export const US_SHIPPING_FREE = SHIPPING_RATES.US === 0;
export const CANADA_SHIPPING = formatPrice(SHIPPING_RATES.CA);

/** Words in a string, ignoring inline link targets. */
export function countWords(text: string) {
  return text
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/[*[\]]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** URL-safe id for headings ("Canvas vs. framed?" -> "canvas-vs-framed"). */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
