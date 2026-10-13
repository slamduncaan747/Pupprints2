import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Prose } from "@/components/marketing/blocks";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { STYLE_MAP } from "@/lib/catalog";
import { BREEDS_SORTED, breedSample, getBreed } from "@/content/breeds";
import { SampleImage } from "@/components/ui/sample-image";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Custom Dog Portraits by Breed",
  description: `Custom portraits of French Bulldogs, Labs, Goldens, Doodles, rescues and ${BREEDS_SORTED.length - 6} more breeds, with breed-specific photo tips and style picks. Preview yours free.`,
  path: "/breeds",
});

export default function BreedsIndexPage() {
  const mixed = getBreed("mixed-breed");
  // Only portraits that actually show the breed, so the picture never claims a breed it doesn't depict.
  const shown = BREEDS_SORTED.map((b) => ({ breed: b, sample: breedSample(b) }))
    .filter((x) => x.sample.breedSpecific)
    .slice(0, 3);

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

      <PageHero
        breadcrumbs={<ContentBreadcrumbs items={[{ name: "Breeds", path: "/breeds" }]} />}
        title="Every breed has its best angle"
        lede="Bat ears, beards, merle coats and mismatched eyes: the details that make your dog yours are the ones a portrait has to get right. Find your breed for photo tips and the styles we'd pick."
        media={
          shown.length > 0 && (
            <ul className="mx-auto grid max-w-[520px] grid-cols-3 gap-3 sm:gap-5">
              {shown.map(({ breed, sample }, i) => (
                <li key={breed.slug}>
                  <Link href={`/breeds/${breed.slug}`} className="group block">
                    <SampleImage
                      src={sample.src}
                      alt={sample.alt}
                      swatch={STYLE_MAP[sample.style].swatch}
                      priority={i === 0}
                      sizes="(max-width: 640px) 30vw, 170px"
                      className="transition-opacity duration-300 group-hover:opacity-90"
                    />
                    <p className="mt-3 text-[13px] leading-snug text-ink-3">{breed.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )
        }
      />

      <section aria-labelledby="all-breeds" className="pb-24 sm:pb-32">
        <Container>
          <h2 id="all-breeds" className="sr-only">
            All breeds
          </h2>
          <ul className="grid grid-cols-2 gap-x-5 border-t border-line sm:gap-x-8 lg:grid-cols-3">
            {BREEDS_SORTED.map((b) => (
              <li key={b.slug} className="border-b border-line">
                <Link
                  href={`/breeds/${b.slug}`}
                  className="block py-4 font-display text-[19px] leading-tight sm:text-[22px] hover:underline hover:decoration-ink/30 hover:decoration-1 hover:underline-offset-4"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-14 max-w-xl text-[14px] leading-relaxed text-ink-3">
            Breeds are listed in order of the American Kennel Club&rsquo;s 2025 popularity ranking, followed by Doodles and
            mixes, which the AKC doesn&rsquo;t rank.
          </p>
        </Container>
      </section>

      {mixed && (
        <Block title="Don't see your breed? Even better.">
          <Prose>
            <p>
              Portraits are made from your photo, not a breed template, so every one-of-a-kind ear, freckle and patch carries
              through. No breed label required:{" "}
              <Link href={`/breeds/${mixed.slug}`}>mixed breed &amp; rescue portraits</Link>.
            </p>
            <p>
              New to portraits? Start with{" "}
              <Link href="/journal/how-to-photograph-your-dog-for-a-portrait">how to photograph your dog for a portrait</Link>{" "}
              or <Link href="/journal/watercolor-vs-oil-vs-line-art">how to choose a style</Link>.
            </p>
          </Prose>
        </Block>
      )}

      <CtaBand />
    </>
  );
}
