import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCT_MAP, PRODUCTS, type ProductType } from "@/lib/catalog";
import { FORMAT_SHOWCASE, GUARANTEE, OFFER, valueStackFor } from "@/lib/offer";
import { site } from "@/lib/config";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CampaignImage, ProductLayout, ProductTitle } from "@/components/marketing/campaign";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { Block, Bullets, Facts, Note, textLink } from "@/components/marketing/blocks";
import { ProductCard } from "@/components/marketing/product-card";
import { FormatTile } from "@/components/marketing/format-showcase";
import { FrameMockup } from "@/components/product/frame-mockup";
import { EFFORT_LINE, GuaranteeNote, ValueStack } from "@/components/marketing/offer";
import { PRODUCT_CONTENT } from "@/components/marketing/product-content";
import { firstSentences } from "@/components/marketing/honest";
import { SizeTable } from "@/components/marketing/size-table";
import { Photo } from "@/components/marketing/photo";
import { FORMAT_SCENE, campaign } from "@/lib/campaign";
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

export default async function ProductTypePage({ params }: PageProps<"/shop/[type]">) {
  const { type } = await params;
  const product = getProduct(type);
  if (!product) notFound();

  const c = PRODUCT_CONTENT[product.type];
  const physical = isPhysical(product);
  const others = PRODUCTS.filter((p) => p.type !== product.type);
  const multi = product.variants.length > 1;

  const digitalIncluded = [
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
      link: { href: "/guarantee", label: GUARANTEE.name },
    },
  ];

  // Every image on the page shows the same portrait, so the differences you see are the format's.
  // The campaign scene of this piece leads the gallery once it exists; the drawn mockups follow.
  const scene = campaign(FORMAT_SCENE[product.type]);
  const lead = scene.live ? (
    <figure key="scene">
      <Photo photo={scene} ratio="4 / 5" eager sizes="(max-width: 640px) 86vw, (max-width: 1024px) 70vw, 58vw" />
      <figcaption className="label px-3 py-3 text-ink-3 sm:px-0 lg:px-10">{product.name}, in the room</figcaption>
    </figure>
  ) : null;
  const showcaseVariant = product.variants.find((v) => v.id === product.defaultVariantId) ?? product.variants[0];
  const pieces = product.frameColors
    ? product.frameColors.map((f, i) => (
        <figure key={f}>
          <FormatTile type={product.type} frameColor={f} priority={!lead && i === 0} zoom={false} scene={false} alt={`The portrait in a ${FRAME_LABELS[f].toLowerCase()} frame`} />
          <figcaption className="label px-3 py-3 text-ink-3 sm:px-0 lg:px-10">{FRAME_LABELS[f]} frame</figcaption>
        </figure>
      ))
    : [
        <figure key="piece">
          <FormatTile type={product.type} priority={!lead} zoom={false} scene={false} alt={`The portrait as a ${product.name.toLowerCase()}`} />
          <figcaption className="label px-3 py-3 text-ink-3 sm:px-0 lg:px-10">{product.name}</figcaption>
        </figure>,
        physical ? (
          <figure key="room">
            <FrameMockup
              src={FORMAT_SHOWCASE.src}
              alt={`The portrait as a ${showcaseVariant.label} ${product.name.toLowerCase()} on a wall, to scale`}
              productType={product.type}
              printSize={{ widthIn: showcaseVariant.widthIn, heightIn: showcaseVariant.heightIn }}
              room
              className="max-w-none"
            />
            <figcaption className="label px-3 py-3 text-ink-3 sm:px-0 lg:px-10">{showcaseVariant.label}, to scale</figcaption>
          </figure>
        ) : (
          <figure key="art">
            <CampaignImage
              src={FORMAT_SHOWCASE.src}
              alt="The portrait file, full resolution"
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 70vw, 58vw"
            />
            <figcaption className="label px-3 py-3 text-ink-3 sm:px-0 lg:px-10">The file, full frame</figcaption>
          </figure>
        ),
      ];

  const gallery = lead ? [lead, ...pieces] : pieces;

  const details = [
    { title: physical ? "Materials" : "The file", items: product.details },
    ...(physical ? [] : [{ title: "Included", items: digitalIncluded }]),
    { title: physical ? "Care" : "Keeping it safe", items: c.care },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Custom dog portrait — ${product.name}`,
          description: c.metaDescription,
          image: absoluteUrl(scene.live ? scene.src : FORMAT_SHOWCASE.src),
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

      <ProductLayout gallery={gallery} galleryLabel={`${product.name} examples`}>
        <ProductTitle
          kicker={<Breadcrumbs items={[{ href: "/shop", label: "Shop" }, { href: `/shop/${product.type}`, label: product.name }]} />}
          title={product.name}
          price={`${multi ? "From " : ""}${formatPrice(fromPrice(product))}`}
        />
        <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-2">{firstSentences(c.intro)}</p>

        <ButtonLink href="/create" size="lg" className="mt-9 w-full">
          {OFFER.cta}
        </ButtonLink>
        <p className="label mt-5 text-center text-ink-3">{EFFORT_LINE}</p>
        <p className="label mt-2 text-center text-ink-3">
          {physical ? `Free US shipping · Arrives in ${shipWindow(product)}` : "Delivered instantly · Free with any print"}
        </p>

        <div className="mt-10">
          <p className="label mb-4 text-ink-3">{multi ? "Sizes" : "Format"}</p>
          <SizeTable product={product} />
        </div>
        {product.frameColors && (
          <Facts
            className="mt-6 border-t-0"
            items={[{ label: "Frames", value: product.frameColors.map((f) => FRAME_LABELS[f]).join(" · ") }]}
          />
        )}

        <GuaranteeNote className="mt-10" />
        <Note className="mt-9 border-t border-line pt-6">
          {physical
            ? "Prices include free US shipping and the hi-res digital file. Art above furniture looks best at about two-thirds of its width."
            : "The digital file is free with every print, framed print and canvas. Buy it alone only if you don't want a physical piece."}
        </Note>
      </ProductLayout>

      {physical && (
        <Block
          id="included"
          eyebrow="Everything included"
          title="Everything included, in one price"
          intro={`${multi ? "From " : ""}${formatPrice(fromPrice(product))}, with free US shipping. Nothing is added at checkout.`}
        >
          <ValueStack
            items={valueStackFor({ productType: product.type, shipCountry: "US" })}
            total={{ label: "Your price", value: `${multi ? "From " : ""}${formatPrice(fromPrice(product))}` }}
          />
        </Block>
      )}

      <Block eyebrow="The details" title={c.h1} layout="stack">
        <div className={details.length > 2 ? "grid gap-12 md:grid-cols-3 md:gap-10" : "grid gap-12 md:grid-cols-2 md:gap-10"}>
          {details.map((g) => (
            <div key={g.title}>
              <h3 className="label text-ink">{g.title}</h3>
              <Bullets items={g.items} className="mt-5" />
            </div>
          ))}
        </div>
      </Block>

      <Block titleStyle="label" title="Delivery">
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
        titleStyle="label"
        title="Client services"
        intro={
          <>
            Still wondering? Read{" "}
            <Link href="/faq" className={textLink}>
              Client Services
            </Link>{" "}
            or{" "}
            <Link href="/contact" className={textLink}>
              write to us
            </Link>
            .
          </>
        }
      >
        <FaqList items={faqs} />
      </Block>

      <Block eyebrow="Also available" title="Other ways to hang it" layout="stack">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-4 lg:grid-cols-3">
          {others.map((p) => (
            <li key={p.type}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Block>

      <CtaBand
        eyebrow="Begin here"
        title="First, meet your portrait"
        body="See your portrait free in about a minute, then choose your size and finish."
      />
    </>
  );
}
