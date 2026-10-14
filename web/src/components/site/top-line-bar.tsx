"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { useFoundingLive } from "@/components/marketing/offer-status";

export type TopLineMessage = {
  /** Changes whenever the message does, so a dismissed message never hides a new one. */
  key: string;
  kind: "founding" | "other";
  /** Phones. */
  short: string;
  /** Wider screens. */
  long: string;
  href: string;
};

export const TOP_LINE_ID = "pp-topline";
export const TOP_LINE_STORAGE_KEY = "pp-topline-dismissed";
const CHANGE_EVENT = "pp-topline-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readDismissed() {
  try {
    return window.localStorage.getItem(TOP_LINE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** The bar itself. Swaps the founding line for the next real message if the offer closes early. */
export function TopLineBar({
  primary,
  fallback,
  cta,
}: {
  primary: TopLineMessage;
  fallback: TopLineMessage | null;
  cta: string;
}) {
  const live = useFoundingLive();
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => null);
  const [closedHere, setClosedHere] = useState(false);

  const message = primary.kind === "founding" && live && !live.open ? fallback : primary;
  if (!message || closedHere || dismissed === message.key) return null;
  const { key } = message;

  function dismiss() {
    setClosedHere(true);
    try {
      window.localStorage.setItem(TOP_LINE_STORAGE_KEY, key);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Private mode: closing for this page view is enough.
    }
  }

  return (
    <div id={TOP_LINE_ID} data-key={key} className="relative bg-ink text-paper">
      <Link
        href={message.href}
        className="mx-auto flex min-h-9 max-w-[1440px] items-center justify-center gap-x-3 px-12 py-2 text-center text-[10px] font-medium uppercase leading-[1.5] tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em]"
      >
        <span className="sm:hidden">{message.short}</span>
        <span className="hidden sm:inline">{message.long}</span>
        <span aria-hidden="true" className="hidden text-paper/40 sm:inline">
          ·
        </span>
        <span className="hidden underline decoration-paper/50 decoration-1 underline-offset-4 sm:inline">{cta}</span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss this message"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-paper/70 transition-opacity hover:text-paper sm:right-4"
      >
        <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
