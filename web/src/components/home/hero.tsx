import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { OfferCta } from "@/components/marketing/offer";
import { STYLE_MAP } from "@/lib/catalog";
import { OFFER } from "@/lib/offer";
import { GALLERY } from "@/lib/samples";
import { cn } from "@/lib/utils";

/**
 * Three portraits, edge to edge: warm, dark, pale. Drawn from the gallery set so they don't repeat
 * the style samples further down. The middle one is the single image on phones.
 */
const TRIPTYCH = ["/samples/gallery-1.webp", "/samples/gallery-4.webp", "/samples/gallery-6.webp"]
  .map((src) => GALLERY.find((g) => g.src === src))
  .filter((g) => g !== undefined);
const MOBILE_PANEL = 1;

/**
 * The campaign, then the offer in one breath: the dream outcome as the headline, free and fast in the
 * line beneath, one black button and the effort line. On phones the image is cropped square so the
 * button sits above the fold.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {TRIPTYCH.map(({ src, style: slug, dog }, i) => {
          const style = STYLE_MAP[slug];
          return (
            <SampleImage
              key={src}
              src={src}
              alt={`${style.name} portrait of a ${dog}`}
              swatch={style.swatch}
              sizes="(min-width: 768px) 34vw, 100vw"
              priority={i === MOBILE_PANEL}
              className={cn(
                "aspect-square md:aspect-auto",
                // Leave room below for the line, the button and the effort line on desktop screens.
                "md:h-[min(41.67vw,max(calc(100svh_-_21rem),30vw))]",
                i !== MOBILE_PANEL && "hidden md:block",
              )}
            />
          );
        })}
      </div>

      <Container className="flex flex-col items-center pb-20 pt-7 text-center sm:pb-28 sm:pt-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:pb-24 lg:pt-10 lg:text-left">
        <div className="lg:col-span-7">
          <p className="label hidden text-ink-3 sm:block">The Portrait Collection</p>
          <h1
            id="hero-title"
            className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] sm:mt-5 sm:text-[64px] lg:text-[60px] xl:text-[72px]"
          >
            Your dog, <br className="sm:hidden" />
            immortalized.
          </h1>
        </div>
        <div className="mt-4 w-full max-w-md sm:mt-6 lg:col-span-5 lg:mt-0 lg:max-w-none lg:pb-1.5">
          <p className="text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">{OFFER.promise}</p>
          <OfferCta className="mt-6 lg:items-start lg:text-left" align="center" />
        </div>
      </Container>
    </section>
  );
}
