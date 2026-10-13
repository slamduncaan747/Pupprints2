"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getStyle, type StyleSlug } from "@/lib/catalog";

const LINES = [
  "Studying those ears…",
  "Sketching the outline…",
  "Matching every marking…",
  "Painting the eyes first — always the eyes…",
  "Mixing the colors…",
  "Finding the perfect light…",
  "Softening the fur…",
  "Adding a little gold leaf…",
  "Stepping back for a squint…",
  "Varnishing the final layer…",
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
  const line = LINES[Math.floor(elapsed / 3.4) % LINES.length];
  const name = petName.trim();

  return (
    <section
      className="mx-auto w-full max-w-md px-5 pt-8 pb-20 text-center sm:max-w-lg sm:px-8 sm:pt-10"
      aria-busy="true"
    >
      <p className="text-[12px] tracking-[0.14em] text-ink-3 uppercase">{s?.name ?? "Your portrait"}</p>
      <h1 className="mt-3 font-display text-[2.6rem] leading-[1.02] sm:text-[3.5rem]">
        {name ? `${name}'s portrait is on the easel.` : "Your portrait is on the easel."}
      </h1>

      <div className="relative mx-auto mt-8 w-full max-w-[280px] overflow-hidden bg-paper-3 sm:mt-10 sm:max-w-[320px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={`Your photo, being painted as ${s?.name ?? "a portrait"}`}
          className="aspect-[4/5] w-full object-cover grayscale"
        />
        {/* A slow breath of light over the photo while the portrait is painted. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-paper"
          initial={{ opacity: 0.25 }}
          animate={reduce ? undefined : { opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(100deg,transparent,rgb(255_255_255/0.55),transparent)]"
            initial={{ x: "0%" }}
            animate={{ x: ["0%", "400%"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
          />
        )}
      </div>

      <div className="mt-8 min-h-6" aria-live="polite">
        <p key={line} className="animate-fade-up font-display text-[1.25rem] text-ink-2 italic">
          {line}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Painting progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="mx-auto mt-6 h-px w-full max-w-[280px] bg-line sm:max-w-[320px]"
      >
        <div
          className="h-full bg-ink transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(3, pct)}%` }}
        />
      </div>
      <p className="mt-4 text-[13px] text-ink-3">Usually under a minute. Keep this page open.</p>

      <button
        type="button"
        onClick={onCancel}
        className="mt-6 inline-flex min-h-11 items-center text-[13px] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
      >
        Choose a different style
      </button>
    </section>
  );
}
