"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { getStyle } from "@/lib/catalog";
import { GUARANTEE } from "@/lib/offer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmailCapture } from "./email-capture";
import { markPortraitSaved } from "./keep-portrait";
import { PhoneWallpaper } from "./phone-wallpaper";
import type { Generation } from "./store";

const textLink = "link-cta inline-flex min-h-11 items-center";

export function ResultView({
  active,
  generations,
  petName,
  onSelect,
  onLoveIt,
  onTryAnother,
  onRegenerate,
  memorial = false,
}: {
  active: Generation;
  /** This upload's generations, newest first. */
  generations: Generation[];
  petName: string;
  onSelect: (generationId: string) => void;
  onLoveIt: () => void;
  onTryAnother: () => void;
  onRegenerate: () => void;
  /** The gentle track: passed to the lead so its emails skip every offer. */
  memorial?: boolean;
}) {
  const style = getStyle(active.style);
  const name = petName.trim();
  /** One quiet panel at a time: email the preview, or the free phone wallpaper. */
  const [panel, setPanel] = useState<"email" | "wallpaper" | null>(null);
  const strip = [...generations].reverse(); // oldest → newest, reads left to right

  return (
    <section className="mx-auto grid w-full max-w-[1440px] gap-10 pt-4 pb-32 sm:px-10 sm:pb-24 sm:pt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-20 xl:gap-28">
      {/* The portrait, as a campaign image: large, on white, unframed. */}
      <figure className="min-w-0">
        <div className="relative mx-auto w-full bg-paper-2 sm:max-w-[520px] lg:max-w-[min(100%,calc((100dvh_-_190px)_*_0.75))]">
          <motion.img
            key={active.generationId}
            src={active.previewUrl}
            alt={`${name || "Your dog"} as ${style?.name ?? "a portrait"} (watermarked preview)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
        <figcaption className="label mt-4 px-5 text-center text-ink-3 sm:px-0">
          Preview only. No watermark on your piece.
        </figcaption>
      </figure>

      {/* Caption + actions */}
      <div className="min-w-0 px-5 text-center sm:px-0 lg:max-w-md lg:text-left">
        <h1 className="font-display text-[40px] leading-[1.04] sm:text-[56px]">
          {name || "Your dog"}, as {style?.name}.
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-[14px] leading-relaxed text-ink-2 lg:mx-0">
          Love it? Choose a size and finish next.
        </p>

        <Button type="button" size="lg" onClick={onLoveIt} className="mt-9 hidden w-full sm:inline-flex sm:max-w-sm lg:max-w-none">
          Choose your piece
        </Button>
        <p className="mt-4 hidden sm:block">
          <Link href="/guarantee" className="label text-ink-3 underline-offset-[5px] transition-colors hover:text-ink hover:underline">
            {GUARANTEE.short}
          </Link>
        </p>
        <div className="mt-5 flex items-center justify-center gap-10 sm:mt-3 lg:justify-start">
          <button type="button" onClick={onTryAnother} className={textLink}>
            Another style
          </button>
          <button type="button" onClick={onRegenerate} className={textLink}>
            Redo
          </button>
        </div>

        {strip.length > 1 && (
          <div className="mt-12 border-t border-line pt-7">
            <h2 className="label text-ink-3">
              Your portraits <span className="tabular-nums">({strip.length})</span>
            </h2>
            <div className="-mx-5 mt-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
              <ul className="mx-auto flex w-max snap-x gap-3 lg:mx-0">
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
                        className="group flex w-[56px] flex-col gap-2 pt-1"
                      >
                        <span className="block aspect-[3/4] w-full overflow-hidden bg-paper-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={g.previewUrl}
                            alt=""
                            loading="lazy"
                            className={cn(
                              "h-full w-full object-cover transition-opacity duration-500",
                              isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100",
                            )}
                          />
                        </span>
                        <span
                          aria-hidden
                          className={cn("h-px w-full transition-colors", isActive ? "bg-ink" : "bg-transparent")}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <div className={cn("mt-10", strip.length > 1 ? "" : "border-t border-line pt-7")}>
          {panel === "wallpaper" ? (
            <PhoneWallpaper key={active.generationId} generationId={active.generationId} petName={name || undefined} memorial={memorial} />
          ) : panel === "email" ? (
            <div className="text-left">
              <p className="text-[13px] leading-relaxed text-ink-2">
                We&apos;ll email you this preview so you can return to it.
              </p>
              <EmailCapture
                className="mt-2"
                source="save_preview"
                generationId={active.generationId}
                petName={name || undefined}
                memorial={memorial}
                cta="Send"
                doneMessage="Sent. Your preview is on its way."
                onDone={markPortraitSaved}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-10 lg:justify-start">
              <button type="button" onClick={() => setPanel("email")} className={cn(textLink, "text-ink-3")}>
                Email me this preview
              </button>
              <button type="button" onClick={() => setPanel("wallpaper")} className={cn(textLink, "text-ink-3")}>
                Get it as a free phone wallpaper
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Phones: the one call to action stays within reach below the campaign image. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <Button type="button" size="lg" onClick={onLoveIt} className="w-full">
          Choose your piece
        </Button>
        <p className="mt-2 text-center">
          <Link href="/guarantee" className="label inline-flex min-h-8 items-center text-ink-3">
            {GUARANTEE.short}
          </Link>
        </p>
      </div>
    </section>
  );
}
