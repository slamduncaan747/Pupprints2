import type { Metadata } from "next";
import { ADDONS } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { campaign } from "@/lib/campaign";
import { site } from "@/lib/config";
import { GIFT_TWO, HOLIDAY, giftTwoActive } from "@/lib/offer";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Rows } from "@/components/marketing/blocks";
import { CampaignImage } from "@/components/marketing/campaign";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The holiday special",
  description: `Order two portraits and two matching ornaments are on us, through ${GIFT_TWO.endsLabel}. ${HOLIDAY.label}.`,
  alternates: { canonical: "/holiday" },
};

/** The offer follows the calendar (see @/lib/offer), so re-render hourly. */
export const revalidate = 3600;

export default function HolidayPage() {
  const live = giftTwoActive();
  const ornament = ADDONS.find((a) => a.id === GIFT_TWO.ornamentId);
  const gift = campaign("gift");

  const rows = [
    { title: "Two portraits", body: "Any two prints, framed prints or canvases in one order. Two dogs, two styles, or the same portrait twice." },
    {
      title: "Two ornaments on us",
      body: `Add up to two matching ornaments${ornament ? ` (${formatPrice(ornament.price)} each)` : ""} and they come off the total at checkout. Each one carries the portrait on both sides.`,
    },
    { title: `Through ${GIFT_TWO.endsLabel}`, body: `${HOLIDAY.label}.` },
  ];

  return (
    <>
      <PageHero
        title="The holiday special"
        lede={
          live
            ? `Order two portraits and two matching ornaments are on us, through ${GIFT_TWO.endsLabel}.`
            : "This year's holiday special has ended."
        }
      />

      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-10">
        <CampaignImage src={gift.src} alt={gift.alt} sizes="(min-width: 1440px) 1360px, 100vw" className="aspect-[4/5] w-full sm:aspect-[16/9]" />
      </section>

      {live && (
        <Block titleStyle="label" title="How it works">
          <Rows items={rows} />
        </Block>
      )}

      <section className="mx-auto w-full max-w-[1440px] px-5 pb-24 text-center sm:px-10 sm:pb-36">
        <ButtonLink href="/create" variant="primary" size="lg">
          {site.cta}
        </ButtonLink>
      </section>
    </>
  );
}
