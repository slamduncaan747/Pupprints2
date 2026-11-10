import { Container } from "@/components/ui/container";
import { Photo, PORTRAIT_SIZE } from "@/components/marketing/photo";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER } from "@/lib/samples";

/**
 * One example: a phone photo and the portrait made from it (ours, not a customer's), side by side at
 * the same size so the comparison is honest. The pictures do the talking.
 */
export function Proof() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];

  return (
    <section aria-labelledby="proof-title" className="py-24 sm:py-36">
      <Container>
        <h2 id="proof-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.015em] sm:text-[52px]">
          From one photo.
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-3 sm:mt-14 sm:gap-x-6 lg:max-w-[1000px]">
          <figure>
            <Photo
              photo={{ src: pair.before, ...PORTRAIT_SIZE, alt: `The original phone photograph of the ${pair.dog}` }}
              sizes="(min-width: 1024px) 490px, 46vw"
            />
            <figcaption className="label mt-4 text-ink">The photo</figcaption>
          </figure>
          <figure>
            <Photo
              photo={{
                src: pair.after,
                ...PORTRAIT_SIZE,
                alt: `Example portrait in ${style.name} style of the same ${pair.dog}, made from the photograph`,
              }}
              sizes="(min-width: 1024px) 490px, 46vw"
            />
            <figcaption className="label mt-4 text-ink">
              The portrait <span className="text-ink-3">&mdash; {style.name}</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
