import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Long-form policy layout: hero, sticky table of contents on desktop, readable prose column. */
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
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        note={
          <span className="inline-flex items-center rounded-full bg-paper-2 px-3 py-1.5 text-[13px] font-medium text-ink-2 ring-1 ring-line">
            Last updated {updated}
          </span>
        }
      />
      <Container className="grid gap-12 pb-24 lg:grid-cols-[240px_1fr] lg:gap-20">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">On this page</p>
            <ol className="mt-4 space-y-2.5 border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-sm text-ink-2 hover:border-ink hover:text-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="prose-legal max-w-[68ch] text-[16px] leading-[1.75] text-ink-2 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-clay/50 [&_a]:underline-offset-4 hover:[&_a]:decoration-clay [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink [&_li]:mt-2 [&_li]:pl-1 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-clay">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-line pt-10 first:border-t-0 first:pt-0 [&+section]:mt-12">
              <h2 className="font-display text-[1.75rem] leading-tight text-ink sm:text-3xl">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
