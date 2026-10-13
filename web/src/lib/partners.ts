import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { site } from "@/lib/config";
import {
  PROGRAM,
  REDEEMABLE_STATUSES,
  TRACKABLE_STATUSES,
  normalizeCode,
} from "@/components/partners/program";

/**
 * Partner / affiliate helpers. CONTRACT used by checkout + the Stripe webhook:
 *   getPartnerByCode, recordReferralOrder, generatePartnerCode,
 *   partnerStatsToken, verifyPartnerStatsToken.
 * Every function degrades gracefully when Supabase is not configured.
 */

export type RedeemablePartner = {
  id: string;
  code: string;
  name: string | null;
  handle: string | null;
  discountPercent: number;
  commissionRate: number;
  status: string;
};

export type PartnerRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  handle: string | null;
  platform: string | null;
  profile_url: string | null;
  followers: number | null;
  tier: string | null;
  niche: string | null;
  email: string | null;
  status: string;
  code: string | null;
  commission_rate: number | string;
  discount_percent: number;
  source: string | null;
  notes: string | null;
  last_contacted_at: string | null;
  application: Record<string, unknown> | null;
};

const PARTNER_SELECT = "id, code, name, handle, discount_percent, commission_rate, status";

type PartnerCodeRow = {
  id: string;
  code: string;
  name: string | null;
  handle: string | null;
  discount_percent: number | null;
  commission_rate: number | string | null;
  status: string;
};

function toRedeemable(row: PartnerCodeRow): RedeemablePartner {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    handle: row.handle,
    discountPercent: Number(row.discount_percent ?? PROGRAM.discountPercent),
    commissionRate: Number(row.commission_rate ?? PROGRAM.commissionRate),
    status: row.status,
  };
}

async function findPartnerByCode(code: string, statuses?: readonly string[]): Promise<PartnerCodeRow | null> {
  const c = db();
  const normalized = normalizeCode(code);
  if (!c || !normalized) return null;
  // normalizeCode only allows [A-Z0-9-], so ilike here is an exact case-insensitive match (no wildcards).
  let q = c.from("partners").select(PARTNER_SELECT).ilike("code", normalized);
  if (statuses) q = q.in("status", [...statuses]);
  const { data, error } = await q.limit(1).maybeSingle<PartnerCodeRow>();
  if (error) {
    console.error("[partners] lookup failed", error.message);
    return null;
  }
  return data ?? null;
}

/**
 * Case-insensitive lookup of a redeemable partner code. Only partners with status
 * `active` or `gifted` count; everything else returns null.
 */
export async function getPartnerByCode(code: string): Promise<RedeemablePartner | null> {
  const row = await findPartnerByCode(code, REDEEMABLE_STATUSES);
  return row ? toRedeemable(row) : null;
}

/** Partner whose `?ref=` clicks we record (a wider set of statuses than redeemable). */
export async function getTrackablePartner(code: string): Promise<RedeemablePartner | null> {
  const row = await findPartnerByCode(code, TRACKABLE_STATUSES);
  return row ? toRedeemable(row) : null;
}

/**
 * Records an attributed order for a partner code: a `referral_events` row of type `order`
 * with commission_cents = round(amountCents * partner.commission_rate).
 * Idempotent per order (safe for webhook retries). Never throws.
 */
export async function recordReferralOrder({
  code,
  orderId,
  amountCents,
}: {
  code: string;
  orderId: string;
  amountCents: number;
}): Promise<void> {
  try {
    const c = db();
    if (!c) return;
    const partner = await findPartnerByCode(code);
    if (!partner) return;

    const { data: existing } = await c
      .from("referral_events")
      .select("id")
      .eq("type", "order")
      .eq("order_id", orderId)
      .limit(1);
    if (existing && existing.length > 0) return;

    const amount = Math.max(0, Math.round(Number(amountCents) || 0));
    const rate = Number(partner.commission_rate ?? PROGRAM.commissionRate);
    const { error } = await c.from("referral_events").insert({
      code: partner.code,
      type: "order",
      order_id: orderId,
      amount_cents: amount,
      commission_cents: Math.round(amount * (Number.isFinite(rate) ? rate : 0)),
    });
    if (error) console.error("[partners] recordReferralOrder insert failed", error.message);
  } catch (err) {
    console.error("[partners] recordReferralOrder failed", err);
  }
}

/**
 * "BELLA15"-style code: up to 10 uppercase letters from the handle/name + the discount
 * number. Pure (no DB); use `uniquePartnerCode` to guarantee uniqueness.
 */
export function generatePartnerCode(nameOrHandle: string, discountPercent: number = PROGRAM.discountPercent): string {
  const letters = nameOrHandle
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 10);
  const pct = Math.max(0, Math.min(99, Math.round(discountPercent)));
  return `${letters.length >= 2 ? letters : `PUP${letters}`}${pct}`;
}

/** `generatePartnerCode` + a DB check; appends B, C, … (then random letters) until unused. */
export async function uniquePartnerCode(
  nameOrHandle: string,
  discountPercent: number = PROGRAM.discountPercent,
  excludePartnerId?: string,
): Promise<string> {
  const base = generatePartnerCode(nameOrHandle, discountPercent);
  const c = db();
  if (!c) return base;
  const candidates = [base, ..."BCDEFGHJKLMNPQRSTUVWXYZ".split("").map((s) => `${base}${s}`)];
  const { data } = await c.from("partners").select("id, code").in("code", candidates);
  const taken = new Set((data ?? []).filter((r) => r.id !== excludePartnerId).map((r) => String(r.code)));
  const free = candidates.find((cand) => !taken.has(cand));
  if (free) return free;
  for (let i = 0; i < 10; i++) {
    const rand = Array.from({ length: 3 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)]).join("");
    const cand = `${base}${rand}`;
    const { data: hit } = await c.from("partners").select("id").eq("code", cand).limit(1);
    if (!hit || hit.length === 0) return cand;
  }
  return `${base}${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

function statsSecret(): string {
  return env.supabaseServerKey || env.adminPassword;
}

/** Private token for a partner's self-serve stats link (HMAC-SHA256 of the code). */
export function partnerStatsToken(code: string): string {
  const secret = statsSecret();
  const normalized = normalizeCode(code);
  if (!secret || !normalized) return "";
  return createHmac("sha256", secret).update(`partner-stats:${normalized}`).digest().subarray(0, 18).toString("base64url");
}

export function verifyPartnerStatsToken(code: string, token: string): boolean {
  const expected = partnerStatsToken(code);
  if (!expected || !token) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function partnerShareLink(code: string): string {
  return `${site.url}/?ref=${encodeURIComponent(code)}`;
}

export function partnerStatsLink(code: string): string {
  return `${site.url}/partners/stats?code=${encodeURIComponent(code)}&token=${partnerStatsToken(code)}`;
}

export type PartnerStats = {
  clicks: number;
  orders: number;
  revenueCents: number;
  commissionCents: number;
  recentOrders: { createdAt: string; amountCents: number; commissionCents: number }[];
};

export const EMPTY_STATS: PartnerStats = { clicks: 0, orders: 0, revenueCents: 0, commissionCents: 0, recentOrders: [] };

/** Aggregates referral_events for one code (clicks counted server-side, orders summed). */
export async function getPartnerStats(code: string, sinceIso?: string): Promise<PartnerStats> {
  const c = db();
  const normalized = normalizeCode(code);
  if (!c || !normalized) return EMPTY_STATS;

  let clicksQ = c
    .from("referral_events")
    .select("id", { count: "exact", head: true })
    .ilike("code", normalized)
    .eq("type", "click");
  if (sinceIso) clicksQ = clicksQ.gte("created_at", sinceIso);

  let ordersQ = c
    .from("referral_events")
    .select("created_at, amount_cents, commission_cents")
    .ilike("code", normalized)
    .eq("type", "order")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (sinceIso) ordersQ = ordersQ.gte("created_at", sinceIso);

  const [clicksRes, ordersRes] = await Promise.all([clicksQ, ordersQ]);
  const rows = (ordersRes.data ?? []) as { created_at: string; amount_cents: number | null; commission_cents: number | null }[];
  return {
    clicks: clicksRes.count ?? 0,
    orders: rows.length,
    revenueCents: rows.reduce((s, r) => s + (r.amount_cents ?? 0), 0),
    commissionCents: rows.reduce((s, r) => s + (r.commission_cents ?? 0), 0),
    recentOrders: rows.slice(0, 20).map((r) => ({
      createdAt: r.created_at,
      amountCents: r.amount_cents ?? 0,
      commissionCents: r.commission_cents ?? 0,
    })),
  };
}
