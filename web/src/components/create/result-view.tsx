"use client";

import { useState } from "react";
import { ArrowRight, Mail, Palette, Plus, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { getStyle, PROMISES } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/container";
import { FrameMockup } from "@/components/product/frame-mockup";
import { EmailCapture } from "./email-capture";
import type { Generation } from "./store";

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
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-6 pb-32 sm:px-8 sm:pt-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:pb-20">
      <div className="min-w-0">
        <div className="relative flex justify-center overflow-hidden rounded-card bg-paper-2 px-5 pt-6 pb-8 sm:px-12 sm:pt-12 sm:pb-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(90% 70% at 30% 0%, rgb(255 255 255 / 0.7), transparent 60%)" }}
          />
          <FrameMockup
            key={active.generationId}
            src={active.previewUrl}
            alt={`${name || "Your dog"} painted as ${style?.name ?? "a portrait"} (watermarked preview)`}
            productType="canvas"
            size="lg"
            priority
            className="relative animate-fade-up"
          />
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[13px] text-ink-3">
          <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden />
          Free preview · no watermark on your order
        </p>
      </div>

      <div className="min-w-0 lg:pt-4">
        <Eyebrow>Your free preview</Eyebrow>
        <h1 className="mt-2 font-display text-[2.15rem] leading-[1.05] sm:text-5xl">
          {name ? (
            <>
              {name}, as <span className="italic">{style?.name}</span>.
            </>
          ) : (
            <>
              Your dog, as <span className="italic">{style?.name}</span>.
            </>
          )}
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">
          Love it? Choose a size and finish next. Want to compare? Try another style — every preview is free.
        </p>

        <div className="mt-7 hidden flex-col gap-3 sm:flex">
          <button
            type="button"
            onClick={onLoveIt}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-clay px-8 text-[16px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(200_85_61/0.7)] transition hover:bg-clay-dark active:scale-[0.98]"
          >
            Love it — choose size
            <ArrowRight className="h-4.5 w-4.5" aria-hidden />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onTryAnother}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium text-ink ring-1 ring-ink/15 transition hover:ring-ink/40"
          >
            <Palette className="h-4 w-4" aria-hidden />
            Another style
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium text-ink ring-1 ring-ink/15 transition hover:ring-ink/40"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Paint again
          </button>
        </div>

        {strip.length > 0 && (
          <div className="mt-8">
            <h2 className="font-sans text-[12px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
              Your portraits <span className="tabular-nums">({strip.length})</span>
            </h2>
            <ul className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
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
                      className="group flex w-[76px] flex-col items-center gap-1.5"
                    >
                      <span
                        className={cn(
                          "block aspect-[3/4] w-full overflow-hidden rounded-lg ring-offset-2 ring-offset-paper transition",
                          isActive ? "ring-2 ring-clay" : "ring-1 ring-line group-hover:ring-ink/30",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.previewUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </span>
                      <span className={cn("w-full truncate text-center text-[11.5px]", isActive ? "font-semibold text-ink" : "text-ink-2")}>
                        {gs?.name.replace(/^The /, "") ?? g.style}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="shrink-0 snap-start">
                <button type="button" onClick={onTryAnother} className="group flex w-[76px] flex-col items-center gap-1.5">
                  <span className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border border-dashed border-ink/25 text-ink-2 transition group-hover:border-clay group-hover:text-clay">
                    <Plus className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[11.5px] text-ink-2">New style</span>
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5">
          {showEmail ? (
            <>
              <p className="mb-3 text-[14px] font-medium">We&apos;ll email you this preview so you can come back to it.</p>
              <EmailCapture
                source="save_preview"
                generationId={active.generationId}
                petName={name || undefined}
                cta="Email it"
                doneMessage="Sent! Your preview is on its way."
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowEmail(true)}
              className="flex min-h-11 w-full items-center gap-3 text-left text-[14px] font-medium text-ink"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-2">
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <span>
                Email me this preview
                <span className="block text-[13px] font-normal text-ink-3">Not ready to decide? Save it for later.</span>
              </span>
            </button>
          )}
        </div>

        <p className="mt-6 flex items-start gap-2 text-[13.5px] leading-snug text-ink-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
          {PROMISES.guarantee}. Every print is checked by a person before it ships.
        </p>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
        <button
          type="button"
          onClick={onLoveIt}
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-clay text-[16px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(200_85_61/0.7)] active:scale-[0.98]"
        >
          Love it — choose size
          <ArrowRight className="h-4.5 w-4.5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
