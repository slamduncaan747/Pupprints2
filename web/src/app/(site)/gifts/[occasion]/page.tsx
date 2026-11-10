import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STYLE_MAP, styleAvailable, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { CampaignImage } from "@/components/marketing/campaign";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Facts, Prose, Rows, textLink } from "@/components/marketing/blocks";
import { StyleCard } from "@/components/marketing/style-card";
import { OCCASIONS, getOccasion, type Occasion } from "@/components/marketing/gift-occasions";
import { stylesFor } from "@/components/marketing/style-content";
import { firstSentences } from "@/components/marketing/honest";
import { CHRISTMAS_CA_CUTOFF, CHRISTMAS_US_CUTOFF_FULL } from "@/components/marketing/commerce";
import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";
import { OfferCta } from "@/components/marketing/offer";


/** The occasion's featured style, or its best available match once a dated edition has retired. */
function featuredSlug(o: Occasion): StyleSlug {
  return styleAvailable(STYLE_MAP[o.feature]) ? o.feature : (stylesFor(o.goodFor, 1)[0]?.slug ?? o.feature);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ occasion: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gifts/[occasion]">): Promise<Metadata> {
  const { occasion } = await params;
  const o = getOccasion(occasion);
  if (!o) return {};
  return {
    title: o.title,
    description: o.metaDescription,
    alternates: { canonical: `/gifts/${o.slug}` },
    openGraph: {
      title: `${o.title} | ${site.name}`,
      description: o.metaDescription,
      url: `/gifts/${o.slug}`,
      type: "website",
      siteName: site.name,
      locale: "en_US",
      // The featured style sample first; the site-wide card is the fallback while samples are still being generated.
      images: [
        { url: STYLE_SAMPLES[featuredSlug(o)], width: 1200, height: 1500, alt: `${STYLE_MAP[featuredSlug(o)]?.name} dog portrait` },
        DEFAULT_OG_IMAGE,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${o.title} | ${site.name}`,
      description: o.metaDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function OccasionPage({ params }: PageProps<"/gifts/[occasion]">) {
  const { occasion } = await params;
  const o = getOccasion(occasion);
  if (!o) notFound();

  const memorial = o.slug === "memorial";
  const christmas = o.slug === "christmas";
  const featureSlug = featuredSlug(o);
  const feature = STYLE_MAP[featureSlug];
  const styles = [...(feature ? [feature] : []), ...stylesFor(o.goodFor, 4, featureSlug)].slice(0, 4);
  // The gift scene leads every occasion but the memorial one, which keeps its gentle style sample.
  const gift = memorial ? null : campaign("gift");

  return (
    <>
      <JsonLd data={faqJsonLd(o.faq)} />

      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ href: "/gifts", label: "Gifts" }, { href: `/gifts/${o.slug}`, label: o.name }]} />}
        title={o.h1}
        lede={<p>{firstSentences(o.lede)}</p>}
        media={
          gift?.live ? (
            <Photo photo={gift} ratio={null} eager sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5] lg:aspect-auto lg:h-full" />
          ) : (
            feature && (
            <CampaignImage
              src={STYLE_SAMPLES[featureSlug]}
              alt={`Example ${feature.name} dog portrait`}
              swatch={feature.swatch}
              priority
              fill
            />
            )
          )
        }
      >
        <OfferCta />
      </PageHero>

      {o.timing && (
        <Block id="timing" title={o.timing.title}>
          {christmas ? (
            <>
              <Facts
                items={[
                  { label: "US · physical pieces", note: "Standard delivery", value: CHRISTMAS_US_CUTOFF_FULL },
                  { label: "Canada · physical pieces", note: "Allow extra transit time", value: CHRISTMAS_CA_CUTOFF },
                  { label: "Digital file", note: "By email, right after checkout", value: "Any time" },
                ]}
              />
              <Prose className="mt-8 text-[15px]">
                <p>{o.timing.body}</p>
              </Prose>
              <p className="mt-6">
                <Link href="/shipping#holidays" className="link-cta">
                  All shipping dates
                </Link>
              </p>
            </>
          ) : (
            <Prose>
              <p>{o.timing.body}</p>
            </Prose>
          )}
        </Block>
      )}

      <Block title={memorial ? "Good to know" : "Ideas"}>
        <Rows items={o.ideas} />
      </Block>

      <Block
        id="styles"
        title={memorial ? "Quiet styles" : `Styles for ${o.forLabel}`}
        layout="stack"
      >
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-4 sm:gap-x-4">
          {styles.map((s) => (
            <li key={s.slug}>
              <StyleCard style={s} compact sizes="(max-width: 640px) 50vw, 25vw" />
            </li>
          ))}
        </ul>
        <p className="mt-12">
          <Link href="/styles" className="link-cta">
            All styles
          </Link>
        </p>
      </Block>

      <Block
        titleStyle="label"
        title="Questions"
        intro={
          <>
            {memorial ? "Or simply " : "More in "}
            <Link href={memorial ? "/contact" : "/faq"} className={textLink}>
              {memorial ? "write to us" : "the FAQ"}
            </Link>
            .
          </>
        }
      >
        <FaqList items={o.faq} />
      </Block>

      <CtaBand title={o.cta.title} body={o.cta.body || undefined} />
    </>
  );
}
