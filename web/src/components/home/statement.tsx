import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER } from "@/lib/samples";

/**
 * The second campaign moment: an asymmetric diptych. The finished portrait large on the left,
 * the photograph it was made from small and offset on the right, and one statement beneath it.
 */
export function Statement() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];

  return (
    <section aria-labelledby="statement-title" className="pb-24 sm:pb-36">
      <Container className="grid grid-cols-12 gap-x-3 sm:gap-x-6 lg:gap-x-0">
        <figure className="col-span-8 row-start-1 lg:col-span-6 lg:row-span-2">
          <SampleImage
            src={pair.after}
            alt={`${style.name} portrait of a ${pair.dog}, made from the photograph beside it`}
            swatch={style.swatch}
            sizes="(min-width: 1440px) 680px, (min-width: 1024px) 47vw, 64vw"
          />
          <figcaption className="label mt-3 text-ink-3 sm:mt-4">
            <span className="text-ink">Portrait</span>
            <span className="hidden sm:inline"> &mdash; {style.name}</span>
          </figcaption>
        </figure>

        <figure className="col-span-4 row-start-1 self-end lg:col-span-3 lg:col-start-8 lg:mt-[22%] lg:self-start">
          <SampleImage
            src={pair.before}
            alt={`The original photograph of the ${pair.dog}`}
            swatch="#d9d6cf"
            sizes="(min-width: 1440px) 340px, (min-width: 1024px) 24vw, 32vw"
          />
          <figcaption className="label mt-3 text-ink sm:mt-4">Photograph</figcaption>
        </figure>

        <div className="col-span-12 row-start-2 mt-14 sm:col-span-9 sm:mt-20 lg:col-span-4 lg:col-start-8 lg:mt-0 lg:self-end lg:pb-9">
          <h2 id="statement-title" className="font-display text-[28px] leading-[1.18] tracking-[-0.01em] sm:text-[36px]">
            From your photograph to a museum-grade portrait. See it in a minute, before you pay anything.
          </h2>
          <Link href="/create" className="link-cta mt-8 inline-block sm:mt-10">
            See yours, free
          </Link>
        </div>
      </Container>
    </section>
  );
}
