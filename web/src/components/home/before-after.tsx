"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { MoveHorizontal } from "lucide-react";
import { SampleImage } from "@/components/ui/sample-image";
import { cn } from "@/lib/utils";

const clamp = (n: number) => Math.min(100, Math.max(0, n));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Intro "hint" sweep: [target position %, duration ms]. Starts at 50. */
const INTRO: [number, number][] = [
  [82, 900],
  [18, 1300],
  [50, 900],
];

/**
 * Before → after comparison. Mouse users scrub by hovering, touch users drag sideways
 * (vertical scrolling still works), keyboard users use the arrow keys on the handle.
 * Plays one gentle sweep when it first scrolls into view (skipped for reduced motion).
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  afterSwatch,
  sizes = "(max-width: 1024px) 60vw, 360px",
  className,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  afterSwatch: string;
  sizes?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const interacted = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;

    const play = () => {
      let seg = 0;
      let from = 50;
      let start = performance.now();
      const tick = (now: number) => {
        if (interacted.current) return;
        const [to, dur] = INTRO[seg];
        const t = Math.min(1, (now - start) / dur);
        setPos(from + (to - from) * easeInOut(t));
        if (t === 1) {
          seg += 1;
          if (seg >= INTRO.length) return;
          from = to;
          start = now;
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          timer = window.setTimeout(play, 700);
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  function stopIntro() {
    interacted.current = true;
    cancelAnimationFrame(raf.current);
  }

  function moveTo(clientX: number) {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setPos(clamp(((clientX - r.left) / r.width) * 100));
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    stopIntro();
    dragging.current = true;
    if (e.pointerType === "mouse") moveTo(e.clientX);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" || dragging.current) {
      stopIntro();
      moveTo(e.clientX);
    }
  }

  function onPointerEnd() {
    dragging.current = false;
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 20 : 5;
    const next: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      Home: 0,
      End: 100,
    };
    if (e.key in next) {
      e.preventDefault();
      stopIntro();
      setPos(clamp(next[e.key]));
    }
  }

  // Images never change while scrubbing; keep the same elements so React skips them.
  const afterImage = useMemo(
    () => (
      <SampleImage src={after} alt={afterAlt} swatch={afterSwatch} sizes={sizes} priority className="h-full w-full" />
    ),
    [after, afterAlt, afterSwatch, sizes],
  );
  const beforeImage = useMemo(
    () => <SampleImage src={before} alt={beforeAlt} swatch="#a5978a" sizes={sizes} className="h-full w-full" />,
    [before, beforeAlt, sizes],
  );

  const rounded = Math.round(pos);

  return (
    <div
      ref={boxRef}
      className={cn("relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerLeave={onPointerEnd}
    >
      <div className="absolute inset-0">{afterImage}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeImage}
      </div>

      {/* Divider + handle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgb(0_0_0/0.25)]"
        style={{ left: `${pos}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare the original photo with the finished portrait"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${100 - rounded}% portrait showing`}
        onKeyDown={onKeyDown}
        onFocus={stopIntro}
        className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_4px_16px_rgb(0_0_0/0.25)] ring-1 ring-black/5 transition-transform hover:scale-105"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="h-4 w-4" aria-hidden="true" />
      </div>

      {/* Corner labels fade when their side is mostly hidden */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-ink/60 px-2 py-0.5 text-[9px] sm:bottom-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: pos > 30 ? 1 : 0 }}
      >
        Photo
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/85 px-2 py-0.5 text-[9px] sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: pos < 70 ? 1 : 0 }}
      >
        Portrait
      </span>
    </div>
  );
}
