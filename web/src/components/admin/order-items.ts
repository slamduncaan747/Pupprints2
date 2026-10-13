import { findVariant, getStyle } from "@/lib/catalog";

export type NormalizedItem = {
  generationId: string | null;
  variantId: string | null;
  label: string;
  quantity: number;
  unitCents: number | null;
  frame: string | null;
  style: string | null;
  petName: string | null;
  raw: unknown;
};

function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  return undefined;
}

const str = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : null);
const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" && v.trim() && !Number.isNaN(Number(v)) ? Number(v) : null);

/**
 * Orders.items is written by checkout/webhook; accept camelCase or snake_case keys so the
 * admin keeps working if the shape evolves.
 */
export function normalizeItems(items: unknown): NormalizedItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((it) => {
    const o = (it && typeof it === "object" ? it : {}) as Record<string, unknown>;
    const variantId = str(pick(o, ["variantId", "variant_id", "sku", "variant"]));
    const found = variantId ? findVariant(variantId) : undefined;
    const styleSlug = str(pick(o, ["style", "styleSlug", "style_slug"]));
    const style = styleSlug ? (getStyle(styleSlug)?.name ?? styleSlug) : null;
    const label =
      str(pick(o, ["label", "name", "productName", "product_name", "description"])) ??
      (found ? `${found.product.name} · ${found.variant.label}` : (variantId ?? "Item"));
    return {
      generationId: str(pick(o, ["generationId", "generation_id"])),
      variantId,
      label: found && !str(pick(o, ["label", "name"])) ? `${found.product.name} · ${found.variant.label}` : label,
      quantity: num(pick(o, ["quantity", "qty"])) ?? 1,
      unitCents:
        num(pick(o, ["unitCents", "unit_cents", "unitAmount", "unit_amount", "priceCents", "price_cents", "price", "amount_cents", "amountCents"])) ??
        (found ? found.variant.price : null),
      frame: str(pick(o, ["frame", "frameColor", "frame_color"])),
      style,
      petName: str(pick(o, ["petName", "pet_name"])),
      raw: it,
    };
  });
}

export function formatAddress(addr: unknown): string[] {
  if (!addr || typeof addr !== "object") return [];
  const a = addr as Record<string, unknown>;
  // Stripe shape: { name, address: { line1, line2, city, state, postal_code, country } } or flat.
  const inner = (a.address && typeof a.address === "object" ? a.address : a) as Record<string, unknown>;
  const s = (k: string) => (typeof inner[k] === "string" ? (inner[k] as string) : "");
  const lines = [
    typeof a.name === "string" ? a.name : "",
    s("line1"),
    s("line2"),
    [s("city"), [s("state"), s("postal_code") || s("zip")].filter(Boolean).join(" ")].filter(Boolean).join(", "),
    s("country"),
  ];
  return lines.filter(Boolean);
}
