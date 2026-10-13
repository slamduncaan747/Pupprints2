"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtStyle } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Style card artwork: the customer's own preview if they've made one, otherwise the sample at
 * /samples/<slug>.webp, falling back to a swatch-gradient placeholder if the sample is missing.
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
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setFailedUrl(url)}
        />
      )}
    </div>
  );
}

function Placeholder({ style }: { style: ArtStyle }) {
  return (
    <div
      aria-hidden
      className="grain absolute inset-0 flex items-center justify-center"
      style={{
        background: `radial-gradient(120% 90% at 30% 15%, color-mix(in oklab, ${style.swatch} 55%, white) 0%, ${style.swatch} 55%, color-mix(in oklab, ${style.swatch} 70%, black) 100%)`,
      }}
    >
      <span className="font-display text-6xl font-light text-white/85 italic drop-shadow-sm">{style.name.replace(/^The /, "")[0]}</span>
      <span className="absolute inset-3 rounded-[10px] border border-white/25" />
    </div>
  );
}
