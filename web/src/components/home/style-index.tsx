import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLES } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";

/** Every style as a quiet wall of portraits: image and name only. Each opens the creator in that style. */
export function StyleIndex() {
  return (
    <section id="styles" aria-labelledby="styles-title" className="scroll-mt-16 pb-24 sm:pb-32">
      <Container>
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-6">
          <h2 id="styles-title" className="font-display text-4xl sm:text-5xl">
            The styles
          </h2>
          <p className="text-[13px] text-ink-3">Choose one to begin</p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {STYLES.map((style) => (
            <li key={style.slug}>
              <Link
                href={`/create?style=${style.slug}`}
                aria-label={`Create your portrait in ${style.name}`}
                className="group block"
              >
                <SampleImage
                  src={STYLE_SAMPLES[style.slug]}
                  alt={`Example ${style.name} portrait`}
                  swatch={style.swatch}
                  sizes="(min-width: 1024px) 264px, (min-width: 640px) 30vw, 46vw"
                  className="transition-opacity duration-300 group-hover:opacity-85"
                />
                <p className="mt-3 text-[14px] text-ink underline-offset-4 group-hover:underline">{style.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
