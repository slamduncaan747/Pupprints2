import { cn } from "@/lib/utils";
import type { TocEntry } from "@/content/articles";
import { renderInline } from "@/components/content/inline";

/** A short "In this article" list shown above long articles. */
export function Toc({ entries, className }: { entries: TocEntry[]; className?: string }) {
  return (
    <nav aria-labelledby="toc-title" className={cn("border-y border-line py-8", className)}>
      <p id="toc-title" className="label text-ink-3">
        In this article
      </p>
      <ol className="mt-6 space-y-3">
        {entries.map((e, i) => (
          <li key={e.id} className="grid grid-cols-[2.25rem_minmax(0,1fr)]">
            <span aria-hidden="true" className="label tabular-nums text-ink-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a href={`#${e.id}`} className="label text-ink-2 transition-colors hover:text-ink">
              {renderInline(e.text, e.id)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
