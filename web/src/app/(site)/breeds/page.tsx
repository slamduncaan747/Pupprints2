import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Prose } from "@/components/marketing/blocks";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { BREEDS_SORTED, getBreed } from "@/content/breeds";
import { BreedCard } from "@/components/content/breed-card";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Custom Dog Portraits by Breed",
  description: `Custom portraits of French Bulldogs, Labs, Goldens, Doodles, rescues and ${BREEDS_SORTED.length - 6} more breeds, with breed-specific photo tips and style picks. Preview yours free.`,
  path: "/breeds",
});

export default function BreedsIndexPage() {
  const mixed = getBreed("mixed-breed");

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
      />

      <section aria-labelledby="all-breeds" className="pb-24 sm:pb-32">
        <Container>
          <h2 id="all-breeds" className="sr-only">
            All breeds
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4">
            {BREEDS_SORTED.map((b, i) => (
              <li key={b.slug}>
                <BreedCard breed={b} priority={i < 4} />
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
