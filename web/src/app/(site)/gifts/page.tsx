import type { Metadata } from "next";
import Link from "next/link";
import { STYLE_MAP, type ProductType } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { FORMAT_SHOWCASE, HOLIDAY } from "@/lib/offer";
import { FrameMockup } from "@/components/product/frame-mockup";
import { OfferCta, beforeHolidayCutoff } from "@/components/marketing/offer";
import { cn, formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { ZoomImage } from "@/components/marketing/campaign";
import { EVERYTHING_CARD, OCCASIONS } from "@/components/marketing/gift-occasions";
import { PRICE_BANDS, itemLabel, itemsInBand, type PricedItem } from "@/components/marketing/commerce";
import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";

export const metadata: Metadata = {
  title: "Gifts for Dog Lovers — Custom Dog Portrait Gift Guide",
  description:
    "Custom portraits of their dog as a gift: for birthdays, Christmas, Mother's Day, memorials and new puppies. Free US shipping.",
  alternates: { canonical: "/gifts" },
};

/**
 * The piece pictured for each price band, always the same portrait, hung to scale on the same wall:
 * the largest piece of this type the band covers. So the bands compare formats and sizes, not pictures.
 */
const BAND_PIECE: ProductType[] = ["poster", "framed", "canvas"];

function bandPiece(items: PricedItem[], index: number) {
  const type = BAND_PIECE[index];
  const ofType = items.filter((i) => i.product.type === type);
  return ofType.sort((a, b) => b.variant.widthIn * b.variant.heightIn - a.variant.widthIn * a.variant.heightIn)[0];
}

/**
 * Magazine layout for the occasion stories (12 columns on desktop): a large lead, then smaller
 * pieces set off-center and staggered. On phones the lead runs full width and the rest alternate sides.
 */
const PLACEMENT = [
  { item: "md:col-span-7", image: "w-full" },
  { item: "md:col-span-4 md:col-start-9 md:mt-56", image: "ml-auto w-[78%] md:ml-0 md:w-full" },
  { item: "md:col-span-4 md:col-start-2", image: "w-[78%] md:w-full" },
  { item: "md:col-span-6 md:col-start-7 md:mt-40", image: "ml-auto w-[78%] md:ml-0 md:w-full" },
  { item: "md:col-span-5", image: "w-[78%] md:w-full" },
  { item: "md:col-span-4 md:col-start-8 md:mt-48", image: "ml-auto w-[78%] md:ml-0 md:w-full" },
];

export default function GiftsPage() {
  const beforeCutoff = beforeHolidayCutoff();
  // The gift scene leads once it exists (split hero); until then the centred type-only hero.
  const gift = campaign("gift");
  return (
    <>
      <PageHero
        align="center"
        title="Gifts"
        lede="A portrait of their dog, made from any photo you have of it."
        media={
          gift.live ? (
            <Photo photo={gift} ratio={null} eager sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5] lg:aspect-auto lg:h-full" />
          ) : undefined
        }
      >
        {beforeCutoff && (
          <p className="label mb-9 text-ink">{HOLIDAY.label}</p>
        )}
        <OfferCta align={gift.live ? "start" : "center"} />
      </PageHero>

      <section id="occasions" aria-labelledby="occasions-title" className="scroll-mt-24 pb-24 sm:pb-36">
        <Container>
          <h2 id="occasions-title" className="sr-only">
            Gifts by occasion
          </h2>
          <ul className="grid gap-y-20 md:grid-cols-12 md:gap-x-10 md:gap-y-28">
            {OCCASIONS.map((o, i) => {
              const s = STYLE_MAP[o.feature];
              const place = PLACEMENT[i % PLACEMENT.length];
              const right = place.image.includes("ml-auto");
              return (
                <li key={o.slug} className={place.item}>
                  <Link href={`/gifts/${o.slug}`} className="group block">
                    <ZoomImage
                      src={STYLE_SAMPLES[o.feature]}
                      alt={`Example ${s.name} dog portrait`}
                      swatch={s.swatch}
                      label={s.name}
                      priority={i < 2}
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 78vw, 40vw"}
                      className={place.image}
                    />
                    <div className={cn("mt-6 md:max-w-sm", i > 0 && "w-[78%] md:w-auto", right && "ml-auto md:ml-0")}>
                      <p className="label text-ink-3">
                        <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true"> · </span>
                        {o.eyebrow}
                      </p>
                      <h3
                        className={cn(
                          "mt-4 font-display leading-[1.08] tracking-[-0.015em]",
                          i === 0 ? "text-[40px] sm:text-[56px]" : "text-[32px] sm:text-[40px]",
                        )}
                      >
                        {o.name}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{o.card}</p>
                      <span className="link-cta mt-6 inline-block text-ink">View</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-24 border-t border-line pt-8 text-[13px] text-ink-3 sm:mt-32">
            {EVERYTHING_CARD.name}?{" "}
            <Link href={EVERYTHING_CARD.href} className={textLink}>
              {EVERYTHING_CARD.cta}
            </Link>
            . Digital gift cards are{" "}
            <Link href="/gift-cards" className={textLink}>
              coming soon
            </Link>
            .
          </p>
        </Container>
      </section>

      <Block
        title="By price"
        intro="US shipping is included. Every physical piece comes with the hi-res digital file."
        layout="stack"
      >
        <div className="grid gap-16 md:grid-cols-3 md:gap-10">
          {PRICE_BANDS.map((band, i) => {
            const items = itemsInBand(band.min, band.max);
            if (items.length === 0) return null;
            const shown = bandPiece(items, i);
            return (
              <div key={band.title}>
                {shown && (
                  <figure className="mb-8">
                    <FrameMockup
                      src={FORMAT_SHOWCASE.src}
                      alt={`The same portrait as a ${itemLabel(shown)}, on a wall to scale`}
                      productType={shown.product.type}
                      printSize={{ widthIn: shown.variant.widthIn, heightIn: shown.variant.heightIn }}
                      room
                      className="max-w-none"
                    />
                    <figcaption className="label mt-3 text-ink-3">
                      Shown: {itemLabel(shown)}, to scale
                    </figcaption>
                  </figure>
                )}
                <h3 className="font-display text-[28px] leading-[1.08] sm:text-[32px]">{band.title}</h3>
                <p className="mt-2 text-[13px] text-ink-3">{band.note}</p>
                <Facts
                  className="mt-6"
                  items={items.map((item) => ({
                    key: item.variant.id,
                    label: (
                      <Link href={`/shop/${item.product.type}`} className="underline-offset-4 hover:underline">
                        {itemLabel(item)}
                      </Link>
                    ),
                    value: formatPrice(item.variant.price),
                  }))}
                />
              </div>
            );
          })}
        </div>
      </Block>

      <CtaBand title="Start with a photo of their dog." image="watercolor" />
    </>
  );
}
