import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCT_MAP, PRODUCTS, PROMISES, type ProductType } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { FramedArt, ProductArt } from "@/components/marketing/framed-art";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Facts, Note, textLink } from "@/components/marketing/blocks";
import { ProductCard } from "@/components/marketing/product-card";
import { PRODUCT_CONTENT } from "@/components/marketing/product-content";
import { SizeTable } from "@/components/marketing/size-table";
import {
  CANADA_SHIPPING_LABEL,
  FRAME_LABELS,
  fromPrice,
  isPhysical,
  shipWindow,
  toPrice,
} from "@/components/marketing/commerce";

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

const FRAME_EXAMPLES = ["royal", "watercolor", "oil-classic"] as const;

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

  const media = product.frameColors ? (
    <ul className="mx-auto grid max-w-[520px] grid-cols-3 items-end gap-4 sm:gap-6" aria-label="Frame colors">
      {product.frameColors.map((f, i) => (
        <li key={f}>
          <FramedArt
            style={FRAME_EXAMPLES[i % FRAME_EXAMPLES.length]}
            finish={f}
            priority={i === 0}
            sizes="(max-width: 1024px) 28vw, 160px"
          />
          <p className="mt-4 text-center text-[13px] text-ink-3">{FRAME_LABELS[f]}</p>
        </li>
      ))}
    </ul>
  ) : (
    <ProductArt
      type={product.type}
      style={c.exampleStyle}
      priority
      sizes="(max-width: 1024px) 80vw, 400px"
      className="mx-auto max-w-[460px]"
    />
  );

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
        title={c.h1}
        lede={<p>{c.intro}</p>}
        media={media}
      >
        <p className="font-display text-[2rem] leading-none">
          {multi && <span className="text-[1.25rem] text-ink-3">from </span>}
          {formatPrice(fromPrice(product))}
        </p>
        <Note className="mt-3">
          {physical ? `Free US shipping · Arrives in ${shipWindow(product)}` : "Delivered instantly by email · Free with any print"}
        </Note>
      </PageHero>

      <Block
        title={multi ? "Sizes & prices" : "Price"}
        intro={
          physical
            ? "Prices include free US shipping and the hi-res digital file. What you see is what you pay at checkout."
            : "The digital file is free with every print, framed print and canvas, so buy it on its own only if you don't want a physical piece."
        }
      >
        <SizeTable product={product} />
        {physical && (
          <Note className="mt-6">
            Measure the wall space first: art above furniture usually looks best at about two-thirds of its width.
          </Note>
        )}
      </Block>

      <Block title="The details">
        <div className="space-y-10">
          {[
            { title: physical ? "Materials & specs" : "The file", items: product.details },
            { title: "What's included", items: included },
            { title: physical ? "Care" : "Keeping it safe", items: c.care },
          ].map((g) => (
            <div key={g.title}>
              <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">{g.title}</h3>
              <Bullets items={g.items} className="mt-4" />
            </div>
          ))}
        </div>
      </Block>

      <Block title="Delivery">
        <Facts
          items={[
            {
              label: physical ? "Arrives in (US)" : "Delivery",
              note: physical ? "Production plus delivery, estimated" : "Emailed right after checkout",
              value: physical ? shipWindow(product) : "Instant",
            },
            {
              label: "Shipping",
              note: physical ? `Canada: flat ${CANADA_SHIPPING_LABEL} per order` : "Nothing to ship",
              value: physical ? "Free in the US" : "Free",
            },
            {
              label: "Tracking",
              note: physical ? (
                <>
                  Or check any time with{" "}
                  <Link href="/track" className={textLink}>
                    order tracking
                  </Link>
                </>
              ) : (
                "Check your inbox (and spam folder)"
              ),
              value: physical ? "Emailed" : "Not needed",
            },
          ]}
        />
      </Block>

      <Block
        title={`About the ${product.name.toLowerCase()}`}
        intro={
          <>
            Still wondering? Read the{" "}
            <Link href="/faq" className={textLink}>
              full FAQ
            </Link>{" "}
            or{" "}
            <Link href="/contact" className={textLink}>
              ask us
            </Link>
            .
          </>
        }
      >
        <FaqList items={faqs} />
      </Block>

      <Block title="Other ways to hang it" layout="stack">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <li key={p.type}>
              <ProductCard product={p} style={PRODUCT_CONTENT[p.type].exampleStyle} />
            </li>
          ))}
        </ul>
      </Block>

      <CtaBand
        title="First, meet your portrait"
        body="Every order starts with your photo. See your portrait free in about a minute, then choose your size and finish."
      />
    </>
  );
}
