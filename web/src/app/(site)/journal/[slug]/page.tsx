import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PROMISES, STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ARTICLES, CATEGORIES, articleStyles, getArticle, relatedArticles, tableOfContents } from "@/content/articles";
import { publicAssetExists } from "@/content/assets";
import type { Article } from "@/content/types";
import { ArticleBody } from "@/components/content/article-body";
import { ArticleCard, formatArticleDate, type ArticleSummary } from "@/components/content/article-card";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { FramedSample } from "@/components/content/framed-sample";
import { JsonLd } from "@/components/content/json-ld";
import { TocDisclosure, TocSidebar } from "@/components/content/toc";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

function heroImage(a: Article) {
  const src = STYLE_SAMPLES[a.heroStyle];
  return publicAssetExists(src) ? src : undefined;
}

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

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.metaTitle ?? article.title,
    description: article.description,
    path: `/journal/${article.slug}`,
    type: "article",
    publishedTime: article.date,
    modifiedTime: article.updated,
    section: CATEGORIES[article.category].label,
    tags: article.keywords,
    image: heroImage(article),
    imageAlt: `Example ${STYLE_MAP[article.heroStyle].name} dog portrait`,
  });
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/journal/${article.slug}`;
  const category = CATEGORIES[article.category];
  const toc = tableOfContents(article);
  const showToc = toc.length >= 4;
  const related = relatedArticles(article, 3);
  const [, left, right] = articleStyles(article, 3);
  const crumbs = [
    { name: "Journal", path: "/journal" },
    { name: article.title, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd({
            title: article.title,
            description: article.description,
            path,
            datePublished: article.date,
            dateModified: article.updated,
            image: heroImage(article),
            section: category.label,
            wordCount: article.wordCount,
            keywords: article.keywords,
          }),
        ]}
      />

      <article>
        <header className="bg-paper">
          <Container className="pt-8 sm:pt-10">
            <ContentBreadcrumbs items={crumbs} />
            <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
              <Eyebrow>{category.label}</Eyebrow>
              <h1 className="mt-5 font-display text-[2.3rem] leading-[1.05] sm:text-[3.4rem] lg:text-[3.9rem]">
                {article.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl sm:leading-relaxed">
                {article.description}
              </p>
              <p className="mt-6 text-sm text-ink-3">
                By the Pup Prints team · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> ·{" "}
                {article.readingMinutes} min read
              </p>
            </div>
            <div
              aria-hidden="true"
              className="relative mx-auto mt-10 flex aspect-[4/3] max-w-5xl items-center justify-center gap-[5%] overflow-hidden rounded-card bg-paper-2 sm:mt-14 sm:aspect-[2.2/1]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_30%,rgb(255_255_255/0.8),transparent_70%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[14%] bg-paper-3/60" />
              {left && (
                <FramedSample
                  style={left}
                  sizes="15vw"
                  className="relative hidden w-[14%] -translate-y-[8%] -rotate-2 sm:block"
                />
              )}
              <FramedSample
                style={article.heroStyle}
                priority
                sizes="(max-width: 640px) 45vw, 22vw"
                className="relative w-[42%] sm:w-[21%]"
              />
              {right && (
                <FramedSample
                  style={right}
                  sizes="15vw"
                  className="relative hidden w-[14%] translate-y-[6%] rotate-2 sm:block"
                />
              )}
            </div>
          </Container>
        </header>

        <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
            <div className="min-w-0">
              {showToc && <TocDisclosure entries={toc} className="mb-10 lg:hidden" />}
              <ArticleBody article={article} />

              <footer className="mt-16 max-w-[68ch] border-t border-line pt-8">
                <p className="text-sm leading-relaxed text-ink-3">
                  Written by the Pup Prints team. We make custom dog portraits, so we&rsquo;ve mentioned ours where it
                  genuinely fits. {article.updated ? `Updated ${formatArticleDate(article.updated)}.` : ""}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Link
                    href="/journal"
                    className="inline-flex h-10 items-center rounded-full bg-paper-2 px-4 text-sm text-ink-2 ring-1 ring-line hover:text-ink"
                  >
                    ← All articles
                  </Link>
                  <Link
                    href={`/styles/${article.heroStyle}`}
                    className="inline-flex h-10 items-center rounded-full bg-paper-2 px-4 text-sm text-ink-2 ring-1 ring-line hover:text-ink"
                  >
                    Style: {STYLE_MAP[article.heroStyle].name}
                  </Link>
                  <Link
                    href="/breeds"
                    className="inline-flex h-10 items-center rounded-full bg-paper-2 px-4 text-sm text-ink-2 ring-1 ring-line hover:text-ink"
                  >
                    Portraits by breed
                  </Link>
                </div>
              </footer>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-10">
                {showToc && <TocSidebar entries={toc} />}
                <div className="rounded-card bg-paper-2 p-5 ring-1 ring-line">
                  <FramedSample
                    style={article.heroStyle}
                    sizes="120px"
                    showLabel={false}
                    className="mx-auto w-24 -rotate-2"
                  />
                  <p className="mt-5 font-display text-lg leading-snug text-ink">See your dog as art, free</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                    {PROMISES.preview}. About a minute, no card needed.
                  </p>
                  <ButtonLink
                    href={`/create?style=${article.heroStyle}`}
                    variant="accent"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Try it free <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-paper-2/60 py-16 sm:py-24">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="related-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.4rem]">
                Keep reading
              </h2>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
              >
                All articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={summary(a)} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
