import { PRODUCTS, PRODUCT_MAP, type Product, type ProductType } from "@/lib/catalog";

/** Lowest variant price for "from $X" copy. */
export function fromPrice(product: Product) {
  return Math.min(...product.variants.map((v) => v.price));
}

/** "8×10″–24×36″" size range for a physical product. */
export function sizeRange(product: Product) {
  const first = product.variants[0]?.label;
  const last = product.variants[product.variants.length - 1]?.label;
  return first === last ? first : `${first}–${last}`;
}

export function shipCopy(type: ProductType) {
  const [a, b] = PRODUCT_MAP[type].shipDays;
  return b === 0 ? "Delivered instantly" : `Arrives in ${a}–${b} business days`;
}

const PHYSICAL = PRODUCTS.filter((p) => p.type !== "digital");

/** Shortest and longest delivery window across physical products, in business days. */
export const SHIP_WINDOW: [number, number] = [
  Math.min(...PHYSICAL.map((p) => p.shipDays[0])),
  Math.max(...PHYSICAL.map((p) => p.shipDays[1])),
];
