import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, Camera, Check, CreditCard, Frame, ShieldCheck, Sparkles, Truck, UserCheck, Wand2 } from "lucide-react";
import { PROMISES } from "@/lib/catalog";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { FramedArt } from "@/components/marketing/framed-art";
import { JsonLd } from "@/components/marketing/json-ld";
import { PhotoIllustration, PhotoTips } from "@/components/marketing/photo-tips";
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
    icon: Camera,
    title: "Upload a photo",
    body: "Any clear phone photo of your dog will do. The best ones are close-up, at their eye level, in soft natural light, with both eyes and ears in the frame.",
    detail: "JPG, PNG or iPhone photos are all fine.",
  },
  {
    icon: Sparkles,
    title: "See your portrait, free",
    body: `Pick a style and your portrait appears in about a minute. ${PROMISES.rerolls}. No card needed.`,
    detail: "Not quite them? Try again, or try another photo.",
  },
  {
    icon: Frame,
    title: "Choose how to hang it",
    body: "Fine art print, framed print or gallery canvas, in the size that suits your wall. The hi-res digital file is included with every physical piece, and US shipping is free.",
    detail: "Buying a gift? Send a Gift Reveal the moment you order.",
  },
  {
    icon: Truck,
    title: "We check, print and ship",
    body: `A person on our team checks your art and print file before it's printed. Your piece is made to order and arrives in ${PHYSICAL_SHIP_WINDOW} in the US.`,
    detail: "We email tracking as soon as it ships.",
  },
];

const TIMELINE = [
  { when: "In about a minute", title: "Your free preview", body: "See your dog in any style, as many times as you like." },
  { when: "Right after checkout", title: "Your digital file and Gift Reveal", body: "The hi-res file lands in your inbox, and a Gift Reveal is ready to send." },
  { when: "Before printing", title: "A human check", body: "A person on our team reviews your art and print file, so problems are caught before they reach your wall." },
  { when: `In ${PHYSICAL_SHIP_WINDOW}`, title: "At your door", body: "Printed to order, packed, and tracked all the way to you (US estimate)." },
];

const MADE = [
  { icon: Wand2, title: "Our AI artist creates it", body: "Your portrait is created from your photo by our AI artist, guided by styles we've designed to keep your dog's face, markings and expression." },
  { icon: CreditCard, title: "You approve it before you pay", body: "You see the exact art first. If it doesn't look like your dog, you don't buy it. Simple." },
  { icon: UserCheck, title: "Our team checks every print", body: "A person reviews every portrait and print file before it's printed, and our love-it guarantee covers what arrives." },
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
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        eyebrow="How it works"
        title="From photo to portrait, in four easy steps"
        lede={
          <p>
            See it now. Give it now. Hang it in days. Here&apos;s exactly what happens, from the photo on your phone to the
            portrait on your wall.
          </p>
        }
        actions={
          <ButtonLink href="/create" variant="accent" size="lg">
            Start with a photo <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
        aside={
          <div className="relative mx-auto flex max-w-[500px] items-center justify-center gap-4 rounded-[2rem] bg-paper-2 px-6 py-12 sm:gap-8 sm:px-10">
            <div className="w-[36%] -rotate-3 bg-white p-2 pb-8 shadow-soft">
              <PhotoIllustration variant="good" title="Illustration of a dog photo taken on a phone" />
            </div>
            <ArrowRight className="h-6 w-6 shrink-0 text-clay" aria-hidden="true" />
            <div className="w-[46%]">
              <FramedArt style="oil-classic" finish="oak" priority sizes="(max-width: 1024px) 45vw, 18vw" />
            </div>
          </div>
        }
      />

      <Section className="bg-paper-2">
        <Container>
          <ol className="grid gap-5 md:grid-cols-2">
            {STEPS.map(({ icon: Icon, title, body, detail }, i) => (
              <li key={title} className="relative flex flex-col rounded-card bg-paper p-7 ring-1 ring-line sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clay-soft">
                    <Icon className="h-5 w-5 text-clay-dark" aria-hidden="true" />
                  </span>
                  <span className="font-display text-5xl text-paper-3" aria-hidden="true">
                    {i + 1}
                  </span>
                </div>
                <h2 className="mt-6 font-display text-3xl leading-tight">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h2>
                <p className="mt-3 flex-1 leading-relaxed text-ink-2">{body}</p>
                <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-3">
                  <Check className="h-4 w-4 text-moss" aria-hidden="true" /> {detail}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="photo-tips" className="scroll-mt-20">
        <Container>
          <SectionHeading
            eyebrow="Photo tips"
            title="The photo makes the portrait"
            subtitle="You don't need a professional camera. A phone photo is perfect if it's sharp, close and well lit."
          />
          <PhotoTips className="mt-14" />
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Timeline</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">See it now. Hang it in days.</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              No waiting days for a proof, and no paying for something you haven&apos;t seen.
            </p>
          </div>
          <ol className="relative space-y-10 border-l border-line pl-8 sm:pl-10">
            {TIMELINE.map((t) => (
              <li key={t.title} className="relative">
                <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-[10px] w-[10px] rounded-full bg-clay ring-4 ring-paper-2 sm:-left-[calc(2.5rem+5px)]" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">{t.when}</p>
                <h3 className="mt-2 font-display text-2xl">{t.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-2">{t.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="how-its-made" className="scroll-mt-20">
        <Container>
          <SectionHeading
            eyebrow="How the art is made"
            title="Honest about how it's made"
            subtitle="We think you deserve to know exactly what you're buying."
          />
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {MADE.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-card bg-paper-2 p-7 sm:p-8">
                <Icon className="h-6 w-6 text-clay" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl leading-tight">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-6 rounded-card bg-ink p-7 text-paper sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 shrink-0 text-butter" aria-hidden="true" />
              <h3 className="font-display text-3xl leading-tight">What we&apos;ll never do</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {NEVER.map((n) => (
                <li key={n} className="flex items-start gap-3 text-[15px] text-paper/80">
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-butter" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Good to know</h2>
            <p className="mt-5 text-lg text-ink-2">
              More answers in our{" "}
              <Link href="/faq" className="text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
                FAQ
              </Link>
              .
            </p>
          </div>
          <FaqList items={FAQS} />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
