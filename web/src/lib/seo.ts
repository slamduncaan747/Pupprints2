/**
 * Structured data (schema.org JSON-LD) + metadata helpers.
 *
 * - Every builder returns a plain object; render it with `<script {...jsonLdProps(data)} />`.
 * - Prices come from @/lib/catalog. We have no reviews yet, so there is deliberately
 *   NO aggregateRating / review markup anywhere. Never add it until real reviews exist.
 * - Safe to import from server and client code (no server-only deps).
 */
import type { Metadata } from "next";
import { PRODUCTS, type Product, type ProductType } from "@/lib/catalog";
import { site } from "@/lib/config";

type Json = Record<string, unknown>;

/** Absolute URL on our own origin (uses site.url so previews and prod agree with the sitemap). */
export function siteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/** Props for a JSON-LD <script>. `<` is escaped so content can never close the tag. */
export function jsonLdProps(data: Json | Json[]) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
  } as const;
}

const ORG_ID = `${siteUrl("/")}#organization`;
const WEBSITE_ID = `${siteUrl("/")}#website`;

/* ------------------------------------------------------------------ */
/* Organization + WebSite                                              */
/* ------------------------------------------------------------------ */

export function organizationJsonLd({ logo }: { logo?: string } = {}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: siteUrl("/"),
    description: site.description,
    ...(logo ? { logo: siteUrl(logo) } : {}),
    email: site.supportEmail,
    sameAs: Object.values(site.social),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.supportEmail,
      areaServed: ["US", "CA"],
      availableLanguage: "English",
    },
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: siteUrl("/"),
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

/** Compact reference to the brand, used inside other entities. */
function orgRef(): Json {
  return { "@type": "Organization", "@id": ORG_ID, name: site.name, url: siteUrl("/") };
}

/* ------------------------------------------------------------------ */
/* Product                                                             */
/* ------------------------------------------------------------------ */

function priceRange(products: Product[]) {
  const prices = products.flatMap((p) => p.variants.map((v) => v.price));
  return { low: Math.min(...prices), high: Math.max(...prices), count: prices.length };
}

/** Cents -> "59.00" (schema.org wants a plain decimal string). */
function decimal(cents: number) {
  return (cents / 100).toFixed(2);
}

/**
 * A custom portrait as a Product with an AggregateOffer spanning the chosen product types.
 * Defaults to every product in the catalog (digital file through 24×36 canvas).
 */
export function productJsonLd({
  name,
  description,
  path,
  image,
  types,
  sku,
}: {
  name: string;
  description: string;
  path: string;
  image?: string | string[];
  /** Restrict offers to these product types (e.g. ["canvas"] on /shop/canvas). */
  types?: ProductType[];
  sku?: string;
}): Json {
  const products = types ? PRODUCTS.filter((p) => types.includes(p.type)) : PRODUCTS;
  const { low, high, count } = priceRange(products);
  const images = image ? (Array.isArray(image) ? image : [image]).map((i) => siteUrl(i)) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: siteUrl(path),
    ...(images ? { image: images } : {}),
    ...(sku ? { sku } : {}),
    brand: { "@type": "Brand", name: site.name },
    category: "Home & Garden > Decor > Artwork",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: decimal(low),
      highPrice: decimal(high),
      offerCount: count,
      availability: "https://schema.org/InStock",
      url: siteUrl(path),
      seller: orgRef(),
    },
  };
}

/* ------------------------------------------------------------------ */
/* BreadcrumbList                                                      */
/* ------------------------------------------------------------------ */

export type Crumb = { name: string; path: string };

/** Pass the trail WITHOUT "Home"; it is prepended. The last crumb is the current page. */
export function breadcrumbJsonLd(crumbs: Crumb[]): Json {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: siteUrl(c.path),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* FAQPage                                                             */
/* ------------------------------------------------------------------ */

/** Answers should be plain text (blank lines are collapsed to a space). */
export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a.replace(/\s*\n+\s*/g, " ") },
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Article                                                             */
/* ------------------------------------------------------------------ */

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
  section,
  wordCount,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  /** ISO date, e.g. "2026-10-06". */
  datePublished: string;
  dateModified?: string;
  image?: string;
  section?: string;
  wordCount?: number;
  keywords?: string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: siteUrl(path),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(path) },
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(image ? { image: [siteUrl(image)] } : {}),
    ...(section ? { articleSection: section } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    inLanguage: "en-US",
    // Written by the team; we never invent named authors.
    author: orgRef(),
    publisher: orgRef(),
  };
}

/* ------------------------------------------------------------------ */
/* ItemList (index pages)                                              */
/* ------------------------------------------------------------------ */

export function itemListJsonLd(items: { name: string; path: string }[], name?: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(name ? { name } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: siteUrl(it.path),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Page metadata                                                        */
/* ------------------------------------------------------------------ */

/**
 * Consistent per-page metadata: canonical URL plus Open Graph + Twitter cards.
 * `title` is the bare page title (the root layout template appends "| Pup Prints").
 * Open Graph fields from the root layout are replaced (not merged) by Next, so siteName etc. are restated.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  section,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}): Metadata {
  const images = image ? [{ url: image, alt: imageAlt ?? title }] : undefined;
  const og: NonNullable<Metadata["openGraph"]> =
    type === "article"
      ? {
          type: "article",
          title,
          description,
          url: path,
          siteName: site.name,
          locale: "en_US",
          publishedTime,
          modifiedTime: modifiedTime ?? publishedTime,
          section,
          tags,
          authors: [site.name],
          ...(images ? { images } : {}),
        }
      : {
          type: "website",
          title,
          description,
          url: path,
          siteName: site.name,
          locale: "en_US",
          ...(images ? { images } : {}),
        };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: og,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
