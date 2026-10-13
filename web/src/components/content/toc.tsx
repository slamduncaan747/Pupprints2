import { cn } from "@/lib/utils";
import type { TocEntry } from "@/content/articles";
import { renderInline } from "@/components/content/inline";

/** A short "In this article" list shown above long articles. */
export function Toc({ entries, className }: { entries: TocEntry[]; className?: string }) {
  return (
    <nav aria-labelledby="toc-title" className={cn("border-y border-line py-6", className)}>
      <p id="toc-title" className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">
        In this article
      </p>
      <ol className="mt-4 space-y-2 text-[16px]">
        {entries.map((e, i) => (
          <li key={e.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
            <span aria-hidden="true" className="tabular-nums text-ink-3">
              {i + 1}.
            </span>
            <a href={`#${e.id}`} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
              {renderInline(e.text, e.id)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
