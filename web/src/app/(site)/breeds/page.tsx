import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PROMISES } from "@/lib/catalog";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { BREEDS_SORTED, breedSample, getBreed } from "@/content/breeds";
import type { Breed } from "@/content/types";
import { BreedCard } from "@/components/content/breed-card";
import { FramedSample } from "@/components/content/framed-sample";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Custom Dog Portraits by Breed",
  description: `Custom portraits of French Bulldogs, Labs, Goldens, Doodles, rescues and ${BREEDS_SORTED.length - 6} more breeds, with breed-specific photo tips and style picks. Preview yours free.`,
  path: "/breeds",
});

export default function BreedsIndexPage() {
  const mixed = getBreed("mixed-breed");
  const collage = ["golden-retriever", "french-bulldog", "dachshund"]
    .map((s) => getBreed(s))
    .filter((b): b is Breed => Boolean(b))
    .map((b) => breedSample(b));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Breeds", path: "/breeds" }]),
          itemListJsonLd(
            BREEDS_SORTED.map((b) => ({ name: `Custom ${b.name} Portraits`, path: `/breeds/${b.slug}` })),
            "Custom dog portraits by breed",
          ),
        ]}
      />

      <section className="bg-paper">
        <Container className="pb-12 pt-8 sm:pb-16 sm:pt-10">
          <ContentBreadcrumbs items={[{ name: "Breeds", path: "/breeds" }]} />
          <div className="mt-10 grid items-center gap-12 sm:mt-14 lg:grid-cols-[1.25fr_1fr]">
            <div className="max-w-3xl">
              <Eyebrow className="mb-5">Portraits by breed</Eyebrow>
              <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
                Every breed has its best angle
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl sm:leading-relaxed">
                Bat ears, beards, merle coats and mismatched eyes: the details that make your dog yours are the ones a
                portrait has to get right. Find your breed for photo tips and the styles we&rsquo;d pick, then see your
                own dog free.
              </p>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-2">
                {[PROMISES.preview, PROMISES.shipping, PROMISES.guarantee].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-clay" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div aria-hidden="true" className="relative hidden h-[420px] lg:block">
              {collage[0] && (
                <FramedSample
                  style={collage[0].style}
                  src={collage[0].src}
                  alt=""
                  priority
                  sizes="16vw"
                  className="absolute left-[30%] top-0 w-[40%] rotate-1"
                />
              )}
              {collage[1] && (
                <FramedSample
                  style={collage[1].style}
                  src={collage[1].src}
                  alt=""
                  sizes="12vw"
                  className="absolute bottom-2 left-[2%] w-[30%] -rotate-3"
                />
              )}
              {collage[2] && (
                <FramedSample
                  style={collage[2].style}
                  src={collage[2].src}
                  alt=""
                  sizes="12vw"
                  className="absolute bottom-8 right-[2%] w-[28%] rotate-3"
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="all-breeds" className="pb-20 sm:pb-28">
        <Container>
          <h2 id="all-breeds" className="sr-only">
            All breeds
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
            {BREEDS_SORTED.map((b, i) => (
              <li key={b.slug}>
                <BreedCard breed={b} priority={i < 4} />
              </li>
            ))}
          </ul>

          {mixed && (
            <div className="mt-16 grid items-center gap-8 rounded-[2rem] bg-sage-soft px-6 py-10 sm:mt-20 sm:px-12 sm:py-14 md:grid-cols-[1.4fr_1fr]">
              <div>
                <Eyebrow className="mb-4 text-moss">Rescues &amp; mixed breeds</Eyebrow>
                <h2 className="font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
                  Don&rsquo;t see your breed? Even better.
                </h2>
                <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">
                  Portraits are made from your photo, not a breed template, so every one-of-a-kind ear, freckle and
                  patch carries through. No breed label required.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href={`/breeds/${mixed.slug}`} variant="primary">
                    Mixed breed &amp; rescue portraits <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink href="/create" variant="secondary">
                    Start with your photo
                  </ButtonLink>
                </div>
              </div>
              <div aria-hidden="true" className="relative mx-auto hidden h-56 w-full max-w-xs md:block">
                <FramedSample
                  style="oil-classic"
                  sizes="10vw"
                  showLabel={false}
                  className="absolute left-[8%] top-4 w-[38%] -rotate-3"
                />
                <FramedSample
                  style="pop-art"
                  sizes="10vw"
                  showLabel={false}
                  className="absolute right-[8%] top-0 w-[38%] rotate-2"
                />
                <FramedSample
                  style="watercolor"
                  sizes="10vw"
                  showLabel={false}
                  className="absolute bottom-0 left-[31%] w-[38%]"
                />
              </div>
            </div>
          )}

          <p className="mt-14 max-w-2xl text-[15px] leading-relaxed text-ink-3">
            Breeds are listed in order of the American Kennel Club&rsquo;s 2025 popularity ranking, followed by Doodles
            and mixes, which the AKC doesn&rsquo;t rank. New to portraits? Start with{" "}
            <Link
              href="/journal/how-to-photograph-your-dog-for-a-portrait"
              className="font-medium text-ink underline decoration-clay/45 underline-offset-[3px] hover:decoration-clay"
            >
              how to photograph your dog for a portrait
            </Link>{" "}
            or{" "}
            <Link
              href="/journal/watercolor-vs-oil-vs-line-art"
              className="font-medium text-ink underline decoration-clay/45 underline-offset-[3px] hover:decoration-clay"
            >
              how to choose a style
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBand title="See your dog as a work of art" />
    </>
  );
}
