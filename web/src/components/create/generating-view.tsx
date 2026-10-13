"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getStyle, type StyleSlug } from "@/lib/catalog";

const LINES = [
  "Composing the portrait…",
  "Studying the likeness…",
  "Considering the light…",
  "Matching every marking…",
  "Setting the palette…",
  "Drawing out the eyes…",
  "Refining the fur…",
  "Balancing the composition…",
  "Finishing the surface…",
  "A final look…",
];

/** Eases toward 95% over ~a minute; it never claims to be done before the server says so. */
function progressAt(seconds: number) {
  return 95 * (1 - Math.exp(-seconds / 17));
}

export function GeneratingView({
  style,
  photoUrl,
  petName,
  startedAt,
  onCancel,
}: {
  style: StyleSlug;
  photoUrl: string;
  petName: string;
  startedAt: number;
  onCancel: () => void;
}) {
  const s = getStyle(style);
  const [elapsed, setElapsed] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 250);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const pct = progressAt(elapsed);
  const line = LINES[Math.floor(elapsed / 4) % LINES.length];
  const name = petName.trim();

  return (
    <section className="mx-auto w-full max-w-[560px] px-5 pt-8 pb-20 text-center sm:px-10 sm:pt-12" aria-busy="true">
      <h1 className="sr-only">
        {name ? `Composing ${name}'s portrait` : "Composing your portrait"}
        {s ? ` as ${s.name}` : ""}
      </h1>
      <p className="label text-ink-3" aria-hidden>
        {s?.name ?? "Your portrait"}
      </p>

      <div className="relative mx-auto mt-6 w-full max-w-[360px] overflow-hidden bg-paper-2 sm:mt-8 sm:max-w-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={`Your photograph, being composed as ${s?.name ?? "a portrait"}`}
          className="aspect-[3/4] w-full object-cover grayscale"
        />
        {/* A slow, quiet veil of white breathing over the photograph while the portrait is made. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-paper"
          initial={{ opacity: 0.2 }}
          animate={reduce ? { opacity: 0.35 } : { opacity: [0.2, 0.62, 0.2] }}
          transition={reduce ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-9 flex min-h-9 items-center justify-center" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={line}
            className="font-display text-[22px] leading-tight text-ink italic sm:text-[26px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: "easeInOut" }}
          >
            {line}
          </motion.p>
        </AnimatePresence>
      </div>

      <div
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="mx-auto mt-7 h-px w-full max-w-[360px] bg-line sm:max-w-[400px]"
      >
        <div className="h-full bg-ink transition-[width] duration-700 ease-out" style={{ width: `${Math.max(2, pct)}%` }} />
      </div>
      <p className="label mt-5 text-ink-3">Usually under a minute. Keep this page open.</p>

      <button type="button" onClick={onCancel} className="link-cta mt-8 inline-flex min-h-11 items-center">
        Choose another style
      </button>
    </section>
  );
}
