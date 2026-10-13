import "server-only";
import Stripe from "stripe";
import { env, features } from "@/lib/env";

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
    });
  }
  return client;
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
