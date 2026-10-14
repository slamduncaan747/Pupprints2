import "server-only";
import { randomInt } from "node:crypto";
import { after } from "next/server";
import { site } from "@/lib/config";
import { features } from "@/lib/env";
import { REFERRAL, type DiscountOption } from "@/lib/offer";
import {
  claimOnce,
  downloadUrl,
  getOrder,
  hasPhysical,
  isPaid,
  orderEta,
  orderPetName,
  PAID_STATUSES,
  primaryItem,
  releaseClaim,
  type OrderRow,
} from "@/lib/orders";
import type { RedeemablePartner } from "@/lib/partners";
import { db } from "@/lib/supabase/server";
import { escapeLike, normalizeCode, REDEEMABLE_STATUSES } from "@/components/partners/program";

/**
 * "Give $15, get $15" (customer referrals). Every paying customer gets a personal code stored as a
 * partners row (kind 'customer'); a friend's first order of $59+ takes $15 off; the referrer's $15
 * is recorded on the friend's referral_events row and issued by the daily cron as a single-use code
 * once the friend's order is past its 30-day guarantee window.
 * Every function degrades gracefully (returns null / no-ops) without Supabase, Stripe or email.
 */

const DAY = 24 * 60 * 60 * 1000;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type CustomerReferral = { id: string; code: string; status: string; name: string | null; email: string | null };

/* ------------------------------------------------------------------ */
/* Codes                                                               */
/* ------------------------------------------------------------------ */

function letters(s: string | null | undefined, max = 10): string {
  return (s ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, max);
}

function randomSuffix(n = 3): string {
  return Array.from({ length: n }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

/** "BISCUIT-7K2": the dog's name (else the buyer's first name, else PUP) + 3 unambiguous characters. */
export function newReferralCode(petName: string | null | undefined, customerName?: string | null): string {
  const pet = letters(petName);
  const first = letters((customerName ?? "").trim().split(/\s+/)[0]);
  const base = pet.length >= 2 ? pet : first.length >= 2 ? first : "PUP";
  return `${base}-${randomSuffix()}`;
}

export function referralLink(code: string): string {
  return `${site.url.replace(/\/$/, "")}/?ref=${encodeURIComponent(code)}`;
}

/** Prefilled share text. It always says the sharer gets something too (FTC material connection). */
export function referralShareText(petName: string | null | undefined, code: string): string {
  const pet = petName?.trim();
  return `I had a portrait made of ${pet || "my dog"} at Pup Prints. See yours free, then take $${REFERRAL.friendCents / 100} off your first order with my code ${code} ${REFERRAL.disclosure}:`;
}

/** The DiscountOption a live customer code gives a friend (checkout and /api/offer). */
export function referralOption(partner: Pick<RedeemablePartner, "code" | "discountCents" | "minOrderCents">): DiscountOption {
  return {
    source: "referral",
    code: partner.code,
    amountOffCents: partner.discountCents ?? REFERRAL.friendCents,
    minimumCents: partner.minOrderCents ?? REFERRAL.minimumCents,
  };
}

/* ------------------------------------------------------------------ */
/* The buyer's own code                                                */
/* ------------------------------------------------------------------ */

const REF_SELECT = "id, code, status, name, email";

/** The customer's personal referral code, if they have one (any status). */
export async function getCustomerReferral(email: string | null | undefined): Promise<CustomerReferral | null> {
  const c = db();
  const e = email?.trim().toLowerCase();
  if (!c || !e) return null;
  const { data, error } = await c
    .from("partners")
    .select(REF_SELECT)
    .eq("kind", "customer")
    .ilike("email", escapeLike(e))
    .limit(1)
    .maybeSingle<CustomerReferral>();
  if (error) {
    // 42703: migration 0005 not applied yet. Referrals simply stay off.
    if (error.code !== "42703") console.error("[referrals] lookup failed", error.message);
    return null;
  }
  return data ?? null;
}

/** True when this customer's code can be shared (active). */
export function isLiveReferral(r: CustomerReferral | null): r is CustomerReferral {
  return Boolean(r && (REDEEMABLE_STATUSES as readonly string[]).includes(r.status) && normalizeCode(r.code));
}

function runLater(task: () => Promise<unknown>) {
  try {
    after(task);
  } catch {
    // Outside a request (scripts): run it now, never throwing.
    void task().catch(() => {});
  }
}

/**
 * Get or create the buyer's personal code once their order is paid (webhook and success page;
 * idempotent and race-safe: one code per email). Their typeable Stripe promotion code is made
 * after the response. Never throws; null without an email or a database.
 */
export async function ensureCustomerReferral(order: OrderRow): Promise<CustomerReferral | null> {
  try {
    const c = db();
    const email = order.email?.trim().toLowerCase();
    if (!c || !email || !isPaid(order)) return null;
    const existing = await getCustomerReferral(email);
    if (existing) return existing;

    for (let attempt = 0; attempt < 6; attempt++) {
      const code = newReferralCode(attempt < 4 ? orderPetName(order) : null, order.customer_name);
      const { data, error } = await c
        .from("partners")
        .insert({
          kind: "customer",
          source: "customer",
          niche: "customer",
          status: "active",
          name: order.customer_name,
          email,
          code,
          commission_rate: 0,
          discount_percent: 0,
          discount_cents: REFERRAL.friendCents,
          min_order_cents: REFERRAL.minimumCents,
          referrer_order_id: order.id,
          notes: `Referral code earned with order ${order.order_number}.`,
        })
        .select(REF_SELECT)
        .single<CustomerReferral>();
      if (data) {
        const { ensureReferralPromotionCode } = await import("@/lib/stripe");
        runLater(() => ensureReferralPromotionCode(data.code));
        return data;
      }
      if (error?.code === "23505") {
        // Same email raced us (webhook vs success page), or the code is taken: re-check, retry.
        const raced = await getCustomerReferral(email);
        if (raced) return raced;
        continue;
      }
      if (error?.code !== "42703") console.error("[referrals] create failed", error?.message);
      return null;
    }
    return null;
  } catch (err) {
    console.error("[referrals] ensureCustomerReferral failed", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Delivery estimate (the guarantee window starts at delivery)          */
/* ------------------------------------------------------------------ */

/**
 * When the order most likely reached the customer. Digital-only: at payment. Physical: the later of
 * the estimate's last day and a week after it actually shipped (late shipments push it out). We
 * have no carrier "delivered" event, so this errs late, never early.
 */
export function estimateDeliveredAt(order: Pick<OrderRow, "items" | "created_at" | "ship_country" | "shipped_email_sent_at">): Date {
  const created = new Date(order.created_at);
  if (!hasPhysical(order)) return created;
  const eta = orderEta(order)?.arriveTo ?? new Date(created.getTime() + 14 * DAY);
  const shipped = order.shipped_email_sent_at ? new Date(new Date(order.shipped_email_sent_at).getTime() + 7 * DAY) : null;
  return shipped && shipped > eta ? shipped : eta;
}

const SHIPPED_STATUSES = ["shipped", "delivered"];

function rewardDueAt(order: OrderRow): Date {
  return new Date(estimateDeliveredAt(order).getTime() + REFERRAL.holdDays * DAY);
}

/* ------------------------------------------------------------------ */
/* Friend's order → the referrer's reward                              */
/* ------------------------------------------------------------------ */

function sameAddress(a: OrderRow["shipping_address"], b: OrderRow["shipping_address"]): boolean {
  const norm = (s: string | null | undefined) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!a?.address?.line1 || !b?.address?.line1) return false;
  return norm(a.address.line1) === norm(b.address.line1) && norm(a.address.postal_code) === norm(b.address.postal_code);
}

/**
 * A paid order used a customer's code (via ?ref=, the code field or Stripe's promo box). Records a
 * referral_events 'order' row: commission_cents 1500 + reward 'pending' (due after the friend's
 * guarantee window) when it qualifies, else reward 'void' with the reason. Self-referrals record
 * nothing. Idempotent per order. Never throws.
 */
export async function recordCustomerReferral(partner: RedeemablePartner, orderId: string, amountCents: number): Promise<void> {
  try {
    const c = db();
    if (!c) return;
    const order = await getOrder(orderId);
    if (!order) return;
    const email = order.email?.trim().toLowerCase() ?? null;
    if (email && partner.email && email === partner.email) return; // their own code

    const { data: existing } = await c.from("referral_events").select("id").eq("type", "order").eq("order_id", orderId).limit(1);
    if (existing && existing.length > 0) return;

    const merchandise = order.subtotal_cents ?? 0;
    const minimum = partner.minOrderCents ?? REFERRAL.minimumCents;
    let voidReason: string | null = null;
    if (merchandise < minimum) voidReason = `Order under $${minimum / 100}`;

    if (!voidReason && email) {
      const { data: earlier } = await c
        .from("orders")
        .select("id")
        .ilike("email", escapeLike(email))
        .in("status", [...PAID_STATUSES, "refunded"])
        .neq("id", order.id)
        .lt("created_at", order.created_at)
        .limit(1);
      if (earlier && earlier.length > 0) voidReason = "Not the friend's first order";
    }

    if (!voidReason) {
      const { data: owner } = await c
        .from("partners")
        .select("referrer_order_id")
        .eq("id", partner.id)
        .maybeSingle<{ referrer_order_id: string | null }>();
      const referrerOrder = owner?.referrer_order_id ? await getOrder(owner.referrer_order_id) : null;
      if (referrerOrder && sameAddress(referrerOrder.shipping_address, order.shipping_address)) {
        voidReason = "Same shipping address as the referrer";
      }
    }

    if (!voidReason) {
      const { count } = await c
        .from("referral_events")
        .select("id", { count: "exact", head: true })
        .ilike("code", partner.code)
        .eq("type", "order")
        .in("reward_status", ["pending", "issued"])
        .gte("created_at", new Date(Date.now() - 365 * DAY).toISOString());
      if ((count ?? 0) >= REFERRAL.maxRewardsPerYear) {
        voidReason = `Annual limit reached ($${(REFERRAL.rewardCents * REFERRAL.maxRewardsPerYear) / 100} a year)`;
      }
    }

    const { error } = await c.from("referral_events").insert({
      code: partner.code,
      type: "order",
      order_id: order.id,
      amount_cents: Math.max(0, Math.round(amountCents)),
      commission_cents: voidReason ? 0 : REFERRAL.rewardCents,
      reward_status: voidReason ? "void" : "pending",
      reward_due_at: voidReason ? null : rewardDueAt(order).toISOString(),
      reward_note: voidReason,
    });
    if (error && error.code !== "23505") console.error("[referrals] record failed", error.message);
  } catch (err) {
    console.error("[referrals] recordCustomerReferral failed", err);
  }
}

/* ------------------------------------------------------------------ */
/* Daily cron: issue rewards                                            */
/* ------------------------------------------------------------------ */

type RewardRow = {
  id: number;
  code: string;
  order_id: string | null;
  reward_status: string;
  reward_due_at: string | null;
  reward_code: string | null;
  reward_note: string | null;
};

const VOID_ORDER = ["refunded", "canceled"];

/**
 * Issue every referral reward that is due: the friend's order is paid, not refunded, has shipped
 * (physical) and is past its 30-day guarantee window. Each gets a single-use $15 code by email.
 * Claimed atomically (pending → issued) so overlapping runs never double-issue; a failed Stripe
 * call or email puts it back to pending (keeping its code) for the next run.
 */
export async function issueDueReferralRewards(): Promise<Record<string, number | string>> {
  const c = db();
  if (!c) return { skipped: "database not configured" };
  if (!features.stripe) return { skipped: "STRIPE_SECRET_KEY not set" };
  if (!features.email) return { skipped: "RESEND_API_KEY not set (rewards stay owed)" };
  const now = Date.now();
  const stats = { due: 0, issued: 0, deferred: 0, voided: 0, failed: 0 };
  const { data, error } = await c
    .from("referral_events")
    .select("id, code, order_id, reward_status, reward_due_at, reward_code, reward_note")
    .eq("type", "order")
    .eq("reward_status", "pending")
    .lte("reward_due_at", new Date(now).toISOString())
    .order("reward_due_at", { ascending: true })
    .limit(50);
  if (error) throw new Error(`referral rewards query failed: ${error.message}`);

  const { createReferralRewardCode } = await import("@/lib/stripe");
  const { sendEmail, referralRewardEmail, transactionalCtx } = await import("@/lib/email");

  for (const row of (data ?? []) as RewardRow[]) {
    stats.due++;
    const order = row.order_id ? await getOrder(row.order_id) : null;
    if (!order || VOID_ORDER.includes(order.status) || !isPaid({ status: order.status })) {
      if (!order || VOID_ORDER.includes(order.status)) {
        await c
          .from("referral_events")
          .update({ reward_status: "void", commission_cents: 0, reward_note: order ? `Friend's order ${order.status}` : "Friend's order not found" })
          .eq("id", row.id)
          .eq("reward_status", "pending");
        stats.voided++;
      } else {
        stats.deferred++;
      }
      continue;
    }
    // Physical pieces must have shipped; the window runs from (estimated) delivery.
    const due = rewardDueAt(order);
    if ((hasPhysical(order) && !SHIPPED_STATUSES.includes(order.status)) || due.getTime() > now) {
      const next = hasPhysical(order) && !SHIPPED_STATUSES.includes(order.status) ? new Date(now + 7 * DAY) : due;
      await c.from("referral_events").update({ reward_due_at: next.toISOString() }).eq("id", row.id).eq("reward_status", "pending");
      stats.deferred++;
      continue;
    }

    const { data: referrer } = await c
      .from("partners")
      .select("code, name, email, status")
      .eq("kind", "customer")
      .ilike("code", row.code)
      .maybeSingle<{ code: string; name: string | null; email: string | null; status: string }>();
    if (!referrer?.email) {
      await c.from("referral_events").update({ reward_note: "Owed: referrer has no email on file" }).eq("id", row.id);
      stats.failed++;
      continue;
    }

    // Claim it, fixing the code string first so a retry re-uses the same Stripe code.
    const rewardCode = row.reward_code ?? `THANKS-${randomSuffix(6)}`;
    const { data: claimed } = await c
      .from("referral_events")
      .update({ reward_status: "issued", reward_issued_at: new Date().toISOString(), reward_code: rewardCode, reward_note: null })
      .eq("id", row.id)
      .eq("reward_status", "pending")
      .select("id");
    if (!claimed || claimed.length === 0) continue;
    const backToPending = (note: string) =>
      c.from("referral_events").update({ reward_status: "pending", reward_issued_at: null, reward_note: note }).eq("id", row.id);

    const promo = await createReferralRewardCode(String(row.id), rewardCode, { referrerCode: referrer.code });
    if (!promo) {
      await backToPending("Owed: Stripe code could not be created; retrying next run");
      stats.failed++;
      continue;
    }
    const ctx = transactionalCtx();
    const email = referralRewardEmail({
      ctx,
      customerName: referrer.name,
      code: promo.code,
      expiresAt: promo.expiresAt,
      createUrl: `${ctx.siteUrl}/create?utm_source=email&utm_medium=lifecycle&utm_campaign=referral_reward`,
      shareUrl: referralLink(referrer.code),
      referralCode: referrer.code,
    });
    const res = await sendEmail({ to: referrer.email, ...email, tag: "referral_reward", idempotencyKey: `referral-reward-${row.id}` });
    if (!res.ok) {
      await backToPending(`Owed: email failed (${res.error ?? "skipped"}); code ${promo.code} kept`);
      stats.failed++;
      continue;
    }
    stats.issued++;
  }
  return stats;
}

/* ------------------------------------------------------------------ */
/* Daily cron: the "Give $15, get $15" reminder (delivered + 7 days)   */
/* ------------------------------------------------------------------ */

/**
 * One reminder per customer, about a week after their piece arrived (digital: a week after
 * payment). Marketing email: only with a postal address (the caller passes marketing ctx), never
 * to unsubscribed addresses, and only for orders from the last 90 days.
 */
export async function sendReferralReminders(
  ctx: import("@/lib/email").EmailCtx,
  blocked: (emails: string[]) => Promise<Set<string>>,
): Promise<Record<string, number>> {
  const c = db();
  if (!c) return { sent: 0 };
  const now = Date.now();
  const stats = { considered: 0, sent: 0, skipped: 0, failed: 0 };
  const { data, error } = await c
    .from("orders")
    .select("*")
    .in("status", SHIPPED_STATUSES)
    .is("referral_reminder_sent_at", null)
    .not("email", "is", null)
    .gte("created_at", new Date(now - 90 * DAY).toISOString())
    .lte("created_at", new Date(now - 7 * DAY).toISOString())
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) {
    if (error.code === "42703") return { skipped: 1 }; // migration 0005 not applied yet
    throw new Error(`referral reminder query failed: ${error.message}`);
  }
  const orders = (data ?? []) as (OrderRow & { referral_reminder_sent_at: string | null })[];
  const unsubscribed = await blocked(orders.map((o) => (o.email as string).toLowerCase()));
  const { sendEmail, referralReminderEmail, unsubscribeUrl, unsubscribeHeaders } = await import("@/lib/email");
  const reminded = new Set<string>();

  for (const order of orders) {
    stats.considered++;
    const email = (order.email as string).toLowerCase();
    if (estimateDeliveredAt(order).getTime() + 7 * DAY > now) {
      stats.skipped++;
      continue;
    }
    // One per customer: unsubscribed, or already reminded about another order → mark and move on.
    const { data: other } = await c
      .from("orders")
      .select("id")
      .ilike("email", escapeLike(email))
      .not("referral_reminder_sent_at", "is", null)
      .limit(1);
    if (unsubscribed.has(email) || reminded.has(email) || (other && other.length > 0)) {
      await claimOnce(order.id, "referral_reminder_sent_at");
      stats.skipped++;
      continue;
    }
    const referral = await getCustomerReferral(email);
    if (!isLiveReferral(referral)) {
      stats.skipped++;
      continue;
    }
    if (!(await claimOnce(order.id, "referral_reminder_sent_at"))) continue;
    reminded.add(email);
    const main = primaryItem(order);
    const rendered = referralReminderEmail({
      ctx,
      customerName: order.customer_name,
      petName: orderPetName(order),
      code: referral.code,
      shareUrl: referralLink(referral.code),
      portraitUrl: main ? downloadUrl(order.reveal_token, main.generationId, true) : null,
      unsubscribeUrl: unsubscribeUrl(email),
    });
    const res = await sendEmail({
      to: email,
      ...rendered,
      headers: unsubscribeHeaders(email),
      tag: "referral_reminder",
      idempotencyKey: `referral-reminder-${order.id}`,
    });
    if (res.ok) stats.sent++;
    else {
      stats.failed++;
      if (!res.skipped) await releaseClaim(order.id, "referral_reminder_sent_at");
    }
  }
  return stats;
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export type ReferralRewardSummary = {
  pendingCount: number;
  pendingCents: number;
  issuedCount: number;
  issuedCents: number;
  voidCount: number;
  nextDueAt: string | null;
  recent: { orderId: string | null; status: string; dueAt: string | null; code: string | null; note: string | null; createdAt: string }[];
};

/** Rewards owed (pending) and issued for one customer code, for the admin partner page. */
export async function getReferralRewards(code: string): Promise<ReferralRewardSummary | null> {
  const c = db();
  const normalized = normalizeCode(code);
  if (!c || !normalized) return null;
  const { data, error } = await c
    .from("referral_events")
    .select("order_id, created_at, commission_cents, reward_status, reward_due_at, reward_code, reward_note")
    .ilike("code", normalized)
    .eq("type", "order")
    .not("reward_status", "is", null)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return null;
  type Row = {
    order_id: string | null;
    created_at: string;
    commission_cents: number | null;
    reward_status: string;
    reward_due_at: string | null;
    reward_code: string | null;
    reward_note: string | null;
  };
  const rows = (data ?? []) as Row[];
  const sum = (status: string) => rows.filter((r) => r.reward_status === status);
  const pending = sum("pending");
  const issued = sum("issued");
  const next = pending.map((r) => r.reward_due_at).filter((d): d is string => Boolean(d)).sort()[0] ?? null;
  return {
    pendingCount: pending.length,
    pendingCents: pending.reduce((s, r) => s + (r.commission_cents ?? 0), 0),
    issuedCount: issued.length,
    issuedCents: issued.reduce((s, r) => s + (r.commission_cents ?? 0), 0),
    voidCount: sum("void").length,
    nextDueAt: next,
    recent: rows.slice(0, 20).map((r) => ({
      orderId: r.order_id,
      status: r.reward_status,
      dueAt: r.reward_due_at,
      code: r.reward_code,
      note: r.reward_note,
      createdAt: r.created_at,
    })),
  };
}
