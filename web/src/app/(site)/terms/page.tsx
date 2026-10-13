import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { CtaBand } from "@/components/marketing/cta-band";
import { CANADA_SHIPPING_LABEL } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using Pup Prints and ordering custom dog portraits, in plain English: previews, orders, shipping, our love-it guarantee, your photos and your portrait license.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "October 12, 2026";

const email = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "The agreement",
    body: (
      <>
        <p>
          These terms are an agreement between you and {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) about using our
          website and buying our products. By using the site or placing an order, you agree to them. We&apos;ve tried to keep
          them short and readable. If anything is unclear, email {email}.
        </p>
        <p>
          Our <Link href="/privacy">privacy policy</Link> explains how we handle your information and is part of these terms.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can order",
    body: (
      <p>
        You must be at least 18 years old, or have a parent or guardian&apos;s permission, to place an order. We currently ship
        physical products to the United States and Canada. Digital files can be delivered anywhere.
      </p>
    ),
  },
  {
    id: "previews",
    title: "Previews and how portraits are made",
    body: (
      <>
        <p>
          Previews are free. Your portrait is created from your photo by our AI artist, in the style you choose. Because each
          portrait is generated, every version is a little different; you can regenerate or try other styles before you buy.
        </p>
        <p>
          Portraits are digital artworks designed to look like paintings and drawings. They are not painted by hand. A person
          on our team checks every print before it&apos;s printed.
        </p>
        <p>
          Colors can look slightly different on paper or canvas than on a backlit screen. That&apos;s normal and not a defect,
          though if you&apos;re unhappy with how your piece looks, our guarantee still applies.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Orders, prices and payment",
    body: (
      <ul>
        <li>Prices are in US dollars and are shown before you pay. US shipping is included in our prices.</li>
        <li>Shipping to Canada is a flat {CANADA_SHIPPING_LABEL} per order, shown at checkout. Any applicable sales tax is also shown at checkout.</li>
        <li>Payments are processed securely by Stripe. Your order is confirmed when payment succeeds and we email a confirmation.</li>
        <li>
          Optional extras are never pre-selected. Promo codes can&apos;t be exchanged for cash and, unless stated otherwise, only
          one code can be used per order.
        </li>
        <li>
          If we make an obvious mistake (for example, a wrong price) or can&apos;t fulfill an order, we&apos;ll tell you and
          give you a full refund.
        </li>
      </ul>
    ),
  },
  {
    id: "custom",
    title: "Custom, made-to-order products",
    body: (
      <p>
        Every piece is made just for you after you order. If you need to change or cancel an order, email us as soon as
        possible. If it hasn&apos;t gone to print, we&apos;ll change or cancel it at no charge. Once printed, it&apos;s covered
        by our love-it guarantee below. Being custom never takes away your rights under the guarantee.
      </p>
    ),
  },
  {
    id: "shipping",
    title: "Shipping and delivery",
    body: (
      <p>
        Delivery times shown on our site are estimates, not guarantees, and holiday order-by dates are guidance. We email
        tracking when your order ships. If a package is lost or arrives damaged, we&apos;ll make it right as described in the
        guarantee. Please make sure your shipping address is correct; if an order is returned because of an incorrect address,
        we&apos;ll work with you to reship it. See our <Link href="/shipping">shipping page</Link> for details.
      </p>
    ),
  },
  {
    id: "guarantee",
    title: "Our love-it guarantee",
    body: (
      <>
        <ul>
          <li>
            <strong>Don&apos;t love your printed piece?</strong> Tell us within 30 days of delivery and we&apos;ll remake it
            free or refund you in full. You choose.
          </li>
          <li>
            <strong>Damaged, defective or wrong item?</strong> Send us a photo and we&apos;ll send a free replacement. You
            don&apos;t need to send the damaged piece back.
          </li>
          <li>
            <strong>Lost in the mail?</strong> If tracking shows it never arrived, we&apos;ll replace it or refund you.
          </li>
          <li>
            <strong>Problem with a digital file?</strong> We&apos;ll fix it or refund you.
          </li>
        </ul>
        <p>
          Refunds go back to your original payment method. If we ever need a piece returned, we&apos;ll cover the return
          shipping. We ask only that claims are made honestly and in good faith. Read more on our{" "}
          <Link href="/guarantee">guarantee page</Link>.
        </p>
      </>
    ),
  },
  {
    id: "your-photos",
    title: "Your photos",
    body: (
      <>
        <p>
          You keep all rights to the photos you upload. You give us permission to use them only to create your previews and
          portrait, fulfill and support your order, and keep our service secure. We won&apos;t use your photo or portrait in
          our marketing unless you give us separate permission.
        </p>
        <p>
          You confirm that you took the photo or have the right to use it, and that it doesn&apos;t infringe anyone else&apos;s
          rights.
        </p>
      </>
    ),
  },
  {
    id: "your-portrait",
    title: "Your portrait: what you can do with it",
    body: (
      <>
        <p>
          When you buy a portrait, we give you a permanent, personal-use license to the artwork. That means you can:
        </p>
        <ul>
          <li>Hang it, print it for yourself, and give prints to friends and family.</li>
          <li>Share it on social media, use it as a wallpaper or profile picture, and make personal holiday cards.</li>
        </ul>
        <p>
          You can&apos;t sell the portrait or products made with it, or use it for commercial purposes (such as advertising or
          merchandise for sale), without our written permission. Our styles, website, designs and brand remain ours.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>Please don&apos;t:</p>
        <ul>
          <li>Upload photos you don&apos;t have the right to use, or images that are illegal, hateful, violent or sexual.</li>
          <li>Upload photos of people for the purpose of making portraits of them. Our service is for dogs.</li>
          <li>Ask for trademarked characters, logos or other people&apos;s artwork.</li>
          <li>Use bots or scripts to generate previews, try to get around our usage limits, or interfere with the site.</li>
        </ul>
        <p>We may decline or cancel requests that break these rules, with a full refund for any paid order.</p>
      </>
    ),
  },
  {
    id: "gifts",
    title: "Gift Reveals and gift cards",
    body: (
      <p>
        A Gift Reveal is a private link to a digital preview of a gift order. Anyone with the link can view it, so share it
        only with the people you intend to. Digital gift cards are not yet available; their terms will be published here
        before they go on sale.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <p>
        We work hard to make our site and products excellent, but apart from the promises in these terms (including our
        guarantee) and any rights you have under law that can&apos;t be waived, our site and services are provided &ldquo;as
        is&rdquo;. We don&apos;t promise the site will always be available or error-free, or that every generated preview will
        be to your taste.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the extent the law allows, we aren&apos;t liable for indirect, incidental or consequential losses, and our total
        liability for any claim related to an order is limited to the amount you paid for that order. Nothing in these terms
        limits liability that can&apos;t be limited by law, or your rights as a consumer.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "If something goes wrong",
    body: (
      <p>
        Please contact us first at {email}. Most problems can be fixed quickly and kindly. These terms are governed by the laws
        of the United States and the state in which {site.legalName} is established, without regard to conflict-of-law rules.
        If you live in Canada or another place with consumer protections that can&apos;t be overridden, those protections still
        apply to you.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The version posted here, with its &ldquo;last updated&rdquo; date, applies
        to orders placed after that date. Orders you&apos;ve already placed stay under the terms you agreed to.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        {site.legalName} · {email} · <Link href="/contact">Contact form</Link>
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <LegalPage
        eyebrow="Terms"
        title="Terms of service"
        lede={<p>The rules of the road, written to be read. The short version: see it first, love it or it&apos;s on us.</p>}
        updated={UPDATED}
        sections={SECTIONS}
      />
      <CtaBand />
    </>
  );
}
