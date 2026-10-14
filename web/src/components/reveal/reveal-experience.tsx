"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/ui/paw";
import { cn } from "@/lib/utils";
import styles from "./reveal.module.css";

export type RevealViewProps = {
  token: string;
  kind: "order" | "gift";
  imageUrl: string | null;
  recipientName: string | null;
  senderName: string | null;
  petName: string | null;
  styleName: string | null;
  message: string | null;
  productNote: string | null;
  ctas: { href: string; label: string; note?: string; lead?: string; fine?: string; primary?: boolean }[];
};

type Phase = "sealed" | "opening" | "open";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Gift Reveal: an ivory cover addressed to the recipient. One tap lifts it, the portrait fades
 * in large on white, then the note appears beneath it. Motion is a few slow fades, and
 * prefers-reduced-motion skips them entirely.
 */
export function RevealExperience(p: RevealViewProps) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const pinged = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Count the view from the browser (link-preview bots don't run JS).
  useEffect(() => {
    if (pinged.current) return;
    pinged.current = true;
    fetch("/api/reveal/viewed", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: p.token }),
      keepalive: true,
    }).catch(() => {});
  }, [p.token]);

  // Warm the image cache so the reveal is instant.
  useEffect(() => {
    if (!p.imageUrl) return;
    const img = new window.Image();
    img.decoding = "async";
    img.src = p.imageUrl;
  }, [p.imageUrl]);

  useEffect(() => {
    if (phase === "open") headingRef.current?.focus({ preventScroll: true });
  }, [phase]);

  function open() {
    if (phase !== "sealed") return;
    if (prefersReducedMotion()) {
      setPhase("open");
      return;
    }
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), 1500);
  }

  const forWhom = p.recipientName
    ? `A portrait for ${p.recipientName}`
    : "A portrait for you";
  const from = p.senderName ? `From ${p.senderName}` : null;
  const petTitle =
    p.petName ?? (p.kind === "gift" ? "Your dog" : "Your portrait");
  const title =
    p.kind === "gift"
      ? `${p.petName ?? "Your dog"}, as a work of art.`
      : p.styleName
        ? `${petTitle}, as ${p.styleName}.`
        : `${petTitle}.`;
  const sealed = phase === "sealed";
  const isOpen = phase === "open";

  return (
    <main className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="flex h-16 shrink-0 items-center justify-center sm:h-20">
        <Logo />
      </header>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-5 pt-4 pb-20 sm:px-8 sm:pt-8">
        <div className="relative aspect-[3/4] w-[min(86vw,440px)] overflow-hidden bg-paper-2">
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, already web-sized
            <img
              src={p.imageUrl}
              alt={p.petName ? `Portrait of ${p.petName}` : "Your portrait"}
              aria-hidden={sealed || undefined}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-out",
                sealed ? "opacity-0" : "opacity-100",
              )}
              decoding="async"
            />
          ) : (
            !sealed && (
              <div className="absolute inset-0 flex items-center justify-center px-10 text-center text-[14px] leading-relaxed text-ink-2">
                Your portrait is being finished. Please check back soon.
              </div>
            )
          )}

          {!isOpen && (
            <button
              type="button"
              onClick={open}
              aria-label="Open your gift"
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center bg-paper-2 px-8 text-center transition-opacity duration-700 ease-out focus-visible:outline-offset-[-8px]",
                phase === "opening" && "pointer-events-none opacity-0",
              )}
            >
              {from && <span className="label text-ink-3">{from}</span>}
              <span className="mt-6 font-display text-[40px] leading-[1.04] sm:text-[52px]">
                {forWhom}
              </span>
              <span
                className={cn(
                  "link-cta absolute inset-x-0 bottom-10 mx-auto w-max",
                  styles.breathe,
                )}
              >
                Tap to reveal
              </span>
            </button>
          )}
        </div>

        {isOpen && (
          <section
            className="mt-14 flex w-full flex-col items-center text-center"
            aria-labelledby="reveal-title"
          >
            <div className={styles.fadeUp}>
              <p className="label text-ink-3">{forWhom}</p>
              <h1
                id="reveal-title"
                ref={headingRef}
                tabIndex={-1}
                className="mt-5 font-display text-[40px] leading-[1.04] outline-none sm:text-[56px]"
              >
                {title}
              </h1>
            </div>

            {(p.message || from) && (
              <figure
                className={cn("mt-10 w-full max-w-md", styles.fadeUp)}
                style={{ animationDelay: "0.3s" }}
              >
                {p.message && (
                  <blockquote className="font-display text-[22px] leading-[1.45] whitespace-pre-line text-ink italic sm:text-[24px]">
                    {p.message}
                  </blockquote>
                )}
                {from && (
                  <figcaption
                    className={cn("label text-ink-3", p.message && "mt-6")}
                  >
                    {from}
                  </figcaption>
                )}
              </figure>
            )}

            {p.productNote && (
              <p
                className={cn(
                  "mt-10 max-w-xs text-[14px] leading-relaxed text-ink-2",
                  styles.fadeUp,
                )}
                style={{ animationDelay: "0.45s" }}
              >
                {p.productNote}
              </p>
            )}

            <div
              className={cn(
                "mt-14 flex w-full max-w-sm flex-col items-center border-t border-line pt-12",
                styles.fadeUp,
              )}
              style={{ animationDelay: "0.6s" }}
            >
              {p.ctas.map((cta) =>
                cta.primary ? (
                  <div key={cta.label} className="mb-3 w-full">
                    {cta.note && (
                      <p className="mb-6 font-display text-[28px] leading-tight">
                        {cta.note}
                      </p>
                    )}
                    {cta.lead && <p className="label -mt-2 mb-6 text-ink-2">{cta.lead}</p>}
                    <a
                      href={cta.href}
                      className={buttonClasses(
                        p.kind === "gift" ? "primary" : "secondary",
                        "lg",
                        "w-full",
                      )}
                    >
                      {cta.label}
                    </a>
                    {cta.fine && (
                      <p className="mx-auto mt-4 max-w-xs text-[12px] leading-relaxed text-ink-3">
                        {cta.fine}
                      </p>
                    )}
                  </div>
                ) : (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className="link-cta mt-2 inline-flex min-h-11 items-center"
                  >
                    {cta.label}
                  </a>
                ),
              )}
              {p.kind === "order" && <p className="label mt-12 text-ink-3">Every portrait is checked by a person</p>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
