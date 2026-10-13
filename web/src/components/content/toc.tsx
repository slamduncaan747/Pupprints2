import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocEntry } from "@/content/articles";
import { renderInline } from "@/components/content/inline";

/** Sticky sidebar table of contents (desktop). */
export function TocSidebar({ entries, className }: { entries: TocEntry[]; className?: string }) {
  return (
    <nav aria-label="In this article" className={cn("text-sm", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">In this article</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className="-ml-px block border-l border-transparent py-1.5 pl-4 leading-snug text-ink-2 transition-colors hover:border-clay hover:text-ink"
            >
              {renderInline(e.text, e.id)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Collapsible table of contents (mobile and tablet). Works without JavaScript. */
export function TocDisclosure({ entries, className }: { entries: TocEntry[]; className?: string }) {
  return (
    <details className={cn("group rounded-2xl bg-paper-2 ring-1 ring-line", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
        <span>In this article <span className="font-normal text-ink-3">· {entries.length} sections</span></span>
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ol className="space-y-0.5 px-5 pb-4">
        {entries.map((e, i) => (
          <li key={e.id}>
            <a href={`#${e.id}`} className="flex gap-3 py-1.5 text-[15px] leading-snug text-ink-2 hover:text-ink">
              <span className="w-5 shrink-0 text-ink-3 tabular-nums">{i + 1}.</span>
              <span>{renderInline(e.text, e.id)}</span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
