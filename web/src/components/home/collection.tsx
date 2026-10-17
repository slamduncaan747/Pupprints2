import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Photo, PORTRAIT_SIZE } from "@/components/marketing/photo";
import { availableStyles, STYLE_MAP, styleAvailable, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";

/**
 * The six styles that open the collection on the home page: the quietest, most painterly of the
 * twelve. In layout order, two per column, so the two dark oils fall on a diagonal.
 */
const CURATED: StyleSlug[] = ["royal", "watercolor", "fine-line", "oil-classic", "charcoal", "botanical"];

/**
 * Three staggered columns of two looks each (desktop): within a column one look runs the full width
 * and one is set smaller to the side, alternating, and the columns start at different heights. The
 * columns end within a few lines of each other, so no row is left half empty. Phones: two columns.
 */
const COLUMNS: { offset: string; looks: ("large" | "small-left" | "small-right")[] }[] = [
  { offset: "", looks: ["large", "small-right"] },
  { offset: "lg:pt-32", looks: ["small-left", "large"] },
  { offset: "lg:pt-14", looks: ["large", "small-right"] },
];
const LOOK: Record<"large" | "small-left" | "small-right", string> = {
  large: "w-full",
  "small-left": "w-full lg:w-[70%]",
  "small-right": "w-full lg:ml-auto lg:w-[70%]",
};

/**
 * Six looks from the collection, not a wall of twelve. Each opens the creator in that style, so
 * choosing a style is the first step, not a detour; the full collection is one link away.
 */
export function Collection() {
  // Styles that can be chosen now (a dated edition leaves on its last day; pages re-render hourly).
  const count = availableStyles().length;
  const styles = CURATED.map((slug) => STYLE_MAP[slug]).filter((s) => styleAvailable(s));

  return (
    <section id="collection" aria-labelledby="collection-title" className="scroll-mt-20 py-24 sm:py-36">
      <Container>
        <div className="lg:grid lg:grid-cols-3 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-2">
            <p className="label text-ink-3">The Portrait Collection</p>
            <h2 id="collection-title" className="mt-6 font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[64px]">
              The Collection
            </h2>
          </div>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2 lg:mt-0 lg:pb-2">
            {count} styles, each made for one subject. Try every one with your own photo, free.
          </p>
        </div>

        {/* Phones: two columns, the second set lower. Desktop: three staggered columns. */}
        <div role="list" aria-label="Styles" className="mt-14 grid grid-cols-2 gap-x-3 sm:mt-20 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-10">
          {COLUMNS.map((column, c) => (
            <div key={c} role="presentation" className={cn("contents lg:flex lg:flex-col lg:gap-y-16", column.offset)}>
              {column.looks.map((look, j) => {
                const style = styles[c * 2 + j];
                if (!style) return null;
                return (
                  <div
                    key={style.slug}
                    role="listitem"
                    className={cn("min-w-0 pb-12 sm:pb-16 lg:pb-0", LOOK[look], (c * 2 + j) % 2 === 1 && "max-lg:pt-16")}
                  >
                    <Link
                      href={`/create?style=${style.slug}`}
                      aria-label={`${style.name}: create your free portrait in this style`}
                      className="group block"
                    >
                      <Photo
                        photo={{ src: STYLE_SAMPLES[style.slug], ...PORTRAIT_SIZE, alt: `Example ${style.name} portrait` }}
                        sizes={look === "large" ? "(min-width: 1440px) 430px, (min-width: 1024px) 30vw, 45vw" : "(min-width: 1440px) 300px, (min-width: 1024px) 21vw, 45vw"}
                        zoom
                      />
                      <p className="label mt-4 text-ink sm:mt-5">{style.name}</p>
                      <p className="mt-1.5 max-w-xs text-[13px] leading-snug text-ink-3">{style.blurb}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-8 sm:mt-20">
          <Link href="/styles" className="link-cta">
            View all {count} styles
          </Link>
        </div>
      </Container>
    </section>
  );
}
