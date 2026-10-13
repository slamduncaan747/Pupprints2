import type { Metadata } from "next";
import Link from "next/link";
import { PROMISES, STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER } from "@/lib/samples";
import { SampleImage } from "@/components/ui/sample-image";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Note, Rows, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { faq } from "@/components/marketing/faq-data";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "How It Works — From Your Photo to a Framed Dog Portrait",
  description:
    "Upload a photo, see your dog's portrait free in about a minute, choose a print, frame or canvas, and we check, print and ship it. Plus photo tips and how the art is made.",
  alternates: { canonical: "/how-it-works" },
};

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
    body: "A person reviews every portrait and print file before it's printed, and our love-it guarantee covers what arrives.",
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
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        eyebrow="How it works"
        title="From photo to portrait, in four steps"
        lede="See it now. Give it now. Hang it in days. Here's exactly what happens, from the photo on your phone to the portrait on your wall."
        media={
          pair &&
          style && (
            <div className="mx-auto grid max-w-[520px] grid-cols-2 gap-4 sm:gap-6">
              <figure>
                <SampleImage
                  src={pair.before}
                  alt={`Phone photo of a ${pair.dog}`}
                  swatch="#d8d2c4"
                  priority
                  sizes="(max-width: 640px) 45vw, 250px"
                />
                <figcaption className="mt-3 text-[13px] text-ink-3">The photo</figcaption>
              </figure>
              <figure>
                <SampleImage
                  src={pair.after}
                  alt={`${style.name} portrait of the same ${pair.dog}`}
                  swatch={style.swatch}
                  priority
                  sizes="(max-width: 640px) 45vw, 250px"
                />
                <figcaption className="mt-3 text-[13px] text-ink-3">The portrait, in {style.name}</figcaption>
              </figure>
            </div>
          )
        }
      />

      <Block title="Step by step">
        <Rows numbered items={STEPS} />
      </Block>

      <Block
        id="photo-tips"
        title="The photo makes the portrait"
        intro="You don't need a professional camera. A phone photo is perfect if it's sharp, close and well lit."
      >
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
          <div>
            <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">A great photo</h3>
            <Bullets items={DO} className="mt-4" />
          </div>
          <div>
            <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">Try to avoid</h3>
            <Bullets items={AVOID} className="mt-4" />
          </div>
        </div>
        <Note className="mt-8">
          Not sure? Upload it anyway. Previews are free, and older or slightly blurry photos often work better than you&apos;d
          expect.
        </Note>
      </Block>

      <Block title="See it now. Hang it in days." intro="No waiting days for a proof, and no paying for something you haven't seen.">
        <Rows items={TIMELINE} />
      </Block>

      <Block id="how-its-made" title="Honest about how it's made" intro="We think you deserve to know exactly what you're buying.">
        <Rows items={MADE} />
        <h3 className="mt-12 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">
          What we&apos;ll never do
        </h3>
        <Bullets items={NEVER} className="mt-4" />
      </Block>

      <Block
        title="Good to know"
        intro={
          <>
            More answers in our{" "}
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
