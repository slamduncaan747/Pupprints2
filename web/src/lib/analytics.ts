"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Funnel events. Names follow Meta standard events where one exists so the same call
 * feeds Vercel Analytics, Meta Pixel, TikTok Pixel and GA4; per-platform names are
 * mapped below (e.g. Purchase → TikTok CompletePayment, GA4 purchase).
 */
export type FunnelEvent =
  | "ViewContent"
  | "UploadPhoto"
  | "GeneratePreview"
  | "PreviewReady"
  | "SelectProduct"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead"
  | "PartnerApply"
  | "ReferralShare"
  /** "How did you hear about us?" answered on the success page. */
  | "HeardFrom"
  /** "This portrait is in memory of my dog" switched on or off in the create flow. */
  | "MemorialToggle"
  /** Admin pop-up mode: a portrait made in person (/admin/popup). */
  | "PopupPortrait";

type Props = Record<string, string | number | boolean | null | undefined>;

/** One line item, prices in major units (dollars), as the ad platforms expect. */
export type EcommerceItem = {
  id: string;
  name?: string;
  /** Unit price in dollars. */
  price: number;
  quantity: number;
  category?: string;
  variant?: string;
};

/** Structured commerce data, mapped to each platform's own parameter names. */
export type Ecommerce = {
  /** Order value in dollars. */
  value: number;
  currency: string;
  items: EcommerceItem[];
  /** Order number: GA4 transaction_id, and the Meta/TikTok event id used for deduplication. */
  transactionId?: string;
  shipping?: number;
  tax?: number;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, props?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      page: () => void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

const META_STANDARD = new Set<FunnelEvent>(["ViewContent", "AddToCart", "InitiateCheckout", "Purchase", "Lead"]);

/** TikTok standard event names that differ from ours (others are sent as-is). */
const TIKTOK_NAME: Partial<Record<FunnelEvent, string>> = { Purchase: "CompletePayment" };

/** GA4 recommended event names (others are sent as-is). */
const GA4_NAME: Partial<Record<FunnelEvent, string>> = {
  ViewContent: "view_item",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  Purchase: "purchase",
  Lead: "generate_lead",
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function track(event: FunnelEvent, props: Props = {}, ecommerce?: Ecommerce) {
  try {
    const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as Record<
      string,
      string | number | boolean | null
    >;
    const items = ecommerce?.items ?? [];
    const value = ecommerce ? round2(ecommerce.value) : undefined;
    const currency = ecommerce?.currency.toUpperCase();
    const eventId = ecommerce?.transactionId ? `${event}-${ecommerce.transactionId}` : undefined;

    // Vercel Analytics only takes flat primitive properties.
    vercelTrack(event, ecommerce ? { ...clean, value: value ?? 0, currency: currency ?? "USD" } : clean);

    if (window.fbq) {
      const data: Record<string, unknown> = { ...clean };
      if (ecommerce) {
        Object.assign(data, {
          value,
          currency,
          content_ids: items.map((i) => i.id),
          content_type: "product",
          contents: items.map((i) => ({ id: i.id, quantity: i.quantity, item_price: round2(i.price) })),
          num_items: items.reduce((n, i) => n + i.quantity, 0),
        });
      }
      const options = eventId ? { eventID: eventId } : undefined;
      if (META_STANDARD.has(event)) window.fbq("track", event, data, ...(options ? [options] : []));
      else window.fbq("trackCustom", event, data, ...(options ? [options] : []));
    }

    if (window.ttq) {
      const data: Record<string, unknown> = { ...clean };
      if (ecommerce) {
        Object.assign(data, {
          value,
          currency,
          content_type: "product",
          contents: items.map((i) => ({
            content_id: i.id,
            content_type: "product",
            content_name: i.name,
            quantity: i.quantity,
            price: round2(i.price),
          })),
        });
      }
      window.ttq.track(TIKTOK_NAME[event] ?? event, data, eventId ? { event_id: eventId } : undefined);
    }

    if (window.gtag) {
      const data: Record<string, unknown> = { ...clean };
      if (ecommerce) {
        Object.assign(data, {
          value,
          currency,
          ...(ecommerce.transactionId ? { transaction_id: ecommerce.transactionId } : {}),
          ...(ecommerce.shipping != null ? { shipping: round2(ecommerce.shipping) } : {}),
          ...(ecommerce.tax != null ? { tax: round2(ecommerce.tax) } : {}),
          items: items.map((i) => ({
            item_id: i.id,
            item_name: i.name ?? i.id,
            item_category: i.category,
            item_variant: i.variant,
            price: round2(i.price),
            quantity: i.quantity,
          })),
        });
      }
      window.gtag("event", GA4_NAME[event] ?? event, data);
    }
  } catch {
    // analytics must never break the UI
  }
}

const PIXELS = {
  meta: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  tiktok: Boolean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
  ga: Boolean(process.env.NEXT_PUBLIC_GA_ID),
};

/** True once every configured pixel's global (fbq/ttq/gtag) exists. */
function pixelsReady() {
  return (!PIXELS.meta || Boolean(window.fbq)) && (!PIXELS.tiktok || Boolean(window.ttq)) && (!PIXELS.ga || Boolean(window.gtag));
}

/**
 * Pixel snippets load `afterInteractive`, so on a fresh page load an effect can run before
 * `fbq`/`ttq`/`gtag` exist. Wait briefly for them (then send anyway) so one-shot events like
 * Purchase aren't lost. Returns a cancel function for effect cleanup.
 */
export function trackWhenReady(
  event: FunnelEvent,
  props: Props = {},
  ecommerce?: Ecommerce,
  { timeoutMs = 6000, onSent }: { timeoutMs?: number; onSent?: () => void } = {},
): () => void {
  let cancelled = false;
  let timer: number | undefined;
  const started = Date.now();
  const attempt = () => {
    if (cancelled) return;
    if (pixelsReady() || Date.now() - started >= timeoutMs) {
      track(event, props, ecommerce);
      onSent?.();
      return;
    }
    timer = window.setTimeout(attempt, 200);
  };
  attempt();
  return () => {
    cancelled = true;
    if (timer !== undefined) window.clearTimeout(timer);
  };
}
