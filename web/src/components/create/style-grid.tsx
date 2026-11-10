"use client";

import { availableStyles, type StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { NameOption } from "./name-option";
import { StyleThumb } from "./style-thumb";
import type { Generation, UploadInfo } from "./store";

export function StyleGrid({
  upload,
  petName,
  nameOnArt,
  generations,
  highlighted,
  onPick,
  onChangePhoto,
  onBackToResult,
}: {
  upload: UploadInfo;
  petName: string;
  /** "Add the name to the portrait" (shown only when a name was given). */
  nameOnArt: boolean;
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
  const link = "link-cta inline-flex min-h-11 items-center";

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 pt-8 pb-28 sm:px-10 sm:pt-14">
      <div className="text-center">
        <h1 className="font-display text-[44px] leading-[1.02] sm:text-[68px]">
          {name ? `A style for ${name}.` : "Choose a style."}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          <span className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upload.url} alt="Your photo" className="h-10 w-8 bg-paper-2 object-cover" />
            <button type="button" onClick={onChangePhoto} className={link}>
              Change photo
            </button>
          </span>
          {onBackToResult && (
            <button type="button" onClick={onBackToResult} className={link}>
              Back to your portrait
            </button>
          )}
        </div>
        {name && (
          <div className="mt-2">
            <NameOption checked={nameOnArt} name={name} />
          </div>
        )}
      </div>

      {/* Two framed previews per row on a phone, each as wide as the screen allows. */}
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:mt-14 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4">
        {availableStyles().map((style) => {
          const made = latestByStyle.get(style.slug);
          const isHighlighted = highlighted === style.slug;
          return (
            <li key={style.slug}>
              <button
                type="button"
                onClick={() => onPick(style.slug)}
                aria-label={`${style.name}: ${style.blurb}${made ? " Already made: view it." : ""}`}
                aria-current={isHighlighted ? "true" : undefined}
                className="group flex h-full w-full flex-col text-left focus-visible:outline-offset-[6px]"
              >
                <StyleThumb
                  style={style}
                  src={made?.previewUrl}
                  selected={isHighlighted}
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 46vw"
                  className="w-full transition-opacity duration-300 group-hover:opacity-85 motion-reduce:transition-none"
                />
                <span className="mt-4 flex flex-col gap-1.5">
                  <span
                    className={cn(
                      "label text-ink underline-offset-[6px] transition-[text-decoration-color]",
                      isHighlighted ? "underline decoration-ink" : "underline decoration-transparent group-hover:decoration-ink",
                    )}
                  >
                    {style.name}
                  </span>
                  {made ? (
                    <span className="label text-ink-3">Made</span>
                  ) : style.edition ? (
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
