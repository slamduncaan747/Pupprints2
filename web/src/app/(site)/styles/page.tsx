import type { Metadata } from "next";
import Link from "next/link";
import { STYLES } from "@/lib/catalog";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Rows, textLink } from "@/components/marketing/blocks";
import { StyleCard } from "@/components/marketing/style-card";
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
            {STYLES.length} styles. <br className="hidden sm:block" />
            One very good dog.
          </>
        }
        lede="From old-master oils to bold pop art, every style is designed to look unmistakably like your dog. Try them all free with your own photo."
      />

      <Container className="pb-24 sm:pb-32">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
          {STYLES.map((style, i) => (
            <li key={style.slug}>
              <StyleCard style={style} priority={i < 4} />
            </li>
          ))}
        </ul>
      </Container>

      <Block
        title="Where to begin"
        intro="There's no wrong answer, and every style is free to preview. These are simply where we'd start."
      >
        <Rows
          items={GUIDE.map((g) => ({
            title: g.title,
            body: (
              <>
                <p>{g.body}</p>
                <p className="mt-2">
                  {stylesFor(g.tags, 4).map((s, i, all) => (
                    <span key={s.slug}>
                      <Link href={`/styles/${s.slug}`} className={textLink}>
                        {s.name}
                      </Link>
                      {i < all.length - 1 && <span className="text-ink-3">, </span>}
                    </span>
                  ))}
                </p>
              </>
            ),
          }))}
        />
      </Block>

      <CtaBand title="Which one looks most like them?" body="Upload one photo and see your dog in every style, free." />
    </>
  );
}
