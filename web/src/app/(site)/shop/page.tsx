import type { Metadata } from "next";
import Link from "next/link";
import { ADDONS, PRODUCT_MAP, STARTING_PHYSICAL_PRICE } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, DataTable, Facts, Note, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FormatShowcase } from "@/components/marketing/format-showcase";
import { CANADA_SHIPPING_LABEL, PHYSICAL_PRODUCTS, shipWindow } from "@/components/marketing/commerce";
import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom Dog Portrait Prints, Framed Prints & Canvas",
  description: `Custom dog portraits as fine art prints, framed prints, gallery canvas or a digital file. Physical pieces from ${formatPrice(STARTING_PHYSICAL_PRICE)}, free US shipping, hi-res digital file included.`,
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

export default function ShopPage() {
  const digital = PRODUCT_MAP.digital;
  // The campaign: three example portraits hung along a hallway, under the title, edge to edge.
  const wall = campaign("galleryWall");
  return (
    <>
      <PageHero
        title="Shop"
        lede="Print, framed print, canvas or digital file. Upload a photo first; you choose the format after you have seen the portrait."
      />

      {wall.live && (
        <Photo
          photo={wall}
          ratio={null}
          sizes="100vw"
          eager
          className="aspect-[4/3] md:aspect-auto md:h-[min(84svh,60vw)] md:min-h-[440px]"
        />
      )}

      <section aria-labelledby="formats-title" className={cn("pb-24 sm:pb-36", wall.live && "pt-24 sm:pt-36")}>
        <Container>
          <div
            className={cn(
              "mb-10 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 sm:mb-14",
              !wall.live && "border-t border-line pt-8 sm:pt-10",
            )}
          >
            <h2 id="formats-title" className="font-display text-[30px] leading-[1.08] sm:text-[40px]">
              The formats
            </h2>
          </div>
          <FormatShowcase variant="compare" />
        </Container>
      </section>

      <Block
        id="prices"
        title="Prices"
        intro="US shipping is included in every price."
      >
        <DataTable
          caption="Prices by size and product"
          head={[
            "Size",
            ...PHYSICAL_PRODUCTS.map((p) => (
              <Link key={p.type} href={`/shop/${p.type}`} className="transition-colors hover:text-ink">
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
                  Arrives (days)
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
          className="mt-12"
          items={[
            {
              label: (
                <Link href="/shop/digital" className="underline-offset-4 hover:underline">
                  {digital.name}
                </Link>
              ),
              note: "Delivered by email. Included with any print, framed print or canvas.",
              value: formatPrice(digital.variants[0].price),
            },
          ]}
        />
        <Note className="mt-8">
          Prices in USD. Arrival times are US business days. Shipping to Canada is a flat {CANADA_SHIPPING_LABEL} per
          order.{" "}
          <Link href="/shipping" className={textLink}>
            Shipping details
          </Link>
        </Note>
      </Block>

      {ADDONS.length > 0 && (
        <Block title="Add-ons" intro="Optional, with a print, framed print or canvas.">
          <Facts
            items={ADDONS.map((a) => ({ key: a.id, label: a.name, note: a.description, value: formatPrice(a.price) }))}
          />
        </Block>
      )}

      <CtaBand image="modern" />
    </>
  );
}
