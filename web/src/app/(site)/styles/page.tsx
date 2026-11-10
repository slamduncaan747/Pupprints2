import type { Metadata } from "next";
import { availableStyles } from "@/lib/catalog";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { StyleCard } from "@/components/marketing/style-card";
import { CtaBand } from "@/components/marketing/cta-band";

/** Evaluated per render (hourly at most), so a retired dated edition leaves the count with it. */
export function generateMetadata(): Metadata {
  return {
    title: "Dog Portrait Styles — Modern, Watercolor, Line Drawing, Pastel, Oil, Charcoal",
    description: `All ${availableStyles().length} dog portrait styles: modern illustration, watercolor, line drawing, pastel, oil and charcoal. See any of them with your own photo.`,
    alternates: { canonical: "/styles" },
  };
}

export default function StylesPage() {
  const styles = availableStyles();
  return (
    <>
      {/* Editorial header: the title, a short intro, then the collection's index, numbered like looks. */}
      <PageHero
        eyebrow="Dog portraits"
        title="Styles"
        lede={`${styles.length} styles. See any of them with your own photo.`}
      >
        <nav aria-label="Styles in the collection" className="border-t border-line pt-6 sm:pt-8">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-3.5 sm:grid-cols-4 lg:grid-cols-7">
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
          <ul className="grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-6 sm:gap-y-20 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-24">
            {styles.map((style, i) => (
              <li key={style.slug} id={`look-${style.slug}`} className="scroll-mt-28">
                <StyleCard
                  style={style}
                  index={i + 1}
                  priority={i < 2}
                  sizes="(max-width: 1024px) 45vw, (max-width: 1440px) 23vw, 330px"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        rule={false}
        title="Which one looks most like them?"
        body="Upload one photo and see your dog in every style."
      />
    </>
  );
}
