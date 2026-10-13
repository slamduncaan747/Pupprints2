"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { Eyebrow } from "@/components/ui/container";
import { FrameMockup } from "@/components/product/frame-mockup";

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
  const swatch = s?.swatch ?? "#c8553d";

  return (
    <section
      className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-6 pb-20 sm:px-8 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
      aria-busy="true"
    >
      <div className="relative flex justify-center rounded-card bg-paper-2 px-6 py-8 sm:px-12 sm:py-12">
        <FrameMockup
          src={photoUrl}
          alt={`Your photo, being painted as ${s?.name ?? "a portrait"}`}
          productType="framed"
          frameColor="oak"
          size="md"
          priority
          imgClassName="scale-105 blur-[2px] saturate-[0.55] sepia-[0.35]"
        >
          <PaintOverlay color={swatch} animate={!reduce} />
        </FrameMockup>
      </div>

      <div className="min-w-0">
        <Eyebrow>Painting in {s?.name ?? "your style"}</Eyebrow>
        <h1 className="mt-3 font-display text-[2rem] leading-[1.08] sm:text-[2.75rem]">
          {name ? `${name}'s portrait is on the easel.` : "Your portrait is on the easel."}
        </h1>

        <div className="mt-6" aria-live="polite">
          <p key={line} className="animate-fade-up font-display text-xl text-ink-2 italic">
            {line}
          </p>
        </div>

        <div className="mt-6">
          <div
            role="progressbar"
            aria-label="Painting progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            className="h-2 w-full overflow-hidden rounded-full bg-line"
          >
            <div
              className="relative h-full overflow-hidden rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${Math.max(3, pct)}%`, background: `linear-gradient(90deg, ${swatch}, #c8553d)` }}
            >
              <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.45)_50%,transparent_100%)] bg-[length:200%_100%]" />
            </div>
          </div>
          <p className="mt-3 text-[14px] text-ink-3">
            Usually ready in under a minute. Keep this page open — we&apos;ll show it the moment it&apos;s done.
          </p>
        </div>

        <ul className="mt-8 grid gap-2.5 text-[14px] text-ink-2">
          {["Free preview, no card needed", "Try as many styles as you like", "Every print is checked by a person before it ships"].map(
            (t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-moss" aria-hidden />
                {t}
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          onClick={onCancel}
          className="mt-8 inline-flex h-11 items-center rounded-full px-1 text-[14px] font-medium text-ink-2 underline decoration-ink/25 underline-offset-4 hover:text-ink"
        >
          Choose a different style instead
        </button>
      </div>
    </section>
  );
}

/** Brush strokes in the style's color sweep across the photo, plus a soft light sweep. */
function PaintOverlay({ color, animate }: { color: string; animate: boolean }) {
  const strokes = [
    "M-10 18 C 20 10, 50 26, 110 14",
    "M-10 36 C 30 46, 60 28, 110 40",
    "M-10 56 C 25 48, 70 64, 110 54",
    "M-10 76 C 35 84, 65 68, 110 78",
    "M-10 96 C 20 88, 55 104, 110 94",
    "M-10 116 C 30 124, 70 108, 110 120",
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 100 133" preserveAspectRatio="none" className="absolute inset-0 h-full w-full mix-blend-multiply">
        {strokes.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke={color}
            strokeOpacity={0.42}
            strokeWidth={17}
            strokeLinecap="round"
            initial={{ pathLength: animate ? 0 : 1 }}
            animate={animate ? { pathLength: [0, 1, 1, 0], opacity: [1, 1, 0.9, 0] } : undefined}
            transition={{ duration: 6.5, times: [0, 0.35, 0.85, 1], delay: i * 0.45, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_30%,rgb(255_255_255/0.35)_50%,transparent_70%)] bg-[length:250%_100%]" />
    </div>
  );
}
