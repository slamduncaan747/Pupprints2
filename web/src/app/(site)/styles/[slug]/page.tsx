import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCT_MAP, PRODUCTS, STYLES, getStyle } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { FramedArt } from "@/components/marketing/framed-art";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts, Note, Rows, textLink } from "@/components/marketing/blocks";
import { StyleCard } from "@/components/marketing/style-card";
import { GOOD_FOR_LABELS, honestDescription, styleContent, stylesFor } from "@/components/marketing/style-content";
import { fromPrice, shipWindow, toPrice, FRAME_LABELS } from "@/components/marketing/commerce";
import { breedsForStyle } from "@/content/breeds";

export const dynamicParams = false;

export function generateStaticParams() {
  return STYLES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/styles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const style = getStyle(slug);
  if (!style) return {};
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
        { url: STYLE_SAMPLES[style.slug], width: 960, height: 1200, alt: `${style.name} dog portrait example` },
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

      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ href: "/styles", label: "Styles" }, { href: `/styles/${style.slug}`, label: style.name }]} />}
        title={c.h1}
        lede={<p>{honestDescription(style)}</p>}
        media={
          <figure className="mx-auto w-full max-w-[460px]">
            <FramedArt style={style.slug} finish={c.frame} priority sizes="(max-width: 1024px) 85vw, 440px" />
            <figcaption className="mt-5 text-center text-[13px] text-ink-3">
              Example in a {FRAME_LABELS[c.frame].toLowerCase()} frame. Yours is made from your photo.
            </figcaption>
          </figure>
        }
      >
        <Note>Good for {style.goodFor.map((g) => GOOD_FOR_LABELS[g].toLowerCase()).join(", ")}</Note>
      </PageHero>

      {c.points.length > 0 && (
        <Block title={`Why ${style.name}`} intro={style.blurb}>
          <Rows items={c.points.map((p) => ({ title: p.title, body: p.body }))} />
          <Note className="mt-6">Photo tip: {c.photoTip}</Note>
        </Block>
      )}

      <Block title="Where it looks best" intro="Every style works on every product. These are the ones we think suit it best.">
        <Facts
          items={best.map((p) => ({
            key: p.type,
            label: (
              <Link href={`/shop/${p.type}`} className={textLink}>
                {p.name}
              </Link>
            ),
            note: p.shipDays[1] === 0 ? "Delivered instantly by email" : `Arrives in ${shipWindow(p)}`,
            value: `${p.variants.length > 1 ? "from " : ""}${formatPrice(fromPrice(p))}`,
          }))}
        />
      </Block>

      <Block
        title="Good to know"
        intro={
          <>
            More answers in our{" "}
            <Link href="/faq" className={textLink}>
              FAQ
            </Link>
            .
          </>
        }
      >
        <FaqList items={faqs} />
      </Block>

      {(others.length > 0 || breeds.length > 0) && (
        <Block title="Styles that pair well" layout="stack">
          {others.length > 0 && (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
              {others.map((s) => (
                <li key={s.slug}>
                  <StyleCard style={s} compact sizes="(max-width: 640px) 45vw, 260px" />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-12 space-y-2 text-[15px] text-ink-2">
            {breeds.length > 0 && (
              <p>
                <span className="text-ink-3">{style.name} by breed: </span>
                {breeds.map((b, i) => (
                  <span key={b.slug}>
                    <Link href={`/breeds/${b.slug}`} className={textLink}>
                      {b.name}
                    </Link>
                    {i < breeds.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            <p>
              <Link href="/styles" className={textLink}>
                All styles
              </Link>
              <span className="text-ink-3"> · </span>
              <Link href="/breeds" className={textLink}>
                All breeds
              </Link>
            </p>
          </div>
        </Block>
      )}

      <CtaBand title={`See your dog in ${style.name}`} href={`/create?style=${style.slug}`} cta={`Try ${style.name} free`} />
    </>
  );
}
