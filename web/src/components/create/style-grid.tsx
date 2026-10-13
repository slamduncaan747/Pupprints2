"use client";

import { STYLES, type StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
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
  const link =
    "inline-flex min-h-11 items-center text-[13px] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink";

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-8 pb-24 sm:px-8 sm:pt-10">
      <h1 className="text-center font-display text-[2.6rem] leading-[1.02] sm:text-[3.5rem]">
        {name ? `How should we paint ${name}?` : "Pick a style."}
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-center text-[15px] leading-relaxed text-ink-2">
        Every preview is free. Try as many as you like.
      </p>

      <div className="mt-4 flex items-center justify-center gap-5">
        <span className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={upload.url} alt="Your photo" className="h-8 w-8 rounded-[2px] bg-paper-3 object-cover" />
          <button type="button" onClick={onChangePhoto} className={link}>
            Change photo
          </button>
        </span>
        {onBackToResult && (
          <button type="button" onClick={onBackToResult} className={link}>
            Back to my portrait
          </button>
        )}
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4">
        {STYLES.map((style) => {
          const made = latestByStyle.get(style.slug);
          const isHighlighted = highlighted === style.slug;
          return (
            <li key={style.slug}>
              <button
                type="button"
                onClick={() => onPick(style.slug)}
                aria-label={`${style.name}: ${style.blurb}${made ? " (already painted — view it)" : ""}`}
                className="group flex w-full flex-col text-left"
              >
                <StyleThumb
                  style={style}
                  src={made?.previewUrl}
                  className={cn(
                    "aspect-[4/5] w-full outline-offset-[5px] transition-[outline-color] duration-200",
                    isHighlighted ? "outline-1 outline-ink" : "outline-1 outline-transparent group-hover:outline-line",
                  )}
                />
                <span className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="text-[14px] text-ink">{style.name}</span>
                  {made && <span className="text-[12px] text-ink-3">Painted</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
