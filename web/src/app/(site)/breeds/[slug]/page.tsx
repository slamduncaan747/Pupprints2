import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, type FaqItem } from "@/components/marketing/faq";
import { FramedArt } from "@/components/marketing/framed-art";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Note, Prose, Rows, textLink } from "@/components/marketing/blocks";
import { StyleCard } from "@/components/marketing/style-card";
import { PRODUCTS, STYLE_MAP } from "@/lib/catalog";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { BREEDS, breedSample, getBreed, relatedBreeds } from "@/content/breeds";
import { ARTICLE_MAP, articlesLinkingTo } from "@/content/articles";
import { fromPrice } from "@/content/helpers";
import { publicAssetExists } from "@/content/assets";
import type { Article, Breed } from "@/content/types";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/content/json-ld";

export const dynamicParams = false;

export function generateStaticParams() {
  return BREEDS.map((b) => ({ slug: b.slug }));
}

/** "Frenchie", "Lab", or the name itself, for friendlier running copy. */
function shortName(b: Breed) {
  return b.slug === "mixed-breed" ? "dog" : (b.nickname ?? b.name);
}

function metaDescription(b: Breed) {
  const [s1, s2] = b.styles.map((s) => STYLE_MAP[s.slug].name);
  const subject =
    b.slug === "mixed-breed"
      ? "Custom portraits of your one-of-a-kind rescue or mixed-breed dog"
      : `Custom ${b.name} portraits`;
  return `${subject}, made from your photo in styles like ${s1} and ${s2}. Preview free, then choose a print, frame or canvas.`;
}

function buildFaq(b: Breed): FaqItem[] {
  const nick = shortName(b);
  const [first, second] = b.styles;
  const styleQ: FaqItem = {
    q:
      b.slug === "mixed-breed"
        ? "Which portrait style suits a mixed-breed dog?"
        : `Which portrait style suits a ${b.name}?`,
    a: `We'd start with ${STYLE_MAP[first.slug].name}: ${first.why} ${STYLE_MAP[second.slug].name} is a close second: ${second.why} That said, you can try every style free with your own photo and pick the one that looks most like your ${nick}.`,
    link: { href: `/styles/${first.slug}`, label: `About ${STYLE_MAP[first.slug].name}` },
  };
  const photoQ: FaqItem = {
    q: `What kind of photo of my ${nick} works best?`,
    a: `A sharp, close photo in soft daylight, taken at your dog's eye level, is the foundation. For a ${nick} specifically: ${b.tips
      .slice(0, 2)
      .map((t) => `${t.title.replace(/[.!]$/, "")}. ${t.body}`)
      .join(" ")}`,
    link: { href: "/journal/how-to-photograph-your-dog-for-a-portrait", label: "Read the full photo guide" },
  };
  const priceLine = PRODUCTS.map(
    (p) =>
      `${p.name} ${p.variants.length > 1 ? "from " : ""}${formatPrice(Math.min(...p.variants.map((v) => v.price)))}`,
  ).join(", ");
  const priceQ: FaqItem = {
    q:
      b.slug === "mixed-breed"
        ? "How much does a custom dog portrait cost?"
        : `How much does a custom ${b.name} portrait cost?`,
    a: `The preview is free. If you love it: ${priceLine}. US shipping is free on every order, and every print, framed print and canvas includes the hi-res digital file.`,
    link: { href: "/shop", label: "See every size and price" },
  };
  const own = b.faq.map((f) => ({ q: f.q, a: f.a }));
  return [...own, styleQ, ...(own.length < 2 ? [photoQ] : []), priceQ].slice(0, 4);
}

function furtherReading(b: Breed): Article[] {
  const linked = articlesLinkingTo(`/breeds/${b.slug}`);
  const defaults = [
    "how-to-photograph-your-dog-for-a-portrait",
    "watercolor-vs-oil-vs-line-art",
    "gift-ideas-for-dog-lovers",
    "canvas-vs-framed-print-vs-poster",
  ]
    .map((s) => ARTICLE_MAP[s])
    .filter(Boolean);
  const out: Article[] = [];
  for (const a of [...linked, ...defaults]) if (!out.some((o) => o.slug === a.slug) && out.length < 3) out.push(a);
  return out;
}

const GIFT_LINKS = [
  { href: "/gifts/christmas", label: "Christmas" },
  { href: "/gifts/birthday", label: "Birthdays" },
  { href: "/gifts/mothers-day", label: "Mother's Day" },
  { href: "/gifts/fathers-day", label: "Father's Day" },
  { href: "/gifts/new-puppy", label: "New puppy" },
  { href: "/gifts/memorial", label: "In memory" },
];

export async function generateMetadata({ params }: PageProps<"/breeds/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const breed = getBreed(slug);
  if (!breed) return {};
  const sample = breedSample(breed);
  return pageMetadata({
    title: `Custom ${breed.name} Portraits from Your Photo`,
    description: metaDescription(breed),
    path: `/breeds/${breed.slug}`,
    image: publicAssetExists(sample.src) ? sample.src : undefined,
    imageAlt: sample.alt,
  });
}

export default async function BreedPage({ params }: PageProps<"/breeds/[slug]">) {
  const { slug } = await params;
  const breed = getBreed(slug);
  if (!breed) notFound();

  const nick = shortName(breed);
  const sample = breedSample(breed);
  const top = breed.styles[0].slug;
  const faq = buildFaq(breed);
  const path = `/breeds/${breed.slug}`;
  const crumbs = [
    { name: "Breeds", path: "/breeds" },
    { name: breed.name, path },
  ];
  const reading = furtherReading(breed);
  const related = relatedBreeds(breed, 4);
  const isMixed = breed.slug === "mixed-breed";

  const facts = [
    { title: "Coat & color", body: breed.coat },
    ...(breed.akcRank2025
      ? [{ title: "Popularity", body: `No. ${breed.akcRank2025} on the AKC’s 2025 most popular breeds list.` }]
      : []),
    {
      title: "Top style pick",
      body: (
        <>
          <Link href={`/styles/${top}`} className={textLink}>
            {STYLE_MAP[top].name}
          </Link>
          <span className="text-ink-3"> · {STYLE_MAP[top].blurb}</span>
        </>
      ),
    },
  ];

  const more = [
    {
      title: "Prints, frames & canvas",
      links: PRODUCTS.map((p) => ({
        href: `/shop/${p.type}`,
        label: `${p.name}, ${p.variants.length > 1 ? "from " : ""}${fromPrice(p.type)}`,
      })),
    },
    { title: `A gift for a ${nick} person`, links: GIFT_LINKS },
    { title: "From the journal", links: reading.map((a) => ({ href: `/journal/${a.slug}`, label: a.title })) },
    {
      title: isMixed ? "Popular breeds" : "You might also love",
      links: [...related.map((b) => ({ href: `/breeds/${b.slug}`, label: b.name })), { href: "/breeds", label: "All breeds" }],
    },
  ].filter((g) => g.links.length > 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          productJsonLd({
            name: `Custom ${breed.name} Portrait`,
            description: metaDescription(breed),
            path,
            image: publicAssetExists(sample.src) ? sample.src : undefined,
          }),
          faqJsonLd(faq),
        ]}
      />

      <PageHero
        breadcrumbs={<ContentBreadcrumbs items={crumbs} />}
        title={`Custom ${breed.name} Portraits`}
        lede={
          <>
            <p className="font-display text-[1.5rem] italic leading-snug text-ink sm:text-[1.75rem]">{breed.personality}</p>
            <p className="mt-4">
              Upload a favorite photo of your {nick} and see them as a work of art in about a minute, free.
            </p>
          </>
        }
        media={
          <figure className="mx-auto w-full max-w-[440px]">
            <FramedArt
              style={sample.style}
              src={sample.src}
              alt={sample.alt}
              priority
              sizes="(max-width: 1024px) 85vw, 440px"
            />
            <figcaption className="mt-5 text-center text-[13px] text-ink-3">
              {sample.breedSpecific
                ? `${STYLE_MAP[sample.style].name} portrait of a ${breed.name}. Yours will look like your dog.`
                : `Example ${STYLE_MAP[sample.style].name} portrait. Yours will be made from your ${nick}'s photo.`}
            </figcaption>
          </figure>
        }
      />

      <Block title={isMixed ? "Painting a one-of-a-kind dog" : `Painting a ${breed.name}`}>
        <Prose>
          {breed.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Prose>
        <Rows items={facts} className="mt-10" />
      </Block>

      <Block id="photo-tips" title={`Photo tips for your ${nick}`}>
        <Rows numbered items={breed.tips.map((t) => ({ title: t.title, body: t.body }))} />
        <Note className="mt-6">
          <Link href="/journal/how-to-photograph-your-dog-for-a-portrait" className={textLink}>
            The full photo guide
          </Link>
        </Note>
      </Block>

      <Block
        id="styles"
        title={isMixed ? "Styles we'd try first" : `Styles we'd pick for a ${nick}`}
        intro={`Chosen for the ${isMixed ? "personality" : "breed's look and personality"}, best first. You can preview every style free with your own photo.`}
        layout="stack"
      >
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
          {breed.styles.map(({ slug: s, why }) => (
            <li key={s}>
              <StyleCard style={STYLE_MAP[s]} compact sizes="(max-width: 640px) 45vw, 260px" />
              <p className="mt-1.5 text-[14px] leading-snug text-ink-3">{why}</p>
            </li>
          ))}
        </ul>
        <Note className="mt-10">
          Not sure? Read{" "}
          <Link href="/journal/watercolor-vs-oil-vs-line-art" className={textLink}>
            how to choose a portrait style
          </Link>{" "}
          or{" "}
          <Link href="/styles" className={textLink}>
            browse all styles
          </Link>
          .
        </Note>
      </Block>

      <Block
        id="faq"
        title={isMixed ? "Rescue portrait FAQ" : `${breed.name} portrait FAQ`}
        intro={
          <>
            More answers in our{" "}
            <Link href="/faq" className={textLink}>
              full FAQ
            </Link>
            .
          </>
        }
      >
        <FaqList items={faq} />
      </Block>

      <Block title="Keep exploring">
        <div className="grid gap-10 sm:grid-cols-2">
          {more.map((g) => (
            <div key={g.title}>
              <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">{g.title}</h3>
              <ul className="mt-4 space-y-2 text-[15px] leading-snug">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <CtaBand
        title={isMixed ? "See your dog as a work of art" : `See your ${nick} as a work of art`}
        href={`/create?style=${top}`}
      />
    </>
  );
}
