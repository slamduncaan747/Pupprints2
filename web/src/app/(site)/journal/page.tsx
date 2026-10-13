import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { ARTICLES, CATEGORIES, CATEGORY_ORDER } from "@/content/articles";
import { BREEDS_SORTED } from "@/content/breeds";
import type { Article } from "@/content/types";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { SampleOnWall } from "@/components/content/framed-sample";
import { JournalGrid } from "@/components/content/journal-grid";
import { formatArticleDate, type ArticleSummary } from "@/components/content/article-card";
import { JsonLd } from "@/components/content/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "The Journal: Dog Portrait Ideas, Gift Guides & Photo Tips",
  description:
    "Practical guides from Pup Prints: how to photograph your dog for a portrait, gift ideas for dog lovers, memorial ideas, choosing a style, and sizing and hanging art.",
  path: "/journal",
});

function summary(a: Article): ArticleSummary {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    categoryLabel: CATEGORIES[a.category].label,
    readingMinutes: a.readingMinutes,
    heroStyle: a.heroStyle,
    date: a.date,
  };
}

export default function JournalIndexPage() {
  const [featured, ...rest] = ARTICLES;
  const categories = CATEGORY_ORDER.map((id) => ({
    id,
    label: CATEGORIES[id].label,
    count: rest.filter((a) => a.category === id).length,
  })).filter((c) => c.count > 0);
  const popularBreeds = BREEDS_SORTED.slice(0, 10);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Journal", path: "/journal" }]),
          itemListJsonLd(
            ARTICLES.map((a) => ({ name: a.title, path: `/journal/${a.slug}` })),
            "The Pup Prints Journal",
          ),
        ]}
      />

      <section className="bg-paper">
        <Container className="pb-12 pt-8 sm:pb-16 sm:pt-10">
          <ContentBreadcrumbs items={[{ name: "Journal", path: "/journal" }]} />
          <div className="mt-10 max-w-3xl sm:mt-14">
            <Eyebrow className="mb-5">The Pup Prints Journal</Eyebrow>
            <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
              Notes on dogs, art &amp; giving
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl sm:leading-relaxed">
              Honest, practical guides: getting the photo, choosing a style, finding the right gift and hanging the
              result. No filler, no fake listicles.
            </p>
          </div>
        </Container>
      </section>

      {featured && (
        <section aria-labelledby="featured-heading" className="pb-16 sm:pb-20">
          <Container>
            <article className="group relative grid items-center gap-8 rounded-[2rem] bg-paper-2 p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-10">
              <SampleOnWall
                style={featured.heroStyle}
                priority
                sizes="(max-width: 1024px) 50vw, 22vw"
                className="aspect-[4/3] bg-paper-3/60"
                frameClassName="w-[38%] transition-transform duration-500 group-hover:-translate-y-1"
              />
              <div className="px-1 pb-2 sm:px-0">
                <Eyebrow>Latest · {CATEGORIES[featured.category].label}</Eyebrow>
                <h2 id="featured-heading" className="mt-4 font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
                  <Link href={`/journal/${featured.slug}`} className="after:absolute after:inset-0 hover:text-clay-dark">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{featured.description}</p>
                <p className="mt-5 text-sm text-ink-3">
                  <time dateTime={featured.date}>{formatArticleDate(featured.date)}</time> · {featured.readingMinutes} min read
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark">
                  Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </article>
          </Container>
        </section>
      )}

      <section aria-labelledby="all-articles" className="pb-20 sm:pb-28">
        <Container>
          <h2 id="all-articles" className="mb-6 font-display text-3xl sm:text-4xl">
            More from the journal
          </h2>
          <JournalGrid articles={rest.map(summary)} categories={categories} />
        </Container>
      </section>

      <section aria-labelledby="breeds-strip" className="border-t border-line bg-paper-2/60 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Eyebrow className="mb-3">Portraits by breed</Eyebrow>
              <h2 id="breeds-strip" className="font-display text-3xl leading-[1.08] sm:text-[2.4rem]">
                Photo tips and style picks for your breed
              </h2>
            </div>
            <Link
              href="/breeds"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
            >
              All breeds <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {popularBreeds.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/breeds/${b.slug}`}
                  className="inline-flex h-11 items-center rounded-full bg-paper px-5 text-[15px] text-ink ring-1 ring-line transition hover:ring-ink/30"
                >
                  {b.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/breeds/mixed-breed"
                className="inline-flex h-11 items-center rounded-full bg-paper px-5 text-[15px] text-ink ring-1 ring-line transition hover:ring-ink/30"
              >
                Mixed breed &amp; rescue
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
