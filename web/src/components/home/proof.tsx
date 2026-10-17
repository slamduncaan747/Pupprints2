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
 * is honest. Desktop: a spread, the pair on the left and the line and the three steps in a column
 * beside it. Phones: the line, the photo, the portrait edge to edge, then the steps.
 */
export function Proof() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];

  return (
    <section aria-labelledby="proof-title" className="py-24 sm:py-36">
      <Container className="grid grid-cols-1 px-0 sm:px-10 md:grid-cols-2 md:gap-x-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)] lg:grid-rows-[auto_1fr] xl:gap-x-8">
        <div className="px-5 sm:px-0 md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:pl-8 xl:pl-14">
          <p className="label text-ink-3">An example from our studio</p>
          <h2
            id="proof-title"
            className="mt-6 font-display text-[36px] leading-[1.06] tracking-[-0.015em] sm:text-[52px] lg:text-[40px] xl:text-[48px]"
          >
            One photo from your phone. Your portrait in a minute.
          </h2>
        </div>

        <figure className="mt-14 px-5 sm:mt-20 sm:px-0 md:col-start-1 md:row-start-2 lg:row-[1/3] lg:mt-0">
          <Photo
            photo={{ src: pair.before, ...PORTRAIT_SIZE, alt: `The original phone photograph of the ${pair.dog}` }}
            sizes="(min-width: 1440px) 480px, (min-width: 1024px) 34vw, (min-width: 768px) 46vw, 70vw"
            className="w-[70%] sm:w-[60%] md:w-full"
          />
          <figcaption className="label mt-4 text-ink">The photo</figcaption>
        </figure>

        <figure className="mt-12 md:col-start-2 md:row-start-2 md:mt-20 lg:row-[1/3] lg:mt-0">
          <Photo
            photo={{
              src: pair.after,
              ...PORTRAIT_SIZE,
              alt: `Example portrait in ${style.name} style of the same ${pair.dog}, made from the photograph`,
            }}
            sizes="(min-width: 1440px) 480px, (min-width: 1024px) 34vw, (min-width: 768px) 46vw, 100vw"
          />
          <figcaption className="label mt-4 px-5 text-ink sm:px-0">
            The portrait <span className="text-ink-3">&mdash; {style.name}</span>
          </figcaption>
        </figure>

        <div className="mt-16 px-5 sm:mt-24 sm:px-0 md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-2 lg:mt-12 lg:self-end lg:pb-9 lg:pl-8 xl:pl-14">
          <ol className="border-t border-line">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-y-1.5 border-b border-line py-4">
                <span className="label tabular-nums text-ink-3" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="label text-ink">{step.title}</h3>
                <p className="col-start-2 text-[14px] leading-relaxed text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/create" className="link-cta mt-8 inline-block">
            See yours, free
          </Link>
        </div>
      </Container>
    </section>
  );
}
