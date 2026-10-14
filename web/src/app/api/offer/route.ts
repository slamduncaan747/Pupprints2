import { cookies } from "next/headers";
import { FOUNDING } from "@/lib/launch";
import { pickCheckoutDiscount, staticFoundingStatus, type OfferStatus } from "@/lib/offer";
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
 * GET /api/offer[?code=CREATOR]: the live offer for this visitor, for the purchase moment.
 *
 * - `founding`: FOUNDING100 status. `remaining` is maxRedemptions − times_redeemed straight from
 *   Stripe (cached ~60s per instance), or null when Stripe isn't configured or can't be read:
 *   a count is never guessed. Without Stripe, `open` follows the static deadline only.
 * - `discount`: what /api/checkout will apply automatically for this visitor, using the same
 *   rule (creator code from ?code= or the pp_ref cookie, else FOUNDING100), so the price shown is
 *   the price charged.
 */
export async function GET(req: Request) {
  const live = await (foundingStatus() ?? Promise.resolve(null));
  const founding: OfferStatus["founding"] = live
    ? { ...staticFoundingStatus(), open: live.open, remaining: live.remaining }
    : staticFoundingStatus();

  const rawTyped = new URL(req.url).searchParams.get("code");
  const typed = rawTyped ? normalizeCode(rawTyped.slice(0, 64)) : null;
  const store = await cookies();
  const cookieCode = normalizeCode(safeDecode(store.get("pp_ref")?.value ?? ""));

  let partner: { code: string; discountPercent: number } | null = null;
  let typedValid: boolean | undefined;
  if (typed || cookieCode) {
    const { getPartnerByCode } = await import("@/lib/partners");
    if (typed) {
      partner = await getPartnerByCode(typed).catch(() => null);
      typedValid = Boolean(partner);
    }
    if (!partner && cookieCode) partner = await getPartnerByCode(cookieCode).catch(() => null);
  }

  const partnerPercent = partner && partner.discountPercent > 0 ? partner.discountPercent : null;
  // With Stripe, only a live, redeemable FOUNDING100 counts (exactly what checkout applies).
  // Without Stripe there is no checkout to disagree with, so the static deadline decides.
  const choice = pickCheckoutDiscount({ partnerPercent, foundingOpen: live ? live.open : founding.open });
  const discount: OfferStatus["discount"] =
    choice === "partner" && partner && partnerPercent
      ? { source: "partner", percentOff: partnerPercent, code: partner.code }
      : choice === "founding"
        ? { source: "founding", percentOff: FOUNDING.percentOff, code: FOUNDING.code }
        : null;

  const body: OfferStatus = {
    founding,
    discount,
    ...(rawTyped ? { code: { code: typed ?? rawTyped.trim().toUpperCase().slice(0, 64), valid: Boolean(typedValid) } } : {}),
  };
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
