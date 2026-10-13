import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl, cn } from "@/lib/utils";
import { JsonLd } from "@/components/marketing/json-ld";

export type Crumb = { href: string; label: string };

/** Visible breadcrumb trail plus BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ href: "/", label: "Home" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-ink-3", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink-2">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </nav>
  );
}
