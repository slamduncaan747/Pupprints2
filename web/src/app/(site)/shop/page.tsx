import type { Metadata } from "next";
import Link from "next/link";
import { ADDONS, PRODUCT_MAP, PRODUCTS, STARTING_PHYSICAL_PRICE } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, DataTable, Facts, Note, Rows, textLink } from "@/components/marketing/blocks";
import { ProductCard } from "@/components/marketing/product-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { PRODUCT_CONTENT } from "@/components/marketing/product-content";
import { CANADA_SHIPPING_LABEL, PHYSICAL_PRODUCTS, shipWindow } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Custom Dog Portrait Prints, Framed Prints & Canvas",
  description: `Custom dog portraits as fine art prints, framed prints, gallery canvas or a digital file. Physical pieces from ${formatPrice(STARTING_PHYSICAL_PRICE)}, free US shipping, hi-res digital file included. Preview free first.`,
  alternates: { canonical: "/shop" },
};

/** All physical sizes, in catalog order of first appearance, sorted by area. */
const SIZES = [...new Set(PHYSICAL_PRODUCTS.flatMap((p) => p.variants.map((v) => v.label)))].sort((a, b) => {
  const area = (label: string) => {
    const v = PHYSICAL_PRODUCTS.flatMap((p) => p.variants).find((x) => x.label === label);
    return v ? v.widthIn * v.heightIn : 0;
  };
  return area(a) - area(b);
});

const INCLUDED = [
  { title: "The hi-res digital file", body: "Emailed right after checkout, free with every physical piece." },
  { title: "Free US shipping", body: "On every order, with tracking. No minimum, no surprise fees." },
  { title: "A human check", body: "A person on our team checks your art before it's printed." },
  { title: "Love-it guarantee", body: "Remake or full refund within 30 days of delivery." },
  { title: "Gift Reveal", body: "Ordering a gift? Send a digital reveal the moment you order." },
];

export default function ShopPage() {
  const digital = PRODUCT_MAP.digital;
  return (
    <>
      <PageHero
        eyebrow="Prints, frames & canvas"
        title="Honest prices, gallery-quality pieces"
        lede="Every portrait starts with a free preview of your dog. US shipping is free, and the hi-res digital file comes with every physical piece."
      />

      <Container className="pb-24 sm:pb-32">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <li key={p.type}>
              <ProductCard product={p} style={PRODUCT_CONTENT[p.type].exampleStyle} priority={i < 2} />
            </li>
          ))}
        </ul>
        <Note className="mt-12">
          Every style works on every product.{" "}
          <Link href="/styles" className={textLink}>
            Browse styles
          </Link>
        </Note>
      </Container>

      <Block
        id="prices"
        title="The price you see is the price you pay"
        intro={`No fake "compare at" prices, no countdown timers, no pre-checked add-ons. US shipping is included in every price.`}
      >
        <DataTable
          caption="Prices by size and product"
          head={[
            "Size",
            ...PHYSICAL_PRODUCTS.map((p) => (
              <Link key={p.type} href={`/shop/${p.type}`} className="hover:text-ink">
                {p.shortName}
              </Link>
            )),
          ]}
          rows={[
            ...SIZES.map((size) => ({
              key: size,
              cells: [
                size,
                ...PHYSICAL_PRODUCTS.map((p) => {
                  const v = p.variants.find((x) => x.label === size);
                  return v ? (
                    formatPrice(v.price)
                  ) : (
                    <span key={p.type} className="text-ink-3" aria-label="Not available">
                      —
                    </span>
                  );
                }),
              ],
            })),
            {
              key: "arrives",
              cells: [
                <span key="a" className="text-ink-3">
                  Arrives in (days)
                </span>,
                ...PHYSICAL_PRODUCTS.map((p) => (
                  <span key={p.type} className="text-ink-3">
                    {shipWindow(p).replace(" business days", "")}
                  </span>
                )),
              ],
            },
          ]}
        />
        <Facts
          className="mt-10"
          items={[
            {
              label: (
                <Link href="/shop/digital" className={textLink}>
                  {digital.name}
                </Link>
              ),
              note: "Delivered instantly by email. Free with any print, framed print or canvas.",
              value: formatPrice(digital.variants[0].price),
            },
          ]}
        />
        <Note className="mt-6">
          Prices in USD. Arrival times are US business days. Shipping to Canada is a flat {CANADA_SHIPPING_LABEL} per
          order.{" "}
          <Link href="/shipping" className={textLink}>
            Shipping details
          </Link>
        </Note>
      </Block>

      <Block title="Included with every physical piece">
        <Rows items={INCLUDED} />
      </Block>

      {ADDONS.length > 0 && (
        <Block
          title="Optional extras"
          intro="When you order a print, framed print or canvas, you can add matching pieces. They're never pre-checked."
        >
          <Facts items={ADDONS.map((a) => ({ key: a.id, label: a.name, note: a.description, value: formatPrice(a.price) }))} />
        </Block>
      )}

      <CtaBand
        title="Meet the portrait first"
        body="Upload a photo of your dog and see your portrait free in about a minute. Then choose a print, frame or canvas."
      />
    </>
  );
}
