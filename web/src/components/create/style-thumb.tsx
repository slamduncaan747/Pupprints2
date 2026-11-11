"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtStyle } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Thin natural-oak frame and a narrow off-white mat, so every style is compared as it would hang. */
const FRAME = { oak: "#c4a582", mat: "#fdfcf9" };

/**
 * Style card artwork in a portrait frame: the customer's own preview if they've made one,
 * otherwise the sample at /samples/<slug>.webp, falling back to a plain placeholder if the sample
 * is missing. The frame is square-cornered and hangs straight; the picture inside is 4:5.
 */
export function StyleThumb({
  style,
  src,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  selected = false,
  className,
}: {
  style: ArtStyle;
  src?: string;
  sizes?: string;
  /** Draws a clear ink outline around the frame. */
  selected?: boolean;
  className?: string;
}) {
  const url = src ?? `/samples/${style.slug}.webp`;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = failedUrl === url;

  return (
    <div
      className={cn(
        "relative p-[4px] shadow-[0_12px_24px_-16px_rgb(0_0_0/0.45)] outline-2 outline-offset-[5px] transition-[outline-color] duration-200 sm:p-[6px]",
        selected ? "outline-ink" : "outline-transparent",
        className,
      )}
      style={{ background: FRAME.oak }}
    >
      <div className="p-[5%] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.14)]" style={{ background: FRAME.mat }}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2 shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
          {failed ? (
            <Placeholder style={style} />
          ) : (
            <Image
              src={url}
              alt=""
              fill
              sizes={sizes}
              className="object-cover"
              onError={() => setFailedUrl(url)}
            />
          )}
        </div>
      </div>
      {/* The photo the example was made from, so the before and after read together. */}
      {!src && !failed && <SourcePhoto slug={style.slug} />}
    </div>
  );
}

/** Small inset of the photo a style's example portrait was made from (/samples/<slug>-photo.webp). */
export function SourcePhoto({ slug, className }: { slug: string; className?: string }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div
      className={cn(
        "absolute -bottom-2 -left-2 w-[34%] border-[3px] border-paper bg-paper shadow-[0_6px_14px_-6px_rgb(0_0_0/0.5)]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={`/samples/${slug}-photo.webp`}
          alt="The photo this example was made from"
          fill
          sizes="120px"
          className="object-cover"
          onError={() => setHidden(true)}
        />
      </div>
    </div>
  );
}

function Placeholder({ style }: { style: ArtStyle }) {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-paper-2">
      <span className="font-display text-[56px] text-ink-3">{style.name[0]}</span>
    </div>
  );
}
