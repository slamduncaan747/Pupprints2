import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Photo, PORTRAIT_SIZE } from "@/components/marketing/photo";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER } from "@/lib/samples";

const STEPS = [
  { title: "The photo", body: "Any clear photo of your dog, straight from your phone." },
  { title: "The preview", body: "Your portrait in about a minute, free. Redo it as often as you like." },
  { title: "The piece", body: `A Gift Reveal the moment you order. At your door in ${PHYSICAL_SHIP_WINDOW}.` },
];

/**
 * Proof of likelihood, as the editorial centrepiece: a real phone photo and the portrait made from
 * it (an example from our studio, not a customer), side by side at the same size so the comparison
 * is honest, then the three steps. Phones: the photo, then the portrait edge to edge beneath it.
 */
export function Proof() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];

  return (
    <section aria-labelledby="proof-title" className="py-24 sm:py-36">
      <Container>
        <div className="max-w-3xl">
          <p className="label text-ink-3">An example from our studio</p>
          <h2
            id="proof-title"
            className="mt-6 font-display text-[36px] leading-[1.06] tracking-[-0.015em] sm:text-[52px] lg:text-[60px]"
          >
            One photo from your phone. Your portrait in a minute.
          </h2>
        </div>
      </Container>

      <Container className="mt-14 px-0 sm:mt-20 sm:px-10">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-6 lg:gap-x-10">
          <figure className="px-5 sm:px-0">
            <Photo
              photo={{ src: pair.before, ...PORTRAIT_SIZE, alt: `The original phone photograph of the ${pair.dog}` }}
              sizes="(min-width: 1440px) 660px, (min-width: 768px) 46vw, 70vw"
              className="w-[70%] md:w-full"
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
              sizes="(min-width: 1440px) 660px, (min-width: 768px) 46vw, 100vw"
            />
            <figcaption className="label mt-4 px-5 text-ink sm:px-0">
              The portrait <span className="text-ink-3">&mdash; {style.name}</span>
            </figcaption>
          </figure>
        </div>
      </Container>

      <Container className="mt-20 sm:mt-28">
        <ol className="grid border-t border-line md:grid-cols-3 md:gap-x-10">
          {STEPS.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-y-2 border-b border-line py-5 md:block md:border-b-0 md:pt-6">
              <span className="label tabular-nums text-ink-3" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="label text-ink md:mt-5">{step.title}</h3>
              <p className="col-start-2 text-[14px] leading-relaxed text-ink-2 md:mt-3 md:max-w-xs md:text-[15px]">{step.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/create" className="link-cta mt-10 inline-block sm:mt-14">
          See yours, free
        </Link>
      </Container>
    </section>
  );
}
