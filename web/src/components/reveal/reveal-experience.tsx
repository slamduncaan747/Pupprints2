"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { PawMark } from "@/components/ui/paw";
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

const PAW_COLORS = ["#f2d492", "#e8cc85", "#f7efe1", "#d9705a", "#c9a457"];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Deterministic pseudo-random so the confetti layout is stable per render. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function PawConfetti() {
  const paws = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: `${(rand(i + 1) * 100).toFixed(1)}%`,
        size: 12 + Math.round(rand(i + 40) * 16),
        style: {
          "--dur": `${(4.2 + rand(i + 7) * 3).toFixed(2)}s`,
          "--delay": `${(rand(i + 13) * 1.4).toFixed(2)}s`,
          "--rot": `${Math.round(rand(i + 21) * 120 - 60)}deg`,
          "--drift": `${Math.round(rand(i + 33) * 80 - 40)}px`,
          "--alpha": (0.45 + rand(i + 55) * 0.45).toFixed(2),
        } as CSSProperties,
        color: PAW_COLORS[i % PAW_COLORS.length],
      })),
    [],
  );
  return (
    <div className={styles.confetti} aria-hidden="true">
      {paws.map((p, i) => (
        <span key={i} className={styles.paw} style={{ ...p.style, left: p.left, color: p.color }}>
          <svg viewBox="0 0 32 32" width={p.size} height={p.size} fill="currentColor">
            <ellipse cx="16" cy="20.5" rx="6" ry="5" />
            <ellipse cx="8.6" cy="13.6" rx="2.4" ry="3.1" />
            <ellipse cx="13.2" cy="9.2" rx="2.4" ry="3.2" />
            <ellipse cx="18.8" cy="9.2" rx="2.4" ry="3.2" />
            <ellipse cx="23.4" cy="13.6" rx="2.4" ry="3.1" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function RevealExperience(p: RevealViewProps) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [confetti, setConfetti] = useState(false);
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
    window.setTimeout(() => {
      setPhase("open");
      setConfetti(true);
      window.setTimeout(() => setConfetti(false), 9000);
    }, 1350);
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

  return (
    <main className={styles.stage}>
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-12 pt-6 sm:px-8">
        <header className="flex justify-center">
          <span className="inline-flex items-center gap-2 text-[#f7efe1]/80">
            <PawMark className="h-5 w-5 text-[#e8cc85]" />
            <span className="font-display text-lg tracking-tight">Pup Prints</span>
          </span>
        </header>

        {phase !== "open" ? (
          <section className="flex flex-1 flex-col items-center justify-center py-10 text-center" aria-label="Your gift">
            <p className="font-display text-[1.65rem] italic leading-tight text-[#f7efe1] sm:text-3xl">{forWhom}</p>
            {from && <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#e8cc85]/80">{from}</p>}

            <div className="mt-10 w-full">
              <button
                type="button"
                onClick={open}
                aria-label="Open your gift"
                className={cn(styles.envelopeButton, phase === "opening" && styles.opening)}
              >
                <span className={styles.envelopeBody} />
                <span className={styles.letter} />
                <span className={styles.flap}>
                  <span className={styles.flapFace} />
                  <span className={styles.flapBack} />
                </span>
                <span className={styles.seal}>
                  <PawMark className="h-[58%] w-[58%]" />
                </span>
              </button>
            </div>

            <p className={cn("mt-12 text-[15px] text-[#f7efe1]/80", styles.tapHint)} aria-hidden={phase === "opening"}>
              {phase === "opening" ? "Opening…" : "Tap the envelope to open"}
            </p>
          </section>
        ) : (
          <section className="flex flex-1 flex-col items-center py-8 text-center" aria-labelledby="reveal-title">
            <div className={cn(styles.portraitWrap, styles.rise)}>
              <span className={styles.glow} aria-hidden="true" />
              <div className={styles.goldFrame}>
                <div className={styles.goldInner}>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, already web-sized
                    <img
                      src={p.imageUrl}
                      alt={p.petName ? `Portrait of ${p.petName}` : "Your portrait"}
                      className="block aspect-[4/5] w-full object-cover"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] w-full items-center justify-center bg-[#efe6d6] px-6 text-[15px] text-[#4a443c]">
                      Your portrait is being finished. Check back soon.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={cn("mt-10", styles.fadeUp)} style={{ animationDelay: "0.35s" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e8cc85]">
                {p.kind === "gift" && p.recipientName ? `A gift for ${p.recipientName}` : forWhom}
              </p>
              <h1
                id="reveal-title"
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 font-display text-[2.75rem] leading-[1.02] text-[#fbf6ec] outline-none sm:text-6xl"
              >
                {p.kind === "gift" ? subtitle : petTitle}
              </h1>
              {p.kind === "order" && <p className="mt-2 font-display text-xl italic text-[#f7efe1]/75">{subtitle}</p>}
            </div>

            {(p.message || from) && (
              <figure
                className={cn("mt-8 w-full max-w-md rounded-2xl bg-[#fbf6ec] px-6 py-6 text-left text-[#1b1814] shadow-[0_24px_48px_-20px_rgb(0_0_0/0.7)]", styles.fadeUp)}
                style={{ animationDelay: "0.6s" }}
              >
                {p.message && (
                  <blockquote className="whitespace-pre-line font-display text-[1.2rem] italic leading-relaxed text-[#2a241d]">
                    {p.message}
                  </blockquote>
                )}
                {from && <figcaption className={cn("text-[15px] font-medium text-[#8a6a2b]", p.message && "mt-4")}>— {from}</figcaption>}
              </figure>
            )}

            {p.productNote && (
              <p
                className={cn("mt-6 inline-flex items-center gap-2 rounded-full bg-[#f7efe1]/10 px-4 py-2 text-[15px] text-[#f7efe1]/90 ring-1 ring-[#f7efe1]/15", styles.fadeUp)}
                style={{ animationDelay: "0.8s" }}
              >
                <span aria-hidden="true">✦</span> {p.productNote}
              </p>
            )}

            <div className={cn("mt-14 w-full max-w-sm", styles.fadeUp)} style={{ animationDelay: "1s" }}>
              {p.ctas.map((cta) =>
                cta.primary ? (
                  <div key={cta.label} className="mb-3">
                    {cta.note && <p className="mb-3 font-display text-xl text-[#fbf6ec]">{cta.note}</p>}
                    <a
                      href={cta.href}
                      className={cn(
                        "flex h-13 w-full items-center justify-center rounded-full px-6 text-base font-medium transition-colors",
                        p.kind === "gift"
                          ? "bg-clay text-white shadow-[0_10px_30px_-8px_rgb(200_85_61/0.7)] hover:bg-clay-dark"
                          : "bg-[#f7efe1]/10 text-[#fbf6ec] ring-1 ring-[#f7efe1]/30 hover:bg-[#f7efe1]/15",
                      )}
                    >
                      {cta.label}
                    </a>
                  </div>
                ) : (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className="mt-1 inline-flex h-11 items-center justify-center px-4 text-[15px] text-[#f7efe1]/80 underline decoration-[#f7efe1]/30 underline-offset-4 hover:text-[#fbf6ec]"
                  >
                    {cta.label}
                  </a>
                ),
              )}
              <p className="mt-8 text-xs text-[#f7efe1]/45">
                {p.kind === "order" ? "Made with Pup Prints · Every portrait is checked by a person" : "Made by the Pup Prints studio"}
              </p>
            </div>
          </section>
        )}
      </div>
      {confetti && <PawConfetti />}
    </main>
  );
}
