import "server-only";
import { env } from "@/lib/env";
import { site, socialHandle } from "@/lib/config";
import {
  appendNote,
  getOrder,
  hasPhysical,
  itemsOf,
  physicalItems,
  updateOrder,
  type OrderRow,
} from "@/lib/orders";
import { createOrder, printfulConfigured, PrintfulError, type PfItem, type PfOrderInput } from "./printful";
import { printfulVariantFor } from "./printful-variants";

/**
 * Fulfillment: hands a paid, human-approved order to the print partner.
 * Provider is chosen with FULFILLMENT_PROVIDER ("printful" | "manual", default manual).
 */

export type FulfillmentResult = { ok: boolean; providerOrderId?: string; status?: string; error?: string };

/** Signed print-file URLs keyed by storage path. */
export type FileUrls = Map<string, string>;

export interface FulfillmentProvider {
  id: string;
  configured(): boolean;
  createOrder(order: OrderRow, files: FileUrls): Promise<{ providerOrderId: string; status: string }>;
}

const money = (cents: number | null | undefined) => ((cents ?? 0) / 100).toFixed(2);

function clip(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/** Build the Printful v1 order body. Exported for tests / admin previews. */
export function buildPrintfulOrder(order: OrderRow, files: FileUrls): PfOrderInput {
  const ship = order.shipping_address;
  const a = ship?.address;
  if (!a?.line1 || !a.city || !a.country || !a.postal_code) throw new Error("Order has no complete shipping address");

  const printFiles = order.print_files?.items ?? [];
  const items: PfItem[] = physicalItems(order).map(({ item, index }) => {
    const variant = printfulVariantFor(item.variantId, item.frameColor);
    if (!variant) throw new Error(`No Printful variant for ${item.variantId}${item.frameColor ? ` (${item.frameColor})` : ""}`);
    const file = printFiles.find((f) => f.index === index);
    const url = file ? files.get(file.path) : undefined;
    if (!url) throw new Error(`Print file missing for item ${index + 1} (${item.variantId})`);
    return {
      external_id: `${order.order_number}-${index + 1}`.slice(0, 32),
      variant_id: variant.variantId,
      quantity: item.quantity,
      name: clip(`${item.label} — ${item.styleName}`, 120),
      retail_price: money(item.unitAmount),
      files: [{ type: "default", url, filename: `${order.order_number}-${index + 1}.jpg` }],
    };
  });

  const giftTo = order.gift_recipient_name?.trim();
  const from = (order.gift_sender_name || order.customer_name || "").trim();
  const giftMessage = order.gift_message?.trim();

  return {
    external_id: order.order_number.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32),
    shipping: "STANDARD",
    recipient: {
      name: ship?.name || order.customer_name || "Customer",
      address1: a.line1,
      address2: a.line2 || undefined,
      city: a.city,
      state_code: a.state || undefined,
      country_code: a.country,
      zip: a.postal_code,
      phone: order.phone || undefined,
      email: order.email || undefined,
    },
    items,
    retail_costs: {
      currency: (order.currency || "usd").toUpperCase(),
      subtotal: money(order.subtotal_cents),
      discount: money(order.discount_cents),
      shipping: money(order.shipping_cents),
      tax: money(order.tax_cents),
    },
    gift: giftMessage
      ? {
          subject: clip(giftTo ? `For ${giftTo}` : "A gift for you", 60),
          message: clip(from ? `${giftMessage} — ${from}` : giftMessage, 200),
        }
      : undefined,
    packing_slip: {
      email: site.supportEmail,
      store_name: "Pup Prints",
      message: `Checked by a person, printed with care. Love it or we'll remake or refund it.${
        socialHandle(site.social.instagram) ? ` Show us on the wall: ${socialHandle(site.social.instagram)}` : ""
      }`,
      custom_order_id: order.order_number,
      ...(process.env.PRINTFUL_PACKING_SLIP_LOGO_URL ? { logo_url: process.env.PRINTFUL_PACKING_SLIP_LOGO_URL } : {}),
    },
  };
}

export const printfulProvider: FulfillmentProvider = {
  id: "printful",
  configured: printfulConfigured,
  async createOrder(order, files) {
    const body = buildPrintfulOrder(order, files);
    const pfOrder = await createOrder(body, { confirm: process.env.PRINTFUL_CONFIRM === "1" });
    return { providerOrderId: String(pfOrder.id), status: pfOrder.status };
  },
};

function providerFor(id: string): FulfillmentProvider | null {
  if (id === "printful") return printfulProvider;
  return null;
}

const SUBMITTABLE = new Set(["paid", "needs_attention", "in_production"]);

/**
 * Send an order to the configured print partner. With FULFILLMENT_PROVIDER=manual (or no API
 * key) the order stays `paid` and `{ ok: false, error: "manual_fulfillment" }` is returned;
 * the print files are linked from the admin. On success the order moves to `in_production`.
 * Printful orders are created as drafts unless PRINTFUL_CONFIRM=1.
 */
export async function submitOrderToFulfillment(orderId: string): Promise<FulfillmentResult> {
  let order = await getOrder(orderId);
  if (!order) return { ok: false, error: "order_not_found" };
  if (!SUBMITTABLE.has(order.status)) return { ok: false, error: `order_is_${order.status}` };
  if (!hasPhysical(order)) return { ok: false, error: "no_physical_items" };
  if (order.fulfillment_order_id && order.status === "in_production") {
    return { ok: true, providerOrderId: order.fulfillment_order_id, status: order.fulfillment_status ?? undefined };
  }

  const provider = providerFor(env.fulfillmentProvider);
  if (!provider || !provider.configured()) {
    // Still make sure the print files exist so a person can fulfill by hand.
    if (!order.print_files) {
      const { preparePrintFiles } = await import("@/lib/print-file");
      await preparePrintFiles(orderId).catch((err) => console.error("[fulfillment] print files failed", err));
    }
    return { ok: false, error: "manual_fulfillment" };
  }

  try {
    const { preparePrintFiles, signPrintFiles } = await import("@/lib/print-file");
    const expected = physicalItems(order).length;
    if (!order.print_files || order.print_files.items.length < expected || order.print_files.errors?.length) {
      await preparePrintFiles(orderId, { force: Boolean(order.print_files) });
      order = (await getOrder(orderId)) as OrderRow;
    }
    if (!order.print_files || order.print_files.items.length < expected) {
      throw new Error(`Print files incomplete: ${order.print_files?.errors?.join("; ") ?? "not generated"}`);
    }
    const urls = await signPrintFiles(order.print_files, 7 * 24 * 60 * 60);
    const created = await provider.createOrder(order, urls);
    await updateOrder(orderId, {
      fulfillment_provider: provider.id,
      fulfillment_order_id: created.providerOrderId,
      fulfillment_status: created.status,
      status: "in_production",
    });
    await appendNote(
      orderId,
      `Sent to ${provider.id} (#${created.providerOrderId}, ${created.status}) — ${itemsOf(order).length} line(s).`,
    );
    return { ok: true, providerOrderId: created.providerOrderId, status: created.status };
  } catch (err) {
    const message =
      err instanceof PrintfulError ? `Printful ${err.status}: ${err.message}` : err instanceof Error ? err.message : String(err);
    console.error("[fulfillment] submit failed", orderId, message);
    await updateOrder(orderId, { status: "needs_attention" }).catch(() => {});
    await appendNote(orderId, `Fulfillment failed: ${message}`);
    return { ok: false, error: message };
  }
}
