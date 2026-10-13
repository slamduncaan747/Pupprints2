import type { Metadata } from "next";
import { ArrowRight, Gift, Mail, Palette, Upload } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
import { GiftRevealMock } from "@/components/marketing/gift-reveal-mock";
import { JsonLd } from "@/components/marketing/json-ld";
import { itemLabel, itemsCoveredBy } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Digital Gift Cards — Coming Soon",
  description:
    "Pup Prints digital gift cards are coming soon: the recipient chooses their own photo and style. Join the list to hear when they launch, or send a Gift Reveal today.",
  alternates: { canonical: "/gift-cards" },
};

/** Planned denominations (cents). Gift-card checkout isn't built yet. */
const AMOUNTS = [5000, 7500, 10000, 15000, 20000];

const STEPS = [
  { icon: Mail, title: "You send it", body: "Choose an amount and add a note. The gift card arrives in their inbox by email." },
  { icon: Upload, title: "They upload a photo", body: "They choose their favorite photo of their dog and see the portrait free." },
  { icon: Palette, title: "They choose the style", body: "Every style, every product. They pick what suits their home, and we print and ship it." },
];

const FAQS: FaqItem[] = [
  {
    q: "When will gift cards be available?",
    a: "We're building them now. Join the list on this page and we'll email you as soon as they're ready. You can unsubscribe any time.",
  },
  {
    q: "I need a gift now. What can I do?",
    a: "Make the portrait yourself from a photo of their dog, then send a Gift Reveal the moment you order. They see their portrait instantly, and the print follows in the mail.",
    link: { href: "/gifts", label: "See gift ideas" },
  },
  {
    q: "Will gift cards expire?",
    a: "We're planning for gift cards that don't expire. We'll confirm all the details on this page before they go on sale.",
  },
];

export default function GiftCardsPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        tone="butter"
        eyebrow="Digital gift cards"
        title="Let them choose the photo and the style"
        lede={
          <>
            <p>
              The perfect gift for someone whose dog you don&apos;t have a great photo of, or who&apos;d love to pick their own
              style. Digital gift cards are coming soon. Join the list and we&apos;ll let you know the moment they&apos;re ready.
            </p>
            <div className="mt-8 rounded-card bg-paper/80 p-5 ring-1 ring-line sm:p-6">
              <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                <Badge tone="clay">Coming soon</Badge> Get notified when gift cards launch
              </p>
              <NewsletterForm source="gift_cards" cta="Notify me" className="mt-4" />
            </div>
          </>
        }
        aside={
          <div className="relative mx-auto aspect-[1.6/1] w-full max-w-[460px] -rotate-2 overflow-hidden rounded-[1.5rem] bg-ink p-7 text-paper shadow-frame sm:p-9">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-clay/40 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-butter/25 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">Pup Prints</span>
                <Gift className="h-6 w-6 text-butter" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-paper/60">Digital gift card</p>
                <p className="mt-1 font-display text-5xl sm:text-6xl">{formatPrice(AMOUNTS[2])}</p>
              </div>
            </div>
          </div>
        }
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Planned amounts"
            title="Pick an amount"
            subtitle="US shipping is free on every order, so the whole amount goes toward their portrait."
          />
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {AMOUNTS.map((amount) => {
              const covers = itemsCoveredBy(amount, 2);
              return (
                <li key={amount} className="flex flex-col rounded-card bg-paper-2 p-5 ring-1 ring-line last:col-span-2 sm:p-6 sm:last:col-span-1">
                  <p className="font-display text-4xl">{formatPrice(amount)}</p>
                  {covers.length > 0 && (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">Covers up to</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
                        {covers.map((c) => (
                          <li key={c.variant.id}>{itemLabel(c)}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container>
          <SectionHeading eyebrow="How it will work" title="They pick, we print" />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-card bg-paper p-7 ring-1 ring-line sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper-2">
                    <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm text-ink-3">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Need a gift today?</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Send a Gift Reveal instead</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              Make their portrait from a photo of their dog, then send a beautiful digital reveal the moment you order. They see
              it instantly, and the print follows.
            </p>
            <ButtonLink href="/create" variant="accent" size="lg" className="mt-8">
              Make a gift portrait <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="rounded-[2rem] bg-blush/50 px-6 py-12 sm:px-12">
            <GiftRevealMock style="botanical" />
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">About gift cards</h2>
          </div>
          <FaqList items={FAQS} />
        </Container>
      </Section>

      <CtaBand eyebrow="Can't wait?" title="Make their portrait today" body="Upload a photo of their dog, see it free in about a minute, and send a Gift Reveal instantly." cta="Start a gift portrait" />
    </>
  );
}
