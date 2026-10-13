import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Factory, Gift, MapPin, PackageCheck, Truck, UserCheck } from "lucide-react";
import { PRODUCTS } from "@/lib/catalog";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
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
  { icon: UserCheck, title: "Checked by a person", body: "Before anything is printed, a person on our team reviews your art and print file." },
  { icon: Factory, title: "Printed to order", body: "Your piece is printed, framed or stretched just for you by our print partner in the US." },
  { icon: PackageCheck, title: "Packed and shipped", body: "We email a tracking link as soon as it leaves, so you always know where it is." },
];

export default function ShippingPage() {
  const christmasRows = [
    {
      what: "Prints, framed prints & canvas",
      where: "United States",
      when: CHRISTMAS_US_CUTOFF_FULL,
    },
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
        lede={
          <p>
            Every order ships free in the US, with tracking and no minimum. We ship to the US and Canada, and digital files
            arrive in your inbox right after checkout.
          </p>
        }
        actions={
          <>
            <ButtonLink href="/create" variant="accent" size="lg">
              Start with a free preview <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#holidays" variant="secondary" size="lg">
              Holiday dates
            </ButtonLink>
          </>
        }
        aside={
          <dl className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: "US shipping", value: "Free", sub: "Every order, no minimum" },
              { label: "Canada", value: CANADA_SHIPPING_LABEL, sub: "Flat rate per order" },
              { label: "Arrives in (US)", value: PHYSICAL_SHIP_WINDOW.replace(" business days", ""), sub: "Business days, door to door" },
              { label: "Digital files", value: "Instant", sub: "Emailed after checkout" },
            ].map((d) => (
              <div key={d.label} className="rounded-card bg-paper-2 p-5 ring-1 ring-line sm:p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">{d.label}</dt>
                <dd className="mt-2 font-display text-3xl sm:text-4xl">{d.value}</dd>
                <dd className="mt-1 text-sm text-ink-2">{d.sub}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Delivery times</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">How long it takes</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Estimates include production and delivery, in business days, for US addresses. Canadian orders usually take a
              few extra business days in transit.
            </p>
          </div>
          <div className="overflow-hidden rounded-card bg-paper ring-1 ring-line">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Estimated delivery time and shipping cost by product</caption>
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-ink-3">
                  <th scope="col" className="px-5 py-4 font-semibold sm:px-6">Product</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Arrives in</th>
                  <th scope="col" className="px-5 py-4 text-right font-semibold sm:px-6">US shipping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PRODUCTS.map((p) => (
                  <tr key={p.type}>
                    <th scope="row" className="px-5 py-4 font-normal sm:px-6">
                      <Link href={`/shop/${p.type}`} className="font-display text-lg hover:text-clay-dark sm:text-xl">
                        {p.name}
                      </Link>
                    </th>
                    <td className="px-5 py-4 text-[15px] text-ink-2">{isPhysical(p) ? shipWindow(p) : "Instantly, by email"}</td>
                    <td className="px-5 py-4 text-right text-[15px] font-medium sm:px-6">Free</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Behind the scenes" title="What happens after you order" />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-card bg-paper-2 p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper ring-1 ring-line">
                    <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm text-ink-3">{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="holidays" className="scroll-mt-20 bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Holidays 2026</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Christmas order-by dates</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Our recommended last order dates for standard delivery before Christmas. They&apos;re honest guidance, not
              guarantees: carriers get very busy in December, so earlier is always better.
            </p>
            <div className="mt-8 flex gap-4 rounded-card bg-paper p-6 ring-1 ring-line">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden="true" />
              <p className="text-[15px] leading-relaxed text-ink-2">
                <span className="font-medium text-ink">Missed the date? </span>
                Order anyway and send a Gift Reveal instantly. They&apos;ll see their portrait on Christmas morning, and the
                print follows.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-card bg-paper ring-1 ring-line">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Christmas 2026 recommended order-by dates</caption>
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-ink-3">
                  <th scope="col" className="px-5 py-4 font-semibold sm:px-6">What</th>
                  <th scope="col" className="px-5 py-4 text-right font-semibold sm:px-6">Order by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {christmasRows.map((r) => (
                  <tr key={r.what + r.where}>
                    <th scope="row" className="px-5 py-5 font-normal sm:px-6">
                      <span className="block font-medium text-ink">{r.what}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-3">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {r.where}
                      </span>
                    </th>
                    <td className="px-5 py-5 text-right font-display text-lg sm:px-6 sm:text-xl">{r.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-line px-5 py-4 text-sm text-ink-3 sm:px-6">
              The Canada date allows a little extra time for cross-border transit. Physical pieces are made to order, so
              please don&apos;t wait for the last day.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 md:grid-cols-3">
          <div className="rounded-card bg-paper-2 p-7 sm:p-8">
            <MapPin className="h-6 w-6 text-clay" aria-hidden="true" />
            <h2 className="mt-5 font-display text-2xl">Where we ship</h2>
            <p className="mt-2 leading-relaxed text-ink-2">
              The United States and Canada. US shipping is free; Canada is a flat {CANADA_SHIPPING_LABEL} per order. Digital
              files can be delivered anywhere.
            </p>
          </div>
          <div className="rounded-card bg-paper-2 p-7 sm:p-8">
            <Truck className="h-6 w-6 text-clay" aria-hidden="true" />
            <h2 className="mt-5 font-display text-2xl">Tracking</h2>
            <p className="mt-2 leading-relaxed text-ink-2">
              We email your tracking link the moment your order ships. You can also check on it any time with our{" "}
              <Link href="/track" className="font-medium text-ink underline underline-offset-4">
                order tracker
              </Link>
              .
            </p>
          </div>
          <div className="rounded-card bg-paper-2 p-7 sm:p-8">
            <PackageCheck className="h-6 w-6 text-clay" aria-hidden="true" />
            <h2 className="mt-5 font-display text-2xl">Damaged or lost?</h2>
            <p className="mt-2 leading-relaxed text-ink-2">
              Send us a photo of any damage and we&apos;ll replace it free. If tracking shows it never arrived, we&apos;ll
              replace it or refund you.{" "}
              <Link href="/guarantee" className="font-medium text-ink underline underline-offset-4">
                Our guarantee
              </Link>
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Shipping FAQ</h2>
            <p className="mt-5 text-lg text-ink-2">
              Need to change your address? Email us as soon as possible and we&apos;ll update it if your order hasn&apos;t
              shipped yet.
            </p>
          </div>
          <FaqList items={FAQS} />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
