"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Funnel events. Names follow Meta/TikTok standard events where one exists so the
 * same call feeds Vercel Analytics, Meta Pixel, TikTok Pixel and GA4.
 */
export type FunnelEvent =
  | "ViewContent"
  | "UploadPhoto"
  | "GeneratePreview"
  | "PreviewReady"
  | "SelectProduct"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"
  | "PartnerApply";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, props?: Props) => void; page: () => void };
    gtag?: (...args: unknown[]) => void;
  }
}

const META_STANDARD = new Set(["ViewContent", "AddToCart", "InitiateCheckout", "Lead"]);

export function track(event: FunnelEvent, props: Props = {}) {
  try {
    const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as Record<
      string,
      string | number | boolean | null
    >;
    vercelTrack(event, clean);
    if (window.fbq) {
      if (META_STANDARD.has(event)) window.fbq("track", event, clean);
      else window.fbq("trackCustom", event, clean);
    }
    window.ttq?.track(event, clean);
    window.gtag?.("event", event, clean);
  } catch {
    // analytics must never break the UI
  }
}
