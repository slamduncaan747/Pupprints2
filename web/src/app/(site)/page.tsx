import type { Metadata } from "next";
import { site } from "@/lib/config";
import { DEFAULT_OG_IMAGE, jsonLdProps, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { StyleIndex } from "@/components/home/style-index";
import { HowItWorks } from "@/components/home/how-it-works";
import { Products } from "@/components/home/products";
import { Promises } from "@/components/home/promises";

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

export default function HomePage() {
  return (
    <>
      <script {...jsonLdProps([organizationJsonLd({ logo: "/logo.png" }), websiteJsonLd()])} />
      <Hero />
      <StyleIndex />
      <HowItWorks />
      <Products />
      <Promises />
    </>
  );
}
