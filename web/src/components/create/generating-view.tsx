"use client";

import { useEffect, useId, useState } from "react";
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
          imgClassName="grayscale contrast-[1.15] brightness-[1.12] blur-[0.6px]"
        >
          <BrushReveal src={photoUrl} color={swatch} animate={!reduce} />
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

/**
 * "Painting" reveal: the photo sits underneath as a soft pencil underdrawing, and loose brush
 * strokes (an animated, roughened SVG mask) paint it back in, in color, row by row. Loops
 * until the real portrait arrives.
 */
function BrushReveal({ src, color, animate }: { src: string; color: string; animate: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rough = `pp-rough-${uid}`;
  const mask = `pp-mask-${uid}`;
  const strokes = [
    "M -30 28 C 70 6, 200 52, 330 22",
    "M 330 82 C 230 104, 90 60, -30 92",
    "M -30 148 C 90 126, 210 172, 330 140",
    "M 330 204 C 210 228, 100 182, -30 212",
    "M -30 266 C 80 246, 220 292, 330 262",
    "M 330 326 C 220 348, 90 304, -30 334",
    "M -30 388 C 90 366, 200 410, 330 384",
  ];
  const T = 12; // seconds per loop
  const per = 1.15; // seconds per stroke
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* paper wash over the underdrawing */}
      <div className="absolute inset-0 bg-[#f6efe2]/45 mix-blend-screen" />
      <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id={rough} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="400">
            <rect width="300" height="400" fill="black" />
            <motion.g
              filter={`url(#${rough})`}
              initial={{ opacity: 1 }}
              animate={animate ? { opacity: [1, 1, 0, 0] } : undefined}
              transition={{ duration: T, times: [0, 0.86, 0.95, 1], repeat: Infinity, ease: "easeInOut" }}
            >
              {strokes.map((d, i) => {
                const s0 = (i * per) / T;
                const s1 = ((i + 1) * per) / T;
                return (
                  <motion.path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="white"
                    strokeWidth={74}
                    strokeLinecap="round"
                    initial={{ pathLength: animate ? 0 : i < 3 ? 1 : 0 }}
                    animate={animate ? { pathLength: [0, 0, 1, 1, 0] } : undefined}
                    transition={{ duration: T, times: [0, s0, s1, 0.97, 1], repeat: Infinity, ease: "easeInOut" }}
                  />
                );
              })}
            </motion.g>
          </mask>
        </defs>
        <g mask={`url(#${mask})`}>
          <image
            href={src}
            x="0"
            y="0"
            width="300"
            height="400"
            preserveAspectRatio="xMidYMid slice"
            style={{ filter: "saturate(1.25) contrast(1.05) sepia(0.12) blur(0.4px)" }}
          />
          <rect width="300" height="400" fill={color} opacity="0.28" style={{ mixBlendMode: "soft-light" }} />
        </g>
      </svg>
      <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_35%,rgb(255_255_255/0.28)_50%,transparent_65%)] bg-[length:250%_100%]" />
    </div>
  );
}
