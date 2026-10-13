import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Check, FileImage, Mail, PackageX, RefreshCcw, Search, Truck, X } from "lucide-react";
import { site } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { FAQ_GROUPS } from "@/components/marketing/faq-data";

export const metadata: Metadata = {
  title: "Love-It Guarantee — Free Remake or Full Refund",
  description:
    "If you don't love your printed portrait, tell us within 30 days of delivery and we'll remake it free or refund you in full. Damaged? Send a photo for a free replacement. No fine print.",
  alternates: { canonical: "/guarantee" },
};

const STEPS = [
  { icon: Mail, title: "Tell us", body: "Email us or use the contact form within 30 days of delivery. Tell us what's not right; a photo helps." },
  { icon: RefreshCcw, title: "Choose", body: "A free remake (a new style, a different photo or a fresh version) or a full refund. It's your call." },
  { icon: Check, title: "Done", body: "Remakes are printed and shipped free. Refunds go back to your original payment method." },
];

const COVERED = [
  { icon: RefreshCcw, title: "You don't love it", body: "Remake it free or get a full refund, within 30 days of delivery." },
  { icon: PackageX, title: "Damaged in transit", body: "Send us a photo of the damage and we'll send a free replacement." },
  { icon: Search, title: "A printing defect", body: "Smudges, color problems or anything that isn't up to standard: free replacement." },
  { icon: Truck, title: "Lost in the mail", body: "If tracking shows it never arrived, we'll replace it or refund you." },
  { icon: FileImage, title: "A problem with your file", body: "If something's wrong with your digital file, we'll fix it or refund you." },
];

const NO_FINE_PRINT = [
  "No “custom items are final sale”",
  "No 48-hour window to report problems",
  "No restocking or cancellation fees",
  "No return shipping costs on you",
  "No hoops: a quick email (and a photo, if it's damaged) is enough",
];

const FAQS = FAQ_GROUPS.find((g) => g.id === "guarantee")?.items ?? [];

export default function GuaranteePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        tone="sage"
        eyebrow="Love-it guarantee"
        title="Love it, or it's on us."
        lede={
          <p>
            If you don&apos;t love your printed portrait, tell us within 30 days of delivery. We&apos;ll remake it free or
            refund you in full. Your choice, in plain English, with no fine print.
          </p>
        }
        actions={
          <>
            <ButtonLink href="/create" variant="accent" size="lg">
              Create your free preview <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/contact?topic=guarantee" variant="secondary" size="lg">
              Start a remake or refund
            </ButtonLink>
          </>
        }
        aside={
          <div className="mx-auto flex max-w-[360px] items-center justify-center">
            <div className="relative aspect-square w-full max-w-[320px] rounded-full bg-paper p-5 shadow-frame">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-moss/40 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-moss">The Pup Prints promise</p>
                <p className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
                  Love it
                  <br />
                  or it&apos;s
                  <br />
                  on us
                </p>
                <p className="mt-3 text-sm text-ink-2">Remake or full refund</p>
              </div>
            </div>
          </div>
        }
      />

      <Section>
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps, no runaround" />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-card bg-paper-2 p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper ring-1 ring-line">
                    <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm text-ink-3">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-3xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">What&apos;s covered</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">If it&apos;s not right, we make it right</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Damaged pieces don&apos;t need to come back. A photo is all we need.
            </p>
            <p className="mt-6 flex items-start gap-3 text-[15px] text-ink-2">
              <Camera className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden="true" />
              Tip: keep the packaging until you&apos;ve checked your piece. It helps if anything was damaged on the way.
            </p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {COVERED.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-5 py-6">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-line">
                  <Icon className="h-5 w-5 text-moss" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-2xl">{title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-2">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-card bg-ink p-8 text-paper sm:p-10">
            <h2 className="font-display text-3xl sm:text-4xl">What you won&apos;t find here</h2>
            <p className="mt-3 text-paper/70">Typical portrait shops often hide behind these. We don&apos;t.</p>
            <ul className="mt-8 space-y-4">
              {NO_FINE_PRINT.map((n) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper/10">
                    <X className="h-3 w-3 text-butter" aria-hidden="true" />
                  </span>
                  <span className="text-paper/90">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <Eyebrow className="mb-4">Why we can promise this</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">You see it before you pay</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Because you approve your portrait before checkout, and a person on our team checks every print before it&apos;s
              printed, there are very few surprises. When something does go wrong, it should be our problem, not yours.
            </p>
            <p className="mt-6 text-[15px] text-ink-2">
              Questions about an order? Write to{" "}
              <a href={`mailto:${site.supportEmail}`} className="font-medium text-ink underline underline-offset-4">
                {site.supportEmail}
              </a>
              . We reply within one business day.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">The details</h2>
            <p className="mt-5 text-lg text-ink-2">
              Full terms are in our{" "}
              <Link href="/terms#guarantee" className="text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
                terms of service
              </Link>
              , written just as plainly.
            </p>
          </div>
          <FaqList items={FAQS} />
        </Container>
      </Section>

      <CtaBand eyebrow="Zero risk" title="See it free. Love it, or it's on us." />
    </>
  );
}
