import type { Metadata } from "next";
import Link from "next/link";
import { ADDONS, PRODUCT_MAP, STARTING_PHYSICAL_PRICE } from "@/lib/catalog";
import { HEIRLOOM_SET } from "@/lib/offer";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, DataTable, Facts, Note, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FormatShowcase } from "@/components/marketing/format-showcase";
import { FROM_PRICE, FoundingLine, GuaranteeNote, OfferCta, PriceAnchor, ValueStack } from "@/components/marketing/offer";
import { CANADA_SHIPPING_LABEL, PHYSICAL_PRODUCTS, shipWindow } from "@/components/marketing/commerce";
import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";
import { cn } from "@/lib/utils";

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

export default function ShopPage() {
  const digital = PRODUCT_MAP.digital;
  // The campaign: three example portraits hung along a hallway, under the title, edge to edge.
  const wall = campaign("galleryWall");
  return (
    <>
      <PageHero
        eyebrow="The Shop"
        title="Made to hang"
        lede="Every piece begins with a free preview of your own dog. See the art first, then choose how to hang it."
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
            <h2 id="formats-title" className="font-display text-[30px] leading-[1.06] sm:text-[40px]">
              Same portrait, four ways
            </h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink-2">
              One portrait shown in every format, so you can compare the pieces, not the pictures.
            </p>
          </div>
          <FormatShowcase variant="compare" />

          <div className="mt-16 grid gap-10 border-t border-line pt-8 sm:mt-20 md:grid-cols-2 md:gap-16">
            <FoundingLine />
            <div>
              <p className="label text-ink">Every style, every piece</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                Any of the styles works on any piece.{" "}
                <Link href="/styles" className={textLink}>
                  The collection
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Block
        id="included"
        eyebrow="Everything included"
        title="One price, everything included"
        intro={
          <>
            <p className="font-display text-[36px] leading-none tracking-[-0.02em] text-ink sm:text-[44px]">{FROM_PRICE}</p>
            <PriceAnchor className="mt-4" />
          </>
        }
      >
        <ValueStack />
        <OfferCta className="mt-10" />
        <GuaranteeNote className="mt-14" />
      </Block>

      <Block
        id="prices"
        eyebrow="The price list"
        title="The price you see is the price you pay"
        intro={`No fake "compare at" prices, no countdown timers, no pre-checked add-ons. US shipping is included in every price.`}
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
              note: "Delivered instantly by email. Free with any print, framed print or canvas.",
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
        <Block
          eyebrow={HEIRLOOM_SET.name}
          title="Small companions"
          intro={`With a print, framed print or canvas, you can add matching pieces. They're never pre-checked. ${HEIRLOOM_SET.line}`}
        >
          <Facts
            items={[
              ...ADDONS.map((a) => ({ key: a.id, label: a.name, note: a.description, value: formatPrice(a.price) })),
              {
                key: "set",
                label: "Both together",
                note: `${HEIRLOOM_SET.name}: instead of ${formatPrice(HEIRLOOM_SET.addonsTotal)}`,
                value: formatPrice(HEIRLOOM_SET.addonsTotal - HEIRLOOM_SET.discountCents),
              },
            ]}
          />
        </Block>
      )}

      <CtaBand
        eyebrow="Begin here"
        title="Meet the portrait first"
        body="See your portrait free in about a minute. Then choose a print, frame or canvas."
        image="oil-classic"
      />
    </>
  );
}
