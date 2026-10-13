import type { Metadata } from "next";
import { ArrowRight, Ban, Brush, Eye, HeartHandshake, MessageCircle, PawPrint, Scale, UserCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
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
    icon: Scale,
    title: "Honesty",
    body: "Real prices, no fake sales, no surprise fees, no made-up reviews. We tell you how the art is made, and you see it before you pay.",
  },
  {
    icon: Brush,
    title: "Craft",
    body: "A small, carefully designed set of styles, archival materials, and a person checking every print before it's printed.",
  },
  {
    icon: PawPrint,
    title: "Dogs first",
    body: "We only do dogs, so every style is tuned for the things that make a dog recognizable: the ears, the markings, the look in their eyes.",
  },
];

const HOW = [
  { icon: Eye, title: "You see it first", body: "Your portrait is free to preview, as many times as you like. You only pay for the one you love." },
  { icon: UserCheck, title: "A person checks every print", body: "Before anything goes to print, someone on our team looks at it closely." },
  { icon: HeartHandshake, title: "We stand behind it", body: "If you don't love what arrives, we remake it or refund you. No fine print." },
  { icon: MessageCircle, title: "Real replies", body: "Write to us and a real person replies within one business day." },
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
        lede={
          <p>
            Pup Prints makes fine-art portraits of the dogs we love, and we try to do it the way we&apos;d want to be treated as
            customers: you see it first, you pay a fair price, and if something isn&apos;t right, we fix it.
          </p>
        }
        actions={
          <ButtonLink href="/create" variant="accent" size="lg">
            Meet your dog&apos;s portrait <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
        aside={
          <div className="relative mx-auto grid max-w-[500px] grid-cols-2 items-center gap-6 rounded-[2rem] bg-paper-2 p-8 sm:gap-8 sm:p-12">
            <FramedArt style="oil-classic" finish="oak" priority sizes="(max-width: 1024px) 40vw, 18vw" className="translate-y-6" />
            <FramedArt style="fine-line" finish="white" sizes="(max-width: 1024px) 40vw, 18vw" className="-translate-y-6" />
          </div>
        }
      />

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Eyebrow className="mb-4">Why we started</Eyebrow>
            <blockquote className="font-display text-4xl leading-[1.1] sm:text-5xl">
              &ldquo;You should be able to see it before you pay for it.&rdquo;
            </blockquote>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink-2">
            <p>
              Pup Prints started with a simple frustration. Getting a portrait of your dog usually meant paying first, waiting
              days for a proof, and hoping it looked like them. Then came the extras: rush fees, add-ons you didn&apos;t ask
              for, and policies that said custom items couldn&apos;t be returned.
            </p>
            <p>
              We thought it should work the other way round. Upload a photo, see the portrait in about a minute, try every
              style for free, and only pay once you love it. If it&apos;s a gift, give it instantly with a Gift Reveal, and let
              the print follow.
            </p>
            <p>
              We&apos;re a new company, so we can&apos;t point to years of history or a wall of reviews yet. What we can offer is
              a clear promise: honest prices, real people checking every print, and a guarantee that puts the risk on us.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="What we believe" title="Three things we won't compromise on" />
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-card bg-paper-2 p-7 sm:p-9">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper ring-1 ring-line">
                  <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-3xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">How we work</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Made with care, checked by people</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Your portrait is created from your photo by our AI artist, in styles we&apos;ve designed and tuned for dogs. Then
              people take over: we check your art and print file, print on archival materials, and stand behind the result.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {HOW.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <Icon className="h-6 w-6 text-clay" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-card bg-ink p-8 text-paper sm:p-10">
            <h2 className="font-display text-3xl sm:text-4xl">What you&apos;ll never see from us</h2>
            <ul className="mt-8 space-y-4">
              {NEVER.map((n) => (
                <li key={n} className="flex items-start gap-3 text-paper/90">
                  <Ban className="mt-1 h-4 w-4 shrink-0 text-butter" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <Eyebrow className="mb-4">Looking ahead</Eyebrow>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">Giving back, when it&apos;s real</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              Once we&apos;re up and running, we plan to support dog rescues and shelters. When we do, we&apos;ll share exactly
              how here, with real details rather than vague promises.
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand eyebrow="Come and see" title="Meet your dog's portrait" />
    </>
  );
}
