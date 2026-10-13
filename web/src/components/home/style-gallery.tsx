import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLES, STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { Accent, HomeHeading } from "./typography";

/** Curated order for the home page (seasonal pick included); names/blurbs come from the catalog. */
const FEATURED: StyleSlug[] = ["royal", "watercolor", "admiral", "oil-classic", "holiday", "pop-art", "fine-line", "botanical"];

export function StyleGallery() {
  const featured = FEATURED.map((slug) => STYLE_MAP[slug]).filter(Boolean);

  return (
    <Section id="styles" aria-labelledby="styles-title" className="scroll-mt-16 overflow-hidden bg-paper">
      <Container>
        <div className={cn("flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", "ph-reveal")}>
          <HomeHeading
            id="styles-title"
            eyebrow="The styles"
            title={
              <>
                {STYLES.length} styles. <Accent>One</Accent> very good dog.
              </>
            }
            subtitle="A small, curated collection, each one tuned to look like your dog and nobody else's. Try them all on your own photo, free."
          />
          <Link
            href="/styles"
            className="hidden items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] transition hover:decoration-ink lg:inline-flex"
          >
            See all {STYLES.length} styles <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul
          className={cn(
            "-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-0 lg:pb-0",
            "ph-no-scrollbar",
          )}
          aria-label="Portrait styles"
        >
          {featured.map((s) => (
            <li key={s.slug} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
              <article className="group relative">
                <Link
                  href={`/styles/${s.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative block bg-white p-2 shadow-soft ring-1 ring-black/[0.04] transition-shadow duration-500 group-hover:shadow-frame"
                >
                  <div className="overflow-hidden">
                    <SampleImage
                      src={STYLE_SAMPLES[s.slug]}
                      alt=""
                      swatch={s.swatch}
                      label={s.name}
                      sizes="(max-width: 640px) 68vw, (max-width: 1024px) 40vw, 300px"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  {(s.popular || s.isNew) && (
                    <Badge tone={s.isNew ? "butter" : "paper"} className="absolute left-4 top-4 shadow-soft">
                      {s.isNew ? "New" : "Popular"}
                    </Badge>
                  )}
                </Link>
                <h3 className="mt-4 font-display text-[1.4rem] leading-tight">
                  <Link href={`/styles/${s.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
                    {s.name}
                  </Link>
                </h3>
                <p className="mt-1 text-[15px] leading-snug text-ink-2">{s.blurb}</p>
                <Link
                  href={`/create?style=${s.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark transition-colors hover:text-ink"
                >
                  Try it with your dog
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  <span className="sr-only">in {s.name}</span>
                </Link>
              </article>
            </li>
          ))}
          <li className="flex w-[68%] shrink-0 snap-start sm:w-[40%] lg:hidden">
            <Link
              href="/styles"
              className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-[2px] bg-paper-2 p-6 text-center ring-1 ring-line"
            >
              <span className="font-display text-2xl">See all {STYLES.length} styles</span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        </ul>

        <div className={cn("mt-12 flex flex-col items-center gap-3 text-center lg:mt-16", "ph-reveal")}>
          <ButtonLink href="/create" size="lg" className="group w-full sm:w-auto">
            Try every style on your dog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </ButtonLink>
          <p className="text-sm text-ink-3">Can&apos;t decide? You don&apos;t have to. Previews are free.</p>
        </div>
      </Container>
    </Section>
  );
}
