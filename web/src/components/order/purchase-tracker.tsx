"use client";

import { useEffect } from "react";
import { trackWhenReady, type EcommerceItem } from "@/lib/analytics";

const KEY_PREFIX = "pp_purchase_tracked:";
/** Guards against React Strict Mode double effects and storage being unavailable. */
const sentThisSession = new Set<string>();

function alreadyTracked(orderNumber: string) {
  if (sentThisSession.has(orderNumber)) return true;
  try {
    return window.localStorage.getItem(KEY_PREFIX + orderNumber) !== null;
  } catch {
    return false;
  }
}

function markTracked(orderNumber: string) {
  sentThisSession.add(orderNumber);
  try {
    window.localStorage.setItem(KEY_PREFIX + orderNumber, String(Date.now()));
  } catch {
    // private mode / blocked storage: the in-memory guard + platform dedup ids still apply
  }
}

/**
 * Fires the Purchase conversion once per order number (Meta Purchase, TikTok CompletePayment,
 * GA4 purchase, Vercel Analytics). Mount only for paid orders; renders nothing.
 */
export function PurchaseTracker({
  orderNumber,
  value,
  currency,
  items,
  shipping,
  tax,
}: {
  orderNumber: string;
  /** Amount charged, in dollars. */
  value: number;
  currency: string;
  items: EcommerceItem[];
  shipping?: number;
  tax?: number;
}) {
  useEffect(() => {
    if (!orderNumber || alreadyTracked(orderNumber)) return;
    // Marked only once actually sent; a cancelled (unmounted) attempt can retry on remount.
    return trackWhenReady(
      "Purchase",
      { order: orderNumber },
      { value, currency, items, transactionId: orderNumber, shipping, tax },
      { onSent: () => markTracked(orderNumber) },
    );
    // Fire once per order; the payload for a given order number doesn't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  return null;
}
