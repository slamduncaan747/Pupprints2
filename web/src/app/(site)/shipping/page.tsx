import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts, Note, Prose, Rows, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { FAQ_GROUPS } from "@/components/marketing/faq-data";
import {
  CANADA_SHIPPING_LABEL,
  CHRISTMAS_2026,
  CHRISTMAS_US_CUTOFF_FULL,
  PHYSICAL_SHIP_WINDOW,
  formatDay,
  isPhysical,
  shipWindow,
} from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Shipping & Delivery — Free US Shipping, Holiday Dates",
  description: `Free US shipping on every order. Prints, framed prints and canvas arrive in about ${PHYSICAL_SHIP_WINDOW}; digital files instantly. Canada ships for a flat ${CANADA_SHIPPING_LABEL}. Christmas 2026 order-by dates inside.`,
  alternates: { canonical: "/shipping" },
};

const FAQS = FAQ_GROUPS.find((g) => g.id === "shipping")?.items ?? [];

const STEPS = [
  { title: "Checked by a person", body: "Before anything is printed, a person on our team reviews your art and print file." },
  { title: "Printed to order", body: "Your piece is printed, framed or stretched just for you by our print partner in the US." },
  { title: "Packed and shipped", body: "We email a tracking link as soon as it leaves, so you always know where it is." },
];

export default function ShippingPage() {
  const christmasRows = [
    { what: "Prints, framed prints & canvas", where: "United States", when: CHRISTMAS_US_CUTOFF_FULL },
    {
      what: "Prints, framed prints & canvas",
      where: "Canada",
      when: formatDay(CHRISTMAS_2026.canadaCutoff, { weekday: true, long: true }),
    },
    {
      what: "Gift Reveal & digital files",
      where: "Anywhere",
      when: `Any time, up to ${formatDay(CHRISTMAS_2026.revealUntil, { long: true })}`,
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        eyebrow="Shipping & delivery"
        title="Free US shipping. Honest delivery times."
        lede={`Every order ships free in the US, with tracking and no minimum. Canada is a flat ${CANADA_SHIPPING_LABEL}, and digital files arrive right after checkout.`}
      />

      <Block
        title="How long it takes"
        intro="Estimates include production and delivery, in business days, for US addresses. US shipping is free on every product."
      >
        <Facts
          items={PRODUCTS.map((p) => ({
            key: p.type,
            label: (
              <Link href={`/shop/${p.type}`} className="hover:underline hover:underline-offset-4">
                {p.name}
              </Link>
            ),
            value: isPhysical(p) ? shipWindow(p) : "Instantly, by email",
          }))}
        />
        <Note className="mt-6">Canadian orders usually take a few extra business days.</Note>
      </Block>

      <Block title="What happens after you order">
        <Rows numbered items={STEPS} />
      </Block>

      <Block
        id="holidays"
        title="Christmas order-by dates"
        intro="Our recommended last order dates for standard delivery before Christmas. They're honest guidance, not guarantees: carriers get very busy in December, so earlier is always better."
      >
        <Facts items={christmasRows.map((r) => ({ key: r.what + r.where, label: r.what, note: r.where, value: r.when }))} />
        <Note className="mt-6">
          The Canada date allows a little extra time for cross-border transit. Physical pieces are made to order, so please
          don&apos;t wait for the last day.
        </Note>
        <Prose className="mt-8">
          <p>
            <strong>Missed the date?</strong> Order anyway and send a Gift Reveal instantly. They&apos;ll see their portrait on
            Christmas morning, and the print follows.
          </p>
        </Prose>
      </Block>

      <Block title="Good to know">
        <Rows
          items={[
            {
              title: "Where we ship",
              body: `The United States and Canada. US shipping is free; Canada is a flat ${CANADA_SHIPPING_LABEL} per order. Digital files can be delivered anywhere.`,
            },
            {
              title: "Tracking",
              body: (
                <>
                  We email your tracking link the moment your order ships. You can also check any time with our{" "}
                  <Link href="/track" className={textLink}>
                    order tracker
                  </Link>
                  .
                </>
              ),
            },
            {
              title: "Damaged or lost?",
              body: (
                <>
                  Send us a photo of any damage and we&apos;ll replace it free. If tracking shows it never arrived, we&apos;ll
                  replace it or refund you.{" "}
                  <Link href="/guarantee" className={textLink}>
                    Our guarantee
                  </Link>
                </>
              ),
            },
            {
              title: "Changing your address",
              body: "Email us as soon as possible and we'll update it if your order hasn't shipped yet.",
            },
          ]}
        />
      </Block>

      <Block title="Shipping FAQ">
        <FaqList items={FAQS} />
      </Block>

      <CtaBand />
    </>
  );
}
