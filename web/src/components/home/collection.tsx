import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { availableStyles } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";

/**
 * The Collection as one quiet strip: a swipeable row on phones, two rows of six on desktop. Each
 * portrait opens the creator in that style, so choosing a style is the first step, not a detour.
 */
export function Collection() {
  // Styles that can be chosen now (a dated edition leaves on its last day; pages re-render hourly).
  const styles = availableStyles();
  return (
    <section id="collection" aria-labelledby="collection-title" className="scroll-mt-20 pb-24 sm:pb-36">
      <Container className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mb-12">
        <div>
          <h2 id="collection-title" className="font-display text-[34px] leading-[1.04] sm:text-[48px]">
            The Collection
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2 sm:text-[15px]">
            {styles.length} styles. Try every one with your own photo, free.
          </p>
        </div>
        <Link href="/styles" className="link-cta">
          View the collection
        </Link>
      </Container>

      <ul
        aria-label="Styles"
        className="flex snap-x snap-mandatory gap-[2px] overflow-x-auto px-0 [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {styles.map((style) => (
          <li key={style.slug} className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
            <Link
              href={`/create?style=${style.slug}`}
              aria-label={`${style.name}: create your free portrait in this style`}
              className="group block focus-visible:outline-offset-[-3px]"
            >
              <div className="overflow-hidden">
                <div className="motion-safe:transition-transform motion-safe:duration-[1600ms] motion-safe:ease-[cubic-bezier(0.2,0.6,0.2,1)] motion-safe:group-hover:scale-[1.04]">
                  <SampleImage
                    src={STYLE_SAMPLES[style.slug]}
                    alt={`Example ${style.name} portrait`}
                    swatch={style.swatch}
                    sizes="(min-width: 1024px) 17vw, (min-width: 640px) 30vw, 42vw"
                  />
                </div>
              </div>
              <p className="label px-3 pb-6 pt-3.5 sm:px-4 lg:pb-8">{style.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
