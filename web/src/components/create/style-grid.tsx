"use client";

import { ArrowLeft, CircleCheck } from "lucide-react";
import { STYLES, type StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eyebrow } from "@/components/ui/container";
import { StyleThumb } from "./style-thumb";
import type { Generation, UploadInfo } from "./store";

export function StyleGrid({
  upload,
  petName,
  generations,
  highlighted,
  onPick,
  onChangePhoto,
  onBackToResult,
}: {
  upload: UploadInfo;
  petName: string;
  /** This upload's generations, newest first. */
  generations: Generation[];
  highlighted?: StyleSlug;
  onPick: (style: StyleSlug) => void;
  onChangePhoto: () => void;
  onBackToResult?: () => void;
}) {
  const latestByStyle = new Map<StyleSlug, Generation>();
  for (const g of generations) if (!latestByStyle.has(g.style)) latestByStyle.set(g.style, g);
  const name = petName.trim();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-8 sm:pt-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow className="hidden sm:block">Step 2 of 3 · Style</Eyebrow>
          <h1 className="font-display text-[2.15rem] leading-[1.05] sm:mt-3 sm:text-5xl">
            {name ? `How should we paint ${name}?` : "Pick a style."}
          </h1>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink-2">
            Tap a style to see the portrait free in about a minute. Try as many as you like.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-full bg-white p-1.5 pr-2 shadow-soft ring-1 ring-line sm:self-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={upload.url} alt="Your photo" className="h-11 w-11 rounded-full object-cover" />
          <span className="text-[13px] leading-tight">
            <span className="block font-medium text-ink">{name || "Your photo"}</span>
            <button
              type="button"
              onClick={onChangePhoto}
              className="min-h-6 text-ink-2 underline decoration-ink/25 underline-offset-2 hover:text-ink"
            >
              Change photo
            </button>
          </span>
        </div>
      </div>

      {onBackToResult && (
        <button
          type="button"
          onClick={onBackToResult}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full px-1 text-[14px] font-medium text-ink-2 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to my portrait
        </button>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {STYLES.map((style) => {
          const made = latestByStyle.get(style.slug);
          const isHighlighted = highlighted === style.slug;
          return (
            <li key={style.slug}>
              <button
                type="button"
                onClick={() => onPick(style.slug)}
                aria-label={`${style.name}: ${style.blurb}${made ? " (already painted — view it)" : ""}`}
                className={cn(
                  "group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-frame active:scale-[0.99]",
                  isHighlighted ? "ring-2 ring-clay" : "ring-line",
                )}
              >
                <div className="relative">
                  <StyleThumb style={style} src={made?.previewUrl} className="aspect-[4/5] w-full" />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {made ? (
                      <Badge tone="paper" className="bg-white/95 text-moss ring-0 shadow-sm">
                        <CircleCheck className="h-3 w-3" aria-hidden /> Painted
                      </Badge>
                    ) : style.popular ? (
                      <Badge tone="paper" className="bg-white/95 ring-0 shadow-sm">
                        Popular
                      </Badge>
                    ) : style.isNew ? (
                      <Badge tone="butter" className="shadow-sm">
                        New
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: style.swatch }} />
                    <span className="font-display text-[17px] leading-tight sm:text-lg">{style.name}</span>
                  </span>
                  <span className="text-[13px] leading-snug text-ink-2">{style.blurb}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
