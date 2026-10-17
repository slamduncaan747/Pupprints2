import type { Metadata } from "next";
import Link from "next/link";
import { availableStyles, STYLE_MAP, styleAvailable, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { StyleCard } from "@/components/marketing/style-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { ZoomImage } from "@/components/marketing/campaign";
import { cn } from "@/lib/utils";

/** Evaluated per render (hourly at most), so a retired dated edition leaves the count with it. */
export function generateMetadata(): Metadata {
  return {
    title: "Dog Portrait Styles — Oil Painting, Watercolor, Royal & More",
    description: `Browse all ${availableStyles().length} custom dog portrait styles, from royal oil paintings to watercolor, line art and pop art. Try every style free with your own photo.`,
    alternates: { canonical: "/styles" },
  };
}

/** Curated edits. The first slug leads with its portrait. */
const EDITS: { title: string; body: string; slugs: StyleSlug[] }[] = [
  {
    title: "The Memorial Edit",
    body: "Soft, timeless styles that feel gentle on the wall.",
    slugs: ["watercolor", "oil-classic", "botanical", "charcoal"],
  },
  {
    title: "The Playful Edit",
    body: "Costumes and color for big personalities.",
    slugs: ["astronaut", "royal", "admiral", "pop-art"],
  },
  {
    title: "The Modern Edit",
    body: "Clean, graphic styles for modern rooms.",
    slugs: ["mid-century", "fine-line", "charcoal", "pop-art"],
  },
];

export default function StylesPage() {
  const styles = availableStyles();
  const edits = EDITS.map((e) => ({
    ...e,
    styles: e.slugs.map((slug) => STYLE_MAP[slug]).filter((s) => styleAvailable(s)),
  })).filter((e) => e.styles.length > 0);

  return (
    <>
      {/* Editorial header: the title, a short intro, then the collection's index, numbered like looks. */}
      <PageHero
        eyebrow="The Portrait Collection"
        title="The Collection"
        lede={`${styles.length} styles, each made for one subject: your dog. Preview any of them free with your own photo.`}
      >
        <nav aria-label="Styles in the collection" className="border-t border-line pt-6 sm:pt-8">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {styles.map((style, i) => (
              <li key={style.slug}>
                <a href={`#look-${style.slug}`} className="label flex gap-3 text-ink transition-opacity hover:opacity-60">
                  <span className="tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  {style.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>

      <section aria-labelledby="all-styles" className="pb-24 sm:pb-36">
        <h2 id="all-styles" className="sr-only">
          All styles
        </h2>
        <Container>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-6 sm:gap-y-20 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-32">
            {styles.map((style, i) => (
              <li key={style.slug} id={`look-${style.slug}`} className="scroll-mt-28">
                <StyleCard
                  style={style}
                  index={i + 1}
                  priority={i < 2}
                  sizes="(max-width: 1024px) 45vw, (max-width: 1440px) 30vw, 430px"
                />
              </li>
            ))}
          </ul>
        </Container>
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
              const lead = e.styles[0];
              return (
                <li key={e.title} className={i === 1 ? "md:mt-24" : undefined}>
                  <Link
                    href={`/styles/${lead.slug}`}
                    className={cn("group block w-[78%] md:w-full", i % 2 === 1 && "ml-auto md:ml-0")}
                  >
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
        rule={false}
        eyebrow="Your commission"
        title="Which one looks most like them?"
        body="Upload one photo and see your dog in every style, free."
      />
    </>
  );
}
