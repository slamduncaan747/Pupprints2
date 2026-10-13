import type { Metadata } from "next";
import Link from "next/link";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn, formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts, Rows, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { ZoomImage } from "@/components/marketing/campaign";
import { EVERYTHING_CARD, OCCASIONS } from "@/components/marketing/gift-occasions";
import { CHRISTMAS_US_CUTOFF, PRICE_BANDS, itemLabel, itemsInBand } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Gifts for Dog Lovers — Custom Dog Portrait Gift Guide",
  description:
    "The gift guide for dog people: custom portraits of their dog for birthdays, Christmas, Mother's Day, memorials and new puppies. Preview free, send a Gift Reveal instantly, free US shipping.",
  alternates: { canonical: "/gifts" },
};

const REVEAL_STEPS = [
  { title: "Make it from any photo", body: "A photo of their dog from your phone or their social media. See the portrait free." },
  { title: "Reveal it instantly", body: "The moment you order, send a digital reveal by text or email, or show it in person." },
  { title: "The real thing follows", body: "We print, check and ship the piece, to them directly or to you to wrap." },
];

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
  return (
    <>
      <PageHero
        align="center"
        eyebrow="The Gift Guide"
        title="A portrait of their dog"
        lede="Made from a photo you already have, seen free before you buy. Send a Gift Reveal the moment you order; the print follows."
      >
        <p className="label text-ink-3">
          Christmas: order physical pieces by {CHRISTMAS_US_CUTOFF} for US delivery. Gift Reveal any time.
        </p>
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
                          "mt-4 font-display leading-[1.04] tracking-[-0.015em]",
                          i === 0 ? "text-[40px] sm:text-[56px]" : "text-[32px] sm:text-[40px]",
                        )}
                      >
                        {o.name}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{o.card}</p>
                      <span className="link-cta mt-6 inline-block text-ink">Discover</span>
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
        eyebrow="The Gift Reveal"
        title="Give it today. Hang it in days."
        intro="The best part of a gift is the moment they see it. With a Gift Reveal, that moment doesn't wait for the mail."
      >
        <Rows numbered items={REVEAL_STEPS} />
      </Block>

      <Block
        eyebrow="By price"
        title="Gifts at every price"
        intro="Real prices, with free US shipping. Every physical piece comes with the hi-res digital file."
        layout="stack"
      >
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {PRICE_BANDS.map((band) => {
            const items = itemsInBand(band.min, band.max);
            if (items.length === 0) return null;
            return (
              <div key={band.title}>
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

      <CtaBand
        eyebrow="Begin a gift"
        title="A gift they'll never see coming"
        body="Upload a photo of their dog and see the portrait free in about a minute. Only pay if you love it."
        cta="Start a gift portrait"
        image="botanical"
      />
    </>
  );
}
