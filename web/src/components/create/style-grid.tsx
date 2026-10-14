"use client";

import { availableStyles, type ArtStyle, type StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { StyleThumb } from "./style-thumb";
import type { Generation, UploadInfo } from "./store";

/** Suggested first on the gentle track ("This portrait is in memory of my dog"), in this order. */
export const MEMORIAL_FIRST: StyleSlug[] = ["watercolor", "oil-classic", "charcoal", "botanical"];

/** Styles that can be chosen now; on the gentle track the four quietest styles lead. */
export function pickerStyles(memorial: boolean): ArtStyle[] {
  const styles = availableStyles();
  if (!memorial) return styles;
  const first = MEMORIAL_FIRST.map((slug) => styles.find((s) => s.slug === slug)).filter((s): s is ArtStyle => Boolean(s));
  return [...first, ...styles.filter((s) => !MEMORIAL_FIRST.includes(s.slug))];
}

export function StyleGrid({
  upload,
  petName,
  generations,
  highlighted,
  onPick,
  onChangePhoto,
  onBackToResult,
  memorial = false,
}: {
  upload: UploadInfo;
  petName: string;
  /** This upload's generations, newest first. */
  generations: Generation[];
  highlighted?: StyleSlug;
  onPick: (style: StyleSlug) => void;
  onChangePhoto: () => void;
  onBackToResult?: () => void;
  /** The gentle track: Watercolor, Old Master, Charcoal Study and Botanical first. */
  memorial?: boolean;
}) {
  const latestByStyle = new Map<StyleSlug, Generation>();
  for (const g of generations) if (!latestByStyle.has(g.style)) latestByStyle.set(g.style, g);
  const name = petName.trim();
  const link = "link-cta inline-flex min-h-11 items-center";

  return (
    <section className="mx-auto w-full max-w-[1440px] pt-8 pb-28 sm:px-10 sm:pt-14">
      <div className="px-5 text-center sm:px-0">
        <h1 className="font-display text-[44px] leading-[1.02] sm:text-[68px]">
          {name ? `A style for ${name}.` : "Choose a style."}
        </h1>
        <p className="mx-auto mt-5 max-w-[20rem] text-[14px] leading-relaxed text-balance text-ink-2 sm:max-w-md sm:text-[15px]">
          {memorial
            ? "Every preview is complimentary. We've placed the gentlest styles first; take all the time you need."
            : "Every preview is complimentary. Try as many as you like."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          <span className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upload.url} alt="Your photograph" className="h-10 w-8 bg-paper-2 object-cover" />
            <button type="button" onClick={onChangePhoto} className={link}>
              Change photograph
            </button>
          </span>
          {onBackToResult && (
            <button type="button" onClick={onBackToResult} className={link}>
              Return to your portrait
            </button>
          )}
        </div>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-x-px gap-y-10 sm:mt-16 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-14 lg:grid-cols-4">
        {pickerStyles(memorial).map((style) => {
          const made = latestByStyle.get(style.slug);
          const isHighlighted = highlighted === style.slug;
          return (
            <li key={style.slug}>
              <button
                type="button"
                onClick={() => onPick(style.slug)}
                aria-label={`${style.name}: ${style.blurb}${made ? " (already composed — view it)" : ""}`}
                aria-current={isHighlighted ? "true" : undefined}
                className="group flex w-full flex-col text-left focus-visible:outline-offset-4"
              >
                <StyleThumb style={style} src={made?.previewUrl} className="aspect-[3/4] w-full" />
                <span className="mt-3.5 flex flex-col gap-1.5 px-3 sm:px-0">
                  <span
                    className={cn(
                      "label text-ink underline-offset-[6px] transition-[text-decoration-color]",
                      isHighlighted ? "underline decoration-ink" : "underline decoration-transparent group-hover:decoration-ink",
                    )}
                  >
                    {style.name}
                  </span>
                  {made ? (
                    <span className="label text-ink-3">Composed</span>
                  ) : memorial && MEMORIAL_FIRST.includes(style.slug) ? (
                    <span className="label text-ink-3">Suggested</span>
                  ) : style.edition && !memorial ? (
                    <span className="text-[12px] leading-snug text-ink-3">{style.edition}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
