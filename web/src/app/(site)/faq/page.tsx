import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { ALL_FAQS, FAQ_GROUPS } from "@/components/marketing/faq-data";

export const metadata: Metadata = {
  title: "FAQ — Custom Dog Portraits, Shipping, Photos & Guarantee",
  description:
    "Answers to common questions about Pup Prints: free previews, prices, photos, how the art is made, printing, shipping to the US and Canada, our love-it guarantee, Gift Reveal and privacy.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(ALL_FAQS)} />
      <PageHero
        eyebrow="Client Services"
        title="How may we help?"
        lede="Previews, pieces, delivery and our guarantee, answered. Can't find it? Write to us; a person replies within one business day."
      >
        <nav aria-label="FAQ topics">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="label text-ink-2 underline-offset-[6px] transition-colors hover:text-ink hover:underline">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {FAQ_GROUPS.map((g) => (
        <Block key={g.id} id={g.id} title={g.title} titleStyle="label" compact>
          <FaqList items={g.items} />
        </Block>
      ))}

      <Block titleStyle="label" title="Write to us">
        <Facts
          items={[
            {
              label: "Email",
              value: (
                <a href={`mailto:${site.supportEmail}`} className="break-all text-[14px] normal-case tracking-normal underline-offset-4 hover:underline">
                  {site.supportEmail}
                </a>
              ),
            },
            { label: "Reply time", value: "One business day" },
          ]}
        />
        <p className="mt-8">
          <Link href="/contact" className="link-cta">
            Contact form
          </Link>
        </p>
      </Block>

      <CtaBand
        eyebrow="Begin here"
        title="Just try it, free"
        body="The quickest way to know if it works for your dog is to upload a photo. You only pay if you love it."
      />
    </>
  );
}
