import type { Metadata } from "next";
import { STYLE_MAP } from "@/lib/catalog";
import { GALLERY } from "@/lib/samples";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Prose, Rows } from "@/components/marketing/blocks";
import { CampaignImage } from "@/components/marketing/campaign";
import { CtaBand } from "@/components/marketing/cta-band";

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

const NUMERALS = ["I", "II", "III", "IV"];

export default function AboutPage() {
  const triptych = GALLERY.slice(0, 3);
  return (
    <>
      <PageHero
        align="center"
        eyebrow="The Maison"
        title="Portraits should be easy, honest and beautiful."
        lede="Pup Prints makes fine-art portraits of the dogs we love. You see it first, you pay a fair price, and if something isn't right, we fix it."
      />

      {triptych.length > 0 && (
        <section aria-label="Portraits from the collection">
          <ul className="grid grid-cols-2 gap-0.5 md:grid-cols-3">
            {triptych.map((g, i) => {
              const style = STYLE_MAP[g.style];
              return (
                <li key={g.src} className={i === 0 ? "col-span-2 md:col-span-1" : undefined}>
                  <CampaignImage
                    src={g.src}
                    alt={`${style.name} portrait of a ${g.dog}`}
                    swatch={style.swatch}
                    priority={i === 0}
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 33vw"}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="why-title" className="py-24 sm:py-36">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            <p className="label text-ink-3 lg:col-span-3">Why we began</p>
            <div className="mt-8 lg:col-span-8 lg:col-start-5 lg:mt-0">
              <h2 id="why-title" className="font-display text-[36px] leading-[1.06] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
                You should be able to see it before you pay for it.
              </h2>
              <Prose className="mt-12 max-w-[560px] text-[16px]">
                <p>
                  Getting a portrait of your dog usually meant paying first, waiting days for a proof, and hoping it looked
                  like them. Then came the extras: rush fees, add-ons you didn&apos;t ask for, and policies that said custom
                  items couldn&apos;t be returned.
                </p>
                <p>
                  We thought it should work the other way round. Upload a photo, see the portrait in about a minute, try every
                  style for free, and only pay once you love it. If it&apos;s a gift, give it instantly with a Gift Reveal, and
                  let the print follow.
                </p>
                <p>
                  We&apos;re a new company, so we can&apos;t point to years of history or a wall of reviews yet. What we can
                  offer is a clear promise: honest prices, real people checking every print, and a guarantee that puts the risk
                  on us.
                </p>
              </Prose>
            </div>
          </div>
        </Container>
      </section>

      <Block eyebrow="Our values" title="What we believe" layout="stack">
        <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
          {VALUES.map((v, i) => (
            <li key={v.title} className="border-t border-line pt-6">
              <p className="label text-ink-3">{NUMERALS[i] ?? i + 1}</p>
              <h3 className="mt-5 font-display text-[30px] leading-[1.06] sm:text-[36px]">{v.title}</h3>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-2">{v.body}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        eyebrow="Our method"
        title="How we work"
        intro="Your portrait is created from your photo by our AI artist, in styles we've designed for dogs. Then people take over."
      >
        <Rows items={HOW} />
      </Block>

      <Block eyebrow="Our word" title="What you'll never see from us">
        <Bullets items={NEVER} />
      </Block>

      <Block eyebrow="Giving back" title="When it's real">
        <Prose>
          <p>
            Once we&apos;re up and running, we plan to support dog rescues and shelters. When we do, we&apos;ll share exactly how
            here, with real details rather than vague promises.
          </p>
        </Prose>
      </Block>

      <CtaBand eyebrow="Commission" title="Meet your dog's portrait" image="oil-classic" />
    </>
  );
}
