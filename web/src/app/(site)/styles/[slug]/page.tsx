import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCT_MAP, PRODUCTS, STYLES, getStyle, styleAvailable, type ArtStyle } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { OFFER } from "@/lib/offer";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CampaignImage, ProductLayout, ProductShot, ProductTitle } from "@/components/marketing/campaign";
import { ProductCard } from "@/components/marketing/product-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { FramedArt } from "@/components/marketing/framed-art";
import { JsonLd } from "@/components/marketing/json-ld";
import { Block, Facts, Note, Rows, textLink } from "@/components/marketing/blocks";
import { StyleCard } from "@/components/marketing/style-card";
import { GOOD_FOR_LABELS, honestDescription, styleContent, stylesFor } from "@/components/marketing/style-content";
import { fromPrice, toPrice, FRAME_LABELS } from "@/components/marketing/commerce";
import { EFFORT_LINE, GuaranteeNote } from "@/components/marketing/offer";
import { firstSentences } from "@/components/marketing/honest";
import { breedsForStyle } from "@/content/breeds";

export const dynamicParams = false;

/**
 * Every style is prerendered, including dated editions: the page re-renders at most hourly (the
 * (site) layout's revalidate), and a dated edition past its availableUntil renders as retired
 * (noindex, out of the sitemap) without a redeploy.
 */
export function generateStaticParams() {
  return STYLES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/styles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const style = getStyle(slug);
  if (!style) return {};
  if (!styleAvailable(style)) {
    return {
      title: `${style.name} (retired)`,
      description: `${style.name} has been retired. Explore the rest of the collection and preview any style free.`,
      alternates: { canonical: `/styles/${style.slug}` },
      robots: { index: false, follow: true },
    };
  }
  const c = styleContent(style);
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: { canonical: `/styles/${style.slug}` },
    openGraph: {
      title: `${c.title} | ${site.name}`,
      description: c.metaDescription,
      url: `/styles/${style.slug}`,
      type: "website",
      siteName: site.name,
      locale: "en_US",
      // The style sample first; the site-wide card is the fallback while samples are still being generated.
      images: [
        { url: STYLE_SAMPLES[style.slug], width: 1200, height: 1500, alt: `${style.name} dog portrait example` },
        DEFAULT_OG_IMAGE,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.title} | ${site.name}`,
      description: c.metaDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function StylePage({ params }: PageProps<"/styles/[slug]">) {
  const { slug } = await params;
  const style = getStyle(slug);
  if (!style) notFound();
  if (!styleAvailable(style)) return <RetiredStyle style={style} />;

  const c = styleContent(style);
  const best = c.bestOn.map((t) => PRODUCT_MAP[t]).filter(Boolean);
  const others = stylesFor(style.goodFor, 4, style.slug);
  const breeds = breedsForStyle(style.slug, 8);
  const lowest = Math.min(...PRODUCTS.map(fromPrice));
  const highest = Math.max(...PRODUCTS.map(toPrice));
  const physicalFrom = Math.min(...PRODUCTS.filter((p) => p.type !== "digital").map(fromPrice));

  const faqs: FaqItem[] = [
    {
      q: `Can I see my dog as ${style.name} before I buy?`,
      a: `Yes. Upload a photo and your ${style.name} portrait appears free in about a minute. You can redo it as often as you like, or try other styles, and you only pay if you love it.`,
    },
    {
      q: `What photo works best for ${style.name}?`,
      a: `${c.photoTip} In general: a sharp, close-up photo at your dog's eye level, in soft natural light, with both eyes and ears visible.`,
      link: { href: "/how-it-works#photo-tips", label: "See all photo tips" },
    },
    {
      q: `Is ${style.name} hand-painted?`,
      a: "No. Our AI artist creates your portrait from your photo in this style, you approve it before paying, and a person on our team checks every print before it's printed. It's made to look like real art, and we'll never pretend it was painted by hand.",
    },
    {
      q: "How much does it cost?",
      a: `Physical pieces start at ${formatPrice(physicalFrom)}, and the digital file alone is ${formatPrice(fromPrice(PRODUCT_MAP.digital))}. US shipping is free, and every print, framed print and canvas includes the hi-res digital file.`,
      link: { href: "/shop", label: "See all sizes and prices" },
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${style.name} custom dog portrait`,
          description: c.metaDescription,
          image: absoluteUrl(STYLE_SAMPLES[style.slug]),
          brand: { "@type": "Brand", name: site.name },
          url: absoluteUrl(`/styles/${style.slug}`),
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: (lowest / 100).toFixed(2),
            highPrice: (highest / 100).toFixed(2),
            offerCount: PRODUCTS.reduce((n, p) => n + p.variants.length, 0),
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <ProductLayout
        galleryLabel={`${style.name} examples`}
        gallery={[
          <CampaignImage
            key="plain"
            src={STYLE_SAMPLES[style.slug]}
            alt={`Example ${style.name} portrait of a dog`}
            swatch={style.swatch}
            priority
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 70vw, 58vw"
          />,
          <ProductShot key="framed">
            <FramedArt style={style.slug} finish={c.frame} sizes="(max-width: 1024px) 50vw, 34vw" showLabel={false} />
          </ProductShot>,
        ]}
      >
        <ProductTitle
          kicker={<Breadcrumbs items={[{ href: "/styles", label: "Styles" }, { href: `/styles/${style.slug}`, label: style.name }]} />}
          title={style.name}
          price={`From ${formatPrice(lowest)}`}
        />
        <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-2">{firstSentences(honestDescription(style))}</p>
        {style.edition && <p className="label mt-4 text-ink-3">{style.edition}</p>}
        <Facts
          className="mt-9"
          items={[
            { label: "Suits", value: style.goodFor.map((g) => GOOD_FOR_LABELS[g]).join(", ") },
            {
              label: "Best on",
              value: best.map((p, i) => (
                <span key={p.type}>
                  <Link href={`/shop/${p.type}`} className="underline-offset-4 hover:underline">
                    {p.shortName}
                  </Link>
                  {i < best.length - 1 && ", "}
                </span>
              )),
            },
            { label: "Shown in", value: `${FRAME_LABELS[c.frame]} frame` },
            { label: "Preview", value: "Free" },
          ]}
        />
        <p className="mt-9 font-display text-[22px] leading-[1.25] sm:text-[24px]">
          You&apos;ll see your own dog in {style.name} before you pay.
        </p>
        <ButtonLink href={`/create?style=${style.slug}`} size="lg" className="mt-7 w-full">
          {OFFER.cta}
        </ButtonLink>
        <p className="label mt-5 text-center text-ink-3">{EFFORT_LINE}</p>
        <GuaranteeNote className="mt-9" link={false} />
        <Note className="mt-9 border-t border-line pt-6">Photo tip: {c.photoTip}</Note>
      </ProductLayout>

      {c.points.length > 0 && (
        <Block eyebrow={`Why ${style.name}`} title={c.h1} intro={style.blurb}>
          <Rows items={c.points.map((p) => ({ title: p.title, body: p.body }))} />
        </Block>
      )}

      <Block
        eyebrow="Available as"
        title="Made to hang"
        intro={`Every style works on every piece. These suit ${style.name} best, shown here with the same portrait so you can compare the pieces.`}
        layout="stack"
      >
        <ul className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-4 lg:grid-cols-3">
          {best.map((p) => (
            <li key={p.type}>
              {/* One picture across every format: this style's own sample, so the page never shows another style. */}
              <ProductCard product={p} src={STYLE_SAMPLES[style.slug]} />
            </li>
          ))}
        </ul>
      </Block>

      <Block
        titleStyle="label"
        title="Client services"
        intro={
          <>
            More answers in{" "}
            <Link href="/faq" className={textLink}>
              Client Services
            </Link>
            .
          </>
        }
      >
        <FaqList items={faqs} />
      </Block>

      {(others.length > 0 || breeds.length > 0) && (
        <Block eyebrow="Pairs well with" title="From the collection" layout="stack">
          {others.length > 0 && (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-4 sm:gap-x-4">
              {others.map((s) => (
                <li key={s.slug}>
                  <StyleCard style={s} compact sizes="(max-width: 640px) 50vw, 25vw" />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10">
            {breeds.length > 0 && (
              <>
                <p className="label text-ink-3">{style.name} by breed</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {breeds.map((b) => (
                    <li key={b.slug}>
                      <Link href={`/breeds/${b.slug}`} className="label text-ink transition-opacity hover:opacity-60">
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="flex flex-wrap gap-x-8 gap-y-3 sm:col-start-2">
              <Link href="/styles" className="link-cta">
                The collection
              </Link>
              <Link href="/breeds" className="link-cta">
                All breeds
              </Link>
            </p>
          </div>
        </Block>
      )}

      <CtaBand
        eyebrow={style.name}
        title={`See your dog in ${style.name}`}
        body={`Upload one photo and you'll see your own dog in ${style.name} in about a minute, before you pay anything.`}
        href={`/create?style=${style.slug}`}
      />
    </>
  );
}

/** A dated edition after its last day: a quiet note and the way back to the collection. */
function RetiredStyle({ style }: { style: ArtStyle }) {
  const others = stylesFor(style.goodFor, 4, style.slug);
  return (
    <>
      <Container className="py-24 text-center sm:py-36">
        <p className="label text-ink-3">The Collection</p>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-[44px] leading-[1.02] sm:text-[72px]">{style.name}</h1>
        <p className="mx-auto mt-6 max-w-sm text-[14px] leading-relaxed text-ink-2 sm:text-[15px]">
          {style.edition ? `${style.edition} ` : ""}It has been retired. Every other style is here, and every preview is
          free.
        </p>
        <div className="mt-12 flex flex-col items-center gap-5">
          <ButtonLink href="/styles" variant="primary" size="lg" className="w-full max-w-xs">
            Discover the collection
          </ButtonLink>
        </div>
      </Container>
      {others.length > 0 && (
        <Block eyebrow="From the collection" title="Where to begin instead" layout="stack">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-4 sm:gap-x-4">
            {others.map((s) => (
              <li key={s.slug}>
                <StyleCard style={s} compact sizes="(max-width: 640px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        </Block>
      )}
    </>
  );
}
