import type { Metadata } from "next";
import Link from "next/link";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { formatPrice } from "@/lib/utils";
import { SampleImage } from "@/components/ui/sample-image";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts, Note, Rows, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { EVERYTHING_CARD, OCCASIONS } from "@/components/marketing/gift-occasions";
import { CHRISTMAS_US_CUTOFF, PRICE_BANDS, itemLabel, itemsInBand } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Gifts for Dog Lovers — Custom Dog Portrait Gift Guide",
  description:
    "The gift guide for dog people: custom portraits of their dog for birthdays, Christmas, Mother's Day, memorials and new puppies. Preview free, send a Gift Reveal instantly, free US shipping.",
  alternates: { canonical: "/gifts" },
};

const REVEAL_STEPS = [
  { title: "Make it from any photo", body: "Grab a photo of their dog from your phone or their social media and see the portrait free." },
  { title: "Reveal it instantly", body: "The moment you order, you get a digital reveal to send by text or email, or show in person." },
  { title: "The real thing follows", body: "We print, check and ship the piece. Send it to them directly, or to you to wrap." },
];

export default function GiftsPage() {
  return (
    <>
      <PageHero
        eyebrow="The gift guide"
        title="A portrait of their dog. The gift they keep."
        lede="Make it from a photo you already have and see it free before you buy. Send a Gift Reveal the moment you order; the print follows."
      >
        <Note>
          Christmas: order physical pieces by {CHRISTMAS_US_CUTOFF} for standard US delivery. Gift Reveal any time.
        </Note>
      </PageHero>

      <Block id="occasions" title="Who's it for?" layout="stack">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
          {OCCASIONS.map((o, i) => {
            const s = STYLE_MAP[o.feature];
            return (
              <li key={o.slug}>
                <Link href={`/gifts/${o.slug}`} className="group block">
                  <SampleImage
                    src={STYLE_SAMPLES[o.feature]}
                    alt={`Example ${s.name} dog portrait`}
                    swatch={s.swatch}
                    label={s.name}
                    priority={i < 2}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                    className="transition-opacity duration-300 group-hover:opacity-90"
                  />
                  <h3 className="mt-4 font-display text-[22px] leading-tight sm:text-2xl">{o.name}</h3>
                  <p className="mt-1 text-[14px] leading-snug text-ink-3">{o.card}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <Note className="mt-12">
          {EVERYTHING_CARD.name}?{" "}
          <Link href={EVERYTHING_CARD.href} className={textLink}>
            {EVERYTHING_CARD.cta}
          </Link>
          . Digital gift cards are{" "}
          <Link href="/gift-cards" className={textLink}>
            coming soon
          </Link>
          .
        </Note>
      </Block>

      <Block
        title="Give it today. Hang it in days."
        intro="The best part of a gift is the moment they see it. With a Gift Reveal, that moment doesn't wait for the mail."
      >
        <Rows numbered items={REVEAL_STEPS} />
      </Block>

      <Block title="Gifts at every price" intro="Real prices, including free US shipping. Every physical piece comes with the hi-res digital file.">
        <div className="space-y-12">
          {PRICE_BANDS.map((band) => {
            const items = itemsInBand(band.min, band.max);
            if (items.length === 0) return null;
            return (
              <div key={band.title}>
                <h3 className="font-display text-[1.75rem] leading-tight">{band.title}</h3>
                <p className="mt-1 text-[14px] text-ink-3">{band.note}</p>
                <Facts
                  className="mt-5"
                  items={items.map((item) => ({
                    key: item.variant.id,
                    label: (
                      <Link href={`/shop/${item.product.type}`} className="hover:underline hover:underline-offset-4">
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

      <CtaBand
        title="Make a gift they'll never see coming"
        body="Upload a photo of their dog and see the portrait free in about a minute. Only pay if you love it."
        cta="Start a gift portrait"
      />
    </>
  );
}
