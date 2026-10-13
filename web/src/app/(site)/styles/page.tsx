import type { Metadata } from "next";
import Link from "next/link";
import { STYLES } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { StyleCard } from "@/components/marketing/style-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { ZoomImage } from "@/components/marketing/campaign";
import { stylesFor, type GoodFor } from "@/components/marketing/style-content";

export const metadata: Metadata = {
  title: "Dog Portrait Styles — Oil Painting, Watercolor, Royal & More",
  description: `Browse all ${STYLES.length} custom dog portrait styles, from royal oil paintings to watercolor, line art and pop art. Try every style free with your own photo.`,
  alternates: { canonical: "/styles" },
};

const EDITS: { title: string; body: string; tags: GoodFor[] }[] = [
  { title: "The Memorial Edit", body: "Soft, timeless styles that feel gentle on the wall.", tags: ["memorial"] },
  { title: "The Playful Edit", body: "Costumes and color for big personalities.", tags: ["funny"] },
  { title: "The Modern Edit", body: "Clean, graphic styles for modern rooms.", tags: ["decor"] },
];

export default function StylesPage() {
  const edits = EDITS.map((e) => ({ ...e, styles: stylesFor(e.tags, 4) }));
  // Lead each edit with a different portrait.
  const used = new Set<string>();
  const leads = edits.map((e) => {
    const lead = e.styles.find((s) => !used.has(s.slug)) ?? e.styles[0];
    used.add(lead.slug);
    return lead;
  });

  return (
    <>
      <PageHero
        align="center"
        eyebrow="The Portrait Collection"
        title="The Collection"
        lede={`${STYLES.length} styles, each made for one subject: your dog. Preview any of them free with your own photo.`}
      />

      <section aria-label="All styles" className="pb-24 sm:pb-36">
        <div className="mx-auto max-w-[1440px] sm:px-10">
          <ul className="grid grid-cols-2 gap-x-0.5 gap-y-12 sm:gap-x-4 sm:gap-y-16 lg:grid-cols-3 lg:gap-y-24">
            {STYLES.map((style, i) => (
              <li key={style.slug}>
                <StyleCard
                  style={style}
                  index={i + 1}
                  bleed
                  priority={i < 4}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 460px"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="edits-title" className="bg-paper-2 py-24 sm:py-36">
        <Container>
          <div className="mb-14 max-w-xl sm:mb-20">
            <p className="label text-ink-3">Where to begin</p>
            <h2 id="edits-title" className="mt-6 font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[64px]">
              Three edits
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">
              There&apos;s no wrong answer, and every style is free to preview. These are where we&apos;d start.
            </p>
          </div>
          <ul className="grid gap-16 sm:gap-10 md:grid-cols-3">
            {edits.map((e, i) => {
              const lead = leads[i];
              return (
                <li key={e.title} className={i === 1 ? "md:mt-24" : undefined}>
                  <Link href={`/styles/${lead.slug}`} className="group block">
                    <ZoomImage
                      src={STYLE_SAMPLES[lead.slug]}
                      alt={`Example ${lead.name} dog portrait`}
                      swatch={lead.swatch}
                      sizes="(max-width: 768px) 100vw, 440px"
                    />
                  </Link>
                  <h3 className="mt-6 font-display text-[28px] leading-[1.08] sm:text-[32px]">{e.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{e.body}</p>
                  <ul className="mt-6 border-t border-ink/15">
                    {e.styles.map((s) => (
                      <li key={s.slug} className="border-b border-ink/15">
                        <Link
                          href={`/styles/${s.slug}`}
                          className="label block py-3.5 text-ink transition-opacity hover:opacity-60"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <CtaBand
        eyebrow="Your commission"
        title="Which one looks most like them?"
        body="Upload one photo and see your dog in every style, free."
      />
    </>
  );
}
