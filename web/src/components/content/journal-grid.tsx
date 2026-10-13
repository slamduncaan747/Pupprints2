"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArticleCard, type ArticleSummary } from "@/components/content/article-card";

type Chip = { id: string; label: string; count: number };

/**
 * Journal grid with category chips. Every article is server-rendered (crawlable);
 * the chips only filter what's visible.
 */
export function JournalGrid({ articles, categories }: { articles: ArticleSummary[]; categories: Chip[] }) {
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? articles : articles.filter((a) => a.category === active);
  const chips: Chip[] = [{ id: "all", label: "All", count: articles.length }, ...categories];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter articles by category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {chips.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c.id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] transition-colors",
                on ? "bg-ink text-paper" : "bg-paper-2 text-ink-2 ring-1 ring-line hover:text-ink hover:ring-ink/25",
              )}
            >
              {c.label}
              <span className={cn("text-xs tabular-nums", on ? "text-paper/60" : "text-ink-3")}>{c.count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "article" : "articles"}
      </p>
      <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((a) => (
          <li key={a.slug}>
            <ArticleCard article={a} headingLevel="h3" />
          </li>
        ))}
        <li className="flex">
          <div className="grain relative flex w-full flex-col justify-between overflow-hidden rounded-card bg-moss p-7 text-paper sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-soft">Free preview</p>
              <p className="mt-4 font-display text-[1.75rem] leading-[1.1]">Done reading? See your dog as art.</p>
              <p className="mt-3 text-[15px] leading-relaxed text-paper/80">
                Upload a photo and see your portrait in about a minute. Only pay if you love it.
              </p>
            </div>
            <ButtonLink href="/create" variant="light" className="mt-8 self-start">
              Create your free preview <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </li>
      </ul>
    </div>
  );
}
