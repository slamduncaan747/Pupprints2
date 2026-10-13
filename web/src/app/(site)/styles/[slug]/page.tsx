import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, Check } from "lucide-react";
import { PRODUCT_MAP, PRODUCTS, STYLES, getStyle } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { FramedArt, ProductScene } from "@/components/marketing/framed-art";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Steps, defaultSteps } from "@/components/marketing/steps";
import { StyleCard } from "@/components/marketing/style-card";
import { FrameSwatches } from "@/components/marketing/product-card";
import { GOOD_FOR_LABELS, honestDescription, styleContent, stylesFor } from "@/components/marketing/style-content";
import { fromPrice, shipWindow, toPrice, FRAME_LABELS } from "@/components/marketing/commerce";
import { honestText } from "@/components/marketing/honest";

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
      images: [{ url: STYLE_SAMPLES[style.slug], width: 960, height: 1200, alt: `${style.name} dog portrait example` }],
    },
  };
}

export default async function StylePage({ params }: PageProps<"/styles/[slug]">) {
  const { slug } = await params;
  const style = getStyle(slug);
  if (!style) notFound();

  const c = styleContent(style);
  const createHref = `/create?style=${style.slug}`;
  const best = c.bestOn.map((t) => PRODUCT_MAP[t]).filter(Boolean);
  const others = stylesFor(style.goodFor, 4, style.slug);
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
        eyebrow={c.keyword}
        title={c.h1}
        lede={
          <>
            <p>{honestDescription(style)}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Good for">
              {style.goodFor.map((g) => (
                <li key={g} className="rounded-full bg-paper-2 px-3 py-1 text-sm text-ink-2 ring-1 ring-line">
                  {GOOD_FOR_LABELS[g]}
                </li>
              ))}
            </ul>
          </>
        }
        actions={
          <ButtonLink href={createHref} variant="accent" size="lg" className="w-full sm:w-auto">
            Try {style.name} with your dog <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
        note={
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {["Free preview, no card needed", "Love-it guarantee", "Free US shipping"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-moss" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        }
        aside={
          <div className="relative mx-auto w-full max-w-[440px] rounded-[2rem] bg-paper-2 px-[13%] py-[11%]">
            <FramedArt style={style.slug} finish={c.frame} priority sizes="(max-width: 1024px) 75vw, 34vw" />
            <p className="mt-6 text-center text-sm text-ink-3">
              Example in a {FRAME_LABELS[c.frame].toLowerCase()} frame. Yours is made from your photo.
            </p>
          </div>
        }
      />

      {c.points.length > 0 && (
        <Section className="bg-paper-2 py-16 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <Eyebrow className="mb-4">Why {style.name}</Eyebrow>
                <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">{style.blurb}</h2>
                <div className="mt-8 flex gap-4 rounded-card bg-paper p-6 ring-1 ring-line">
                  <Camera className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden="true" />
                  <p className="text-[15px] leading-relaxed text-ink-2">
                    <span className="font-medium text-ink">Photo tip: </span>
                    {c.photoTip}
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {c.points.map((p, i) => (
                  <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-7">
                    <span className="font-display text-xl text-clay">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-2xl">{p.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink-2">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <SectionHeading eyebrow="How it works" title={`Your dog in ${style.name}, in four steps`} />
          <Steps steps={defaultSteps(style.name)} className="mt-16" />
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container>
          <SectionHeading
            eyebrow="Where it looks best"
            title={`How to hang ${style.name}`}
            subtitle="Every style works on every product. These are the ones we think suit it best."
          />
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {best.map((p) => (
              <li key={p.type} className="flex flex-col">
                <ProductScene type={p.type} style={style.slug} finish={p.type === "framed" ? c.frame : undefined} className="bg-paper" />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <p className="text-ink-2">
                    {p.variants.length > 1 && "from "}
                    <span className="font-medium text-ink">{formatPrice(fromPrice(p))}</span>
                  </p>
                </div>
                <p className="mt-1.5 text-[15px] text-ink-2">{honestText(p.tagline)}</p>
                {p.frameColors && <FrameSwatches colors={p.frameColors} className="mt-3" />}
                <p className="mt-3 text-sm text-ink-3">
                  {p.shipDays[1] === 0 ? "Delivered instantly by email" : `Arrives in ${shipWindow(p)}`}
                </p>
                <Link
                  href={`/shop/${p.type}`}
                  className="mt-4 inline-flex items-center gap-1.5 self-start text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
                >
                  Sizes &amp; details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Good to know</h2>
            <p className="mt-5 text-lg text-ink-2">
              More answers in our{" "}
              <Link href="/faq" className="text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
                FAQ
              </Link>
              .
            </p>
          </div>
          <FaqList items={faqs} />
        </Container>
      </Section>

      {others.length > 0 && (
        <Section className="bg-paper-2">
          <Container>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading align="left" eyebrow="Keep exploring" title="Styles that pair well" />
              <ButtonLink href="/styles" variant="secondary" className="self-start sm:self-auto">
                All styles
              </ButtonLink>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {others.map((s) => (
                <li key={s.slug}>
                  <StyleCard style={s} showTags={false} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand
        eyebrow={`${style.name} · free preview`}
        title={`See your dog in ${style.name}`}
        href={createHref}
        cta={`Try ${style.name} free`}
      />
    </>
  );
}
