import { cookies } from "next/headers";
import { FOUNDING } from "@/lib/launch";
import { staticFoundingStatus, type DiscountOption, type OfferStatus } from "@/lib/offer";
import { foundingStatus } from "@/lib/stripe";
import { normalizeCode } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/**
 * GET /api/offer[?code=CODE]: the live offer for this visitor, for the purchase moment.
 *
 * - `founding`: FOUNDING100 status. `remaining` is maxRedemptions − times_redeemed straight from
 *   Stripe (cached ~60s per instance), or null when Stripe isn't configured or can't be read:
 *   a count is never guessed. Without Stripe, `open` follows the static deadline only.
 * - `discounts`: every automatic discount /api/checkout would consider for this visitor (a
 *   creator or referral code from ?code= or the pp_ref cookie, and FOUNDING100). The product step
 *   runs the same pickCheckoutDiscount on its subtotal, so the price shown is the price charged.
 */
export async function GET(req: Request) {
  const live = await (foundingStatus() ?? Promise.resolve(null));
  const founding: OfferStatus["founding"] = live
    ? { ...staticFoundingStatus(), open: live.open, remaining: live.remaining }
    : staticFoundingStatus();

  const rawTyped = new URL(req.url).searchParams.get("code");
  const typed = rawTyped ? normalizeCode(rawTyped.slice(0, 64)) : null;
  const store = await cookies();
  const ownCode = normalizeCode(safeDecode(store.get("pp_own_ref")?.value ?? ""));
  const cookieRaw = normalizeCode(safeDecode(store.get("pp_ref")?.value ?? ""));
  const cookieCode = cookieRaw && cookieRaw !== ownCode ? cookieRaw : null;

  type Found = Awaited<ReturnType<typeof import("@/lib/partners").getPartnerByCode>>;
  let partner: Found = null;
  let typedResult: OfferStatus["code"];
  if (typed || cookieCode) {
    const { getPartnerByCode } = await import("@/lib/partners");
    if (typed) {
      const found = await getPartnerByCode(typed).catch(() => null);
      if (found && typed === ownCode) {
        typedResult = { code: found.code, valid: false, kind: found.kind, reason: "own_code" };
      } else {
        partner = found;
        typedResult = { code: found?.code ?? typed, valid: Boolean(found), ...(found ? { kind: found.kind } : {}) };
      }
    }
    if (!partner && cookieCode) partner = await getPartnerByCode(cookieCode).catch(() => null);
  }

  const discounts: DiscountOption[] = [];
  if (partner?.kind === "customer") {
    const { referralOption } = await import("@/lib/referrals");
    discounts.push(referralOption(partner));
  } else if (partner && partner.discountPercent > 0) {
    discounts.push({ source: "partner", code: partner.code, percentOff: partner.discountPercent });
  }
  // With Stripe, only a live, redeemable FOUNDING100 counts (exactly what checkout applies).
  // Without Stripe there is no checkout to disagree with, so the static deadline decides.
  if (live ? live.open : founding.open) {
    discounts.push({ source: "founding", code: FOUNDING.code, percentOff: FOUNDING.percentOff });
  }

  const body: OfferStatus = {
    founding,
    discounts,
    ...(rawTyped ? { code: typedResult ?? { code: rawTyped.trim().toUpperCase().slice(0, 64), valid: false } } : {}),
  };
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
