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
import { ensureWebImage } from "@/lib/print-file";
import { BUCKETS, db } from "@/lib/supabase/server";

export type RevealCta = { href: string; label: string; note?: string; primary?: boolean };

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
    const ref = normalizeCode(order.referral_code);
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
      ctas: [{ href: `${base()}/${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`, label: "Make one for your own dog", primary: true }],
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
  if (gift.generation_id) {
    const { data: gen } = await c.from("generations").select("style").eq("id", gift.generation_id).maybeSingle<{ style: string }>();
    if (gen?.style) {
      const { getStyle } = await import("@/lib/catalog");
      styleName = getStyle(gen.style)?.name ?? null;
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
    ctas: [
      {
        href: `${base()}/create${refQs}`,
        label: discount > 0 ? `Get ${discount}% off a canvas or framed print` : "Order it as a canvas or framed print",
        note: "Want it on your wall?",
        primary: true,
      },
      { href: `${base()}/create${refQs}`, label: "Make one for another dog" },
    ],
  };
});
