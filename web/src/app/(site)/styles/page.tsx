import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STYLES } from "@/lib/catalog";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { StyleCard } from "@/components/marketing/style-card";
import { PromiseRow } from "@/components/marketing/promise-row";
import { CtaBand } from "@/components/marketing/cta-band";
import { stylesFor, type GoodFor } from "@/components/marketing/style-content";

export const metadata: Metadata = {
  title: "Dog Portrait Styles — Oil Painting, Watercolor, Royal & More",
  description: `Browse all ${STYLES.length} custom dog portrait styles, from royal oil paintings to watercolor, line art and pop art. Try every style free with your own photo.`,
  alternates: { canonical: "/styles" },
};

const GUIDE: { title: string; body: string; tags: GoodFor[] }[] = [
  { title: "To remember a best friend", body: "Soft, timeless styles that feel gentle on the wall.", tags: ["memorial"] },
  { title: "For a good laugh", body: "Costumes and color for big personalities.", tags: ["funny"] },
  { title: "For a modern home", body: "Clean, graphic styles that sit well with modern decor.", tags: ["decor"] },
];

export default function StylesPage() {
  return (
    <>
      <PageHero
        eyebrow="The collection"
        title={
          <>
            {STYLES.length} styles.
            <br className="hidden sm:block" /> One very good dog.
          </>
        }
        lede="From old-master oil paintings to bold pop art, every style is designed around one thing: looking unmistakably like your dog. The best way to choose is to try them all with your own photo. It's free."
        actions={
          <>
            <ButtonLink href="/create" variant="accent" size="lg">
              Try every style free <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="secondary" size="lg">
              How it works
            </ButtonLink>
          </>
        }
      />

      <Container className="pb-20 sm:pb-28">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
          {STYLES.map((style, i) => (
            <li key={style.slug}>
              <StyleCard style={style} priority={i < 3} />
            </li>
          ))}
        </ul>
      </Container>

      <Section className="bg-paper-2">
        <Container>
          <SectionHeading
            eyebrow="Not sure where to start?"
            title="A few good places to begin"
            subtitle="There's no wrong answer, and you can preview every style free. These are simply where we'd start."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {GUIDE.map((g) => (
              <div key={g.title} className="rounded-card bg-paper p-7 ring-1 ring-line sm:p-8">
                <h3 className="font-display text-2xl">{g.title}</h3>
                <p className="mt-2 text-[15px] text-ink-2">{g.body}</p>
                <ul className="mt-6 space-y-1">
                  {stylesFor(g.tags, 4).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/styles/${s.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 -mx-3 hover:bg-paper-2"
                      >
                        <span className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ background: s.swatch }} aria-hidden="true" />
                          <span className="font-medium">{s.name}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-ink-3 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 sm:py-20">
        <Container>
          <PromiseRow />
        </Container>
      </Section>

      <CtaBand title="Which one looks most like them?" body="Upload one photo and see your dog in every style, free. Pay only for the one you love." />
    </>
  );
}
