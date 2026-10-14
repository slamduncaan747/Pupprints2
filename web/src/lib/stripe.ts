import "server-only";
import Stripe from "stripe";
import { env, features } from "@/lib/env";
import { FOUNDING, foundingOfferOpen } from "@/lib/launch";

/**
 * Stripe client + idempotent coupon helpers.
 * Every function returns null / no-ops when STRIPE_SECRET_KEY is not configured.
 */

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!features.stripe) return null;
  if (!client) {
    client = new Stripe(env.stripeSecretKey, {
      appInfo: { name: "Pup Prints", url: env.siteUrl },
      maxNetworkRetries: 2,
      timeout: 20_000,
      ...mockApiBase(),
    });
  }
  return client;
}

/**
 * Local testing only: STRIPE_API_BASE (e.g. http://127.0.0.1:12111 for stripe-mock) points the
 * SDK at a mock server. Ignored with a live key so production can never be redirected.
 */
function mockApiBase(): { host: string; port: number; protocol: "http" | "https" } | Record<string, never> {
  const raw = process.env.STRIPE_API_BASE?.trim();
  if (!raw || env.stripeSecretKey.startsWith("sk_live_") || env.stripeSecretKey.startsWith("rk_live_")) return {};
  try {
    const u = new URL(raw);
    const protocol = u.protocol === "http:" ? "http" : "https";
    return { host: u.hostname, port: Number(u.port || (protocol === "http" ? 80 : 443)), protocol };
  } catch {
    return {};
  }
}

/** Shared welcome offer that the newsletter promises. */
export const WELCOME = {
  couponId: "WELCOME10",
  code: "WELCOME10",
  percentOff: 10,
} as const;

function isMissing(err: unknown) {
  return err instanceof Stripe.errors.StripeError && (err.statusCode === 404 || err.code === "resource_missing");
}

function isAlreadyExists(err: unknown) {
  return err instanceof Stripe.errors.StripeError && err.code === "resource_already_exists";
}

/** Retrieve a coupon by id or create it (race-safe). */
async function ensureCoupon(stripe: Stripe, params: Stripe.CouponCreateParams & { id: string }): Promise<Stripe.Coupon> {
  try {
    return await stripe.coupons.retrieve(params.id);
  } catch (err) {
    if (!isMissing(err)) throw err;
  }
  try {
    return await stripe.coupons.create(params);
  } catch (err) {
    if (isAlreadyExists(err)) return stripe.coupons.retrieve(params.id);
    throw err;
  }
}

let welcomePromise: Promise<boolean> | null = null;

/**
 * Ensure the WELCOME10 coupon (10% off, once) and its public promotion code exist.
 * "Once per customer" is enforced with Stripe's first-time-transaction restriction.
 * Cached per server instance; a failure is retried on the next call.
 */
export function ensureWelcomePromo(): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return Promise.resolve(false);
  if (!welcomePromise) {
    welcomePromise = (async () => {
      await ensureCoupon(stripe, {
        id: WELCOME.couponId,
        percent_off: WELCOME.percentOff,
        duration: "once",
        name: "Welcome: 10% off your first order",
      });
      const existing = await stripe.promotionCodes.list({ code: WELCOME.code, active: true, limit: 1 });
      if (existing.data.length === 0) {
        await stripe.promotionCodes.create({
          promotion: { type: "coupon", coupon: WELCOME.couponId },
          code: WELCOME.code,
          restrictions: { first_time_transaction: true },
          metadata: { source: "pupprints-newsletter" },
        });
      }
      return true;
    })().catch((err) => {
      console.error("[stripe] ensureWelcomePromo failed", err instanceof Error ? err.message : err);
      welcomePromise = null;
      return false;
    });
  }
  return welcomePromise;
}

let foundingPromise: Promise<boolean> | null = null;

/**
 * Ensure the Founding 100 launch offer exists: coupon PP_FOUNDING_15 (15% off, once) and the
 * public promotion code FOUNDING100 (max 100 redemptions, hard expiry). Idempotent and race-safe:
 * an existing FOUNDING100 code (active or not) is never recreated, so the cap and deadline are
 * never reset. No-op after the deadline. Cached per server instance; failures retry next call.
 */
export function ensureFoundingPromo(): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe || !foundingOfferOpen()) return Promise.resolve(false);
  if (!foundingPromise) {
    foundingPromise = (async () => {
      await ensureCoupon(stripe, {
        id: FOUNDING.couponId,
        percent_off: FOUNDING.percentOff,
        duration: "once",
        name: `Founding ${FOUNDING.maxRedemptions}: ${FOUNDING.percentOff}% off`,
      });
      const existing = await stripe.promotionCodes.list({ code: FOUNDING.code, coupon: FOUNDING.couponId, limit: 1 });
      if (existing.data.length === 0) {
        await stripe.promotionCodes.create({
          promotion: { type: "coupon", coupon: FOUNDING.couponId },
          code: FOUNDING.code,
          max_redemptions: FOUNDING.maxRedemptions,
          expires_at: Math.floor(FOUNDING.expiresAt.getTime() / 1000),
          metadata: { source: "founding-100" },
        });
      }
      return true;
    })().catch((err) => {
      console.error("[stripe] ensureFoundingPromo failed", err instanceof Error ? err.message : err);
      foundingPromise = null;
      return false;
    });
  }
  return foundingPromise;
}

export type FoundingStatus = {
  /** True while FOUNDING100 can really be redeemed: before the deadline, active, under the cap. */
  open: boolean;
  /** maxRedemptions − times_redeemed, straight from Stripe. null when Stripe could not be read. */
  remaining: number | null;
  /** The FOUNDING100 promotion code id (promo_…), for auto-applying it at checkout. */
  promotionCodeId: string | null;
};

const FOUNDING_TTL_MS = 60_000;
/** A failed lookup is retried sooner than a good answer is refreshed. */
const FOUNDING_ERROR_TTL_MS = 10_000;
type FoundingCacheEntry = { at: number; ttl: number; value: Promise<FoundingStatus> };
let foundingCache: FoundingCacheEntry | null = null;

/**
 * Live status of the Founding 100 offer, read from Stripe and cached per server instance for
 * about a minute (so a product page view never waits on Stripe twice). null when Stripe is not
 * configured; callers then fall back to the static deadline and never show a count.
 */
export function foundingStatus(opts: { fresh?: boolean } = {}): Promise<FoundingStatus> | null {
  const stripe = getStripe();
  if (!stripe) return null;
  if (!foundingOfferOpen()) return Promise.resolve({ open: false, remaining: null, promotionCodeId: null });
  const now = Date.now();
  if (!opts.fresh && foundingCache && now - foundingCache.at < foundingCache.ttl) return foundingCache.value;
  const entry = { at: now, ttl: FOUNDING_TTL_MS } as FoundingCacheEntry;
  entry.value = loadFoundingStatus(stripe, entry);
  foundingCache = entry;
  return entry.value;
}

async function loadFoundingStatus(stripe: Stripe, entry: FoundingCacheEntry): Promise<FoundingStatus> {
  const closed: FoundingStatus = { open: false, remaining: null, promotionCodeId: null };
  const failed = () => {
    entry.ttl = FOUNDING_ERROR_TTL_MS;
    return closed;
  };
  if (!(await ensureFoundingPromo())) return failed();
  try {
    // Not filtered by `active`: an exhausted or deactivated code must read as closed, not missing.
    const { data } = await stripe.promotionCodes.list({ code: FOUNDING.code, coupon: FOUNDING.couponId, limit: 10 });
    const promo = data.find((p) => p.active) ?? data[0];
    if (!promo) return failed();
    const max = promo.max_redemptions ?? FOUNDING.maxRedemptions;
    const remaining = Math.max(0, max - promo.times_redeemed);
    const expired = promo.expires_at != null && promo.expires_at * 1000 <= Date.now();
    return { open: promo.active && !expired && remaining > 0, remaining, promotionCodeId: promo.id };
  } catch (err) {
    console.error("[stripe] founding status failed", err instanceof Error ? err.message : err);
    return failed();
  }
}

/** Drop the cached status (e.g. Stripe just refused FOUNDING100 because it hit its cap). */
export function forgetFoundingStatus(): void {
  foundingCache = null;
}

/**
 * True while FOUNDING100 can really be redeemed: before the deadline, the code exists and is
 * active in Stripe, and fewer than 100 orders have used it. False when Stripe is not configured.
 */
export async function foundingOfferAvailable(): Promise<boolean> {
  const status = await foundingStatus();
  return Boolean(status?.open);
}

/** Stripe rejected a session because of its discount (e.g. FOUNDING100 just hit its cap). */
export function isDiscountError(err: unknown): boolean {
  if (!(err instanceof Stripe.errors.StripeInvalidRequestError)) return false;
  return Boolean(err.param?.startsWith("discounts")) || /promotion code|coupon|discount/i.test(err.message);
}

const partnerCoupons = new Map<number, Promise<string>>();

/** `PP_PARTNER_<percent>`: one shared percent-off coupon per creator discount level. */
export function ensurePartnerCoupon(percent: number): Promise<string> | null {
  const stripe = getStripe();
  const pct = Math.round(percent);
  if (!stripe || !Number.isFinite(pct) || pct <= 0 || pct > 50) return null;
  let p = partnerCoupons.get(pct);
  if (!p) {
    p = ensureCoupon(stripe, {
      id: `PP_PARTNER_${pct}`,
      percent_off: pct,
      duration: "once",
      name: `Creator code: ${pct}% off`,
    }).then((c) => c.id);
    p.catch(() => partnerCoupons.delete(pct));
    partnerCoupons.set(pct, p);
  }
  return p;
}

const partnerPromos = new Map<string, Promise<boolean>>();

/**
 * Make a creator's code (e.g. RUFUS15) a typeable Stripe promotion code on the shared
 * PP_PARTNER_<percent> coupon, so it works in the checkout promo box without the ?ref= link.
 * Idempotent: an active code on the right coupon is left alone; one on a different coupon
 * (discount changed) is deactivated and replaced. Never throws; resolves false on failure.
 */
export function ensurePartnerPromotionCode(code: string, percent: number, opts: { force?: boolean } = {}): Promise<boolean> {
  const stripe = getStripe();
  const normalized = code.trim().toUpperCase();
  const pct = Math.round(percent);
  if (!stripe || !/^[A-Z0-9-]{2,40}$/.test(normalized)) return Promise.resolve(false);
  const couponPromise = ensurePartnerCoupon(pct);
  if (!couponPromise) return Promise.resolve(false);
  const key = `${normalized}:${pct}`;
  // `force` re-checks Stripe (admin changes), since another instance may have deactivated it.
  let p = opts.force ? undefined : partnerPromos.get(key);
  if (!p) {
    p = (async () => {
      const couponId = await couponPromise;
      const { data } = await stripe.promotionCodes.list({ code: normalized, active: true, limit: 10 });
      const couponOf = (pc: Stripe.PromotionCode) =>
        typeof pc.promotion.coupon === "string" ? pc.promotion.coupon : (pc.promotion.coupon?.id ?? null);
      const sameCode = data.filter((pc) => pc.code.toUpperCase() === normalized);
      if (sameCode.some((pc) => couponOf(pc) === couponId)) return true;
      if (sameCode.some((pc) => pc.metadata?.source !== "partner")) {
        console.warn(`[stripe] promotion code ${normalized} already exists for another offer; not replacing it`);
        return false;
      }
      for (const stale of sameCode) await stripe.promotionCodes.update(stale.id, { active: false });
      await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: couponId },
        code: normalized,
        metadata: { source: "partner", partner_code: normalized },
      });
      return true;
    })().catch((err) => {
      console.error(`[stripe] ensurePartnerPromotionCode ${normalized} failed`, err instanceof Error ? err.message : err);
      partnerPromos.delete(key);
      return false;
    });
    partnerPromos.set(key, p);
  }
  return p;
}

/** Deactivate a creator's typeable code (partner paused/ended, or code renamed). Never throws. */
export async function deactivatePartnerPromotionCode(code: string): Promise<void> {
  const stripe = getStripe();
  const normalized = code.trim().toUpperCase();
  if (!stripe || !normalized) return;
  for (const key of partnerPromos.keys()) if (key.startsWith(`${normalized}:`)) partnerPromos.delete(key);
  try {
    const { data } = await stripe.promotionCodes.list({ code: normalized, active: true, limit: 10 });
    for (const pc of data) {
      if (pc.code.toUpperCase() === normalized && pc.metadata?.source === "partner") {
        await stripe.promotionCodes.update(pc.id, { active: false });
      }
    }
  } catch (err) {
    console.error(`[stripe] deactivate ${normalized} failed`, err instanceof Error ? err.message : err);
  }
}

/** The customer-facing promotion codes a completed Checkout Session used (upper-cased). */
export async function sessionPromotionCodes(session: Stripe.Checkout.Session): Promise<string[]> {
  const refs = (session.discounts ?? []).map((d) => d.promotion_code).filter((p): p is string | Stripe.PromotionCode => Boolean(p));
  if (refs.length === 0) return [];
  const stripe = getStripe();
  const codes: string[] = [];
  for (const ref of refs) {
    if (typeof ref !== "string") {
      codes.push(ref.code.toUpperCase());
      continue;
    }
    if (!stripe) continue;
    try {
      const pc = await stripe.promotionCodes.retrieve(ref);
      codes.push(pc.code.toUpperCase());
    } catch (err) {
      console.warn("[stripe] promotion code lookup failed", err instanceof Error ? err.message : err);
    }
  }
  return codes;
}

/**
 * A personal, single-use WELCOME10 code with a real expiry (used by the 72h nurture email).
 * Returns null when Stripe is not configured or the code can't be created, in which case
 * the email must not mention a discount.
 */
export async function createPersonalWelcomeCode(
  email: string,
  hoursValid = 48,
): Promise<{ code: string; expiresAt: Date } | null> {
  const stripe = getStripe();
  if (!stripe) return null;
  if (!(await ensureWelcomePromo())) return null;
  const expiresAt = new Date(Date.now() + hoursValid * 60 * 60 * 1000);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 3; attempt++) {
    const suffix = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
    const code = `WELCOME10-${suffix}`;
    try {
      await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: WELCOME.couponId },
        code,
        expires_at: Math.floor(expiresAt.getTime() / 1000),
        max_redemptions: 1,
        restrictions: { first_time_transaction: true },
        metadata: { source: "nurture-72h", email: email.slice(0, 200) },
      });
      return { code, expiresAt };
    } catch (err) {
      if (attempt === 2) {
        console.error("[stripe] personal code failed", err instanceof Error ? err.message : err);
      }
    }
  }
  return null;
}
