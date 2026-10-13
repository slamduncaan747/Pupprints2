import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  /** Plain text so it can also feed FAQPage structured data. Blank lines split paragraphs. */
  a: string;
  link?: { href: string; label: string };
};

/** Accessible accordion built on native <details>, so it works without JavaScript. */
export function FaqList({ items, className, tone = "paper" }: { items: FaqItem[]; className?: string; tone?: "paper" | "sage" }) {
  return (
    <div className={cn("divide-y border-y", tone === "sage" ? "divide-sage/40 border-sage/40" : "divide-line border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-lg leading-snug sm:text-xl">{item.q}</span>
            <span
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-ink/15 transition-transform duration-200 group-open:rotate-45 group-open:bg-ink group-open:text-paper"
              aria-hidden="true"
            >
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <div className="max-w-2xl space-y-3 pb-6 pr-10 text-[15px] leading-relaxed text-ink-2 sm:text-base">
            {item.a.split(/\n\n+/).map((para) => (
              <p key={para}>{para}</p>
            ))}
            {item.link && (
              <p>
                <Link href={item.link.href} className="font-medium text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
                  {item.link.label}
                </Link>
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a.replace(/\n\n+/g, " ") },
    })),
  };
}
