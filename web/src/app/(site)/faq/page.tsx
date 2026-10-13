import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { site } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
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
        eyebrow="Help center"
        title="Questions, answered"
        lede={<p>Everything you might want to know before (and after) you meet your dog&apos;s portrait. Can&apos;t find it? Just ask.</p>}
        actions={
          <nav aria-label="FAQ topics" className="flex flex-wrap gap-2">
            {FAQ_GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="rounded-full bg-paper-2 px-4 py-2 text-sm text-ink-2 ring-1 ring-line transition hover:bg-paper-3 hover:text-ink"
              >
                {g.title}
              </a>
            ))}
          </nav>
        }
      />

      <Container className="pb-8">
        <div className="space-y-16 sm:space-y-20">
          {FAQ_GROUPS.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="grid scroll-mt-24 gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <h2 id={`${g.id}-title`} className="font-display text-3xl leading-tight sm:text-4xl lg:sticky lg:top-28 lg:self-start">
                {g.title}
              </h2>
              <FaqList items={g.items} />
            </section>
          ))}
        </div>
      </Container>

      <Section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 rounded-card bg-paper-2 p-7 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="flex gap-4">
              <Mail className="mt-1 h-6 w-6 shrink-0 text-clay" aria-hidden="true" />
              <div>
                <h2 className="font-display text-3xl">Still have a question?</h2>
                <p className="mt-2 text-ink-2">
                  Write to us at{" "}
                  <a href={`mailto:${site.supportEmail}`} className="font-medium text-ink underline underline-offset-4">
                    {site.supportEmail}
                  </a>{" "}
                  or use our{" "}
                  <Link href="/contact" className="font-medium text-ink underline underline-offset-4">
                    contact form
                  </Link>
                  . A real person replies within one business day.
                </p>
              </div>
            </div>
            <ButtonLink href="/contact" variant="secondary" className="self-start sm:self-auto">
              Contact us <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <CtaBand eyebrow="The easiest answer" title="Just try it, free" body="The quickest way to see if it works for your dog is to upload a photo. Your portrait appears in about a minute, and you only pay if you love it." />
    </>
  );
}
