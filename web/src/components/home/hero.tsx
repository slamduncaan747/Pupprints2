import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER } from "@/lib/samples";

/** One sentence, one button, and the proof: a phone photo beside the portrait made from it. */
export function Hero() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];

  return (
    <section aria-labelledby="hero-title">
      <Container className="grid gap-12 pb-24 pt-10 sm:gap-16 sm:pb-32 sm:pt-20 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pt-24">
        <div className="lg:col-span-5 lg:pb-8">
          <h1
            id="hero-title"
            className="font-display text-[3.25rem] leading-[0.95] tracking-[-0.02em] sm:text-[5rem]"
          >
            Your dog,
            <br />
            as a work of&nbsp;art.
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-ink-2 sm:mt-8 sm:text-lg">
            See it free in a minute. <br className="sm:hidden" />
            Pay only if you love it.
          </p>
          <ButtonLink href="/create" size="lg" className="mt-8 w-full sm:mt-10 sm:w-auto">
            Create your portrait
          </ButtonLink>
        </div>

        <div className="grid grid-cols-[2fr_5fr] items-end gap-4 sm:gap-6 lg:col-span-7 lg:col-start-6 lg:gap-8">
          <figure>
            <SampleImage
              src={pair.before}
              alt={`The original photo: a ${pair.dog}`}
              swatch="#d9d6cf"
              sizes="(min-width: 1024px) 180px, 28vw"
            />
            <figcaption className="mt-3 text-[13px] text-ink-3">Photo</figcaption>
          </figure>
          <figure>
            <SampleImage
              src={pair.after}
              alt={`The same ${pair.dog} as a ${style.name} portrait`}
              swatch={style.swatch}
              sizes="(min-width: 1024px) 460px, 68vw"
              priority
            />
            <figcaption className="mt-3 text-[13px] text-ink-3">Portrait, {style.name}</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
