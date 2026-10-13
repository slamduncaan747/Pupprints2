import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb trail. Pass the trail WITHOUT "Home" (it's prepended), matching
 * breadcrumbJsonLd() in @/lib/seo, which the page renders alongside it.
 */
export function ContentBreadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-ink-3", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className={cn("flex items-center gap-1.5", last && "min-w-0 max-w-full")}>
              {last ? (
                <span aria-current="page" className="truncate text-ink-2">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="hover:text-ink">
                    {c.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
