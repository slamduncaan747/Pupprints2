import "server-only";
import type Stripe from "stripe";
import { findAddon, findVariant, getStyle, PRODUCT_MAP, type FrameColor, type ProductType } from "@/lib/catalog";
import { site } from "@/lib/config";
import { features } from "@/lib/env";
import { db, previewUrl, requireDb } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { computeEta, formatArrival, type OrderStatus } from "@/components/order/timeline";
import { escapeLike } from "@/components/partners/program";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type { OrderStatus };

/** One line in `orders.items` (written by /api/checkout). */
export type OrderItem = {
  kind: "product" | "addon";
  generationId: string;
  /** Our SKU: a catalog variant id ("canvas-16x20") or an addon id ("addon-mug"). */
  variantId: string;
  productType: ProductType | "addon";
  productName: string;
  /** Customer-facing label, e.g. `Gallery Canvas 16×20″ · Oak frame`. */
  label: string;
  variantLabel: string;
  frameColor: FrameColor | null;
  quantity: number;
  /** Cents charged per unit (0 when the digital file is included with a physical piece). */
  unitAmount: number;
  included?: boolean;
  style: string;
  styleName: string;
  petName: string | null;
  previewPath: string | null;
  widthIn: number;
  heightIn: number;
};

export type ShippingAddress = {
  name: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
  };
};

export type PrintFileEntry = {
  /** Index into orders.items */
  index: number;
  variantId: string;
  frameColor: FrameColor | null;
  path: string;
  width: number;
  height: number;
  dpi: number;
  /** Mirrored gallery-wrap band on each side, in inches (canvas only). */
  wrapIn?: number;
};

export type DigitalFileEntry = { generationId: string; path: string; width: number; height: number };

export type PrintFiles = {
  version: 1;
  generatedAt: string;
  upscaler: string;
  items: PrintFileEntry[];
  digital: DigitalFileEntry[];
  errors?: string[];
};

export type OrderRow = {
  id: string;
  created_at: string;
  updated_at: string;
  order_number: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  status: OrderStatus;
  email: string | null;
  customer_name: string | null;
  phone: string | null;
  shipping_address: ShippingAddress | null;
  items: OrderItem[];
  subtotal_cents: number | null;
  shipping_cents: number | null;
  discount_cents: number | null;
  tax_cents: number | null;
  total_cents: number | null;
  currency: string;
  referral_code: string | null;
  utm: Record<string, string> | null;
  gift_message: string | null;
  fulfillment_provider: string | null;
  fulfillment_order_id: string | null;
  fulfillment_status: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  print_files: PrintFiles | null;
  notes: string | null;
  reveal_token: string;
  ship_country: string | null;
  gift_sender_name: string | null;
  gift_recipient_name: string | null;
  gift_recipient_email: string | null;
  reveal_sent_at: string | null;
  reveal_viewed_at: string | null;
  confirmation_sent_at: string | null;
  shipped_email_sent_at: string | null;
  review_request_sent_at: string | null;
};

/** Orders that have been paid for (the reveal + downloads work for these). */
export const PAID_STATUSES: OrderStatus[] = ["paid", "in_production", "shipped", "delivered", "needs_attention"];

export function isPaid(order: Pick<OrderRow, "status">) {
  return PAID_STATUSES.includes(order.status);
}

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

export function itemsOf(order: Pick<OrderRow, "items">): OrderItem[] {
  return Array.isArray(order.items) ? order.items : [];
}

export function physicalItems(order: Pick<OrderRow, "items">) {
  return itemsOf(order)
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.productType !== "digital");
}

export function hasPhysical(order: Pick<OrderRow, "items">) {
  return physicalItems(order).length > 0;
}

/** Generations whose clean hi-res file the customer receives (every portrait in the order). */
export function digitalGenerationIds(order: Pick<OrderRow, "items">): string[] {
  return [...new Set(itemsOf(order).map((i) => i.generationId))];
}

/** Production + shipping window (business days) for the slowest physical item. */
export function orderShipDays(order: Pick<OrderRow, "items">): [number, number] {
  let min = 0;
  let max = 0;
  for (const { item } of physicalItems(order)) {
    const days = item.productType === "addon" ? PRODUCT_MAP.poster.shipDays : PRODUCT_MAP[item.productType]?.shipDays;
    if (days) {
      min = Math.max(min, days[0]);
      max = Math.max(max, days[1]);
    }
  }
  return min || max ? [min, max] : PRODUCT_MAP.canvas.shipDays;
}

export function orderEta(order: Pick<OrderRow, "items" | "created_at" | "ship_country">) {
  if (!hasPhysical(order)) return null;
  return computeEta(new Date(order.created_at), orderShipDays(order), order.ship_country);
}

export function orderArrivalText(order: Pick<OrderRow, "items" | "created_at" | "ship_country">) {
  const eta = orderEta(order);
  return eta ? formatArrival(eta) : null;
}

/** The pet name to use in copy (first item that has one). */
export function orderPetName(order: Pick<OrderRow, "items">): string | null {
  return itemsOf(order).find((i) => i.petName)?.petName ?? null;
}

/** The main portrait: the first physical item's generation, else the first item's. */
export function primaryItem(order: Pick<OrderRow, "items">): OrderItem | null {
  const items = itemsOf(order);
  return items.find((i) => i.kind === "product" && i.productType !== "digital") ?? items[0] ?? null;
}

export function mainProductName(order: Pick<OrderRow, "items">): string | null {
  const p = itemsOf(order).find((i) => i.kind === "product" && i.productType !== "digital");
  if (!p) return null;
  return p.productType === "canvas" ? "canvas" : p.productType === "framed" ? "framed print" : "fine art print";
}

export function revealUrl(token: string) {
  return `${site.url.replace(/\/$/, "")}/reveal/${token}`;
}

export function downloadUrl(token: string, generationId: string, inline = false) {
  return `${site.url.replace(/\/$/, "")}/api/download/${token}/${generationId}${inline ? "?inline=1" : ""}`;
}

export function trackUrl(orderNumber?: string) {
  return `${site.url.replace(/\/$/, "")}/track${orderNumber ? `?order=${encodeURIComponent(orderNumber)}` : ""}`;
}

export function previewImageUrl(item: Pick<OrderItem, "previewPath"> | null | undefined) {
  return item?.previewPath ? previewUrl(item.previewPath) : null;
}

/** Customer-facing label for an item, e.g. "Gallery Canvas 16×20″ · Oak frame". */
export function itemLabel(variantId: string, frameColor?: FrameColor | null): { label: string; variantLabel: string; productName: string } {
  const addon = findAddon(variantId);
  if (addon) return { label: addon.name, variantLabel: addon.description, productName: addon.name };
  const found = findVariant(variantId);
  if (!found) return { label: variantId, variantLabel: variantId, productName: variantId };
  const { product, variant } = found;
  if (product.type === "digital") return { label: "Hi-res digital portrait", variantLabel: variant.label, productName: product.name };
  const size = `${variant.widthIn}×${variant.heightIn}″`;
  const frame = frameColor ? ` · ${frameColor.charAt(0).toUpperCase()}${frameColor.slice(1)} frame` : "";
  return { label: `${product.name} ${size}${frame}`, variantLabel: size, productName: product.name };
}

export function styleNameOf(slug: string) {
  return getStyle(slug)?.name ?? slug;
}

/** Order summary rows used in emails and on the success page. */
export function summarizeOrder(order: OrderRow) {
  const items = itemsOf(order).map((i) => ({
    label: i.label,
    detail: [i.styleName, i.petName ? `Portrait of ${i.petName}` : null].filter(Boolean).join(" · "),
    quantity: i.quantity,
    amount: i.included ? "Included" : formatPrice(i.unitAmount * i.quantity),
  }));
  const physical = hasPhysical(order);
  const totals: { label: string; value: string; strong?: boolean; muted?: boolean }[] = [];
  if (order.subtotal_cents != null) totals.push({ label: "Subtotal", value: formatPrice(order.subtotal_cents) });
  if (order.discount_cents) totals.push({ label: "Discount", value: `−${formatPrice(order.discount_cents)}` });
  if (physical) totals.push({ label: "Shipping", value: order.shipping_cents ? formatPrice(order.shipping_cents) : "Free" });
  if (order.tax_cents) totals.push({ label: "Tax", value: formatPrice(order.tax_cents) });
  if (order.total_cents != null) totals.push({ label: "Total", value: formatPrice(order.total_cents), strong: true });
  return { items, totals };
}

/* ------------------------------------------------------------------ */
/* Data access                                                         */
/* ------------------------------------------------------------------ */

const TOKEN_RE = /^[a-f0-9]{16,64}$/i;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: string | null | undefined): v is string {
  return Boolean(v && UUID_RE.test(v));
}

export async function getOrder(id: string): Promise<OrderRow | null> {
  const c = db();
  if (!c || !isUuid(id)) return null;
  const { data, error } = await c.from("orders").select("*").eq("id", id).maybeSingle<OrderRow>();
  if (error) console.error("[orders] getOrder", error.message);
  return data ?? null;
}

export async function getOrderByRevealToken(token: string): Promise<OrderRow | null> {
  const c = db();
  if (!c || !TOKEN_RE.test(token)) return null;
  const { data } = await c.from("orders").select("*").eq("reveal_token", token).maybeSingle<OrderRow>();
  return data ?? null;
}

export async function getOrderByStripeSession(sessionId: string): Promise<OrderRow | null> {
  const c = db();
  if (!c || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  const { data } = await c.from("orders").select("*").eq("stripe_session_id", sessionId).maybeSingle<OrderRow>();
  return data ?? null;
}

export async function updateOrder(id: string, patch: Partial<OrderRow>): Promise<OrderRow | null> {
  const { data, error } = await requireDb()
    .from("orders")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle<OrderRow>();
  if (error) throw new Error(`Order update failed: ${error.message}`);
  return data ?? null;
}

/** Append a timestamped line to orders.notes (visible in admin). Never throws. */
export async function appendNote(id: string, note: string) {
  try {
    const order = await getOrder(id);
    if (!order) return;
    const line = `[${new Date().toISOString().slice(0, 16).replace("T", " ")}] ${note}`;
    const notes = order.notes ? `${order.notes}\n${line}` : line;
    await updateOrder(id, { notes: notes.slice(-8000) });
  } catch (err) {
    console.error("[orders] appendNote failed", err);
  }
}

type ClaimColumn = "confirmation_sent_at" | "reveal_sent_at" | "shipped_email_sent_at" | "review_request_sent_at";

/**
 * Atomically mark a once-only side effect (e.g. an email) as done. Returns true only for the
 * caller that flipped the column from null, so concurrent webhooks never double-send.
 */
export async function claimOnce(id: string, column: ClaimColumn): Promise<boolean> {
  const c = db();
  if (!c) return false;
  const now = new Date().toISOString();
  const { data, error } = await c
    .from("orders")
    .update({ [column]: now, updated_at: now })
    .eq("id", id)
    .is(column, null)
    .select("id");
  if (error) {
    console.error(`[orders] claim ${column} failed`, error.message);
    return false;
  }
  return Array.isArray(data) && data.length > 0;
}

/** Undo a claim when the side effect failed, so a retry can try again. */
export async function releaseClaim(id: string, column: ClaimColumn) {
  await db()?.from("orders").update({ [column]: null }).eq("id", id);
}

/* ------------------------------------------------------------------ */
/* Stripe → order                                                      */
/* ------------------------------------------------------------------ */

function addressFromSession(session: Stripe.Checkout.Session): ShippingAddress | null {
  const ship = session.collected_information?.shipping_details;
  if (!ship?.address) return null;
  const a = ship.address;
  return {
    name: ship.name ?? session.customer_details?.name ?? null,
    address: {
      line1: a.line1 ?? null,
      line2: a.line2 ?? null,
      city: a.city ?? null,
      state: a.state ?? null,
      postal_code: a.postal_code ?? null,
      country: a.country ?? null,
    },
  };
}

function paymentIntentId(session: Stripe.Checkout.Session) {
  const pi = session.payment_intent;
  return typeof pi === "string" ? pi : (pi?.id ?? null);
}

export function sessionIsPaid(session: Stripe.Checkout.Session) {
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}

/**
 * Apply a completed Checkout Session to its order. Idempotent: only the first call moves the
 * order from `pending` to `paid` (`transitioned: true`); later calls return the current row.
 */
export async function applyCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ order: OrderRow | null; transitioned: boolean; paid: boolean }> {
  const orderId = session.client_reference_id ?? session.metadata?.orderId ?? null;
  let order = orderId ? await getOrder(orderId) : null;
  if (!order) order = await getOrderByStripeSession(session.id);
  if (!order) {
    console.error("[orders] no order for checkout session", session.id);
    return { order: null, transitioned: false, paid: false };
  }

  const email = (session.customer_details?.email ?? session.customer_email ?? order.email ?? null)?.trim().toLowerCase() ?? null;
  const details: Partial<OrderRow> = {
    email,
    customer_name: session.customer_details?.name ?? session.collected_information?.shipping_details?.name ?? order.customer_name,
    phone: session.customer_details?.phone ?? order.phone,
    shipping_address: addressFromSession(session) ?? order.shipping_address,
    stripe_session_id: session.id,
    stripe_payment_intent: paymentIntentId(session) ?? order.stripe_payment_intent,
    subtotal_cents: session.amount_subtotal ?? order.subtotal_cents,
    shipping_cents: session.total_details?.amount_shipping ?? session.shipping_cost?.amount_total ?? 0,
    discount_cents: session.total_details?.amount_discount ?? 0,
    tax_cents: session.total_details?.amount_tax ?? 0,
    total_cents: session.amount_total ?? order.total_cents,
    currency: session.currency ?? order.currency,
  };

  if (!sessionIsPaid(session)) {
    // Async payment methods (e.g. bank debits): keep the details, wait for async_payment_succeeded.
    if (order.status === "pending") order = (await updateOrder(order.id, details)) ?? order;
    return { order, transitioned: false, paid: false };
  }

  const c = requireDb();
  const { data, error } = await c
    .from("orders")
    .update({ ...details, status: "paid", updated_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle<OrderRow>();
  if (error) throw new Error(`Marking order paid failed: ${error.message}`);
  if (data) return { order: data, transitioned: true, paid: true };
  return { order: (await getOrder(order.id)) ?? order, transitioned: false, paid: isPaid(order) };
}

/* ------------------------------------------------------------------ */
/* Post-payment side effects                                           */
/* ------------------------------------------------------------------ */

function emailCtx() {
  return { siteUrl: site.url.replace(/\/$/, ""), supportEmail: site.supportEmail };
}

/** Mark the buyer's lead (newsletter / saved preview) as converted. */
async function markLeadConverted(order: OrderRow) {
  const c = db();
  if (!c || !order.email) return;
  const { error } = await c
    .from("leads")
    .update({ converted_order_id: order.id })
    .ilike("email", escapeLike(order.email))
    .is("converted_order_id", null);
  if (error) console.error("[orders] lead conversion failed", error.message);
}

export async function sendConfirmationEmail(order: OrderRow, opts: { giftEmailedNow: boolean }) {
  // Without an email provider nothing is claimed, so nothing is wrongly marked as sent.
  if (!order.email || !features.email) return;
  if (!(await claimOnce(order.id, "confirmation_sent_at"))) return;
  const { sendEmail, orderConfirmationEmail } = await import("@/lib/email");
  const main = primaryItem(order);
  const gens = digitalGenerationIds(order);
  const { items, totals } = summarizeOrder(order);
  const email = orderConfirmationEmail({
    ctx: emailCtx(),
    orderNumber: order.order_number,
    customerName: order.customer_name,
    petName: orderPetName(order),
    portraitUrl: main ? downloadUrl(order.reveal_token, main.generationId, true) : null,
    items,
    totals,
    hasPhysical: hasPhysical(order),
    arrival: orderArrivalText(order),
    revealUrl: revealUrl(order.reveal_token),
    downloads: gens.map((g, n) => ({
      label: gens.length > 1 ? `Portrait ${n + 1}` : "Download",
      url: downloadUrl(order.reveal_token, g),
    })),
    trackUrl: trackUrl(order.order_number),
    giftRecipient:
      order.gift_recipient_email || order.gift_recipient_name
        ? { name: order.gift_recipient_name, emailedNow: opts.giftEmailedNow }
        : null,
  });
  const res = await sendEmail({ to: order.email, ...email, tag: "order_confirmation", idempotencyKey: `confirm-${order.id}` });
  if (!res.ok && !res.skipped) await releaseClaim(order.id, "confirmation_sent_at");
}

/** Email the Gift Reveal link to the recipient. Pass `force` to allow a re-send. */
export async function sendGiftRevealEmail(order: OrderRow, opts: { force?: boolean } = {}): Promise<boolean> {
  if (!order.gift_recipient_email || !isPaid(order) || !features.email) return false;
  if (!opts.force && !(await claimOnce(order.id, "reveal_sent_at"))) return false;
  const { sendEmail, giftRevealEmail } = await import("@/lib/email");
  const email = giftRevealEmail({
    ctx: emailCtx(),
    senderName: order.gift_sender_name || order.customer_name,
    recipientName: order.gift_recipient_name,
    petName: orderPetName(order),
    revealUrl: revealUrl(order.reveal_token),
    physicalComing: hasPhysical(order),
  });
  const res = await sendEmail({
    to: order.gift_recipient_email,
    ...email,
    tag: "gift_reveal",
    idempotencyKey: opts.force ? undefined : `reveal-${order.id}`,
  });
  if (!res.ok && !res.skipped && !opts.force) await releaseClaim(order.id, "reveal_sent_at");
  if (opts.force && res.ok) await updateOrder(order.id, { reveal_sent_at: new Date().toISOString() });
  return res.ok;
}

/** "It shipped" email, once per order (Printful webhook, or the daily cron for manual shipments). */
export async function sendShippedEmail(order: OrderRow) {
  if (!order.email || !features.email) return;
  if (!(await claimOnce(order.id, "shipped_email_sent_at"))) return;
  const { sendEmail, shippedEmail } = await import("@/lib/email");
  const main = primaryItem(order);
  const email = shippedEmail({
    ctx: emailCtx(),
    orderNumber: order.order_number,
    customerName: order.customer_name,
    petName: orderPetName(order),
    trackingUrl: order.tracking_url,
    trackingNumber: order.tracking_number,
    carrier: order.carrier,
    arrival: orderArrivalText(order),
    trackUrl: trackUrl(order.order_number),
    portraitUrl: main ? downloadUrl(order.reveal_token, main.generationId, true) : null,
  });
  const res = await sendEmail({ to: order.email, ...email, tag: "shipped", idempotencyKey: `shipped-${order.id}` });
  if (!res.ok && !res.skipped) await releaseClaim(order.id, "shipped_email_sent_at");
}

/**
 * Fast, once-only side effects after payment (safe to call on every webhook retry):
 * lead conversion, partner attribution, confirmation email, optional Gift Reveal email.
 */
export async function runPostPaymentTasks(order: OrderRow, opts: { giftSendNow: boolean }) {
  const tasks: Promise<unknown>[] = [markLeadConverted(order)];
  if (order.referral_code) {
    tasks.push(
      import("@/lib/partners").then(({ recordReferralOrder }) =>
        recordReferralOrder({
          code: order.referral_code as string,
          orderId: order.id,
          amountCents: Math.max(0, (order.subtotal_cents ?? 0) - (order.discount_cents ?? 0)),
        }),
      ),
    );
  }
  await Promise.allSettled(tasks);

  let giftEmailedNow = false;
  if (opts.giftSendNow && order.gift_recipient_email) {
    giftEmailedNow = await sendGiftRevealEmail(order).catch((err) => {
      console.error("[orders] gift reveal email failed", err);
      return false;
    });
  }
  await sendConfirmationEmail(order, { giftEmailedNow }).catch((err) => console.error("[orders] confirmation failed", err));
}

/**
 * Slow follow-up (run in `after()`): build print + digital files, then auto-submit to the
 * print partner when FULFILLMENT_AUTO_SUBMIT=1. Otherwise the order waits in admin for a
 * person to check and approve it. Digital-only orders are marked delivered.
 */
export async function prepareOrderFiles(orderId: string) {
  try {
    const { preparePrintFiles } = await import("@/lib/print-file");
    const files = await preparePrintFiles(orderId);
    const order = await getOrder(orderId);
    if (!order) return;
    if (!hasPhysical(order)) {
      if (order.status === "paid" && files.digital.length > 0) await updateOrder(orderId, { status: "delivered" });
      return;
    }
    if (process.env.FULFILLMENT_AUTO_SUBMIT === "1" && order.status === "paid") {
      const { submitOrderToFulfillment } = await import("@/lib/fulfillment");
      const res = await submitOrderToFulfillment(orderId);
      if (!res.ok && res.error !== "manual_fulfillment") await appendNote(orderId, `Auto-submit failed: ${res.error}`);
    }
  } catch (err) {
    console.error("[orders] prepareOrderFiles failed", orderId, err);
    await appendNote(orderId, `Print file preparation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Storage path of the clean ~1600px web image for a generation. */
export function webImagePath(generationId: string) {
  return `web/${generationId}.jpg`;
}

