import Link from "next/link";
import type { ArtStyle } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { SampleImage } from "@/components/ui/sample-image";
import { cn } from "@/lib/utils";

/** Style tile for image grids: the sample portrait, the style name and its one-line blurb. */
export function StyleCard({
  style,
  priority,
  compact = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px",
  className,
}: {
  style: ArtStyle;
  priority?: boolean;
  /** Small image rows: name only. */
  compact?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/styles/${style.slug}`} className="block">
        <SampleImage
          src={STYLE_SAMPLES[style.slug]}
          alt={`Example ${style.name} dog portrait`}
          swatch={style.swatch}
          label={style.name}
          sizes={sizes}
          priority={priority}
          className="transition-opacity duration-300 group-hover:opacity-90"
        />
        <h3
          className={cn(
            "font-display leading-tight",
            compact ? "mt-3 text-[19px]" : "mt-4 text-[22px] sm:text-2xl",
          )}
        >
          {style.name}
        </h3>
        {!compact && <p className="mt-1 text-[14px] leading-snug text-ink-3">{style.blurb}</p>}
      </Link>
    </article>
  );
}
