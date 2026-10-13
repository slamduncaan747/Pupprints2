import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Prose } from "@/components/marketing/blocks";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { STYLE_MAP } from "@/lib/catalog";
import { BREEDS_SORTED, breedSample, getBreed } from "@/content/breeds";
import { ZoomImage } from "@/components/marketing/campaign";
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
    .slice(0, 4);

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
        align="center"
        breadcrumbs={<ContentBreadcrumbs items={[{ name: "Breeds", path: "/breeds" }]} />}
        title="Every breed has its best angle"
        lede="Bat ears, beards, merle coats, mismatched eyes: the details a portrait has to get right. Find your breed for photo tips and the styles we'd pick."
      />

      {shown.length > 0 && (
        <section aria-labelledby="lookbook-title">
          <h2 id="lookbook-title" className="sr-only">
            The lookbook
          </h2>
          <ul className="grid grid-cols-2 gap-x-0.5 gap-y-10 md:grid-cols-4">
            {shown.map(({ breed, sample }, i) => (
              <li key={breed.slug}>
                <Link href={`/breeds/${breed.slug}`} className="group block">
                  <ZoomImage
                    src={sample.src}
                    alt={sample.alt}
                    swatch={STYLE_MAP[sample.style].swatch}
                    priority={i < 2}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="mt-4 flex items-baseline justify-between gap-3 px-3 sm:px-5">
                    <p className="label text-ink">{breed.name}</p>
                    <p aria-hidden="true" className="label tabular-nums text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <p className="mt-1.5 px-3 text-[13px] text-ink-3 sm:px-5">{STYLE_MAP[sample.style].name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="all-breeds" className="py-24 sm:py-36">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            <div className="mb-12 lg:col-span-4 lg:mb-0">
              <p className="label text-ink-3">The index</p>
              <h2 id="all-breeds" className="mt-5 font-display text-[30px] leading-[1.06] sm:text-[40px]">
                All breeds
              </h2>
              <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-ink-3">
                Listed in order of the American Kennel Club&rsquo;s 2025 popularity ranking, followed by Doodles and mixes,
                which the AKC doesn&rsquo;t rank.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-x-5 border-t border-line sm:gap-x-10 lg:col-span-8 lg:grid-cols-3">
              {BREEDS_SORTED.map((b) => (
                <li key={b.slug} className="border-b border-line">
                  <Link href={`/breeds/${b.slug}`} className="label block py-4 text-ink transition-opacity hover:opacity-60">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {mixed && (
        <Block eyebrow="Mixed & rescue" title="Don't see your breed? Even better.">
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
