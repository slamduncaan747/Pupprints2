import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArtStyle } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { FramedArt } from "@/components/marketing/framed-art";
import { GOOD_FOR_LABELS, styleContent } from "@/components/marketing/style-content";
import { cn } from "@/lib/utils";

/** Style tile: framed sample, name, blurb, occasions, and a direct "try it" link into /create. */
export function StyleCard({
  style,
  priority,
  showTags = true,
  className,
}: {
  style: ArtStyle;
  priority?: boolean;
  showTags?: boolean;
  className?: string;
}) {
  const content = styleContent(style);
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={`/styles/${style.slug}`}
        className="relative block rounded-2xl bg-paper-2 px-[13%] py-[12%] transition-colors duration-300 hover:bg-paper-3 sm:rounded-card"
      >
        <FramedArt
          style={style.slug}
          finish={content.frame}
          priority={priority}
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 22vw"
          className="transition-transform duration-500 group-hover:-translate-y-1"
        />
        {style.isNew && (
          <Badge tone="butter" className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4">
            New
          </Badge>
        )}
        <span className="sr-only">View the {style.name} style</span>
      </Link>
      <div className="mt-4 flex flex-1 flex-col sm:mt-5">
        <h3 className="font-display text-xl leading-tight sm:text-2xl">
          <Link href={`/styles/${style.slug}`} className="hover:text-clay-dark">
            {style.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-2 sm:mt-1.5 sm:text-[15px]">{style.blurb}</p>
        {showTags && (
          <ul className="mt-3 hidden flex-wrap gap-1.5 sm:flex" aria-label="Good for">
            {style.goodFor.map((g) => (
              <li key={g} className="rounded-full bg-paper-2 px-2.5 py-1 text-xs text-ink-2">
                {GOOD_FOR_LABELS[g]}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/create?style=${style.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-medium text-clay-dark underline-offset-4 hover:underline sm:mt-4 sm:text-[15px]"
        >
          Try with your dog <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
