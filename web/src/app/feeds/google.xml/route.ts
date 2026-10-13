/**
 * Google Merchant Center product feed (free Shopping listings): /feeds/google.xml
 *
 * RSS 2.0 + the g: namespace. One item per catalog variant, plus style-specific items for the
 * top styles on the default canvas and framed sizes. Everything comes from @/lib/catalog, so the
 * feed can never disagree with checkout. Static, revalidated daily.
 *
 * Honesty: catalog copy that claims popularity ("most popular", "best-selling") is stripped,
 * and there is no rating/review data in the feed.
 */
import { PRODUCTS, PROMISES, SHIPPING_RATES, STYLES, type ArtStyle, type Product, type Variant } from "@/lib/catalog";
import { site } from "@/lib/config";
import { STYLE_SAMPLES } from "@/lib/samples";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 86400;

/** Home & Garden > Decor > Artwork > Posters, Prints & Visual Artwork */
const GOOGLE_CATEGORY = "500044";

/** Style used for the image of size-level (style-agnostic) items. */
const DEFAULT_STYLE = STYLES.find((s) => s.popular) ?? STYLES[0];

/** The 4 styles that also get their own items on the default canvas + framed sizes. */
const FEATURED_STYLES = STYLES.filter((s) => s.popular).slice(0, 4);

const NOUN: Record<Product["type"], string> = {
  canvas: "Gallery Canvas",
  framed: "Framed Print",
  poster: "Fine Art Print",
  digital: "Digital File",
};

const PRODUCT_TYPE_PATH: Record<Product["type"], string> = {
  canvas: "Home & Garden > Wall Art > Canvas Prints",
  framed: "Home & Garden > Wall Art > Framed Prints",
  poster: "Home & Garden > Wall Art > Art Prints",
  digital: "Home & Garden > Wall Art > Digital Art",
};

const UNVERIFIABLE = /best-?sell|most[- ](requested|popular|gifted|loved)|everyone asks|bestseller/i;

/** Drop sentences that claim popularity we can't verify yet. */
function honest(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => !UNVERIFIABLE.test(s))
    .join(" ");
}

function xml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function money(cents: number) {
  return `${(cents / 100).toFixed(2)} USD`;
}

function size(v: Variant) {
  return v.widthIn ? `${v.widthIn}x${v.heightIn} in` : "";
}

/** "The Royal" -> "Royal". */
function shortStyle(style: ArtStyle) {
  return style.name.replace(/^The\s+/i, "");
}

type Item = {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  price: number;
  product: Product;
  variant: Variant;
  groupId?: string;
  style?: ArtStyle;
};

function describe(product: Product, variant: Variant, style?: ArtStyle) {
  const parts = [
    style
      ? `A custom ${shortStyle(style)}-style portrait of your dog, made from your photo. ${honest(style.description)}`
      : "A custom fine-art portrait of your dog, made from your photo, in the style you choose: royal, admiral, old-master oil, watercolor, fine line, pop art and more.",
    `${PROMISES.preview}: upload a photo, see it in about a minute, and only order if you love it.`,
    product.type === "digital"
      ? "The full-resolution file is emailed to you right after checkout."
      : `${product.name}${variant.widthIn ? `, ${variant.widthIn}×${variant.heightIn} inches` : ""}. ${honest(product.tagline)} ${product.details.join(". ")}.`,
    product.type === "digital" ? "" : `${PROMISES.digital}. ${PROMISES.shipping}.`,
    `${PROMISES.guarantee}. Every portrait is checked by a person on our team before it's printed.`,
  ];
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").replace(/\.\./g, ".").trim();
}

function variantTitle(product: Product, variant: Variant) {
  if (product.type === "digital") return "Custom Dog Portrait Digital File — High-Res, Made From Your Photo";
  return `Custom Dog Portrait ${NOUN[product.type]} ${variant.widthIn}x${variant.heightIn} — Made From Your Photo`;
}

function styleTitle(product: Product, variant: Variant, style: ArtStyle) {
  return `Custom Dog Portrait ${NOUN[product.type]} ${variant.widthIn}x${variant.heightIn} — ${shortStyle(style)} Style, Made From Your Photo`;
}

function buildItems(): Item[] {
  const items: Item[] = [];

  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      items.push({
        id: variant.id,
        title: variantTitle(product, variant),
        description: describe(product, variant),
        link: siteUrl(`/shop/${product.type}`),
        image: siteUrl(STYLE_SAMPLES[DEFAULT_STYLE.slug]),
        price: variant.price,
        product,
        variant,
        groupId: product.variants.length > 1 ? `dog-portrait-${product.type}` : undefined,
      });
    }
  }

  for (const type of ["canvas", "framed"] as const) {
    const product = PRODUCTS.find((p) => p.type === type);
    const variant = product?.variants.find((v) => v.id === product.defaultVariantId);
    if (!product || !variant) continue;
    for (const style of FEATURED_STYLES) {
      items.push({
        id: `${variant.id}-${style.slug}`,
        title: styleTitle(product, variant, style),
        description: describe(product, variant, style),
        link: siteUrl(`/styles/${style.slug}`),
        image: siteUrl(STYLE_SAMPLES[style.slug]),
        price: variant.price,
        product,
        variant,
        style,
      });
    }
  }

  return items;
}

function renderItem(item: Item) {
  const { product, variant } = item;
  const physical = product.type !== "digital";
  const lines = [
    `<g:id>${xml(item.id)}</g:id>`,
    `<g:title>${xml(item.title.slice(0, 150))}</g:title>`,
    `<g:description>${xml(item.description.slice(0, 5000))}</g:description>`,
    `<g:link>${xml(item.link)}</g:link>`,
    `<g:image_link>${xml(item.image)}</g:image_link>`,
    `<g:availability>in_stock</g:availability>`,
    `<g:price>${money(item.price)}</g:price>`,
    `<g:condition>new</g:condition>`,
    `<g:brand>${xml(site.name)}</g:brand>`,
    `<g:identifier_exists>no</g:identifier_exists>`,
    `<g:google_product_category>${GOOGLE_CATEGORY}</g:google_product_category>`,
    `<g:product_type>${xml(PRODUCT_TYPE_PATH[product.type])}</g:product_type>`,
    item.groupId ? `<g:item_group_id>${xml(item.groupId)}</g:item_group_id>` : "",
    physical && size(variant) ? `<g:size>${xml(size(variant))}</g:size>` : "",
    `<g:shipping><g:country>US</g:country><g:service>Standard</g:service><g:price>${money(SHIPPING_RATES.US)}</g:price></g:shipping>`,
    physical ? `<g:shipping_label>${product.type}</g:shipping_label>` : "",
    `<g:custom_label_0>${xml(product.type)}</g:custom_label_0>`,
    `<g:custom_label_1>${xml(item.style ? item.style.slug : "any-style")}</g:custom_label_1>`,
  ].filter(Boolean);
  return `    <item>\n      ${lines.join("\n      ")}\n    </item>`;
}

export function GET() {
  const items = buildItems();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(`${site.name} — Custom Dog Portraits`)}</title>
    <link>${xml(siteUrl("/"))}</link>
    <description>${xml(site.description)}</description>
${items.map(renderItem).join("\n")}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
