import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { GALLERY } from "@/lib/samples";
import { cn } from "@/lib/utils";

/**
 * Three portraits, edge to edge: warm, dark, pale. Drawn from the gallery set so they don't repeat
 * the style samples in The Collection below. The middle one is the single image on phones.
 */
const TRIPTYCH = ["/samples/gallery-1.webp", "/samples/gallery-4.webp", "/samples/gallery-6.webp"]
  .map((src) => GALLERY.find((g) => g.src === src))
  .filter((g) => g !== undefined);
const MOBILE_PANEL = 1;

/**
 * The campaign: a full-width triptych (no gutters), then the line beneath it on white,
 * set like a caption bar on desktop: label · headline · call to action.
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
                // On short desktop screens, trim the panels a little so the line and link stay in view.
                "md:aspect-auto md:h-[min(41.67vw,max(calc(100svh_-_15rem),32vw))]",
                i !== MOBILE_PANEL && "hidden md:block",
              )}
            />
          );
        })}
      </div>

      <Container className="flex flex-col items-center gap-5 pb-24 pt-9 text-center sm:pb-36 sm:pt-12 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-baseline lg:gap-10 lg:pt-10">
        <p className="label text-ink-2 lg:justify-self-start">The Portrait Collection</p>
        <h1
          id="hero-title"
          className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[64px] lg:text-[60px] xl:text-[68px]"
        >
          Your dog, <br className="sm:hidden" />
          immortalized.
        </h1>
        <Link href="/create" className="link-cta mt-2 lg:mt-0 lg:justify-self-end">
          Commission yours
        </Link>
      </Container>
    </section>
  );
}
