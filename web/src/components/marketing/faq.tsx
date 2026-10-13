import Link from "next/link";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  /** Plain text so it can also feed FAQPage structured data. Blank lines split paragraphs. */
  a: string;
  link?: { href: string; label: string };
};

/** Accessible accordion built on native <details>, so it works without JavaScript. */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-[17px] leading-snug text-ink [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span aria-hidden="true" className="w-4 shrink-0 text-center text-[20px] font-light leading-[1.1] text-ink-3">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">&minus;</span>
            </span>
          </summary>
          <div className="space-y-3 pb-6 pr-10 text-[16px] leading-relaxed text-ink-2">
            {item.a.split(/\n\n+/).map((para) => (
              <p key={para}>{para}</p>
            ))}
            {item.link && (
              <p>
                <Link
                  href={item.link.href}
                  className="text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink"
                >
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
