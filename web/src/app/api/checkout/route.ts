import type Stripe from "stripe";
import { cookies } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { ADDONS, findAddon, findVariant, PRODUCT_MAP, SHIPPING_RATES, type FrameColor, type ProductType } from "@/lib/catalog";
import { site } from "@/lib/config";
import { db, previewUrl } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import { ensureFoundingPromo, ensurePartnerCoupon, ensurePartnerPromotionCode, ensureWelcomePromo, getStripe } from "@/lib/stripe";
import { itemLabel, styleNameOf, type OrderItem } from "@/lib/orders";
import { shipWindow } from "@/components/order/timeline";
import { normalizeCode } from "@/components/partners/program";

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
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email().optional()),
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

  // --- Verify portraits belong to this browser ---------------------------------------
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
    if (!sessionId || g.session_id !== sessionId) {
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

  // --- Attribution -------------------------------------------------------------------
  const store = await cookies();
  const referralCode = normalizeCode(safeDecode(store.get("pp_ref")?.value ?? ""));
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
    // --- Discounts: creator code beats the generic promo-code box ---------------------
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (referralCode) {
      const { getPartnerByCode } = await import("@/lib/partners");
      const partner = await getPartnerByCode(referralCode).catch(() => null);
      const couponPromise = partner && partner.discountPercent > 0 ? ensurePartnerCoupon(partner.discountPercent) : null;
      const coupon = couponPromise ? await couponPromise.catch(() => null) : null;
      if (coupon) discounts = [{ coupon }];
      // Lazily make their code typeable too (cached per instance; never blocks checkout).
      if (partner && partner.discountPercent > 0) after(() => ensurePartnerPromotionCode(partner.code, partner.discountPercent));
    }
    // Promo-code box: make sure WELCOME10 and FOUNDING100 exist (idempotent, cached per instance).
    if (!discounts) await Promise.all([ensureWelcomePromo(), ensureFoundingPromo()]);

    // --- Line items ------------------------------------------------------------------
    const automaticTax = process.env.STRIPE_AUTOMATIC_TAX === "1";
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items
      .filter((i) => !i.included)
      .map((i) => {
        const preview = i.previewPath ? previewUrl(i.previewPath) : null;
        const description = [
          i.petName ? `Portrait of ${i.petName}` : null,
          i.productType === "addon" ? findAddon(i.variantId)?.description : null,
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
    };

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: lineItems,
      client_reference_id: order.id,
      metadata,
      payment_intent_data: { metadata: { orderId: order.id, orderNumber: order.order_number } },
      success_url: `${siteUrl()}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/create?step=product`,
      billing_address_collection: "auto",
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

    const session = await stripe.checkout.sessions.create(params, { idempotencyKey: `checkout-${order.id}` });
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
