import { timingSafeEqual } from "node:crypto";
import { site } from "@/lib/config";
import { features } from "@/lib/env";
import {
  marketingCtx,
  NURTURE_SOURCES,
  nurtureEmail,
  reviewRequestEmail,
  sendEmail,
  unsubscribeHeaders,
  unsubscribeUrl,
  type EmailCtx,
} from "@/lib/email";
import { FOUNDING, foundingOfferOpen } from "@/lib/launch";
import { syncPartnerPromo } from "@/lib/partners";
import { issueDueReferralRewards, sendReferralReminders } from "@/lib/referrals";
import {
  claimOnce,
  downloadUrl,
  orderPetName,
  primaryItem,
  releaseClaim,
  sendShippedEmail,
  type OrderRow,
} from "@/lib/orders";
import { foundingOfferAvailable } from "@/lib/stripe";
import { db, previewUrl } from "@/lib/supabase/server";
import { escapeLike, REDEEMABLE_STATUSES } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const HOUR = 60 * 60 * 1000;
/** Leads older than this are never nurtured (avoids emailing stale leads). */
const NURTURE_MAX_AGE_DAYS = 10;
const BATCH = 100;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  if (!secret) return false;
  const got = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

type LeadRow = {
  id: string;
  created_at: string;
  email: string;
  source: string | null;
  pet_name: string | null;
  generation_id: string | null;
  referral_code: string | null;
  nurture_step: number;
  last_nurture_at: string | null;
  /** "This portrait is in memory of my dog" (migration 0007): the gentle track. */
  memorial: boolean | null;
};


async function unsubscribedEmails(emails: string[]): Promise<Set<string>> {
  const c = db();
  if (!c || emails.length === 0) return new Set();
  const { data } = await c.from("leads").select("email").not("unsubscribed_at", "is", null).in("email", emails);
  return new Set((data ?? []).map((r: { email: string }) => r.email.toLowerCase()));
}

/**
 * Preview nurture: step 1 at ~2h, step 2 at ~24h, step 3 at ~72h (one step per lead per run).
 * Step 3: memorial leads get a gentle note (never an offer). Everyone else gets FOUNDING100 while
 * it can really be redeemed (before its deadline and under its cap, per Stripe); once the Founding
 * offer is closed, the feature downsell instead (the same portrait as a print or the file, at
 * catalog prices, with the guarantee). No discount codes are created here.
 */
async function runNurture(ctx: EmailCtx) {
  const c = db()!;
  let founding: Promise<boolean> | null = null;
  const step3Offer = async () => {
    if (!foundingOfferOpen()) return null;
    founding ??= foundingOfferAvailable();
    if (!(await founding)) return null;
    return { code: FOUNDING.code, expiresAt: FOUNDING.expiresAt, percentOff: FOUNDING.percentOff, kind: "founding" as const };
  };
  const now = Date.now();
  const stats = { considered: 0, sent: 0, skipped: 0, converted: 0, failed: 0 };
  const { data, error } = await c
    .from("leads")
    .select("id, created_at, email, source, pet_name, generation_id, referral_code, nurture_step, last_nurture_at, memorial")
    .in("source", [...NURTURE_SOURCES])
    .is("unsubscribed_at", null)
    .is("converted_order_id", null)
    .eq("consent", true)
    .lt("nurture_step", 3)
    .gte("created_at", new Date(now - NURTURE_MAX_AGE_DAYS * 24 * HOUR).toISOString())
    .lte("created_at", new Date(now - 2 * HOUR).toISOString())
    .order("created_at", { ascending: true })
    .limit(BATCH);
  if (error) throw new Error(`leads query failed: ${error.message}`);

  for (const lead of (data ?? []) as LeadRow[]) {
    stats.considered++;
    const age = now - new Date(lead.created_at).getTime();
    const sinceLast = lead.last_nurture_at ? now - new Date(lead.last_nurture_at).getTime() : Infinity;
    const next = (lead.nurture_step + 1) as 1 | 2 | 3;
    const due = next === 1 ? age >= 2 * HOUR : next === 2 ? age >= 24 * HOUR && sinceLast >= 20 * HOUR : age >= 72 * HOUR && sinceLast >= 20 * HOUR;
    if (!due) {
      stats.skipped++;
      continue;
    }

    // Bought in the meantime? Stop the series.
    const { data: bought } = await c
      .from("orders")
      .select("id")
      .ilike("email", escapeLike(lead.email))
      .in("status", ["paid", "in_production", "shipped", "delivered", "needs_attention"])
      .limit(1);
    if (bought && bought.length > 0) {
      await c.from("leads").update({ converted_order_id: bought[0].id, nurture_step: 3 }).eq("id", lead.id);
      stats.converted++;
      continue;
    }

    // Claim the step first so overlapping runs never double-send.
    const { data: claimed } = await c
      .from("leads")
      .update({ nurture_step: next, last_nurture_at: new Date().toISOString() })
      .eq("id", lead.id)
      .eq("nurture_step", lead.nurture_step)
      .select("id");
    if (!claimed || claimed.length === 0) {
      stats.skipped++;
      continue;
    }

    let preview: string | null = null;
    let memorial = lead.memorial === true;
    if (lead.generation_id) {
      const { data: gen } = await c
        .from("generations")
        .select("preview_path, pet_name, memorial")
        .eq("id", lead.generation_id)
        .maybeSingle<{ preview_path: string | null; pet_name: string | null; memorial: boolean | null }>();
      preview = gen?.preview_path ? previewUrl(gen.preview_path) : null;
      lead.pet_name ??= gen?.pet_name ?? null;
      memorial ||= gen?.memorial === true;
    }
    const createUrl = `${ctx.siteUrl}/create${lead.referral_code ? `?ref=${encodeURIComponent(lead.referral_code)}` : ""}`;
    const offer = next === 3 && !memorial ? await step3Offer() : null;

    const email = nurtureEmail({
      ctx,
      step: next,
      source: lead.source ?? "save_preview",
      petName: lead.pet_name,
      previewUrl: preview,
      createUrl,
      unsubscribeUrl: unsubscribeUrl(lead.email),
      offer,
      memorial,
    });
    const res = await sendEmail({
      to: lead.email,
      ...email,
      headers: unsubscribeHeaders(lead.email),
      tag: `nurture_${next}`,
      idempotencyKey: `nurture-${lead.id}-${next}`,
    });
    if (res.ok) stats.sent++;
    else {
      stats.failed++;
      if (!res.skipped) {
        await c.from("leads").update({ nurture_step: lead.nurture_step, last_nurture_at: lead.last_nurture_at }).eq("id", lead.id);
      }
    }
  }
  return stats;
}

/**
 * Shipped emails (transactional, always) for orders marked shipped by hand, then review requests
 * (marketing: only with a postal address) 7 days after shipping.
 */
async function runOrderEmails() {
  const c = db()!;
  const stats: { shippedEmails: number; reviewRequests: number | string; failed: number } = { shippedEmails: 0, reviewRequests: 0, failed: 0 };

  const { data: shippedNoEmail } = await c
    .from("orders")
    .select("*")
    .in("status", ["shipped", "delivered"])
    .is("shipped_email_sent_at", null)
    .not("email", "is", null)
    // Only recent shipments (don't email old orders when email is first switched on).
    .gte("updated_at", new Date(Date.now() - 14 * 24 * HOUR).toISOString())
    .limit(BATCH);
  for (const order of (shippedNoEmail ?? []) as OrderRow[]) {
    await sendShippedEmail(order);
    stats.shippedEmails++;
  }

  const ctx = marketingCtx("review_request");
  if (!ctx) {
    // Left unclaimed, so they go out once BUSINESS_POSTAL_ADDRESS is set.
    stats.reviewRequests = "skipped: BUSINESS_POSTAL_ADDRESS not set";
    return stats;
  }
  let reviewsSent = 0;
  const reviewUrlBase = process.env.REVIEW_URL || `mailto:${site.supportEmail}?subject=${encodeURIComponent("My Pup Prints review")}`;
  const { data: due } = await c
    .from("orders")
    .select("*")
    .in("status", ["shipped", "delivered"])
    .is("review_request_sent_at", null)
    .not("shipped_email_sent_at", "is", null)
    .lte("shipped_email_sent_at", new Date(Date.now() - 7 * 24 * HOUR).toISOString())
    .not("email", "is", null)
    .limit(BATCH);
  const orders = (due ?? []) as OrderRow[];
  const blocked = await unsubscribedEmails(orders.map((o) => (o.email as string).toLowerCase()));
  for (const order of orders) {
    if (!order.email) continue;
    if (blocked.has(order.email.toLowerCase())) {
      await claimOnce(order.id, "review_request_sent_at");
      continue;
    }
    if (!(await claimOnce(order.id, "review_request_sent_at"))) continue;
    const main = primaryItem(order);
    const email = reviewRequestEmail({
      ctx,
      customerName: order.customer_name,
      petName: orderPetName(order),
      reviewUrl: reviewUrlBase,
      portraitUrl: main ? downloadUrl(order.reveal_token, main.generationId, true) : null,
      unsubscribeUrl: unsubscribeUrl(order.email),
    });
    const res = await sendEmail({
      to: order.email,
      ...email,
      headers: unsubscribeHeaders(order.email),
      tag: "review_request",
      idempotencyKey: `review-${order.id}`,
    });
    if (res.ok) reviewsSent++;
    else {
      stats.failed++;
      if (!res.skipped) await releaseClaim(order.id, "review_request_sent_at");
    }
  }
  stats.reviewRequests = reviewsSent;
  return stats;
}

/**
 * Backfill/repair: every active or gifted creator's code exists as a typeable Stripe promotion code.
 * (Customer referral codes are made when the order is paid and again lazily at checkout.)
 */
async function syncPartnerPromos() {
  const { data, error } = await db()!
    .from("partners")
    .select("code, status, discount_percent")
    .in("status", [...REDEEMABLE_STATUSES])
    .neq("kind", "customer")
    .not("code", "is", null)
    .limit(500);
  if (error) throw new Error(`partners query failed: ${error.message}`);
  const rows = (data ?? []) as { code: string | null; status: string; discount_percent: number | null }[];
  for (const p of rows) await syncPartnerPromo(p);
  return { partners: rows.length };
}

/** Abandoned checkouts: counted only (we never chase them with fake urgency). */
async function countStalePending() {
  const { count } = await db()!
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .lte("created_at", new Date(Date.now() - 24 * HOUR).toISOString());
  return count ?? 0;
}

/** Daily lifecycle job (Vercel cron sends `Authorization: Bearer $CRON_SECRET`). */
export async function GET(req: Request) {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!db()) return Response.json({ ok: false, error: "database_not_configured" }, { status: 503 });

  const result: Record<string, unknown> = { ok: true, emailEnabled: features.email, ranAt: new Date().toISOString() };
  // Without an email provider, leave leads/orders untouched so nothing is marked as sent.
  const skip = Promise.resolve({ skipped: "RESEND_API_KEY not set" });
  // Marketing emails need a postal address (CAN-SPAM); leads stay untouched until it's set.
  const nurtureCtx = features.email ? marketingCtx("nurture") : null;
  // "Give $15, get $15" reminder is marketing too (postal address + unsubscribe).
  const referralCtx = features.email ? marketingCtx("referral_reminder") : null;
  const [nurture, orders, stalePending, partnerPromos, referralRewards, referralReminders] = await Promise.allSettled([
    !features.email ? skip : nurtureCtx ? runNurture(nurtureCtx) : Promise.resolve({ skipped: "BUSINESS_POSTAL_ADDRESS not set" }),
    features.email ? runOrderEmails() : skip,
    countStalePending(),
    features.stripe ? syncPartnerPromos() : Promise.resolve({ skipped: "STRIPE_SECRET_KEY not set" }),
    // Referrer rewards: single-use $15 codes once the friend's order is past its guarantee window.
    issueDueReferralRewards(),
    !features.email
      ? skip
      : referralCtx
        ? sendReferralReminders(referralCtx, unsubscribedEmails)
        : Promise.resolve({ skipped: "BUSINESS_POSTAL_ADDRESS not set" }),
  ]);
  const settled = { nurture, orders, partnerPromos, referralRewards, referralReminders };
  for (const [key, r] of Object.entries(settled)) result[key] = r.status === "fulfilled" ? r.value : { error: String(r.reason) };
  result.stalePendingOrders = stalePending.status === "fulfilled" ? stalePending.value : null;
  if ([...Object.values(settled), stalePending].some((r) => r.status === "rejected")) result.ok = false;
  console.info("[cron/lifecycle]", JSON.stringify(result));
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
