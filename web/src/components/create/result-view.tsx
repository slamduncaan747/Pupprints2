"use client";

import { useState } from "react";
import { getStyle, PROMISES } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { FrameMockup } from "@/components/product/frame-mockup";
import { EmailCapture } from "./email-capture";
import type { Generation } from "./store";

const textLink =
  "inline-flex min-h-11 items-center text-[14px] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink";

export function ResultView({
  active,
  generations,
  petName,
  onSelect,
  onLoveIt,
  onTryAnother,
  onRegenerate,
}: {
  active: Generation;
  /** This upload's generations, newest first. */
  generations: Generation[];
  petName: string;
  onSelect: (generationId: string) => void;
  onLoveIt: () => void;
  onTryAnother: () => void;
  onRegenerate: () => void;
}) {
  const style = getStyle(active.style);
  const name = petName.trim();
  const [showEmail, setShowEmail] = useState(false);
  const strip = [...generations].reverse(); // oldest → newest, reads left to right

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-8 pb-20 sm:px-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-20 lg:pt-14">
      {/* The portrait, large, in a thin frame */}
      <div className="flex min-w-0 flex-col items-center">
        <FrameMockup
          key={active.generationId}
          src={active.previewUrl}
          alt={`${name || "Your dog"} painted as ${style?.name ?? "a portrait"} (watermarked preview)`}
          productType="framed"
          frameColor="black"
          size="lg"
          priority
          className="max-w-[310px] animate-fade-up sm:max-w-[400px] lg:max-w-[440px]"
        />
        <p className="mt-6 text-center text-[12.5px] text-ink-3">Free preview · no watermark on your order</p>
      </div>

      {/* Caption + actions */}
      <div className="min-w-0 text-center lg:text-left">
        <h1 className="font-display text-[2.4rem] leading-[1.04] sm:text-[3rem]">
          {name || "Your dog"}, as <span className="italic">{style?.name}</span>.
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-ink-2 lg:mx-0">
          Love it? Choose a size and finish next.
        </p>

        <button
          type="button"
          onClick={onLoveIt}
          className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-[3px] bg-ink px-8 text-[15px] font-medium text-paper transition-colors hover:bg-ink/85 sm:mx-auto sm:max-w-sm lg:max-w-none"
        >
          Choose your piece
        </button>
        <div className="mt-2 flex items-center justify-center gap-6 lg:justify-start">
          <button type="button" onClick={onTryAnother} className={textLink}>
            Try another style
          </button>
          <button type="button" onClick={onRegenerate} className={textLink}>
            Redo
          </button>
        </div>

        {strip.length > 1 && (
          <div className="mt-10 border-t border-line pt-6">
            <h2 className="font-sans text-[12px] tracking-[0.14em] text-ink-3 uppercase">
              Your portraits <span className="tabular-nums">({strip.length})</span>
            </h2>
            <ul className="-mx-5 mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 lg:justify-start">
              {strip.map((g) => {
                const gs = getStyle(g.style);
                const isActive = g.generationId === active.generationId;
                return (
                  <li key={g.generationId} className="shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => onSelect(g.generationId)}
                      aria-pressed={isActive}
                      aria-label={`Show ${gs?.name ?? g.style} preview`}
                      className="group flex w-[60px] flex-col items-center gap-1.5 pt-1"
                    >
                      <span
                        className={cn(
                          "block aspect-[3/4] w-full overflow-hidden outline-1 outline-offset-[3px] transition-[outline-color]",
                          isActive ? "outline-ink" : "outline-transparent group-hover:outline-line",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.previewUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </span>
                      <span className={cn("w-full truncate text-center text-[11px]", isActive ? "text-ink" : "text-ink-3")}>
                        {gs?.name.replace(/^The /, "") ?? g.style}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className={cn("mt-8", strip.length > 1 ? "" : "border-t border-line pt-6")}>
          {showEmail ? (
            <div className="text-left">
              <p className="mb-3 text-[14px] text-ink-2">We&apos;ll email you this preview so you can come back to it.</p>
              <EmailCapture
                source="save_preview"
                generationId={active.generationId}
                petName={name || undefined}
                cta="Email it"
                doneMessage="Sent! Your preview is on its way."
              />
            </div>
          ) : (
            <button type="button" onClick={() => setShowEmail(true)} className={textLink}>
              Not ready? Email me this preview
            </button>
          )}
        </div>

        <p className="mt-4 text-[12.5px] leading-snug text-ink-3">{PROMISES.guarantee}.</p>
      </div>
    </section>
  );
}
