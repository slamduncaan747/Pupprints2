"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FOUNDING_OFFER } from "@/lib/offer";
import { fetchOffer, peekOffer } from "./api";
import { EmailCapture } from "./email-capture";

/**
 * "Keep your portrait." A small, honest save-for-later prompt for visitors who have a finished
 * preview and are about to leave: the cursor leaves through the top of the window (desktop), or
 * 45 seconds without any interaction on the product step. Shown at most once per browser session
 * and never again once dismissed or saved (localStorage). It never blocks leaving: no
 * beforeunload, and Esc, the backdrop or Close dismiss it.
 */

const DONE_KEY = "pp_keep_portrait"; // localStorage: "dismissed" | "saved"
const SHOWN_KEY = "pp_keep_portrait_shown"; // sessionStorage: once per session
const IDLE_MS = 45_000;
/** Ignore exit intent right after the preview appears (people reach for the tab bar to compare). */
const ARM_MS = 4_000;

function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    // private mode / blocked storage: the in-memory guard still prevents a repeat on this page
  }
}

/** Call when the visitor saved their preview by email anywhere, so this prompt never appears. */
export function markPortraitSaved() {
  write("local", DONE_KEY, "saved");
}

export function KeepPortrait({
  generationId,
  previewUrl,
  petName,
  watchIdle,
  suppressed,
}: {
  generationId: string;
  previewUrl: string;
  petName: string;
  /** Start the 45s idle timer (product step only). */
  watchIdle: boolean;
  /** True once the visitor is on the way to checkout. */
  suppressed: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shownRef = useRef(false);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const name = petName.trim();

  const show = useCallback(() => {
    if (shownRef.current || suppressed) return;
    if (read("local", DONE_KEY) || read("session", SHOWN_KEY)) return;
    shownRef.current = true;
    write("session", SHOWN_KEY, "1");
    void fetchOffer().catch(() => {});
    setOpen(true);
  }, [suppressed]);

  // Desktop exit intent: the cursor leaves the window through the top edge.
  useEffect(() => {
    if (suppressed || !window.matchMedia("(pointer: fine)").matches) return;
    let armed = false;
    const arm = window.setTimeout(() => {
      armed = true;
    }, ARM_MS);
    const onOut = (e: MouseEvent) => {
      if (armed && !e.relatedTarget && e.clientY <= 0) show();
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
    };
  }, [show, suppressed]);

  // Product step: 45s without any interaction and no checkout.
  useEffect(() => {
    if (!watchIdle || suppressed) return;
    let timer = window.setTimeout(show, IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(show, IDLE_MS);
    };
    const events = ["pointerdown", "pointermove", "keydown", "scroll", "wheel", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, reset, { passive: true });
    return () => {
      window.clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, reset);
    };
  }, [watchIdle, suppressed, show]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  function close() {
    dialogRef.current?.close();
  }

  function onClose() {
    if (!saved) write("local", DONE_KEY, "dismissed");
    setOpen(false);
  }

  if (!open) return null;
  const offer = peekOffer();
  const foundingApplies = Boolean(offer?.discounts?.some((d) => d.source === "founding"));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="m-auto w-[calc(100%-2.5rem)] max-w-[600px] rounded-none border border-line bg-paper p-0 text-ink backdrop:bg-ink/30 motion-safe:animate-fade-up"
    >
      <div className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
        <div className="hidden bg-paper-2 sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative px-6 pt-14 pb-8 sm:px-9 sm:pt-12 sm:pb-10">
          <button
            type="button"
            onClick={close}
            className="label absolute top-2 right-2 inline-flex min-h-11 items-center px-3 text-ink-3 transition-colors hover:text-ink"
          >
            Close
          </button>
          <h2 id={titleId} className="font-display text-[34px] leading-[1.05] sm:text-[40px]">
            Keep your portrait.
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
            We&apos;ll email you {name ? `${name}'s` : "your"} preview so you can come back to it whenever you&apos;re
            ready. No account needed.
          </p>
          <EmailCapture
            className="mt-5"
            source="save_preview"
            generationId={generationId}
            petName={name || undefined}
            cta="Send"
            doneMessage="Sent. Your portrait is waiting in your inbox."
            onDone={() => {
              setSaved(true);
              markPortraitSaved();
            }}
          />
          {foundingApplies && (
            <p className="label mt-6 leading-relaxed text-ink-3">
              The founding offer still applies when you return: {FOUNDING_OFFER.percentOff}% off for our first{" "}
              {FOUNDING_OFFER.maxRedemptions} orders, through {FOUNDING_OFFER.deadlineLabel}.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
