import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BarChart3, Camera, Film, Flower2, Gift, HandCoins, Palette, Percent, Send, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PartnerApplyForm } from "@/components/partners/apply-form";
import { RevealVisual } from "@/components/partners/reveal-visual";
import { PROGRAM } from "@/components/partners/program";
import { site } from "@/lib/config";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const COMMISSION = `${Math.round(PROGRAM.commissionRate * 100)}%`;
const DISCOUNT = `${PROGRAM.discountPercent}%`;

const TITLE = "Creator & Affiliate Program";
const DESCRIPTION = `Dog creators: get a free fine-art portrait of your dog for your content, give your audience ${DISCOUNT} off, and earn ${COMMISSION} on every order. Apply in two minutes.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/partners" },
  openGraph: {
    type: "website",
    title: `${TITLE} | ${site.name}`,
    description: DESCRIPTION,
    url: "/partners",
    siteName: site.name,
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | ${site.name}`, description: DESCRIPTION, images: [DEFAULT_OG_IMAGE.url] },
};

const PERKS = [
  {
    icon: Gift,
    title: "A portrait of your dog, on us",
    body: "We create your dog's portrait in the style you choose, then print and ship it to you free, with the hi-res file for your content.",
  },
  {
    icon: HandCoins,
    title: `${COMMISSION} commission on every order`,
    body: `Earn on every order placed through your link or code. Your link tracks for ${PROGRAM.attributionDays} days after a click.`,
  },
  {
    icon: Percent,
    title: `${DISCOUNT} off for your audience`,
    body: "A personal code with your name on it, so your followers get a real discount (not a made-up one).",
  },
  {
    icon: BarChart3,
    title: "Your own stats page",
    body: "A private link that shows your clicks, orders and earnings, updated in real time. No spreadsheets, no chasing.",
  },
];

const STEPS = [
  { icon: Send, title: "Apply", body: "Tell us about you, your channels and your dog. It takes about two minutes." },
  { icon: Palette, title: "We create your portrait", body: "Pick a style together, approve your portrait, and we print it and ship it to you." },
  { icon: Camera, title: "Share the reveal", body: "Post the moment it arrives, clearly marked #ad or Paid partnership, with your link and code." },
  { icon: HandCoins, title: "Earn", body: `You earn ${COMMISSION} of every order from your audience. We pay out monthly.` },
];

const IDEAS = [
  {
    icon: Film,
    title: "The reveal reaction",
    body: "Film the unboxing, or your family seeing it for the first time. Bonus points for your dog's reaction to meeting their own portrait.",
  },
  {
    icon: Sparkles,
    title: "Before & after",
    body: "Your original photo, then the portrait. A simple swipe or transition is the most-saved format for a reason.",
  },
  {
    icon: Palette,
    title: "Style try-on",
    body: "Previews are free, so try your dog in several styles and let your followers vote on the one you frame.",
  },
  {
    icon: Flower2,
    title: "A memorial tribute",
    body: "If you've lost a dog, a portrait can be a gentle way to remember them. Only if it feels right; never staged for content.",
  },
];

const FAQ = [
  {
    q: "Do I need a big following?",
    a: "No. We work with creators of every size, including small accounts with a close, engaged community. Genuine love of dogs and a consistent style matter more to us than follower counts.",
  },
  {
    q: "What's the standard offer?",
    a: `A free portrait of your dog (print plus hi-res file), ${COMMISSION} commission on every order through your link or code, and ${DISCOUNT} off for your audience. Creators we work with often get custom terms, like higher commission or gift portraits for giveaways.`,
  },
  {
    q: "Do I have to post?",
    a: "We hope you'll love your portrait enough to share it, but there's no minimum posting requirement for the gifted portrait. Commission is only paid on real orders.",
  },
  {
    q: "How do I disclose the partnership?",
    a: "Every post that mentions us must clearly say it's a partnership: use the platform's Paid partnership label and/or put #ad at the start of your caption (not hidden among hashtags), and say it out loud in videos. This applies to gifted posts too. It's required by the FTC and similar rules elsewhere, and it's required by us.",
  },
  {
    q: "How is the art made?",
    a: "Your portrait is created by our AI artist, then finished and checked by a person on our team before anything is printed. Please describe it that way if anyone asks; don't call it hand-painted.",
  },
  {
    q: "How long does my link track, and when do I get paid?",
    a: `Your link remembers a visitor for ${PROGRAM.attributionDays} days after they click, and your code works any time it's used at checkout. Commission is calculated on what the customer paid for their portrait, and refunded orders don't count. We pay monthly by PayPal or bank transfer.`,
  },
  {
    q: "Can I run ads with my code or post it on coupon sites?",
    a: "Please don't post your code on coupon or deal sites, and don't bid on Pup Prints in search ads. If you'd like to run paid ads with your content, talk to us first and we'll set it up properly.",
  },
  {
    q: "Where can you ship my portrait?",
    a: "Tell us where you're based in the application. We'll confirm shipping for your portrait before we start.",
  },
];

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="partners-title" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 top-24 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(242_212_146/0.45),rgb(250_246_239/0))]"
        />
        <Container className="relative grid items-center gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
          <div className="max-w-xl">
            <Eyebrow>Creators &amp; affiliates</Eyebrow>
            <h1
              id="partners-title"
              className="mt-5 font-display text-[2.6rem] leading-[1.0] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
            >
              Your dog, as art. <span className="italic text-clay-dark">Your audience, delighted.</span>
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-ink-2 sm:text-xl sm:leading-relaxed">
              Join the Pup Prints creator program: we make a fine-art portrait of your dog for your content, your followers
              get <strong className="font-semibold text-ink">{DISCOUNT} off</strong>, and you earn{" "}
              <strong className="font-semibold text-ink">{COMMISSION}</strong> on every order.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="#apply" size="lg" className="w-full sm:w-auto">
                Apply in two minutes <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#how" variant="secondary" size="lg" className="w-full sm:w-auto">
                How it works
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-3">For Instagram, TikTok, YouTube and Pinterest creators of every size.</p>
          </div>
          <RevealVisual />
        </Container>
      </section>

      {/* What you get */}
      <Section className="bg-paper-2 py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What you get"
            title="A simple, honest offer"
            subtitle="No posting quotas, no complicated tiers. Creators we work with closely get custom terms."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-card bg-paper p-6 ring-1 ring-line">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-clay-soft text-clay-dark">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl leading-snug">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* How it works */}
      <Section id="how" className="scroll-mt-20 py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="How it works" title="From application to first payout" />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-clay-dark" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Content ideas */}
      <Section className="bg-ink py-16 text-paper sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="text-butter">Content ideas</Eyebrow>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">Posts your audience will actually love</h2>
            <p className="mt-5 text-lg leading-relaxed text-paper/70">
              The best partner content is real: your dog, your home, your genuine reaction. A few formats that work well:
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {IDEAS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-card bg-white/[0.06] p-6 ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-butter" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/75">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Disclosure */}
      <Section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 rounded-card bg-butter-soft p-6 ring-1 ring-butter sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-10">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-ink shadow-soft">
              <BadgeCheck className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Always disclose. It&apos;s the law, and it&apos;s our rule.</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-2">
                Because you receive a free portrait and earn commission, every post about Pup Prints is an ad, even if you&apos;d
                have loved it anyway. Make that obvious:
              </p>
              <ul className="mt-5 grid gap-3 text-[15px] leading-relaxed text-ink-2 sm:grid-cols-2">
                <li className="rounded-xl bg-white/70 p-4">
                  Turn on the platform&apos;s <strong className="text-ink">Paid partnership</strong> label, and/or start your
                  caption with <strong className="text-ink">#ad</strong>. Don&apos;t bury it in hashtags.
                </li>
                <li className="rounded-xl bg-white/70 p-4">
                  In videos, say it out loud too (&ldquo;Pup Prints sent me this&rdquo;). Stories need it on every frame.
                </li>
                <li className="rounded-xl bg-white/70 p-4">
                  Gifted-only posts need disclosure as well, even when you&apos;re not earning commission yet.
                </li>
                <li className="rounded-xl bg-white/70 p-4">
                  Keep claims honest: no invented urgency, prices or reviews, and say it&apos;s created by our AI artist and
                  checked by our team if anyone asks.
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-paper-2 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">Creator FAQ</h2>
            <p className="mt-5 text-lg text-ink-2">
              Something else?{" "}
              <a href={`mailto:${site.partnersEmail}`} className="font-medium text-ink underline underline-offset-4">
                {site.partnersEmail}
              </a>
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-xl leading-snug [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 text-sm transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Apply */}
      <Section id="apply" className="scroll-mt-16 py-16 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Apply"
            title="Let's make something beautiful"
            subtitle="Tell us about you and your dog. We read every application and reply within about a week."
            className="mb-10"
          />
          <PartnerApplyForm partnersEmail={site.partnersEmail} />
        </Container>
      </Section>
    </>
  );
}
