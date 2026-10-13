import type { Metadata } from "next";
import { site } from "@/lib/config";
import { DEFAULT_OG_IMAGE, jsonLdProps, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { Statement } from "@/components/home/statement";
import { Collection } from "@/components/home/collection";
import { Objects } from "@/components/home/objects";
import { Process } from "@/components/home/process";
import { Closing } from "@/components/home/closing";

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

/**
 * The home page as a fashion-house campaign: triptych, editorial diptych, the collection,
 * the pieces as objects, the process, and one closing line.
 */
export default function HomePage() {
  return (
    <>
      <script {...jsonLdProps([organizationJsonLd({ logo: "/logo.png" }), websiteJsonLd()])} />
      <Hero />
      <Statement />
      <Collection />
      <Objects />
      <Process />
      <Closing />
    </>
  );
}
