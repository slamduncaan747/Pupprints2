import type { Metadata } from "next";
import Link from "next/link";
import { PROMISES, STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER, STYLE_SAMPLES } from "@/lib/samples";
import { CampaignImage, Chapter, ProductShot } from "@/components/marketing/campaign";
import { FramedArt } from "@/components/marketing/framed-art";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Note, Rows, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { faq } from "@/components/marketing/faq-data";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { GUARANTEE_IN_SENTENCE, OfferCta } from "@/components/marketing/offer";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works — One Photo, About a Minute, Free",
  description:
    "Upload one photo and see your dog's portrait free in about a minute: no account, no card. Then choose a print, frame or canvas, and we check, print and ship it.",
  alternates: { canonical: "/how-it-works" },
};

/** The effort lever, in four short facts. */
const EFFORT = [
  { label: "What you need", value: "One photo" },
  { label: "Until you see it", value: "About a minute" },
  { label: "To sign up", value: "Nothing" },
  { label: "To preview", value: "Free, no card" },
];

const STEPS = [
  {
    title: "Upload a photo",
    body: "Any clear phone photo of your dog will do. JPG, PNG or iPhone photos are all fine.",
  },
  {
    title: "See your portrait, free",
    body: `Pick a style and your portrait appears in about a minute. ${PROMISES.rerolls}. No card needed.`,
  },
  {
    title: "Choose how to hang it",
    body: "Fine art print, framed print or gallery canvas. The hi-res digital file is included with every physical piece, and US shipping is free. Buying a gift? Send a Gift Reveal the moment you order.",
  },
  {
    title: "We check, print and ship",
    body: `A person on our team checks your art and print file before it's printed. It's made to order and arrives in ${PHYSICAL_SHIP_WINDOW} in the US, with tracking.`,
  },
];

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

const TIMELINE = [
  { title: "In about a minute", body: "Your free preview. See your dog in any style, as many times as you like." },
  { title: "Right after checkout", body: "The hi-res file lands in your inbox, and a Gift Reveal is ready to send." },
  { title: "Before printing", body: "A person on our team reviews your art and print file, so problems are caught before they reach your wall." },
  { title: `In ${PHYSICAL_SHIP_WINDOW}`, body: "Printed to order, packed and tracked all the way to your door (US estimate)." },
];

const MADE = [
  {
    title: "Our AI artist creates it",
    body: "Your portrait is created from your photo by our AI artist, guided by styles we've designed to keep your dog's face, markings and expression.",
  },
  {
    title: "You approve it before you pay",
    body: "You see the exact art first. If it doesn't look like your dog, you don't buy it.",
  },
  {
    title: "Our team checks every print",
    body: `A person reviews every portrait and print file before it's printed, and ${GUARANTEE_IN_SENTENCE} covers what arrives.`,
  },
];

const NEVER = [
  "Claim your portrait was painted by hand",
  "Charge you before you've seen your art",
  "Pre-check add-ons or add surprise fees",
  "Use fake sales, fake reviews or countdown timers",
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
  const chapterStyle = style ?? STYLE_MAP.royal;
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        align="center"
        eyebrow="The Process"
        title="One photo. About a minute."
        lede="No account, no card, nothing to install. Upload a photo of your dog and see the portrait before you decide anything. Here is exactly what happens, from your phone to your wall."
      >
        <OfferCta align="center" note={null} />
      </PageHero>

      <section aria-label="What it takes" className="pb-20 sm:pb-28">
        <Container>
          <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {EFFORT.map((e, i) => (
              <div
                key={e.label}
                className={cn(
                  "border-b border-line py-7 sm:py-9 lg:border-b-0 lg:px-6 lg:first:pl-0",
                  i % 2 === 0 ? "border-r pr-4" : "pl-4 sm:pl-6",
                  i === EFFORT.length - 1 ? "lg:border-r-0" : "lg:border-r",
                )}
              >
                <dt className="label text-ink-3">{e.label}</dt>
                <dd className="mt-3 font-display text-[28px] leading-[1.05] sm:text-[40px]">{e.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <h2 className="sr-only">Step by step</h2>
      <Chapter
        id="step-photo"
        kicker="I · The photograph"
        title="It begins with a photograph."
        media={
          <CampaignImage
            src={pair?.before ?? STYLE_SAMPLES.royal}
            alt={pair ? `Phone photo of a ${pair.dog}` : "Example dog portrait"}
            swatch="#d8d2c4"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        }
      >
        <p>{STEPS[0].body}</p>
        <p className="mt-6">
          <a href="#photo-tips" className="link-cta text-ink">
            Photo tips
          </a>
        </p>
      </Chapter>
      <Chapter
        id="step-preview"
        side="right"
        kicker="II · The preview"
        title="See it before you pay."
        media={
          <CampaignImage
            src={pair?.after ?? STYLE_SAMPLES[chapterStyle.slug]}
            alt={pair && style ? `${style.name} portrait of the same ${pair.dog}` : `Example ${chapterStyle.name} dog portrait`}
            swatch={chapterStyle.swatch}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        }
      >
        <p>{STEPS[1].body}</p>
      </Chapter>
      <Chapter
        id="step-piece"
        kicker="III · The piece"
        title="Checked by a person. Hung in days."
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
        <p>{STEPS[2].body}</p>
        <p className="mt-4">{STEPS[3].body}</p>
      </Chapter>

      <Block
        id="photo-tips"
        eyebrow="The photograph"
        title="The photo makes the portrait"
        intro="A phone photo is perfect if it's sharp, close and well lit."
      >
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-10">
          <div>
            <h3 className="label text-ink">A great photo</h3>
            <Bullets items={DO} className="mt-5" />
          </div>
          <div>
            <h3 className="label text-ink">Try to avoid</h3>
            <Bullets items={AVOID} className="mt-5" />
          </div>
        </div>
        <Note className="mt-8">
          Not sure? Upload it anyway. Previews are free, and older or slightly blurry photos often work better than you&apos;d
          expect.
        </Note>
      </Block>

      <Block
        eyebrow="Timing"
        title="See it now. Hang it in days."
        intro="No waiting days for a proof, and no paying for something you haven't seen."
      >
        <Rows items={TIMELINE} />
      </Block>

      <Block
        id="how-its-made"
        eyebrow="In confidence"
        title="Honest about how it's made"
        intro="You deserve to know exactly what you're buying."
      >
        <Rows items={MADE} />
        <h3 className="label mt-14 text-ink">What we&apos;ll never do</h3>
        <Bullets items={NEVER} className="mt-5" />
      </Block>

      <Block
        titleStyle="label"
        title="Client services"
        intro={
          <>
            More answers in{" "}
            <Link href="/faq" className={textLink}>
              Client Services
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
