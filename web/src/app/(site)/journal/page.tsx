import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Block } from "@/components/marketing/blocks";
import { CampaignImage } from "@/components/marketing/campaign";
import { BLEED_PAD_RIGHT } from "@/components/marketing/page-hero";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { ARTICLES, CATEGORIES, CATEGORY_ORDER } from "@/content/articles";
import { BREEDS_SORTED } from "@/content/breeds";
import type { Article } from "@/content/types";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { ArticleCard, formatArticleDate, type ArticleSummary } from "@/components/content/article-card";
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
  const groups = CATEGORY_ORDER.map((id) => ({
    id,
    label: CATEGORIES[id].label,
    blurb: CATEGORIES[id].blurb,
    articles: rest.filter((a) => a.category === id),
  })).filter((g) => g.articles.length > 0);
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

      <PageHero
        align="center"
        breadcrumbs={<ContentBreadcrumbs items={[{ name: "Journal", path: "/journal" }]} />}
        title="The Journal"
        lede="Notes on dogs, art and giving: the photo, the style, the gift and the wall. No filler."
      >
        <nav aria-label="Journal sections">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="label text-ink-2 underline-offset-[6px] transition-colors hover:text-ink hover:underline">
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {featured && (
        <section aria-labelledby="featured-heading" className="border-t border-line md:border-t-0">
          <article className="group relative md:grid md:grid-cols-12 md:items-center">
            <div className="overflow-hidden md:col-span-7">
              <CampaignImage
                src={STYLE_SAMPLES[featured.heroStyle]}
                alt={`Example ${STYLE_MAP[featured.heroStyle].name} dog portrait`}
                swatch={STYLE_MAP[featured.heroStyle].swatch}
                priority
                sizes="(max-width: 768px) 100vw, 58vw"
                className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              />
            </div>
            <div className={`px-5 pb-20 pt-10 sm:px-10 md:col-span-5 md:py-20 md:pl-14 xl:pl-20 ${BLEED_PAD_RIGHT}`}>
              <p className="label text-ink-3">
                The latest <span aria-hidden="true">·</span> {CATEGORIES[featured.category].label}
              </p>
              <h2
                id="featured-heading"
                className="mt-6 font-display text-[38px] leading-[1.04] tracking-[-0.02em] sm:text-[52px] xl:text-[60px]"
              >
                <Link href={`/journal/${featured.slug}`} className="after:absolute after:inset-0">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-2">{featured.description}</p>
              <p className="label mt-6 text-ink-3">
                <time dateTime={featured.date}>{formatArticleDate(featured.date)}</time>
                <span aria-hidden="true"> · </span>
                {featured.readingMinutes} min read
              </p>
              <span className="link-cta mt-10 inline-block text-ink">Read the story</span>
            </div>
          </article>
        </section>
      )}

      {groups.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-24">
          <Container>
            <div className="border-t border-line pb-16 pt-8 sm:pb-24 sm:pt-10 lg:grid lg:grid-cols-12 lg:gap-x-10">
              <header className="mb-4 lg:col-span-4 lg:mb-0">
                <h2 id={`${g.id}-title`} className="font-display text-[30px] leading-[1.06] sm:text-[40px]">
                  {g.label}
                </h2>
                <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-3">{g.blurb}</p>
              </header>
              <ul className="lg:col-span-8 lg:-mt-9">
                {g.articles.map((a, i) => (
                  <li key={a.slug}>
                    <ArticleCard article={summary(a)} layout="row" className={i === g.articles.length - 1 ? "border-b-0 pb-0 sm:pb-0" : undefined} />
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ))}

      <Block eyebrow="The breeds" title="Portraits by breed" intro="Photo tips and style picks for your breed.">
        <ul className="flex flex-wrap gap-x-7 gap-y-4">
          {popularBreeds.map((b) => (
            <li key={b.slug}>
              <Link href={`/breeds/${b.slug}`} className="label text-ink transition-opacity hover:opacity-60">
                {b.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/breeds/mixed-breed" className="label text-ink transition-opacity hover:opacity-60">
              Mixed breed &amp; rescue
            </Link>
          </li>
        </ul>
        <p className="mt-10">
          <Link href="/breeds" className="link-cta">
            All breeds
          </Link>
        </p>
      </Block>

      <CtaBand />
    </>
  );
}
