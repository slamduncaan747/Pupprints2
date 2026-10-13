import Link from "next/link";
import type { ReactNode } from "react";
import type { ArtStyle } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { ZoomImage } from "@/components/marketing/campaign";
import { cn } from "@/lib/utils";

/**
 * Style tile for image grids, like a look in a fashion e-shop: the portrait, then the style name as
 * a `.label` beneath (with an optional look number), and a short grey line.
 */
export function StyleCard({
  style,
  priority,
  compact = false,
  index,
  note,
  bleed = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 480px",
  className,
}: {
  style: ArtStyle;
  priority?: boolean;
  /** Small image rows: name only. */
  compact?: boolean;
  /** Look number shown to the right of the name ("01"). */
  index?: number;
  /** Replaces the style's blurb under the name. */
  note?: ReactNode;
  /** The image runs edge to edge on phones, so inset the text a little. */
  bleed?: boolean;
  sizes?: string;
  className?: string;
}) {
  const line = note ?? (compact ? null : style.blurb);
  return (
    <article className={cn("group", className)}>
      <Link href={`/styles/${style.slug}`} className="block">
        <ZoomImage
          src={STYLE_SAMPLES[style.slug]}
          alt={`Example ${style.name} dog portrait`}
          swatch={style.swatch}
          label={style.name}
          sizes={sizes}
          priority={priority}
        />
        <div className={cn("mt-4 flex items-baseline justify-between gap-3", bleed && "px-3 sm:px-0")}>
          <h3 className="label text-ink">{style.name}</h3>
          {index !== undefined && (
            <span aria-hidden="true" className="label tabular-nums text-ink-3">
              {String(index).padStart(2, "0")}
            </span>
          )}
        </div>
        {line && <p className={cn("mt-1.5 text-[13px] leading-snug text-ink-3", bleed && "px-3 sm:px-0")}>{line}</p>}
      </Link>
    </article>
  );
}
