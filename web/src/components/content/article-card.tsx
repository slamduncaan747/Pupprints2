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
    <article className={cn("group relative grid grid-cols-[7rem_1fr] gap-4 sm:flex sm:flex-col sm:gap-0", className)}>
      <div className="relative flex aspect-[4/5] items-center justify-center self-start overflow-hidden rounded-2xl sm:self-stretch bg-paper-2 transition-colors duration-300 group-hover:bg-paper-3 sm:aspect-[4/3] sm:rounded-card">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgb(255_255_255/0.7),transparent_70%)]"
        />
        <FramedSample
          style={article.heroStyle}
          sizes="(max-width: 640px) 20vw, (max-width: 1024px) 22vw, 14vw"
          showLabel={false}
          className="relative w-[62%] transition-transform duration-500 group-hover:-translate-y-1 sm:w-[38%]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col sm:mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay sm:text-xs">{article.categoryLabel}</p>
        <Heading className="mt-1.5 font-display text-[1.15rem] leading-[1.2] text-ink sm:mt-2 sm:text-[1.4rem]">
          <Link href={`/journal/${article.slug}`} className="after:absolute after:inset-0 hover:text-clay-dark">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2 hidden text-[15px] leading-relaxed text-ink-2 sm:line-clamp-3">{article.description}</p>
        <p className="mt-2 text-[13px] text-ink-3 sm:mt-3 sm:text-sm">
          <time dateTime={article.date}>{formatArticleDate(article.date, "short")}</time> · {article.readingMinutes}{" "}
          min read
        </p>
      </div>
    </article>
  );
}
