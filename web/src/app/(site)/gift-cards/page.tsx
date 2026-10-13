import type { Metadata } from "next";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Rows } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd, type FaqItem } from "@/components/marketing/faq";
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
  { title: "You send it", body: "Choose an amount and add a note. The gift card arrives in their inbox by email." },
  { title: "They upload a photo", body: "They choose their favorite photo of their dog and see the portrait free." },
  { title: "They choose the style", body: "Every style, every product. They pick what suits their home, and we print and ship it." },
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
        eyebrow="Gift cards · Coming soon"
        title="Let them choose"
        lede="For someone whose dog you don't have a great photo of, or who'd love to pick their own style. Join the list and we'll tell you the moment gift cards are ready."
      >
        <NewsletterForm
          source="gift_cards"
          cta="Notify me"
          successMessage="You're on the list. We'll email you the moment gift cards go live."
        />
      </PageHero>

      <Block eyebrow="Planned amounts" title="The whole amount, for the portrait" intro="US shipping is free on every order, so nothing is lost to delivery.">
        <Rows
          items={AMOUNTS.map((amount) => ({
            key: String(amount),
            title: formatPrice(amount),
            body: `Up to ${itemsCoveredBy(amount, 2).map(itemLabel).join(" or ")}`,
          }))}
        />
      </Block>

      <Block eyebrow="How it will work" title="They pick, we print">
        <Rows numbered items={STEPS} />
      </Block>

      <Block titleStyle="label" title="About gift cards">
        <FaqList items={FAQS} />
      </Block>

      <CtaBand
        eyebrow="A gift today"
        title="Make their portrait today"
        body="Upload a photo of their dog, see it free in about a minute, and send a Gift Reveal instantly."
        cta="Start a gift portrait"
      />
    </>
  );
}
