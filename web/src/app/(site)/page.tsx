import type { Metadata } from "next";
import { site } from "@/lib/config";
import { DEFAULT_OG_IMAGE, jsonLdProps, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { faqJsonLd } from "@/components/marketing/faq";
import { Hero } from "@/components/home/hero";
import { Proof } from "@/components/home/proof";
import { Collection } from "@/components/home/collection";
import { Pieces } from "@/components/home/pieces";
import { OfferStack } from "@/components/home/offer-stack";
import { Founding } from "@/components/home/founding";
import { Heirloom } from "@/components/home/heirloom";
import { Guarantee } from "@/components/home/guarantee";
import { Questions, homeFaq } from "@/components/home/questions";
import { Closing } from "@/components/home/closing";

const TITLE = "Custom Dog Portraits from Your Photo — See Yours Free";
const DESCRIPTION =
  "Turn your photo into a custom dog portrait. See it free in about a minute, then we print, frame and ship it to your door. Love it, or it's free.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "/",
    title: `${TITLE} | ${site.name}`,
    description: DESCRIPTION,
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${site.name}`,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

/**
 * The home page as a Grand Slam Offer in campaign clothing. Each section moves one lever of the value
 * equation: the dream outcome (hero), likelihood (a real photo beside its portrait), effort and time
 * (one photo, a minute, no card), the stacked offer, real scarcity (Founding 100), a premium bundle,
 * risk reversal, objections, and one last call to action.
 */
export default function HomePage() {
  const faqs = homeFaq();
  return (
    <>
      <script {...jsonLdProps([organizationJsonLd({ logo: "/logo.png" }), websiteJsonLd(), faqJsonLd(faqs)])} />
      <Hero />
      <Proof />
      <Collection />
      <Pieces />
      <OfferStack />
      <Founding />
      <Heirloom />
      <Guarantee />
      <Questions items={faqs} />
      <Closing />
    </>
  );
}
