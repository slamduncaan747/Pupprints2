import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb trail. Pass the trail WITHOUT "Home" (it's prepended), matching
 * breadcrumbJsonLd() in @/lib/seo, which the page renders alongside it.
 */
export function ContentBreadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("label text-ink-3", className)}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className={cn("flex items-center gap-3", last && "min-w-0 max-w-full")}>
              {last ? (
                <span aria-current="page" className="truncate text-ink">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="transition-colors hover:text-ink">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
