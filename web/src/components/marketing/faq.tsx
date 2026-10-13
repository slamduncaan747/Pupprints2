import Link from "next/link";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  /** Plain text so it can also feed FAQPage structured data. Blank lines split paragraphs. */
  a: string;
  link?: { href: string; label: string };
};

/** Hairline accordion built on native <details>, so it works without JavaScript. */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-8 py-5 text-left text-[15px] leading-snug text-ink transition-opacity hover:opacity-60 sm:py-6 sm:text-[16px] [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span aria-hidden="true" className="w-3 shrink-0 text-center text-[15px] font-light leading-none text-ink-3">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">&minus;</span>
            </span>
          </summary>
          <div className="max-w-[62ch] space-y-3 pb-7 pr-8 text-[15px] leading-relaxed text-ink-2">
            {item.a.split(/\n\n+/).map((para) => (
              <p key={para}>{para}</p>
            ))}
            {item.link && (
              <p className="pt-1">
                <Link href={item.link.href} className="link-cta text-ink">
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
