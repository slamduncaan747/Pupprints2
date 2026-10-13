import Link from "next/link";
import type { StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { FramedSample } from "@/components/content/framed-sample";

/** Serializable article summary (safe to pass to client components without shipping article bodies). */
export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  readingMinutes: number;
  heroStyle: StyleSlug;
  date: string;
};

export function formatArticleDate(iso: string, style: "short" | "long" = "long") {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00Z`));
}

export function ArticleCard({
  article,
  className,
  headingLevel = "h3",
}: {
  article: ArticleSummary;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card bg-paper-2 transition-colors duration-300 group-hover:bg-paper-3">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgb(255_255_255/0.7),transparent_70%)]"
        />
        <FramedSample
          style={article.heroStyle}
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 14vw"
          className="relative w-[38%] transition-transform duration-500 group-hover:-translate-y-1"
        />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">{article.categoryLabel}</p>
        <Heading className="mt-2 font-display text-[1.4rem] leading-[1.2] text-ink">
          <Link href={`/journal/${article.slug}`} className="after:absolute after:inset-0 hover:text-clay-dark">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-2">{article.description}</p>
        <p className="mt-3 text-sm text-ink-3">
          <time dateTime={article.date}>{formatArticleDate(article.date, "short")}</time> · {article.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
