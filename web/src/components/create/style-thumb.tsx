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
        "p-[4px] shadow-[0_12px_24px_-16px_rgb(0_0_0/0.45)] outline-2 outline-offset-[5px] transition-[outline-color] duration-200 sm:p-[6px]",
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
