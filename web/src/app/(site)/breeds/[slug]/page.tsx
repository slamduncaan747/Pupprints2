import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, Check, Gift, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, type FaqItem } from "@/components/marketing/faq";
import { PRODUCTS, PROMISES, STYLE_MAP } from "@/lib/catalog";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { BREEDS, breedSample, getBreed, relatedBreeds } from "@/content/breeds";
import { ARTICLE_MAP, CATEGORIES, articlesLinkingTo } from "@/content/articles";
import { fromPrice, shipWindow, sizeList } from "@/content/helpers";
import { publicAssetExists } from "@/content/assets";
import type { Article, Breed } from "@/content/types";
import { BreedCard } from "@/components/content/breed-card";
import { ContentBreadcrumbs } from "@/components/content/breadcrumbs";
import { FramedSample, SampleOnWall } from "@/components/content/framed-sample";
import { ArticleCard, type ArticleSummary } from "@/components/content/article-card";
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

function summary(a: Article): ArticleSummary {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    categoryLabel: CATEGORIES[a.category].label,
    readingMinutes: a.readingMinutes,
    heroStyle: a.heroStyle,
    date: a.date,
  };
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

      {/* Hero */}
      <section className="overflow-hidden bg-paper">
        <Container className="pb-14 pt-8 sm:pb-20 sm:pt-10">
          <ContentBreadcrumbs items={crumbs} />
          <div className="mt-8 grid items-center gap-10 sm:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Eyebrow className="mb-5">
                {isMixed ? "Rescue & mixed breed portraits" : `${breed.name} portraits`}
              </Eyebrow>
              <h1 className="font-display text-[2.5rem] leading-[1.03] sm:text-6xl lg:text-[4rem]">
                Custom {breed.name} Portraits
              </h1>
              <p className="mt-5 font-display text-xl italic leading-snug text-ink-2 sm:text-2xl">
                {breed.personality}
              </p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
                Upload a favorite photo of your {nick} and see them as a work of art in about a minute. Try every style
                free, and only order if you love it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={`/create?style=${top}`} variant="accent" size="lg">
                  Create your free preview <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="#styles" variant="secondary" size="lg">
                  Styles for {isMixed ? "your dog" : `${breed.plural}`}
                </ButtonLink>
              </div>
              <ul className="mt-7 flex flex-col gap-2 text-[15px] text-ink-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {[PROMISES.preview, PROMISES.shipping, PROMISES.guarantee].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-clay" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <figure>
              <SampleOnWall
                style={sample.style}
                src={sample.src}
                alt={sample.alt}
                priority
                sizes="(max-width: 1024px) 60vw, 26vw"
                className="aspect-[5/4] sm:aspect-[4/3]"
                frameClassName="w-[46%] sm:w-[40%]"
              />
              <figcaption className="mt-3 text-center text-sm text-ink-3">
                {sample.breedSpecific
                  ? `${STYLE_MAP[sample.style].name} portrait of a ${breed.name}. Yours will look like your dog.`
                  : `Example ${STYLE_MAP[sample.style].name} portrait. Yours will be made from your ${nick}'s photo.`}
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* About the breed */}
      <section className="border-y border-line bg-paper-2/50 py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="max-w-[68ch]">
            <Eyebrow className="mb-4">The portrait brief</Eyebrow>
            <h2 className="font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
              {isMixed ? "Painting a one-of-a-kind dog" : `Painting a ${breed.name}`}
            </h2>
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.8] text-ink-2 sm:text-[1.125rem]">
              {breed.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="self-start rounded-card bg-paper p-6 ring-1 ring-line sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Coat &amp; color</p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{breed.coat}</p>
            {breed.akcRank2025 && (
              <>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Popularity</p>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
                  <span className="font-display text-3xl text-ink">No. {breed.akcRank2025}</span>
                  <span className="mt-1 block text-sm text-ink-3">
                    on the AKC&rsquo;s 2025 most popular breeds list
                  </span>
                </p>
              </>
            )}
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Top style pick</p>
            <Link
              href={`/styles/${top}`}
              className="mt-3 flex items-center gap-4 rounded-2xl bg-paper-2 p-3 transition-colors hover:bg-paper-3"
            >
              <FramedSample style={top} sizes="56px" showLabel={false} className="w-14 shrink-0" />
              <span>
                <span className="block font-display text-lg leading-tight text-ink">{STYLE_MAP[top].name}</span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-2">{STYLE_MAP[top].blurb}</span>
              </span>
            </Link>
          </aside>
        </Container>
      </section>

      {/* Photo tips */}
      <section className="py-16 sm:py-24" aria-labelledby="photo-tips">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Eyebrow className="mb-4">Before you upload</Eyebrow>
              <h2 id="photo-tips" className="font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
                Photo tips for your {nick}
              </h2>
            </div>
            <Link
              href="/journal/how-to-photograph-your-dog-for-a-portrait"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
            >
              The full photo guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {breed.tips.map((t, i) => (
              <li key={t.title} className="rounded-card bg-paper-2 p-6 sm:p-7">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-clay-dark">
                  <Camera className="h-4 w-4" aria-hidden="true" /> Tip {i + 1}
                </span>
                <h3 className="mt-3 font-display text-xl leading-snug text-ink sm:text-[1.4rem]">{t.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{t.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Recommended styles */}
      <section id="styles" className="scroll-mt-24 bg-paper-2 py-16 sm:py-24" aria-labelledby="styles-heading">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="mb-4">Recommended styles</Eyebrow>
            <h2 id="styles-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
              {isMixed ? "Styles we'd try first" : `Styles we'd pick for a ${nick}`}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              Chosen for the {isMixed ? "personality" : "breed's look and personality"}. You can preview all of them,
              and every other style, free with your own photo.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {breed.styles.map(({ slug: s, why }, i) => {
              const style = STYLE_MAP[s];
              return (
                <li key={s} className="group flex flex-col">
                  <Link
                    href={`/styles/${s}`}
                    className="block rounded-card bg-paper px-[18%] py-[14%] transition-colors duration-300 hover:bg-paper-3"
                  >
                    <FramedSample
                      style={s}
                      sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 16vw"
                      className="transition-transform duration-500 group-hover:-translate-y-1"
                    />
                    <span className="sr-only">About the {style.name} style</span>
                  </Link>
                  <div className="mt-5 flex flex-1 flex-col">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-display text-2xl leading-tight">{style.name}</h3>
                      {i === 0 && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-clay">Top pick</span>
                      )}
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{why}</p>
                    <Link
                      href={`/create?style=${s}`}
                      className="mt-4 inline-flex items-center gap-1.5 self-start text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
                    >
                      Try it with your {nick} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-12 text-[15px] text-ink-2">
            Not sure? Read{" "}
            <Link
              href="/journal/watercolor-vs-oil-vs-line-art"
              className="font-medium text-ink underline decoration-clay/45 underline-offset-[3px] hover:decoration-clay"
            >
              how to choose a portrait style
            </Link>{" "}
            or{" "}
            <Link
              href="/styles"
              className="font-medium text-ink underline decoration-clay/45 underline-offset-[3px] hover:decoration-clay"
            >
              browse all styles
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24" aria-labelledby="products-heading">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="mb-4">Prints, frames &amp; canvas</Eyebrow>
            <h2 id="products-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
              Choose how to hang it
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              Honest prices with free US shipping built in. {PROMISES.digital}.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <li key={p.type}>
                <Link
                  href={`/shop/${p.type}`}
                  className="group flex h-full flex-col rounded-card bg-paper-2 p-6 ring-1 ring-transparent transition hover:bg-paper-3 hover:ring-line"
                >
                  <span className="font-display text-2xl leading-tight text-ink">{p.name}</span>
                  <span className="mt-1 text-ink-2">
                    {p.variants.length > 1 ? "from " : ""}
                    <span className="font-medium text-ink">{fromPrice(p.type)}</span>
                  </span>
                  <span className="mt-4 text-sm leading-relaxed text-ink-2">
                    {p.type === "digital" ? "High-res file, no watermark" : sizeList(p.type)}
                  </span>
                  <span className="mt-1 text-sm text-ink-3">
                    {p.type === "digital" ? "Delivered instantly by email" : `Arrives in ${shipWindow(p.type)}`}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-medium text-clay-dark">
                    Details{" "}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Gifts */}
      <section className="pb-16 sm:pb-24" aria-labelledby="gifts-heading">
        <Container>
          <div className="grid gap-8 rounded-[2rem] bg-blush/45 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Eyebrow className="mb-4 text-clay-dark">
                <Gift className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />A gift for a {nick} person
              </Eyebrow>
              <h2 id="gifts-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.4rem]">
                Their {nick}, as a work of art
              </h2>
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">
                Grab a photo from their Instagram, preview it free, and send a Gift Reveal the moment you order. The
                print follows by mail, straight to their door if you like.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {GIFT_LINKS.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-[15px] text-ink ring-1 ring-line transition hover:ring-ink/30"
                  >
                    <Sparkles className="h-4 w-4 text-clay" aria-hidden="true" />
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-16 sm:py-24" aria-labelledby="faq-heading">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 id="faq-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.6rem]">
              {isMixed ? "Rescue portrait FAQ" : `${breed.name} portrait FAQ`}
            </h2>
            <p className="mt-4 text-ink-2">
              More answers in our{" "}
              <Link
                href="/faq"
                className="font-medium text-ink underline decoration-clay/45 underline-offset-[3px] hover:decoration-clay"
              >
                full FAQ
              </Link>
              .
            </p>
          </div>
          <FaqList items={faq} />
        </Container>
      </section>

      {/* Further reading */}
      {reading.length > 0 && (
        <section className="bg-paper-2/60 py-16 sm:py-24" aria-labelledby="reading-heading">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="reading-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.4rem]">
                From the journal
              </h2>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
              >
                All articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {reading.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={summary(a)} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Related breeds */}
      <section className="py-16 sm:py-24" aria-labelledby="related-heading">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="related-heading" className="font-display text-3xl leading-[1.08] sm:text-[2.4rem]">
              {isMixed ? "Popular breeds" : "You might also love"}
            </h2>
            <Link
              href="/breeds"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
            >
              All breeds <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {related.map((b) => (
              <li key={b.slug}>
                <BreedCard breed={b} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        title={isMixed ? "See your dog as a work of art" : `See your ${nick} as a work of art`}
        href={`/create?style=${top}`}
      />
    </>
  );
}
