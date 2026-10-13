import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";

export type LegalSection = { id: string; title: string; body: ReactNode };

const SPLIT = "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)] lg:gap-16";

/** Long-form policy layout: headline, a short contents list, then one readable column with hairlines. */
export function LegalPage({
  eyebrow,
  title,
  lede,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  lede: ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede}>
        <p className="text-[14px] text-ink-3">Last updated {updated}</p>
      </PageHero>
      <Container className="pb-16 sm:pb-24">
        <nav aria-labelledby="contents-title" className={`border-t border-line py-10 ${SPLIT}`}>
          <p id="contents-title" className="mb-4 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3 lg:mb-0 lg:pt-1">
            Contents
          </p>
          <ol className="text-[15px] sm:columns-2 sm:gap-8">
            {sections.map((s) => (
              <li key={s.id} className="mb-2 break-inside-avoid">
                <a href={`#${s.id}`} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={`scroll-mt-20 border-t border-line py-12 sm:py-16 ${SPLIT}`}>
            <h2 id={`${s.id}-title`} className="mb-2 max-w-sm font-display text-[1.75rem] leading-tight sm:text-[2rem] lg:mb-0">
              {s.title}
            </h2>
            <div className="text-[17px] leading-[1.75] text-ink-2 [&>:first-child]:mt-0 lg:[&>:first-child]:mt-1 [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-[3px] hover:[&_a]:decoration-ink [&_h3]:mt-8 [&_h3]:font-sans [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:leading-snug [&_h3]:tracking-normal [&_h3]:text-ink [&_li]:mt-2 [&_li]:pl-1 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-ink-3">
              {s.body}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
