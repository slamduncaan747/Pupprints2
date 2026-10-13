import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";

export type LegalSection = { id: string; title: string; body: ReactNode };

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Long-form policy layout: Bodoni headline, a numbered `.label` contents list (sticky on desktop),
 * then numbered sections in one readable column.
 */
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
        <p className="label text-ink-3">Last updated {updated}</p>
      </PageHero>
      <Container className="pb-24 sm:pb-36">
        <div className="border-t border-line lg:grid lg:grid-cols-12 lg:gap-x-10">
          <nav aria-labelledby="contents-title" className="border-b border-line py-10 lg:col-span-3 lg:border-b-0 lg:py-14">
            <div className="lg:sticky lg:top-28">
              <p id="contents-title" className="label text-ink-3">
                Contents
              </p>
              <ol className="mt-6 space-y-3.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="label flex gap-4 text-ink-2 transition-colors hover:text-ink">
                      <span className="tabular-nums text-ink-3">{num(i)}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-24 border-b border-line py-12 last:border-b-0 sm:py-16"
              >
                <p aria-hidden="true" className="label tabular-nums text-ink-3">
                  {num(i)}
                </p>
                <h2 id={`${s.id}-title`} className="mt-4 font-display text-[28px] leading-[1.08] sm:text-[36px]">
                  {s.title}
                </h2>
                <div className="mt-6 max-w-[680px] text-[15px] leading-[1.85] text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:decoration-1 [&_a]:underline-offset-4 hover:[&_a]:decoration-ink [&_h3]:mt-10 [&_h3]:font-sans [&_h3]:text-[11px] [&_h3]:font-medium [&_h3]:uppercase [&_h3]:leading-snug [&_h3]:tracking-[0.18em] [&_h3]:text-ink [&_li]:mt-2.5 [&_li]:pl-1 [&_p]:mt-4 [&_p:first-child]:mt-0 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-ink-3 [&_ul:first-child]:mt-0">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
