import "server-only";
import { cache } from "react";
import { site } from "@/lib/config";
import { REDEEMABLE_STATUSES, normalizeCode } from "@/components/partners/program";
import {
  getOrderByRevealToken,
  hasPhysical,
  isPaid,
  mainProductName,
  orderPetName,
  primaryItem,
  webImagePath,
} from "@/lib/orders";
import { GUARANTEE, REFERRAL } from "@/lib/offer";
import { ensureWebImage } from "@/lib/print-file";
import { getCustomerReferral, isLiveReferral } from "@/lib/referrals";
import { BUCKETS, db } from "@/lib/supabase/server";

export type RevealCta = {
  href: string;
  label: string;
  note?: string;
  /** Short line above the button (e.g. the friend's referral offer). */
  lead?: string;
  /** Fine print under the button (terms, disclosure). */
  fine?: string;
  primary?: boolean;
};

export type RevealData = {
  kind: "order" | "gift";
  token: string;
  /** Clean (unwatermarked) web-size portrait, short-lived signed URL. */
  imageUrl: string | null;
  /** Storage path of the image (for the OG renderer). */
  imagePath: string | null;
  recipientName: string | null;
  senderName: string | null;
  petName: string | null;
  styleName: string | null;
  message: string | null;
  /** e.g. "Your canvas is being made and will arrive soon." */
  productNote: string | null;
  frame: "gold" | "wood";
  ctas: RevealCta[];
  /** Recipient's Choice, for the person who received an order as a gift (copy + a way to ask). */
  choice: { title: string; body: string; href: string; label: string } | null;
};

type GiftRow = {
  id: string;
  reveal_token: string;
  generation_id: string | null;
  partner_id: string | null;
  recipient_name: string | null;
  pet_name: string | null;
  sender_name: string | null;
  message: string | null;
};

const TOKEN_RE = /^[a-f0-9]{16,64}$/i;

async function sign(path: string, expiresIn = 60 * 60 * 6): Promise<string | null> {
  const c = db();
  if (!c) return null;
  const { data } = await c.storage.from(BUCKETS.portraits).createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

function base() {
  return site.url.replace(/\/$/, "");
}

/** Resolve a reveal token: orders first, then creator-outreach gifts. Cached per request. */
export const getRevealData = cache(async (token: string): Promise<RevealData | null> => {
  if (!TOKEN_RE.test(token) || !db()) return null;

  const order = await getOrderByRevealToken(token);
  if (order) {
    if (!isPaid(order)) return null;
    const main = primaryItem(order);
    let imagePath: string | null = null;
    if (main) imagePath = await ensureWebImage(main.generationId).catch(() => webImagePath(main.generationId));
    const product = mainProductName(order);
    const productNote = hasPhysical(order)
      ? order.status === "shipped"
        ? `Your ${product ?? "portrait"} is on its way.`
        : order.status === "delivered"
          ? null
          : `Your ${product ?? "portrait"} is being made and will arrive soon.`
      : null;
    // The giver's own "Give $15, get $15" code: the recipient takes $15 off their first portrait.
    // A portrait made in memory carries no referral offer to the person who receives it.
    const own = order.memorial ? null : await getCustomerReferral(order.email);
    const giverCode = isLiveReferral(own) ? own.code : null;
    const ref = giverCode ?? normalizeCode(order.referral_code);
    const giverFirst = (order.gift_sender_name || order.customer_name || "").trim().split(/\s+/)[0] || null;
    const giverName = giverFirst ? `${giverFirst.charAt(0).toUpperCase()}${giverFirst.slice(1)}` : null;
    const friend = `$${REFERRAL.friendCents / 100}`;
    return {
      kind: "order",
      token,
      imageUrl: imagePath ? await sign(imagePath) : null,
      imagePath,
      recipientName: order.gift_recipient_name,
      senderName: order.gift_sender_name || order.customer_name,
      petName: orderPetName(order),
      styleName: main?.styleName ?? null,
      message: order.gift_message,
      productNote,
      frame: "gold",
      // Remakes are arranged by client services (no self-serve flow): the recipient writes to us.
      choice: {
        title: GUARANTEE.recipientName,
        body: hasPhysical(order)
          ? "Prefer a different style? Ask within 30 days of delivery and we'll remake it, free."
          : "Prefer a different style? Ask within 30 days and we'll remake it, free.",
        href: `mailto:${site.supportEmail}?subject=${encodeURIComponent(`Recipient's Choice: order ${order.order_number}`)}`,
        label: "Ask for another style",
      },
      ctas: [
        {
          href: `${base()}/${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`,
          label: "Make one for your own dog",
          primary: true,
          ...(giverCode
            ? {
                note: "Want one of your own dog?",
                lead: `${friend} off with ${giverName ? `${giverName}'s` : "their"} code, ${giverCode}`,
                fine: `Your preview is free. ${friend} off a first order of $${REFERRAL.minimumCents / 100} or more, applied through this link. ${giverName ?? "Your giver"} gets $${REFERRAL.rewardCents / 100} too, as a thank-you.`,
              }
            : {}),
        },
      ],
    };
  }

  const c = db()!;
  const { data: gift } = await c
    .from("gifts")
    .select("id, reveal_token, generation_id, partner_id, recipient_name, pet_name, sender_name, message")
    .eq("reveal_token", token)
    .maybeSingle<GiftRow>();
  if (!gift) return null;

  // Image: the prepared gift file, else the generation's master, downsized.
  let imagePath: string | null = `gifts/${gift.id}.jpg`;
  const { data: hasGiftFile } = await c.storage.from(BUCKETS.portraits).exists(imagePath);
  if (!hasGiftFile) {
    imagePath = gift.generation_id ? await ensureWebImage(gift.generation_id).catch(() => null) : null;
  }

  let styleName: string | null = null;
  /** The recipient can order this exact portrait (finished, with a print master). */
  let buyable = false;
  if (gift.generation_id) {
    const { data: gen } = await c
      .from("generations")
      .select("style, status, full_path")
      .eq("id", gift.generation_id)
      .maybeSingle<{ style: string; status: string; full_path: string | null }>();
    if (gen?.style) {
      const { getStyle } = await import("@/lib/catalog");
      styleName = getStyle(gen.style)?.name ?? null;
      buyable = Boolean(styleName && gen.status === "succeeded" && gen.full_path);
    }
  }

  // Partner discount only when it's real and redeemable.
  let code: string | null = null;
  let discount = 0;
  if (gift.partner_id) {
    const { data: partner } = await c
      .from("partners")
      .select("code, discount_percent, status")
      .eq("id", gift.partner_id)
      .maybeSingle<{ code: string | null; discount_percent: number | null; status: string }>();
    code = normalizeCode(partner?.code);
    if (code && partner && (REDEEMABLE_STATUSES as readonly string[]).includes(partner.status)) {
      discount = Number(partner.discount_percent ?? 0);
    }
  }
  const refQs = code ? `?ref=${encodeURIComponent(code)}` : "";
  // Buying this portrait: /create?gift=<token> opens it straight at "choose your piece"; the
  // ref param (when the gift went to a creator) sets the referral cookie so their code applies.
  const buyQs = new URLSearchParams();
  buyQs.set("gift", token);
  if (code) buyQs.set("ref", code);

  return {
    kind: "gift",
    token,
    imageUrl: imagePath ? await sign(imagePath) : null,
    imagePath,
    recipientName: gift.recipient_name,
    senderName: gift.sender_name || "The Pup Prints studio",
    petName: gift.pet_name,
    styleName,
    message: gift.message,
    productNote: null,
    frame: "gold",
    choice: null,
    ctas: [
      buyable
        ? {
            href: `${base()}/create?${buyQs.toString()}`,
            label: `Put ${gift.pet_name?.trim() || "them"} on your wall`,
            note: discount > 0 ? `Want it on your wall? Take ${discount}% off.` : "Want it on your wall?",
            primary: true,
          }
        : {
            href: `${base()}/create${refQs}`,
            label: discount > 0 ? `Get ${discount}% off a canvas or framed print` : "Order it as a canvas or framed print",
            note: "Want it on your wall?",
            primary: true,
          },
      { href: `${base()}/create${refQs}`, label: "Make one for another dog" },
    ],
  };
});
