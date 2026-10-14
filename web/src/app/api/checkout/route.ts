import type Stripe from "stripe";
import { cookies } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { ADDONS, findAddon, findVariant, PRODUCT_MAP, SHIPPING_RATES, type FrameColor, type ProductType } from "@/lib/catalog";
import { site } from "@/lib/config";
import { FOUNDING } from "@/lib/launch";
import { HEIRLOOM_SET, heirloomSets, pickCheckoutDiscount, type DiscountOption } from "@/lib/offer";
import { db, previewUrl } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import {
  ensurePartnerCoupon,
  ensurePartnerPromotionCode,
  ensureReferralCoupon,
  ensureReferralPromotionCode,
  ensureWelcomePromo,
  forgetFoundingStatus,
  foundingStatus,
  getStripe,
  isDiscountError,
} from "@/lib/stripe";
import { itemLabel, PAID_STATUSES, styleNameOf, type OrderItem } from "@/lib/orders";
import type { RedeemablePartner } from "@/lib/partners";
import { shipWindow } from "@/components/order/timeline";
import { escapeLike, normalizeCode } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ADDON_IDS = new Set(ADDONS.map((a) => a.id));

const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const Body = z.object({
  items: z
    .array(
      z.object({
        generationId: z.uuid(),
        variantId: z.string().trim().min(1).max(40),
        frameColor: z.enum(["black", "white", "oak"]).optional(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(12),
  shipCountry: z.enum(["US", "CA"]).optional(),
  giftMessage: optText(500),
  giftSenderName: optText(80),
  giftRecipientName: optText(80),
  giftRecipientEmail: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email().optional()),
  /** Email the Gift Reveal to the recipient as soon as payment clears (default when an email is given). */
  giftSendNow: z.boolean().optional(),
  /**
   * Reveal token of a gift portrait (creator outreach) the visitor is buying from its reveal page.
   * Lets them order that portrait although it wasn't made in their browser session.
   */
  giftToken: z
    .string()
    .trim()
    .regex(/^[a-f0-9]{16,64}$/i)
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email().optional()),
  /**
   * A creator code typed on the product step (e.g. RUFUS15). While FOUNDING100 is auto-applied
   * Stripe's promo-code box is off, so this is where a creator's code is entered; it credits the
   * creator and applies their discount. Unknown codes are ignored.
   */
  code: z
    .string()
    .trim()
    .max(64)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

type GenerationRow = {
  id: string;
  session_id: string | null;
  status: string;
  style: string;
  pet_name: string | null;
  preview_path: string | null;
  full_path: string | null;
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function parseUtm(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(safeDecode(raw));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && /^[a-z_]{1,20}$/.test(k)) out[k] = v.slice(0, 100);
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function siteUrl() {
  return site.url.replace(/\/$/, "");
}

/**
 * A friend's referral code only discounts a first order, never the code owner's own. Checkout
 * usually doesn't know the email yet (Stripe collects it), so the webhook re-checks both before
 * the referrer is rewarded.
 */
async function referralAllowed(partner: RedeemablePartner, email: string | undefined): Promise<boolean> {
  if (!email) return true;
  const e = email.toLowerCase();
  if (partner.email && partner.email === e) return false;
  const { data } = await db()!
    .from("orders")
    .select("id")
    .ilike("email", escapeLike(e))
    .in("status", [...PAID_STATUSES, "refunded"])
    .limit(1);
  return !(data && data.length > 0);
}

/**
 * Create a pending order + a Stripe Checkout Session. Every price comes from the catalog
 * (never from the client); each portrait must belong to this browser's session.
 */
export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return json({ error: "invalid_request", message: "Something about that order didn't look right. Please try again." }, 400);
  }

  const stripe = getStripe();
  const supabase = db();
  if (!stripe || !supabase) {
    return json({ error: "checkout_unavailable", message: "Checkout is temporarily unavailable." }, 503);
  }

  // --- Validate products ------------------------------------------------------------
  type Line = { input: (typeof body.items)[number]; productType: ProductType | "addon"; unit: number };
  const lines: Line[] = [];
  for (const input of body.items) {
    if (ADDON_IDS.has(input.variantId)) {
      const addon = findAddon(input.variantId)!;
      lines.push({ input, productType: "addon", unit: addon.price });
      continue;
    }
    const found = findVariant(input.variantId);
    if (!found) return json({ error: "invalid_item", message: "One of those products isn't available." }, 400);
    const { product, variant } = found;
    if (product.frameColors) {
      if (!input.frameColor || !product.frameColors.includes(input.frameColor)) {
        return json({ error: "invalid_frame", message: "Please choose a frame color." }, 400);
      }
    }
    lines.push({ input, productType: product.type, unit: variant.price });
  }

  const physicalTypes = new Set<ProductType>(["canvas", "framed", "poster"]);
  const hasPhysical = lines.some((l) => l.productType !== "addon" && physicalTypes.has(l.productType));
  if (!hasPhysical && lines.some((l) => l.productType === "addon")) {
    return json({ error: "addon_requires_print", message: "Add-ons can only be ordered with a print, canvas or framed piece." }, 400);
  }
  const shipCountry = body.shipCountry ?? "US";

  // --- Gift portrait being bought from its reveal page (optional) --------------------
  let gift: { revealToken: string; generationId: string; partnerId: string | null } | null = null;
  if (body.giftToken) {
    const { data: giftRow, error: giftError } = await supabase
      .from("gifts")
      .select("reveal_token, generation_id, partner_id")
      .eq("reveal_token", body.giftToken)
      .maybeSingle<{ reveal_token: string; generation_id: string | null; partner_id: string | null }>();
    if (giftError) console.error("[checkout] gift lookup failed", giftError.message);
    if (giftRow?.generation_id) {
      gift = { revealToken: giftRow.reveal_token, generationId: giftRow.generation_id, partnerId: giftRow.partner_id };
    }
  }

  // --- Verify portraits belong to this browser (or to the gift being bought) ---------
  const sessionId = await getSessionId();
  const generationIds = [...new Set(lines.map((l) => l.input.generationId))];
  const { data: gens, error: genError } = await supabase
    .from("generations")
    .select("id, session_id, status, style, pet_name, preview_path, full_path")
    .in("id", generationIds);
  if (genError) {
    console.error("[checkout] generation lookup failed", genError.message);
    return json({ error: "checkout_unavailable", message: "Checkout is temporarily unavailable." }, 503);
  }
  const genMap = new Map(((gens ?? []) as GenerationRow[]).map((g) => [g.id, g]));
  for (const id of generationIds) {
    const g = genMap.get(id);
    if (!g || g.status !== "succeeded" || !g.full_path) {
      return json({ error: "portrait_not_found", message: "We couldn't find that portrait. Please create it again." }, 404);
    }
    const ownedHere = Boolean(sessionId) && g.session_id === sessionId;
    if (!ownedHere && gift?.generationId !== g.id) {
      return json({ error: "forbidden", message: "That portrait belongs to a different browser session." }, 403);
    }
  }

  // --- Build order items (digital is free alongside any physical piece) --------------
  const seenDigital = new Set<string>();
  const items: OrderItem[] = [];
  for (const { input, productType, unit } of lines) {
    const g = genMap.get(input.generationId)!;
    const isDigital = productType === "digital";
    if (isDigital) {
      if (seenDigital.has(g.id)) continue;
      seenDigital.add(g.id);
    }
    const frameColor = (productType === "framed" ? input.frameColor : null) as FrameColor | null;
    const names = itemLabel(input.variantId, frameColor);
    const found = findVariant(input.variantId);
    const included = isDigital && hasPhysical;
    items.push({
      kind: productType === "addon" ? "addon" : "product",
      generationId: g.id,
      variantId: input.variantId,
      productType,
      productName: names.productName,
      label: names.label,
      variantLabel: names.variantLabel,
      frameColor,
      quantity: isDigital ? 1 : input.quantity,
      unitAmount: included ? 0 : unit,
      ...(included ? { included: true } : {}),
      style: g.style,
      styleName: styleNameOf(g.style),
      petName: g.pet_name,
      previewPath: g.preview_path,
      widthIn: found?.variant.widthIn ?? 0,
      heightIn: found?.variant.heightIn ?? 0,
    });
  }

  // --- The Heirloom Set: ornament + mug together (with a physical piece) cost less ----------
  // Each complete set takes HEIRLOOM_SET.discountCents off, split across the two add-ons as real
  // per-unit prices. A line only partly in a set is split so every stored unit price is exact.
  const sets = heirloomSets(items, hasPhysical);
  const bundledItems: OrderItem[] = [];
  const setsLeft: Record<string, number> = Object.fromEntries(HEIRLOOM_SET.addonIds.map((id) => [id, sets]));
  for (const item of items) {
    const off = HEIRLOOM_SET.unitDiscount[item.variantId] ?? 0;
    const inSet = item.kind === "addon" && off > 0 ? Math.min(item.quantity, setsLeft[item.variantId] ?? 0) : 0;
    if (inSet === 0) {
      bundledItems.push(item);
      continue;
    }
    setsLeft[item.variantId] -= inSet;
    bundledItems.push({
      ...item,
      quantity: inSet,
      unitAmount: Math.max(0, item.unitAmount - off),
      regularUnitAmount: item.unitAmount,
      bundle: "heirloom",
    });
    if (item.quantity > inSet) bundledItems.push({ ...item, quantity: item.quantity - inSet });
  }
  items.splice(0, items.length, ...bundledItems);

  // --- Attribution -------------------------------------------------------------------
  const store = await cookies();
  // The visitor's own referral code (set on their order page): never a discount or credit for them.
  const ownCode = normalizeCode(safeDecode(store.get("pp_own_ref")?.value ?? ""));
  const notOwn = (code: string | null) => (code && code !== ownCode ? code : null);
  // A creator or referral code typed on the product step wins over an earlier ?ref= link (most recent intent).
  const typedCode = notOwn(normalizeCode(body.code));
  let typedPartner: RedeemablePartner | null = null;
  if (typedCode) {
    const { getPartnerByCode } = await import("@/lib/partners");
    typedPartner = await getPartnerByCode(typedCode).catch(() => null);
  }
  let referralCode = typedPartner?.code ?? notOwn(normalizeCode(safeDecode(store.get("pp_ref")?.value ?? "")));
  // A gift from a creator credits that creator when the visitor has no other referral.
  if (!referralCode && gift?.partnerId) {
    const { data: partner } = await supabase
      .from("partners")
      .select("code")
      .eq("id", gift.partnerId)
      .maybeSingle<{ code: string | null }>();
    referralCode = normalizeCode(partner?.code);
  }
  const utm = parseUtm(store.get("pp_utm")?.value);

  // --- Create the pending order first -----------------------------------------------
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status: "pending",
      email: body.email ?? null,
      items,
      ship_country: hasPhysical ? shipCountry : null,
      referral_code: referralCode,
      utm,
      gift_message: body.giftMessage ?? null,
      gift_sender_name: body.giftSenderName ?? null,
      gift_recipient_name: body.giftRecipientName ?? null,
      gift_recipient_email: body.giftRecipientEmail ?? null,
      currency: "usd",
    })
    .select("id, order_number")
    .single<{ id: string; order_number: string }>();
  if (orderError || !order) {
    console.error("[checkout] order insert failed", orderError?.message);
    return json({ error: "checkout_unavailable", message: "Checkout is temporarily unavailable." }, 503);
  }

  try {
    // --- Discounts ---------------------------------------------------------------------
    // Stripe takes one discount per session, so every automatic discount the visitor qualifies
    // for competes and the one that saves them the most on this order wins:
    //   - a creator code (?ref= link, gift from a creator, or typed on the product step), % off;
    //   - a friend's referral code ($15 off a first order of $59+);
    //   - FOUNDING100, while it can really be redeemed.
    // The code's owner is credited either way (orders.referral_code). With none of them, Stripe's
    // promo-code box opens (WELCOME10, personal codes, typed creator / referral codes).
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    let applied: DiscountOption["source"] | null = null;
    let partner = typedPartner;
    if (!partner && referralCode) {
      const { getPartnerByCode } = await import("@/lib/partners");
      partner = await getPartnerByCode(referralCode).catch(() => null);
    }
    const merchandise = items.filter((i) => !i.included).reduce((sum, i) => sum + i.unitAmount * i.quantity, 0);
    const options: DiscountOption[] = [];
    if (partner?.kind === "customer") {
      if (await referralAllowed(partner, body.email)) {
        const { referralOption } = await import("@/lib/referrals");
        options.push(referralOption(partner));
      }
      // Lazily make the code typeable in Stripe's box too (cached per instance; never blocks).
      const { code } = partner;
      after(() => ensureReferralPromotionCode(code));
    } else if (partner && partner.discountPercent > 0) {
      options.push({ source: "partner", code: partner.code, percentOff: partner.discountPercent });
      const { code, discountPercent } = partner;
      after(() => ensurePartnerPromotionCode(code, discountPercent));
    }
    const founding = await (foundingStatus() ?? Promise.resolve(null));
    const foundingOpen = Boolean(founding?.open && founding.promotionCodeId);
    if (foundingOpen) options.push({ source: "founding", code: FOUNDING.code, percentOff: FOUNDING.percentOff });
    const choice = pickCheckoutDiscount(options, merchandise);
    if (choice?.source === "partner") {
      const coupon = await (ensurePartnerCoupon(choice.percentOff) ?? Promise.resolve(null)).catch(() => null);
      if (coupon) {
        discounts = [{ coupon }];
        applied = "partner";
      }
    } else if (choice?.source === "referral") {
      const coupon = await (ensureReferralCoupon() ?? Promise.resolve(null)).catch(() => null);
      if (coupon) {
        discounts = [{ coupon }];
        applied = "referral";
      }
    }
    if (!discounts && foundingOpen && founding?.promotionCodeId) {
      discounts = [{ promotion_code: founding.promotionCodeId }];
      applied = "founding";
    }
    // Promo-code box: make sure WELCOME10 exists (idempotent, cached per instance).
    if (!discounts) await ensureWelcomePromo();
    // The founding offer won (or nothing applies) although a referral code was used: say so.
    const referralUsed = partner?.kind === "customer" && applied !== "referral";

    // --- Line items ------------------------------------------------------------------
    const automaticTax = process.env.STRIPE_AUTOMATIC_TAX === "1";
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items
      .filter((i) => !i.included)
      .map((i) => {
        const preview = i.previewPath ? previewUrl(i.previewPath) : null;
        const description = [
          i.petName ? `Portrait of ${i.petName}` : null,
          i.productType === "addon" ? findAddon(i.variantId)?.description : null,
          i.bundle === "heirloom" && i.regularUnitAmount
            ? `${HEIRLOOM_SET.name} price (regularly $${(i.regularUnitAmount / 100).toFixed(0)})`
            : null,
          i.productType === "digital" ? "Full-resolution file, no watermark. Delivered instantly." : null,
          i.frameColor ? `${i.frameColor.charAt(0).toUpperCase()}${i.frameColor.slice(1)} frame` : null,
        ]
          .filter(Boolean)
          .join(" · ");
        return {
          quantity: i.quantity,
          price_data: {
            currency: "usd",
            unit_amount: i.unitAmount,
            ...(automaticTax ? { tax_behavior: "exclusive" as const } : {}),
            product_data: {
              name: `${i.productType === "addon" ? i.productName : i.label.split(" · ")[0]} — ${i.styleName}`,
              ...(description ? { description } : {}),
              ...(preview ? { images: [preview] } : {}),
              metadata: { variantId: i.variantId, generationId: i.generationId },
            },
          },
        };
      });

    const metadata: Record<string, string> = {
      orderId: order.id,
      orderNumber: order.order_number,
      giftSendNow: body.giftRecipientEmail && body.giftSendNow !== false ? "1" : "0",
      ...(applied ? { offer: applied } : {}),
      ...(referralUsed && partner ? { referral: partner.code } : {}),
      ...(sets > 0 ? { heirloomSets: String(sets) } : {}),
    };

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: lineItems,
      client_reference_id: order.id,
      metadata,
      payment_intent_data: { metadata: { orderId: order.id, orderNumber: order.order_number } },
      success_url: `${siteUrl()}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: gift ? `${siteUrl()}/create?gift=${gift.revealToken}` : `${siteUrl()}/create?step=piece`,
      billing_address_collection: "auto",
      // Without a Customer, Stripe rejects promotion codes restricted to first-time customers
      // (WELCOME10 and the personal nurture codes), so always create one.
      customer_creation: "always",
      ...(body.email ? { customer_email: body.email } : {}),
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      ...(automaticTax ? { automatic_tax: { enabled: true } } : {}),
    };

    if (hasPhysical) {
      const shipDays = lines
        .filter((l) => l.productType !== "addon" && l.productType !== "digital")
        .reduce<[number, number]>(
          (acc, l) => {
            const d = PRODUCT_MAP[l.productType as ProductType].shipDays;
            return [Math.max(acc[0], d[0]), Math.max(acc[1], d[1])];
          },
          [0, 0],
        );
      const [min, max] = shipWindow(shipDays, shipCountry);
      const rate = SHIPPING_RATES[shipCountry];
      params.shipping_address_collection = { allowed_countries: [shipCountry] };
      // Carriers use the phone number for delivery issues.
      params.phone_number_collection = { enabled: true };
      params.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipCountry === "US" ? "Free US shipping (tracked)" : "Tracked shipping to Canada",
            fixed_amount: { amount: rate, currency: "usd" },
            ...(automaticTax ? { tax_behavior: "exclusive" as const } : {}),
            delivery_estimate: {
              minimum: { unit: "business_day", value: min },
              maximum: { unit: "business_day", value: max },
            },
          },
        },
      ];
      params.custom_text = {
        submit: {
          message: `Every portrait is checked by a person before printing. Your hi-res digital file is included free.${
            body.giftRecipientEmail && body.giftSendNow !== false
              ? " We'll email the Gift Reveal to your recipient as soon as payment clears."
              : ""
          }`,
        },
      };
    } else {
      params.custom_text = { submit: { message: "Your full-resolution file is delivered instantly after payment." } };
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(params, { idempotencyKey: `checkout-${order.id}` });
    } catch (err) {
      // FOUNDING100 can hit its cap between our cached check and this call: never lose the sale
      // over it. Retry once without it (promo box back on) under a new idempotency key.
      if (applied !== "founding" || !isDiscountError(err)) throw err;
      console.warn("[checkout] founding offer refused by Stripe, retrying without it", err instanceof Error ? err.message : err);
      forgetFoundingStatus();
      await ensureWelcomePromo();
      const retry: Stripe.Checkout.SessionCreateParams = { ...params, metadata: { ...metadata }, allow_promotion_codes: true };
      delete retry.discounts;
      delete retry.metadata!.offer;
      session = await stripe.checkout.sessions.create(retry, { idempotencyKey: `checkout-${order.id}-nodiscount` });
    }
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id, updated_at: new Date().toISOString() })
      .eq("id", order.id);
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return json({ url: session.url, orderNumber: order.order_number });
  } catch (err) {
    console.error("[checkout] stripe session failed", err instanceof Error ? err.message : err);
    await supabase
      .from("orders")
      .update({ status: "canceled", notes: "Checkout session could not be created", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    return json({ error: "checkout_unavailable", message: "Checkout is temporarily unavailable." }, 503);
  }
}
