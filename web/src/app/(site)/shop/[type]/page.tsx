import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Droplets, Ruler } from "lucide-react";
import { PRODUCT_MAP, PRODUCTS, PROMISES, type ProductType } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { FramedArt, ProductScene } from "@/components/marketing/framed-art";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { FrameSwatches, ProductCard } from "@/components/marketing/product-card";
import { PRODUCT_CONTENT } from "@/components/marketing/product-content";
import { SizeTable } from "@/components/marketing/size-table";
import { CANADA_SHIPPING_LABEL, fromPrice, isPhysical, shipWindow, toPrice } from "@/components/marketing/commerce";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ type: p.type }));
}

function getProduct(type: string) {
  return PRODUCT_MAP[type as ProductType];
}

export async function generateMetadata({ params }: PageProps<"/shop/[type]">): Promise<Metadata> {
  const { type } = await params;
  const product = getProduct(type);
  if (!product) return {};
  const c = PRODUCT_CONTENT[product.type];
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: { canonical: `/shop/${product.type}` },
    openGraph: {
      type: "website",
      title: `${c.title} | ${site.name}`,
      description: c.metaDescription,
      url: `/shop/${product.type}`,
      siteName: site.name,
      locale: "en_US",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.title} | ${site.name}`,
      description: c.metaDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function ProductTypePage({ params }: PageProps<"/shop/[type]">) {
  const { type } = await params;
  const product = getProduct(type);
  if (!product) notFound();

  const c = PRODUCT_CONTENT[product.type];
  const physical = isPhysical(product);
  const others = PRODUCTS.filter((p) => p.type !== product.type);
  const multi = product.variants.length > 1;

  const included = physical
    ? [
        `Your portrait as a ${product.name.toLowerCase()}, in the size you choose`,
        PROMISES.digital,
        "Free US shipping with tracking",
        "A person on our team checks it before it's printed",
        "Our love-it guarantee: remake or full refund within 30 days of delivery",
        "Ordering a gift? A Gift Reveal you can send instantly",
      ]
    : [
        "The full-resolution, unwatermarked file of your portrait",
        "Delivered to your inbox right after checkout",
        "A personal-use license: print it, share it, post it",
        "If anything's wrong with your file, we'll fix it",
      ];

  const faqs: FaqItem[] = [
    ...c.faq,
    physical
      ? {
          q: `How long does a ${product.name.toLowerCase()} take to arrive?`,
          a: `About ${shipWindow(product)} in the US, including production. We email tracking as soon as it ships. Canadian orders usually take a few extra business days, and shipping to Canada is a flat ${CANADA_SHIPPING_LABEL}.`,
          link: { href: "/shipping", label: "Shipping details" },
        }
      : {
          q: "How quickly will I get it?",
          a: "Right away. The file is emailed to you as soon as you check out, usually within minutes.",
        },
    {
      q: "What if I don't love it?",
      a: physical
        ? "Tell us within 30 days of delivery and we'll remake it free or refund you in full. If it arrives damaged, send us a photo and we'll replace it."
        : "You see the exact art before you pay, but if something isn't right with your file, write to us and we'll make it right.",
      link: { href: "/guarantee", label: "Our love-it guarantee" },
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Custom dog portrait — ${product.name}`,
          description: c.metaDescription,
          image: absoluteUrl(STYLE_SAMPLES[c.exampleStyle]),
          brand: { "@type": "Brand", name: site.name },
          url: absoluteUrl(`/shop/${product.type}`),
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: (fromPrice(product) / 100).toFixed(2),
            highPrice: (toPrice(product) / 100).toFixed(2),
            offerCount: product.variants.length,
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ href: "/shop", label: "Shop" }, { href: `/shop/${product.type}`, label: product.name }]} />}
        eyebrow={product.name}
        title={c.h1}
        lede={
          <>
            <p>{c.intro}</p>
            <p className="mt-6 font-display text-3xl text-ink">
              {multi && <span className="text-xl text-ink-3">from </span>}
              {formatPrice(fromPrice(product))}
            </p>
          </>
        }
        actions={
          <ButtonLink href="/create" variant="accent" size="lg" className="w-full sm:w-auto">
            Start with a free preview <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
        note={
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-moss" aria-hidden="true" />
              {physical ? `Arrives in ${shipWindow(product)}` : "Delivered instantly by email"}
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-moss" aria-hidden="true" />
              {physical ? "Free US shipping" : "Free with any print"}
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-moss" aria-hidden="true" />
              Love-it guarantee
            </li>
          </ul>
        }
        aside={
          product.frameColors ? (
            <div className="rounded-[2rem] bg-paper-2 p-8 sm:p-10">
              <div className="grid grid-cols-3 items-end gap-4 sm:gap-6">
                {product.frameColors.map((f, i) => (
                  <FramedArt
                    key={f}
                    style={(["royal", "watercolor", "oil-classic"] as const)[i % 3]}
                    finish={f}
                    priority={i === 0}
                    sizes="(max-width: 1024px) 28vw, 12vw"
                    className={i === 1 ? "-translate-y-4" : undefined}
                  />
                ))}
              </div>
              <FrameSwatches colors={product.frameColors} className="mt-8 flex-wrap justify-center" />
            </div>
          ) : (
            <ProductScene type={product.type} style={c.exampleStyle} priority className="mx-auto max-w-[560px] rounded-[2rem]" />
          )
        }
      />

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">{multi ? "Sizes & prices" : "Price"}</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
              {multi ? "Choose a size that fits the wall" : "One simple price"}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              {physical
                ? "Prices include free US shipping and the hi-res digital file. What you see here is what you pay at checkout."
                : "The digital file is free with every print, framed print and canvas, so buy it on its own only if you don't want a physical piece."}
            </p>
            {physical && (
              <p className="mt-6 flex items-start gap-3 text-[15px] text-ink-2">
                <Ruler className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden="true" />
                Measure the wall space first: art above furniture usually looks best at about two-thirds of its width.
              </p>
            )}
          </div>
          <SizeTable product={product} />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="font-display text-3xl">{physical ? "Materials & specs" : "The file"}</h2>
            <ul className="mt-6 space-y-3">
              {product.details.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">What&apos;s included</h2>
            <ul className="mt-6 space-y-3">
              {included.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">{physical ? "Care" : "Keeping it safe"}</h2>
            <ul className="mt-6 space-y-3">
              {c.care.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <Droplets className="mt-1 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 rounded-card bg-paper p-7 ring-1 ring-line sm:p-10 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">{physical ? "Arrives in (US)" : "Delivery"}</p>
              <p className="mt-2 font-display text-3xl">{physical ? shipWindow(product) : "Instant"}</p>
              <p className="mt-1 text-sm text-ink-2">{physical ? "Production plus delivery, estimated" : "Emailed right after checkout"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Shipping</p>
              <p className="mt-2 font-display text-3xl">{physical ? "Free in the US" : "Free"}</p>
              <p className="mt-1 text-sm text-ink-2">
                {physical ? `Canada: flat ${CANADA_SHIPPING_LABEL} per order` : "Nothing to ship"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">Tracking</p>
              <p className="mt-2 font-display text-3xl">{physical ? "Emailed" : "Not needed"}</p>
              <p className="mt-1 text-sm text-ink-2">
                {physical ? (
                  <>
                    Or check any time on{" "}
                    <Link href="/track" className="underline underline-offset-4 hover:text-ink">
                      order tracking
                    </Link>
                  </>
                ) : (
                  "Check your inbox (and spam folder)"
                )}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">About the {product.name.toLowerCase()}</h2>
            <p className="mt-5 text-lg text-ink-2">
              Still wondering?{" "}
              <Link href="/faq" className="text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
                Read the full FAQ
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
                ask us
              </Link>
              .
            </p>
          </div>
          <FaqList items={faqs} />
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container>
          <SectionHeading eyebrow="Other ways to hang it" title="Compare the options" />
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.type}>
                <ProductCard product={p} style={PRODUCT_CONTENT[p.type].exampleStyle} onTint />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        eyebrow={`${product.name} · free preview first`}
        title="First, meet your portrait"
        body="Every order starts with your photo. See your portrait free in about a minute, then choose your size and finish."
        cta="Start with a free preview"
      />
    </>
  );
}
