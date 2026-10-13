import Link from "next/link";
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { ZoomImage } from "@/components/marketing/campaign";
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

/**
 * One story in a magazine grid: the portrait, a `.label` section, the Bodoni headline and a `.label`
 * date line. On phones it collapses to a row with a small portrait on the left.
 */
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
    <article className={cn("group relative grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-5 sm:block", className)}>
      <ZoomImage
        src={STYLE_SAMPLES[article.heroStyle]}
        alt=""
        swatch={style.swatch}
        sizes="(max-width: 640px) 104px, (max-width: 1024px) 45vw, 440px"
      />
      <div className="min-w-0 sm:mt-6">
        <p className="label text-ink-3">{article.categoryLabel}</p>
        <Heading className="mt-3 font-display text-[22px] leading-[1.1] text-ink sm:text-[28px]">
          <Link
            href={`/journal/${article.slug}`}
            className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-ink/30 group-hover:decoration-1 group-hover:underline-offset-[6px]"
          >
            {article.title}
          </Link>
        </Heading>
        <p className="mt-3 hidden max-w-md text-[14px] leading-relaxed text-ink-2 sm:line-clamp-2">{article.description}</p>
        <p className="label mt-3 text-ink-3 sm:mt-4">
          <time dateTime={article.date}>{formatArticleDate(article.date, "short")}</time>
          <span aria-hidden="true"> · </span>
          <span className="whitespace-nowrap">{article.readingMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}
