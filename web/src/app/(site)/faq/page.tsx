import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Prose } from "@/components/marketing/blocks";
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
        eyebrow="Help"
        title="Questions, answered"
        lede="Everything you might want to know before (and after) you meet your dog's portrait. Can't find it? Just ask."
      >
        <nav aria-label="FAQ topics">
          <ul className="flex max-w-xl flex-wrap gap-x-5 gap-y-2 text-[15px]">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {FAQ_GROUPS.map((g) => (
        <Block key={g.id} id={g.id} title={g.title}>
          <FaqList items={g.items} />
        </Block>
      ))}

      <Block title="Still have a question?">
        <Prose>
          <p>
            Write to us at <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> or use our{" "}
            <Link href="/contact">contact form</Link>. A real person replies within one business day.
          </p>
        </Prose>
      </Block>

      <CtaBand
        title="Just try it, free"
        body="The quickest way to see if it works for your dog is to upload a photo. You only pay if you love it."
      />
    </>
  );
}
