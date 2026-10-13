import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Prose, Rows } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FramedArt } from "@/components/marketing/framed-art";

export const metadata: Metadata = {
  title: "Our Story — Honest, Beautiful Portraits of the Dogs We Love",
  description:
    "Why we started Pup Prints: dog portraits should be easy, honest and beautiful, and you should see yours before you pay. Our values and how we work.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "Honesty",
    body: "Real prices, no fake sales, no surprise fees, no made-up reviews. We tell you how the art is made, and you see it before you pay.",
  },
  {
    title: "Craft",
    body: "A small, carefully designed set of styles, archival materials, and a person checking every print before it's printed.",
  },
  {
    title: "Dogs first",
    body: "We only do dogs, so every style is tuned for the things that make a dog recognizable: the ears, the markings, the look in their eyes.",
  },
];

const HOW = [
  { title: "You see it first", body: "Your portrait is free to preview, as many times as you like. You only pay for the one you love." },
  { title: "A person checks every print", body: "Before anything goes to print, someone on our team looks at it closely." },
  { title: "We stand behind it", body: "If you don't love what arrives, we remake it or refund you. No fine print." },
  { title: "Real replies", body: "Write to us and a real person replies within one business day." },
];

const NEVER = [
  "Fake reviews, star ratings or customer counts",
  "Fake “compare at” prices or permanent sales",
  "Countdown timers or pressure tactics",
  "Pre-checked add-ons or surprise fees",
  "Pretending the art was painted by hand",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Portraits should be easy, honest and beautiful."
        lede="Pup Prints makes fine-art portraits of the dogs we love. You see it first, you pay a fair price, and if something isn't right, we fix it."
        media={
          <FramedArt
            style="oil-classic"
            finish="oak"
            priority
            sizes="(max-width: 1024px) 85vw, 420px"
            className="mx-auto w-full max-w-[420px]"
          />
        }
      />

      <Block title="Why we started">
        <Prose>
          <p className="font-display text-[1.75rem] leading-[1.2] text-ink sm:text-[2rem]">
            &ldquo;You should be able to see it before you pay for it.&rdquo;
          </p>
          <p>
            Pup Prints started with a simple frustration. Getting a portrait of your dog usually meant paying first, waiting days
            for a proof, and hoping it looked like them. Then came the extras: rush fees, add-ons you didn&apos;t ask for, and
            policies that said custom items couldn&apos;t be returned.
          </p>
          <p>
            We thought it should work the other way round. Upload a photo, see the portrait in about a minute, try every style
            for free, and only pay once you love it. If it&apos;s a gift, give it instantly with a Gift Reveal, and let the print
            follow.
          </p>
          <p>
            We&apos;re a new company, so we can&apos;t point to years of history or a wall of reviews yet. What we can offer is a
            clear promise: honest prices, real people checking every print, and a guarantee that puts the risk on us.
          </p>
        </Prose>
      </Block>

      <Block title="What we believe">
        <Rows items={VALUES} />
      </Block>

      <Block
        title="How we work"
        intro="Your portrait is created from your photo by our AI artist, in styles we've designed for dogs. Then people take over."
      >
        <Rows items={HOW} />
      </Block>

      <Block title="What you'll never see from us">
        <Bullets items={NEVER} />
      </Block>

      <Block title="Giving back, when it's real">
        <Prose>
          <p>
            Once we&apos;re up and running, we plan to support dog rescues and shelters. When we do, we&apos;ll share exactly how
            here, with real details rather than vague promises.
          </p>
        </Prose>
      </Block>

      <CtaBand title="Meet your dog's portrait" />
    </>
  );
}
