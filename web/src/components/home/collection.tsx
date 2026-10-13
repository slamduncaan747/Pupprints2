import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLES } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";

/**
 * The Collection, set like a fashion e-shop: edge-to-edge portraits with hairline gutters,
 * the name beneath in small capitals. Each opens the creator in that style.
 */
export function Collection() {
  return (
    <section id="collection" aria-labelledby="collection-title" className="scroll-mt-20 pb-16 sm:pb-24">
      <Container className="mb-8 flex items-baseline justify-between gap-6 sm:mb-12">
        <h2 id="collection-title" className="font-display text-[34px] sm:text-[48px]">
          The Collection
        </h2>
        <Link href="/styles" className="label text-ink-3 transition-colors hover:text-ink">
          {STYLES.length} styles
        </Link>
      </Container>

      <ul className="grid grid-cols-2 gap-x-[2px] lg:grid-cols-4">
        {STYLES.map((style) => (
          <li key={style.slug}>
            <Link
              href={`/create?style=${style.slug}`}
              aria-label={`${style.name}: commission your portrait in this style`}
              className="group block focus-visible:outline-offset-[-3px]"
            >
              <div className="overflow-hidden">
                <div className="motion-safe:transition-transform motion-safe:duration-[1600ms] motion-safe:ease-[cubic-bezier(0.2,0.6,0.2,1)] motion-safe:group-hover:scale-[1.04]">
                  <SampleImage
                    src={STYLE_SAMPLES[style.slug]}
                    alt={`Example ${style.name} portrait`}
                    swatch={style.swatch}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </div>
              </div>
              <p className="label px-3 pb-9 pt-3.5 sm:px-4 sm:pb-12 sm:pt-4">{style.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
