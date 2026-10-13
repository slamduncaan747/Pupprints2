"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "motion/react";
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
  ctas: { href: string; label: string; note?: string; primary?: boolean }[];
};

type Phase = "sealed" | "opening" | "open";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Gift Reveal: a covered, framed artwork. One tap lifts the cover, the portrait fades in on
 * white, then the frame settles and the note appears beneath it. Motion is minimal and
 * prefers-reduced-motion skips it entirely.
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

  const forWhom = p.recipientName ? `For ${p.recipientName}` : "A gift for you";
  const from = p.senderName ? `From ${p.senderName}` : null;
  const petTitle = p.petName ?? (p.kind === "gift" ? "Your dog" : "Your portrait");
  const subtitle =
    p.kind === "gift"
      ? `${p.petName ?? "Your dog"}, as a work of art`
      : p.styleName
        ? `as ${p.styleName}`
        : "as a work of art";
  const sealed = phase === "sealed";
  const isOpen = phase === "open";

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-dvh flex-col bg-paper text-ink">
        <header className="flex h-16 shrink-0 items-center justify-center">
          <span className="font-display text-[22px] leading-none">Pup Prints</span>
        </header>

        <div
          className={cn(
            "mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-5 sm:px-8",
            isOpen ? "justify-start pt-4 pb-16 sm:pt-8" : "justify-center pb-24",
          )}
        >
          <motion.div
            layout
            transition={{ layout: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
            className="w-[min(78vw,400px)] bg-[#161616] p-2 shadow-frame"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#fdfdfb]">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, already web-sized
                <img
                  src={p.imageUrl}
                  alt={p.petName ? `Portrait of ${p.petName}` : "Your portrait"}
                  aria-hidden={sealed || undefined}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out",
                    sealed ? "opacity-0" : "opacity-100",
                  )}
                  decoding="async"
                />
              ) : (
                !sealed && (
                  <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-[15px] text-ink-2">
                    Your portrait is being finished. Check back soon.
                  </div>
                )
              )}

              {!isOpen && (
                <button
                  type="button"
                  onClick={open}
                  aria-label="Open your gift"
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center bg-[#fdfdfb] px-6 text-center transition-opacity duration-500 ease-out focus-visible:outline-offset-[-6px]",
                    phase === "opening" && "pointer-events-none opacity-0",
                  )}
                >
                  <span className="font-display text-[2.1rem] leading-tight italic sm:text-[2.6rem]">{forWhom}</span>
                  {from && <span className="mt-3 text-[12px] tracking-[0.14em] text-ink-3 uppercase">{from}</span>}
                  <span className={cn("absolute inset-x-0 bottom-7 text-[13px] text-ink-2", styles.breathe)}>
                    Tap to reveal
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {isOpen && (
            <section className="mt-12 flex w-full flex-col items-center text-center" aria-labelledby="reveal-title">
              <div className={styles.fadeUp}>
                <p className="text-[12px] tracking-[0.14em] text-ink-3 uppercase">
                  {p.kind === "gift" && p.recipientName ? `A gift for ${p.recipientName}` : forWhom}
                </p>
                <h1
                  id="reveal-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-3 font-display text-[2.6rem] leading-[1.02] outline-none sm:text-[3.5rem]"
                >
                  {p.kind === "gift" ? subtitle : petTitle}
                </h1>
                {p.kind === "order" && <p className="mt-2 font-display text-[1.35rem] text-ink-2 italic">{subtitle}</p>}
              </div>

              {(p.message || from) && (
                <figure className={cn("mt-10 w-full max-w-md", styles.fadeUp)} style={{ animationDelay: "0.25s" }}>
                  {p.message && (
                    <blockquote className="font-display text-[1.35rem] leading-relaxed whitespace-pre-line text-ink italic">
                      {p.message}
                    </blockquote>
                  )}
                  {from && (
                    <figcaption className={cn("text-[13px] text-ink-3", p.message && "mt-4")}>— {from}</figcaption>
                  )}
                </figure>
              )}

              {p.productNote && (
                <p
                  className={cn("mt-8 max-w-xs text-[14px] leading-relaxed text-ink-2", styles.fadeUp)}
                  style={{ animationDelay: "0.4s" }}
                >
                  {p.productNote}
                </p>
              )}

              <div
                className={cn("mt-12 w-full max-w-sm border-t border-line pt-10", styles.fadeUp)}
                style={{ animationDelay: "0.55s" }}
              >
                {p.ctas.map((cta) =>
                  cta.primary ? (
                    <div key={cta.label} className="mb-2">
                      {cta.note && <p className="mb-5 font-display text-[1.6rem] leading-tight">{cta.note}</p>}
                      <a
                        href={cta.href}
                        className={cn(
                          "flex h-13 w-full items-center justify-center rounded-[3px] px-6 text-[15px] font-medium transition-colors",
                          p.kind === "gift"
                            ? "bg-ink text-paper hover:bg-ink/85"
                            : "text-ink ring-1 ring-ink/25 ring-inset hover:ring-ink",
                        )}
                      >
                        {cta.label}
                      </a>
                    </div>
                  ) : (
                    <a
                      key={cta.label}
                      href={cta.href}
                      className="inline-flex min-h-11 items-center justify-center px-2 text-[14px] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      {cta.label}
                    </a>
                  ),
                )}
                <p className="mt-10 text-[12px] text-ink-3">
                  {p.kind === "order"
                    ? "Made with Pup Prints · Every portrait is checked by a person"
                    : "Made by the Pup Prints studio"}
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </MotionConfig>
  );
}
