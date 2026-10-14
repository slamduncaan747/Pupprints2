import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER } from "@/lib/samples";

const STEPS = [
  { title: "The photo", body: "Any clear photo of your dog, straight from your phone." },
  { title: "The preview", body: "Your portrait in about a minute, free. Redo it as often as you like." },
  { title: "The piece", body: `A Gift Reveal the moment you order. At your door in ${PHYSICAL_SHIP_WINDOW}.` },
];

/**
 * Proof of likelihood: a real phone photo beside the portrait made from it (an example from our
 * studio, not a customer), then the three steps with how long each one takes.
 */
export function Proof() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];

  return (
    <section aria-labelledby="proof-title" className="pb-24 sm:pb-36">
      <Container className="grid grid-cols-12 gap-x-3 sm:gap-x-6 lg:gap-x-0">
        <figure className="col-span-8 row-start-1 lg:col-span-6 lg:row-span-2">
          <SampleImage
            src={pair.after}
            alt={`${style.name} portrait of a ${pair.dog}, made from the photograph beside it`}
            swatch={style.swatch}
            sizes="(min-width: 1440px) 680px, (min-width: 1024px) 47vw, 64vw"
          />
          <figcaption className="label mt-3 text-ink-3 sm:mt-4">
            <span className="text-ink">The portrait</span>
            <span className="hidden sm:inline"> &mdash; {style.name}</span>
          </figcaption>
        </figure>

        <figure className="col-span-4 row-start-1 self-end lg:col-span-3 lg:col-start-8 lg:mt-[12%] lg:self-start">
          <SampleImage
            src={pair.before}
            alt={`The original phone photograph of the ${pair.dog}`}
            swatch="#d9d6cf"
            sizes="(min-width: 1440px) 340px, (min-width: 1024px) 24vw, 32vw"
          />
          <figcaption className="label mt-3 text-ink sm:mt-4">The photo</figcaption>
        </figure>

        <div className="col-span-12 row-start-2 mt-14 sm:col-span-10 sm:mt-20 lg:col-span-4 lg:col-start-8 lg:mt-12 lg:self-end">
          <p className="label text-ink-3">An example from our studio</p>
          <h2
            id="proof-title"
            className="mt-5 font-display text-[30px] leading-[1.12] tracking-[-0.01em] sm:text-[40px]"
          >
            One photo from your phone. Your portrait in a minute.
          </h2>
          <ol className="mt-8 border-t border-line">
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
