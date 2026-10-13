import type { Metadata } from "next";
import { site, socialLinks } from "@/lib/config";
import { absoluteUrl } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { StyleGallery } from "@/components/home/style-gallery";
import { Comparison } from "@/components/home/comparison";
import { Products } from "@/components/home/products";
import { GiftReveal } from "@/components/home/gift-reveal";
import { Memorial } from "@/components/home/memorial";
import { Guarantee } from "@/components/home/guarantee";
import { Founding } from "@/components/home/founding";
import { FaqTeaser } from "@/components/home/faq-teaser";
import { FinalCta } from "@/components/home/final-cta";

const TITLE = "Custom Dog Portraits from Your Photo — See Yours Free";
const DESCRIPTION =
  "Turn your photo into a custom dog portrait. See it free in about a minute, then we print, frame and ship it to your door. Love it, or it's on us.";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: site.name,
      url: absoluteUrl("/"),
      description: site.description,
      email: site.supportEmail,
      ...(socialLinks.length ? { sameAs: socialLinks.map((s) => s.url) } : {}),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.supportEmail,
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: site.name,
      url: absoluteUrl("/"),
      description: site.description,
      inLanguage: "en-US",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD must be inlined; escape "<" so the payload can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <HowItWorks />
      <StyleGallery />
      <Comparison />
      <Products />
      <GiftReveal />
      <Memorial />
      <Guarantee />
      <Founding />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
