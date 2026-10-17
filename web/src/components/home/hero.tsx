import { getImageProps } from "next/image";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { OfferCta } from "@/components/marketing/offer";
import { STYLE_MAP } from "@/lib/catalog";
import { campaign } from "@/lib/campaign";
import { OFFER } from "@/lib/offer";
import { GALLERY } from "@/lib/samples";
import { BLEED_PAD_LEFT } from "@/components/marketing/page-hero";
import { cn } from "@/lib/utils";

/**
 * The campaign, then the offer in one breath: the dream outcome as the headline, free and fast in
 * the line beneath, one black button and the effort line.
 *
 * With the campaign photographs in place, one full-bleed scene: hero-wide from tablet up (the type
 * sits on the calm left of the wall from laptop up), hero-tall on phones (the headline on its calm
 * lower third, the button directly beneath so it stays above the fold). Until they land, the
 * three-portrait triptych.
 */
export function Hero() {
  const wide = campaign("heroWide");
  return wide.live ? <CampaignHero /> : <TriptychHero />;
}

function HeroTitle({ className }: { className?: string }) {
  return (
    <h1
      id="hero-title"
      className={cn("font-display text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[64px]", className)}
    >
      Your dog, <br className="sm:hidden" />
      immortalized.
    </h1>
  );
}

/** The scene's height from tablet up: the first screen, never cropped past the image's own 16:9. */
const SCENE_H = "md:h-[min(calc(100svh-7rem),56.25vw)] md:min-h-[400px]";

function CampaignHero() {
  const wide = campaign("heroWide");
  const tall = campaign("heroTall");
  const phone = tall.live ? tall : wide;

  // Art direction: the browser downloads exactly one of the two scenes.
  const {
    props: { srcSet: wideSet },
  } = getImageProps({ src: wide.src, width: wide.width, height: wide.height, alt: wide.alt, sizes: "100vw" });
  const {
    props: { srcSet: phoneSet, ...img },
  } = getImageProps({
    src: phone.src,
    width: phone.width,
    height: phone.height,
    alt: phone.alt,
    sizes: "100vw",
    loading: "eager",
  });

  return (
    // One grid cell holds the scene and the type laid over it. Laptop up: the type sits on the calm
    // left of the wall, centred by the two 1fr rows. Phones: the headline on the calm lower third of
    // the tall scene, the line and the button directly beneath it. Tablets: the type below the scene.
    <section aria-labelledby="hero-title" className="grid grid-cols-1 lg:grid-rows-[1fr_auto_auto_1fr]">
      <picture className="col-start-1 row-start-1 lg:row-[1/5]">
        <source media="(min-width: 768px)" srcSet={wideSet} sizes="100vw" />
        {/* getImageProps output: next/image's optimized srcset inside <picture> for art direction. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img
          {...img}
          srcSet={phoneSet}
          fetchPriority="high"
          className={cn(
            "block w-full bg-paper-2 object-cover md:aspect-auto",
            tall.live ? "aspect-[4/5]" : "aspect-[16/9]",
            SCENE_H,
          )}
        />
      </picture>

      <div
        className={cn(
          "relative col-start-1 px-5 text-center sm:px-10 lg:row-start-2 lg:text-left",
          tall.live ? "row-start-1 self-end pb-8 md:row-start-2 md:pb-0 md:pt-12" : "row-start-2 pt-8 sm:pt-12",
          BLEED_PAD_LEFT,
        )}
      >
        <div className="lg:max-w-[min(36vw,560px)]">
          <p className="label hidden text-ink-2 lg:block">The Portrait Collection</p>
          <HeroTitle className="lg:mt-6 lg:text-[56px] xl:text-[76px]" />
        </div>
      </div>

      <div
        className={cn(
          "relative col-start-1 px-5 text-center sm:px-10 lg:row-start-3 lg:text-left",
          tall.live ? "row-start-2 pt-6 md:row-start-3" : "row-start-3 pt-5",
          "sm:pt-6 lg:pt-7",
          BLEED_PAD_LEFT,
        )}
      >
        <div className="mx-auto max-w-md lg:mx-0 lg:max-w-[min(30vw,400px)]">
          <p className="text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">{OFFER.promise}</p>
          <OfferCta className="mt-6 sm:mt-8 lg:items-start lg:text-left" align="center" />
        </div>
      </div>
    </section>
  );
}

/**
 * Three portraits, edge to edge: warm, dark, pale. Drawn from the gallery set so they don't repeat
 * the style samples further down. The middle one is the single image on phones.
 */
const TRIPTYCH = ["/samples/gallery-1.webp", "/samples/gallery-4.webp", "/samples/gallery-6.webp"]
  .map((src) => GALLERY.find((g) => g.src === src))
  .filter((g) => g !== undefined);
const MOBILE_PANEL = 1;

function TriptychHero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {TRIPTYCH.map(({ src, style: slug, dog }, i) => {
          const style = STYLE_MAP[slug];
          return (
            <SampleImage
              key={src}
              src={src}
              alt={`Example ${style.name} portrait of a ${dog}`}
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

      <Container className="flex flex-col items-center pt-7 text-center sm:pt-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:pt-10 lg:text-left">
        <div className="lg:col-span-7">
          <p className="label hidden text-ink-3 sm:block">The Portrait Collection</p>
          <HeroTitle className="sm:mt-5 lg:text-[60px] xl:text-[72px]" />
        </div>
        <div className="mt-4 w-full max-w-md sm:mt-6 lg:col-span-5 lg:mt-0 lg:max-w-none lg:pb-1.5">
          <p className="text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">{OFFER.promise}</p>
          <OfferCta className="mt-6 lg:items-start lg:text-left" align="center" />
        </div>
      </Container>
    </section>
  );
}
