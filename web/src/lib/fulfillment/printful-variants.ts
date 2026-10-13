import type { FrameColor } from "@/lib/catalog";

/**
 * Our SKUs → Printful catalog variant ids.
 *
 * How this was derived (2026-10-13): from Printful's public, unauthenticated catalog API,
 *   GET https://api.printful.com/products            (find product ids by title)
 *   GET https://api.printful.com/products/{id}       (variants: id, size, color, price, availability)
 * using these catalog products:
 *   3   "Canvas (in)"                                 1.25″ thick, hand-stretched on wood bars
 *   2   "Enhanced Matte Paper Framed Poster (in)"     colors Black / White / Red Oak (= our "oak")
 *   1   "Enhanced Matte Paper Poster (in)"            189 g/m² matte
 *   19  "White Glossy Mug"                            11 oz
 *   900 "Ceramic Ornaments, 2-Side Print"            1 pc / Circle (2.99″), same design both sides
 * Each id below was matched on product + size (+ frame color) and confirmed `in_stock` in the
 * US region. White framed posters and the ornament list no Canadian production region, so
 * Canadian orders for those ship from the US. Base prices at derivation time are noted for
 * margin checks. Re-verify with `verifyPrintfulVariants()` in ./printful.ts.
 */

export type PrintfulVariantRef = {
  productId: number;
  variantId: number;
  /** Printful's variant name, for humans. */
  name: string;
  /** Base price (USD) when this table was built. */
  baseUsd: number;
};

const v = (productId: number, variantId: number, name: string, baseUsd: number): PrintfulVariantRef => ({
  productId,
  variantId,
  name,
  baseUsd,
});

export const PRINTFUL_VARIANTS = {
  // Canvas (product 3)
  "canvas-8x10": v(3, 19293, "Canvas (in) (8″×10″)", 15.81),
  "canvas-12x16": v(3, 5, "Canvas 12″×16″", 23.41),
  "canvas-16x20": v(3, 6, "Canvas 16″×20″", 28.56),
  "canvas-18x24": v(3, 7, "Canvas 18″×24″", 33.66),
  "canvas-24x36": v(3, 825, "Canvas 24″×36″", 52.02),

  // Enhanced Matte Paper Poster (product 1)
  "poster-8x10": v(1, 4463, "Enhanced Matte Paper Poster 8″×10″", 7.03),
  "poster-12x16": v(1, 1349, "Enhanced Matte Paper Poster 12″×16″", 11.11),
  "poster-18x24": v(1, 1, "Enhanced Matte Paper Poster 18″×24″", 13.15),
  "poster-24x36": v(1, 2, "Enhanced Matte Paper Poster 24″×36″", 18.25),

  // Enhanced Matte Paper Framed Poster (product 2): black
  "framed-8x10:black": v(2, 4651, "Framed Poster (Black/8″×10″)", 20.76),
  "framed-12x16:black": v(2, 1350, "Framed Poster (Black/12″×16″)", 32.2),
  "framed-16x20:black": v(2, 4399, "Framed Poster (Black/16″×20″)", 42.61),
  "framed-18x24:black": v(2, 3, "Framed Poster (Black/18″×24″)", 46.3),
  "framed-24x36:black": v(2, 4, "Framed Poster (Black/24″×36″)", 75.9),
  // white
  "framed-8x10:white": v(2, 10754, "Framed Poster (White/8″×10″)", 20.76),
  "framed-12x16:white": v(2, 10751, "Framed Poster (White/12″×16″)", 32.2),
  "framed-16x20:white": v(2, 10753, "Framed Poster (White/16″×20″)", 42.61),
  "framed-18x24:white": v(2, 10749, "Framed Poster (White/18″×24″)", 46.3),
  "framed-24x36:white": v(2, 10750, "Framed Poster (White/24″×36″)", 75.9),
  // oak (Printful "Red Oak")
  "framed-8x10:oak": v(2, 15021, "Framed Poster (Red Oak / 8″×10″)", 20.76),
  "framed-12x16:oak": v(2, 15025, "Framed Poster (Red Oak / 12″×16″)", 32.2),
  "framed-16x20:oak": v(2, 15029, "Framed Poster (Red Oak / 16″×20″)", 42.61),
  "framed-18x24:oak": v(2, 15031, "Framed Poster (Red Oak / 18″×24″)", 46.3),
  "framed-24x36:oak": v(2, 15032, "Framed Poster (Red Oak / 24″×36″)", 75.9),

  // Add-ons
  "addon-mug": v(19, 1320, "White Glossy Mug 11 oz", 6.07),
  "addon-ornament": v(900, 23133, "Ceramic Ornaments, 2-Side Print (1 pc / Circle)", 7.73),
} as const satisfies Record<string, PrintfulVariantRef>;

export type PrintfulSku = keyof typeof PRINTFUL_VARIANTS;

/** Resolve our variant id (+ frame color for framed prints) to a Printful catalog variant. */
export function printfulVariantFor(variantId: string, frameColor?: FrameColor | null): PrintfulVariantRef | null {
  const key = variantId.startsWith("framed-") ? `${variantId}:${frameColor ?? "black"}` : variantId;
  return (PRINTFUL_VARIANTS as Record<string, PrintfulVariantRef>)[key] ?? null;
}
