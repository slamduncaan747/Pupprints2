import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { Block, textLink } from "@/components/marketing/blocks";
import { FramedArt } from "@/components/marketing/framed-art";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ARTICLES, CATEGORIES, getArticle, relatedArticles, tableOfContents } from "@/content/articles";
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
          <Container className="pt-12 sm:pt-20">
            <div className="mx-auto max-w-[680px]">
              <ContentBreadcrumbs items={crumbs} />
              <p className="mt-10 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3 sm:mt-14">
                {category.label}
              </p>
              <h1 className="mt-4 font-display text-[2.6rem] leading-[1.04] tracking-[-0.015em] sm:text-[3.75rem]">
                {article.title}
              </h1>
              <p className="mt-6 text-[19px] leading-relaxed text-ink-2">{article.description}</p>
              <p className="mt-6 text-[14px] text-ink-3">
                By the Pup Prints team · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> ·{" "}
                {article.readingMinutes} min read
              </p>
            </div>
            <figure className="mx-auto mt-12 max-w-[300px] sm:mt-16 sm:max-w-[400px]">
              <FramedArt style={article.heroStyle} priority sizes="(max-width: 640px) 300px, 400px" />
              <figcaption className="mt-5 text-center text-[13px] text-ink-3">
                Example {heroStyle.name} portrait
              </figcaption>
            </figure>
          </Container>
        </header>

        <Container className="pb-20 pt-14 sm:pb-28 sm:pt-20">
          <div className="mx-auto max-w-[680px]">
            {showToc && <Toc entries={toc} className="mb-12" />}
            <ArticleBody article={article} />

            <footer className="mt-16 border-t border-line pt-8">
              <p className="text-[14px] leading-relaxed text-ink-3">
                Written by the Pup Prints team. We make custom dog portraits, so we&rsquo;ve mentioned ours where it genuinely
                fits. {article.updated ? `Updated ${formatArticleDate(article.updated)}.` : ""}
              </p>
              <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                <Link href="/journal" className={textLink}>
                  All articles
                </Link>
                <Link href={`/styles/${article.heroStyle}`} className={textLink}>
                  Style: {heroStyle.name}
                </Link>
                <Link href="/breeds" className={textLink}>
                  Portraits by breed
                </Link>
              </p>
            </footer>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <Block id="related" title="Keep reading">
          <ul className="-mt-6 sm:-mt-8">
            {related.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={summary(a)} />
              </li>
            ))}
          </ul>
        </Block>
      )}

      <CtaBand href={`/create?style=${article.heroStyle}`} />
    </>
  );
}
