import Link from "next/link";
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { SampleImage } from "@/components/ui/sample-image";
import { cn } from "@/lib/utils";

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

/** One article in a hairline list: meta line, serif title, dek, and a small portrait on the right. */
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
  const style = STYLE_MAP[article.heroStyle];
  return (
    <article
      className={cn(
        "group relative grid grid-cols-[minmax(0,1fr)_4.5rem] items-start gap-5 border-b border-line py-6 sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-10 sm:py-8",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[13px] text-ink-3">
          {article.categoryLabel} · <time dateTime={article.date}>{formatArticleDate(article.date, "short")}</time> ·{" "}
          {article.readingMinutes} min read
        </p>
        <Heading className="mt-2 font-display text-[1.55rem] leading-[1.12] text-ink sm:text-[1.9rem]">
          <Link
            href={`/journal/${article.slug}`}
            className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-ink/30 group-hover:decoration-1 group-hover:underline-offset-4"
          >
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2 hidden max-w-xl text-[15px] leading-relaxed text-ink-2 sm:line-clamp-2">{article.description}</p>
      </div>
      <SampleImage
        src={STYLE_SAMPLES[article.heroStyle]}
        alt=""
        swatch={style.swatch}
        sizes="(max-width: 640px) 72px, 112px"
      />
    </article>
  );
}
