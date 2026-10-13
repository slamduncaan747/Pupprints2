import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { CampaignImage } from "@/components/marketing/campaign";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ARTICLES, CATEGORIES, articleStyles, getArticle, relatedArticles, tableOfContents } from "@/content/articles";
import { publicAssetExists } from "@/content/assets";
import type { Article } from "@/content/types";
import { ArticleBody } from "@/components/content/article-body";
import { ArticleCard, formatArticleDate, type ArticleSummary } from "@/components/content/article-card";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";
import { Toc } from "@/components/content/toc";

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
  const heroStyle = STYLE_MAP[article.heroStyle];
  const openers = articleStyles(article, 2);
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
        <header>
          <Container className="pb-14 pt-12 text-center sm:pb-20 sm:pt-20">
            <ContentBreadcrumbs items={crumbs} className="mx-auto max-w-3xl [&_ol]:justify-center" />
            <p className="label mt-14 text-ink-3 sm:mt-20">{category.label}</p>
            <h1 className="mx-auto mt-6 max-w-5xl font-display text-[40px] leading-[1.03] tracking-[-0.02em] sm:text-[64px] lg:text-[80px]">
              {article.title}
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-ink-2 sm:text-[19px]">{article.description}</p>
            <p className="label mt-8 text-ink-3">
              By the Pup Prints team <span aria-hidden="true">·</span>{" "}
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time> <span aria-hidden="true">·</span>{" "}
              <span className="whitespace-nowrap">{article.readingMinutes} min read</span>
            </p>
          </Container>
          <figure>
            <div className="grid gap-0.5 md:grid-cols-2">
              {openers.map((slug, i) => (
                <CampaignImage
                  key={slug}
                  src={STYLE_SAMPLES[slug]}
                  alt={`Example ${STYLE_MAP[slug].name} dog portrait`}
                  swatch={STYLE_MAP[slug].swatch}
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={i > 0 ? "hidden md:block" : undefined}
                />
              ))}
            </div>
            <figcaption className="label mx-auto mt-4 max-w-[1440px] px-5 text-ink-3 sm:px-10">
              <span className="md:hidden">Example {heroStyle.name} portrait</span>
              <span className="hidden md:inline">Example portraits: {openers.map((slug) => STYLE_MAP[slug].name).join(", ")}</span>
            </figcaption>
          </figure>
        </header>

        <Container className="pb-24 pt-16 sm:pb-32 sm:pt-24">
          <div className="mx-auto max-w-[680px]">
            {showToc && <Toc entries={toc} className="mb-14" />}
            <ArticleBody article={article} />

            <footer className="mt-20 border-t border-line pt-8">
              <p className="text-[13px] leading-relaxed text-ink-3">
                Written by the Pup Prints team. We make custom dog portraits, so we&rsquo;ve mentioned ours where it genuinely
                fits. {article.updated ? `Updated ${formatArticleDate(article.updated)}.` : ""}
              </p>
              <p className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                <Link href="/journal" className="link-cta">
                  The Journal
                </Link>
                <Link href={`/styles/${article.heroStyle}`} className="link-cta">
                  {heroStyle.name}
                </Link>
                <Link href="/breeds" className="link-cta">
                  Portraits by breed
                </Link>
              </p>
            </footer>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section id="related" aria-labelledby="related-title" className="scroll-mt-24">
          <Container>
            <div className="border-t border-line pb-20 pt-8 sm:pb-28 sm:pt-10">
              <p className="label text-ink-3">From the Journal</p>
              <h2 id="related-title" className="mt-5 font-display text-[30px] leading-[1.06] sm:text-[40px]">
                Keep reading
              </h2>
              <ul className="mt-12 grid gap-y-8 sm:mt-14 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-16 lg:grid-cols-3">
                {related.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={summary(a)} />
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      <CtaBand href={`/create?style=${article.heroStyle}`} />
    </>
  );
}
