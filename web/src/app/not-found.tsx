import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ButtonLink } from "@/components/ui/button";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { PageHero } from "@/components/marketing/page-hero";
import { CampaignImage } from "@/components/marketing/campaign";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/styles", label: "The collection" },
  { href: "/shop", label: "The shop" },
  { href: "/gifts", label: "Gifts" },
  { href: "/faq", label: "Client services" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  const style = STYLE_MAP.charcoal;
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <PageHero
          eyebrow="Error 404"
          title="This page has wandered off."
          lede="It may have moved, or the link might be a little off. Let's get you back on the trail."
          media={
            <CampaignImage
              src={STYLE_SAMPLES[style.slug]}
              alt={`Example ${style.name} dog portrait`}
              swatch={style.swatch}
              fill
              priority
            />
          }
        >
          <ButtonLink href="/create" size="lg" className="w-full sm:w-auto">
            Commission a portrait
          </ButtonLink>
          <nav aria-label="Helpful links" className="mt-14 border-t border-line pt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="label text-ink-2 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </PageHero>
      </main>
      <Footer />
    </>
  );
}
