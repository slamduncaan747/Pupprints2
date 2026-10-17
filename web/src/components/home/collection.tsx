import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Photo, PORTRAIT_SIZE } from "@/components/marketing/photo";
import { availableStyles, STYLE_MAP, styleAvailable, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";

/** The six styles that open the collection on the home page: the quietest, most painterly of the twelve. */
const CURATED: StyleSlug[] = ["royal", "oil-classic", "watercolor", "charcoal", "botanical", "fine-line"];

/**
 * An editorial layout on a 12-column grid: a large look beside a small one set low, then the
 * reverse, then two staggered mediums. On phones: one full-width look, then pairs offset in height.
 */
const PLACEMENT: { item: string; sizes: string }[] = [
  { item: "col-span-2 lg:col-span-6", sizes: "(min-width: 1440px) 660px, (min-width: 1024px) 46vw, 90vw" },
  { item: "lg:col-span-4 lg:col-start-9 lg:self-end", sizes: "(min-width: 1440px) 430px, (min-width: 1024px) 30vw, 45vw" },
  { item: "mt-16 lg:col-span-4 lg:col-start-2 lg:mt-36 lg:self-start", sizes: "(min-width: 1440px) 430px, (min-width: 1024px) 30vw, 45vw" },
  { item: "col-span-2 lg:col-span-6 lg:col-start-7 lg:mt-56", sizes: "(min-width: 1440px) 660px, (min-width: 1024px) 46vw, 90vw" },
  { item: "lg:col-span-5 lg:mt-36", sizes: "(min-width: 1440px) 545px, (min-width: 1024px) 38vw, 45vw" },
  { item: "mt-16 lg:col-span-5 lg:col-start-8 lg:mt-72", sizes: "(min-width: 1440px) 545px, (min-width: 1024px) 38vw, 45vw" },
];

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
        <div className="max-w-xl">
          <p className="label text-ink-3">The Portrait Collection</p>
          <h2 id="collection-title" className="mt-6 font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[64px]">
            The Collection
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">
            {count} styles, each made for one subject. Try every one with your own photo, free.
          </p>
        </div>

        <ul aria-label="Styles" className="mt-16 grid grid-cols-2 gap-x-3 gap-y-14 sm:mt-24 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {styles.map((style, i) => {
            const place = PLACEMENT[i % PLACEMENT.length];
            return (
              <li key={style.slug} className={cn("min-w-0", place.item)}>
                <Link
                  href={`/create?style=${style.slug}`}
                  aria-label={`${style.name}: create your free portrait in this style`}
                  className="group block"
                >
                  <Photo
                    photo={{ src: STYLE_SAMPLES[style.slug], ...PORTRAIT_SIZE, alt: `Example ${style.name} portrait` }}
                    sizes={place.sizes}
                    zoom
                  />
                  <p className="label mt-4 text-ink sm:mt-5">{style.name}</p>
                  <p className="mt-1.5 max-w-xs text-[13px] leading-snug text-ink-3">{style.blurb}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-20 border-t border-line pt-8 sm:mt-28">
          <Link href="/styles" className="link-cta">
            View all {count} styles
          </Link>
        </div>
      </Container>
    </section>
  );
}
