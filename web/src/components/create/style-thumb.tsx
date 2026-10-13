"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtStyle } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Style card artwork: the customer's own preview if they've made one, otherwise the sample at
 * /samples/<slug>.webp, falling back to a quiet neutral placeholder if the sample is missing.
 */
export function StyleThumb({
  style,
  src,
  sizes = "(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw",
  className,
}: {
  style: ArtStyle;
  src?: string;
  sizes?: string;
  className?: string;
}) {
  const url = src ?? `/samples/${style.slug}.webp`;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = failedUrl === url;

  return (
    <div className={cn("relative overflow-hidden bg-paper-3", className)}>
      {failed ? (
        <Placeholder style={style} />
      ) : (
        <Image
          src={url}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          onError={() => setFailedUrl(url)}
        />
      )}
    </div>
  );
}

function Placeholder({ style }: { style: ArtStyle }) {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-paper-3">
      <span className="font-display text-5xl text-ink-3">{style.name.replace(/^The /, "")[0]}</span>
    </div>
  );
}
