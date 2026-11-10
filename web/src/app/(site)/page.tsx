import type { Metadata } from "next";
import { site } from "@/lib/config";
import { DEFAULT_OG_IMAGE, jsonLdProps, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { Proof } from "@/components/home/proof";
import { Collection } from "@/components/home/collection";
import { Pieces } from "@/components/home/pieces";
import { Moment } from "@/components/home/moment";
import { Closing } from "@/components/home/closing";

const TITLE = "Custom Dog Portraits from Your Photo";
const DESCRIPTION = site.description;

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
 * The home page: very few words, and every screen leads to one action, uploading a photo (/create).
 * Hero, one photo beside its portrait, the styles, the four formats with prices, one picture, and a
 * last call to upload. The portraits do the talking.
 */
export default function HomePage() {
  return (
    <>
      <script {...jsonLdProps([organizationJsonLd({ logo: "/logo.png" }), websiteJsonLd()])} />
      <Hero />
      <Proof />
      <Collection />
      <Pieces />
      <Moment />
      <Closing />
    </>
  );
}
