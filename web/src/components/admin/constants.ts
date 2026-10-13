import { FOUNDING, foundingOfferOpen } from "@/lib/launch";

/** Client-safe admin constants (mirrors the CHECK constraints in supabase/migrations/0001_init.sql). */

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "in_production",
  "shipped",
  "delivered",
  "canceled",
  "refunded",
  "needs_attention",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Orders that count as revenue. */
export const PAID_STATUSES: readonly OrderStatus[] = ["paid", "in_production", "shipped", "delivered", "needs_attention"];

export const GENERATION_STATUSES = ["pending", "processing", "succeeded", "failed"] as const;

export function labelize(s: string | null | undefined): string {
  if (!s) return "—";
  const t = s.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export const IMPORT_HEADER = "name,handle,platform,profile_url,followers,niche,email,notes";

/** Session id stamped on generations/uploads made by the admin gift tool (excluded from customer KPIs). */
export const GIFT_SESSION = "admin-gift";

/**
 * Prefilled outreach DM for a gift portrait. Gifts without a partner record (friends, past
 * customers, local shops) also mention the Founding 100 code while it's open.
 */
export function giftDm({
  name,
  pet,
  link,
  partnered = true,
  now = Date.now(),
}: {
  name?: string | null;
  pet?: string | null;
  link: string;
  /** False for standalone gifts with no partner record. */
  partnered?: boolean;
  now?: number;
}): string {
  const base = `Hi ${name?.trim() || "there"}! We're Pup Prints — we made ${pet?.trim() || "your pup"} a portrait as a little gift, no strings attached: ${link} 💛`;
  if (partnered || !foundingOfferOpen(now)) return base;
  return `${base} If you'd ever like it printed for the wall, code ${FOUNDING.code} takes ${FOUNDING.percentOff}% off through ${FOUNDING.deadlineLabel} (first ${FOUNDING.maxRedemptions} orders).`;
}
