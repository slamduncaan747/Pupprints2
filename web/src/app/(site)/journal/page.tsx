import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, textLink } from "@/components/marketing/blocks";
import { FramedArt } from "@/components/marketing/framed-art";
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
        breadcrumbs={<ContentBreadcrumbs items={[{ name: "Journal", path: "/journal" }]} />}
        title="Notes on dogs, art & giving"
        lede="Honest, practical guides: getting the photo, choosing a style, finding the right gift and hanging the result. No filler."
      />

      {featured && (
        <section aria-labelledby="featured-heading" className="pb-16 sm:pb-24">
          <Container>
            <article className="group relative grid items-center gap-10 border-t border-line pt-12 sm:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
              <FramedArt
                style={featured.heroStyle}
                priority
                sizes="(max-width: 1024px) 80vw, 420px"
                className="mx-auto w-full max-w-[420px]"
              />
              <div>
                <p className="text-[13px] text-ink-3">
                  Latest · {CATEGORIES[featured.category].label} ·{" "}
                  <time dateTime={featured.date}>{formatArticleDate(featured.date)}</time> · {featured.readingMinutes} min
                  read
                </p>
                <h2 id="featured-heading" className="mt-4 font-display text-[2.25rem] leading-[1.06] sm:text-5xl">
                  <Link
                    href={`/journal/${featured.slug}`}
                    className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-ink/30 group-hover:decoration-1 group-hover:underline-offset-[6px]"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-2">{featured.description}</p>
              </div>
            </article>
          </Container>
        </section>
      )}

      {groups.map((g) => (
        <Block key={g.id} id={g.id} title={g.label} intro={g.blurb} compact>
          <ul className="-mt-6 sm:-mt-8">
            {g.articles.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={summary(a)} />
              </li>
            ))}
          </ul>
        </Block>
      ))}

      <Block title="Portraits by breed" intro="Photo tips and style picks for your breed.">
        <p className="text-[16px] leading-[1.9] text-ink-2">
          {popularBreeds.map((b) => (
            <span key={b.slug}>
              <Link href={`/breeds/${b.slug}`} className={textLink}>
                {b.name}
              </Link>
              <span className="text-ink-3">{"\u00a0· "}</span>
            </span>
          ))}
          <Link href="/breeds/mixed-breed" className={textLink}>
            Mixed breed &amp; rescue
          </Link>
        </p>
        <p className="mt-6 text-[15px]">
          <Link href="/breeds" className={textLink}>
            All breeds
          </Link>
        </p>
      </Block>

      <CtaBand />
    </>
  );
}
