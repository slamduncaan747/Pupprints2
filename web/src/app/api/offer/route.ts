import { cookies } from "next/headers";
import { giftTwoActive, type DiscountOption, type OfferStatus } from "@/lib/offer";
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
 * - `discounts`: every automatic discount /api/checkout would consider for this visitor (a
 *   creator or referral code from ?code= or the pp_ref cookie; empty without one). The product
 *   step runs the same pickCheckoutDiscount on its subtotal, so the price shown is the price charged.
 * - `giftTwo`: "two portraits, two ornaments" is live on the server's clock (checkout uses the same).
 */
export async function GET(req: Request) {
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

  const body: OfferStatus = {
    discounts,
    giftTwo: giftTwoActive(),
    ...(rawTyped ? { code: typedResult ?? { code: rawTyped.trim().toUpperCase().slice(0, 64), valid: false } } : {}),
  };
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
