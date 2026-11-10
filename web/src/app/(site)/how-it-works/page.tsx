import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_STYLE, STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER, STYLE_SAMPLES } from "@/lib/samples";
import { CampaignImage, Chapter, ProductShot } from "@/components/marketing/campaign";
import { FramedArt } from "@/components/marketing/framed-art";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Note, Prose, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { faq } from "@/components/marketing/faq-data";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { OfferCta } from "@/components/marketing/offer";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Upload a photo of your dog, see the portrait, and order it as a print, framed print, canvas or digital file.",
  alternates: { canonical: "/how-it-works" },
};

const DO = [
  "Close-up, at their eye level",
  "Soft natural light, like near a window",
  "Sharp focus on the eyes",
  "Whole head and both ears in the frame",
];

const AVOID = [
  "Too far away: their face needs to fill most of the photo",
  "Blurry or moving: tap to focus on the eyes and hold steady",
  "Dark or backlit: face the window, not the other way round",
  "Ears cut off: leave a little room around the head",
];

const FAQS = [
  faq("How is the art made?"),
  faq("Will it actually look like my dog?"),
  faq("Can I use an old, blurry or low-resolution photo?"),
  faq("What file types can I upload?"),
  faq("How long will it take?"),
];

export default function HowItWorksPage() {
  const pair = BEFORE_AFTER[0];
  const style = pair ? STYLE_MAP[pair.style] : undefined;
  const chapterStyle = style ?? STYLE_MAP[DEFAULT_STYLE];
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero align="center" title="How it works" lede="Upload a photo. See the portrait. Order it if you like it.">
        <OfferCta align="center" />
      </PageHero>

      <h2 className="sr-only">Step by step</h2>
      <Chapter
        id="step-photo"
        kicker="1"
        title="Upload a photo."
        media={
          <CampaignImage
            src={pair?.before ?? STYLE_SAMPLES[DEFAULT_STYLE]}
            alt={pair ? `Phone photo of a ${pair.dog}` : "Example dog portrait"}
            swatch="#d8d2c4"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        }
      >
        <p>Any clear phone photo of your dog.</p>
        <p className="mt-6">
          <a href="#photo-tips" className="link-cta text-ink">
            Photo tips
          </a>
        </p>
      </Chapter>
      <Chapter
        id="step-preview"
        side="right"
        kicker="2"
        title="See the portrait."
        media={
          <CampaignImage
            src={pair?.after ?? STYLE_SAMPLES[chapterStyle.slug]}
            alt={pair && style ? `${style.name} portrait of the same ${pair.dog}` : `Example ${chapterStyle.name} dog portrait`}
            swatch={chapterStyle.swatch}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        }
      >
        <p>Pick a style and it appears in about a minute. Try other styles, or another photo, as often as you like.</p>
      </Chapter>
      <Chapter
        id="step-piece"
        kicker="3"
        title="Choose a format."
        media={
          <ProductShot>
            <FramedArt
              style={chapterStyle.slug}
              src={pair?.after}
              alt={pair && style ? `${style.name} portrait of a ${pair.dog} in a black frame` : undefined}
              finish="black"
              sizes="(max-width: 768px) 60vw, 30vw"
            />
          </ProductShot>
        }
      >
        <p>
          Print, framed print, canvas or the digital file. Physical pieces are made to order and arrive in{" "}
          <span className="whitespace-nowrap">{PHYSICAL_SHIP_WINDOW}</span> in the US.
        </p>
        <p className="mt-6">
          <Link href="/shop" className="link-cta text-ink">
            Sizes and prices
          </Link>
        </p>
      </Chapter>

      <Block id="photo-tips" title="Photo tips" intro="A phone photo works well if it is sharp, close and well lit.">
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-10">
          <div>
            <h3 className="label text-ink">A good photo</h3>
            <Bullets items={DO} className="mt-5" />
          </div>
          <div>
            <h3 className="label text-ink">Try to avoid</h3>
            <Bullets items={AVOID} className="mt-5" />
          </div>
        </div>
        <Note className="mt-8">Not sure? Upload it and see. Older or slightly blurry photos often work.</Note>
      </Block>

      <Block id="how-its-made" title="How the art is made">
        <Prose>
          <p>
            Your portrait is made from your photo by our AI artist, in styles we designed for dogs, and finished by our
            team. It is printed with archival pigment inks. It is not painted by hand.
          </p>
        </Prose>
      </Block>

      <Block
        titleStyle="label"
        title="Questions"
        intro={
          <>
            More answers in the{" "}
            <Link href="/faq" className={textLink}>
              FAQ
            </Link>
            .
          </>
        }
      >
        <FaqList items={FAQS} />
      </Block>

      <CtaBand />
    </>
  );
}
