import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Rows, textLink } from "@/components/marketing/blocks";
import { FaqList } from "@/components/marketing/faq";
import { CampaignImage } from "@/components/marketing/campaign";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { PartnerApplyForm } from "@/components/partners/apply-form";
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
    title: "A portrait of your dog, on us",
    body: "We create your dog's portrait in the style you choose, then print and ship it to you free, with the hi-res file for your content.",
  },
  {
    title: `${COMMISSION} commission on every order`,
    body: `Earn on every order placed through your link or code. Your link tracks for ${PROGRAM.attributionDays} days after a click.`,
  },
  {
    title: `${DISCOUNT} off for your audience`,
    body: "A personal code with your name on it, so your followers get a real discount (not a made-up one).",
  },
  {
    title: "Your own stats page",
    body: "A private link that shows your clicks, orders and earnings, updated in real time. No spreadsheets, no chasing.",
  },
];

const STEPS = [
  { title: "Apply", body: "Tell us about you, your channels and your dog. It takes about two minutes." },
  { title: "We create your portrait", body: "Pick a style together, approve your portrait, and we print it and ship it to you." },
  { title: "Share the reveal", body: "Post the moment it arrives, clearly marked #ad or Paid partnership, with your link and code." },
  { title: "Earn", body: `You earn ${COMMISSION} of every order from your audience. We pay out monthly.` },
];

const IDEAS = [
  {
    title: "The reveal reaction",
    body: "Film the unboxing, or your family seeing it for the first time. Bonus points for your dog's reaction to meeting their own portrait.",
  },
  {
    title: "Before & after",
    body: "Your original photo, then the portrait. A simple swipe or transition does the work.",
  },
  {
    title: "Style try-on",
    body: "Previews are free, so try your dog in several styles and let your followers vote on the one you frame.",
  },
  {
    title: "A memorial tribute",
    body: "If you've lost a dog, a portrait can be a gentle way to remember them. Only if it feels right; never staged for content.",
  },
];

const DISCLOSE = [
  <>
    Turn on the platform&apos;s <strong className="font-medium text-ink">Paid partnership</strong> label, and/or start your
    caption with <strong className="font-medium text-ink">#ad</strong>. Don&apos;t bury it in hashtags.
  </>,
  <>In videos, say it out loud too (&ldquo;Pup Prints sent me this&rdquo;). Stories need it on every frame.</>,
  <>Gifted-only posts need disclosure as well, even when you&apos;re not earning commission yet.</>,
  <>
    Keep claims honest: no invented urgency, prices or reviews, and say it&apos;s created by our AI artist and checked by
    our team if anyone asks.
  </>,
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
      <PageHero
        eyebrow="Creators & affiliates"
        title="The Creator Programme"
        lede={`A fine-art portrait of your dog for your content, ${DISCOUNT} off for your followers, and ${COMMISSION} on every order. For creators of every size.`}
        media={
          <CampaignImage
            src={STYLE_SAMPLES.royal}
            alt={`Example ${STYLE_MAP.royal.name} dog portrait`}
            swatch={STYLE_MAP.royal.swatch}
            priority
            fill
          />
        }
      >
        <a href="#apply" className="link-cta">
          Apply in two minutes
        </a>
      </PageHero>

      <Block
        eyebrow="The offer"
        title="Simple and honest"
        intro="No posting quotas, no complicated tiers. Creators we work with closely get custom terms."
      >
        <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {PERKS.map((p, i) => (
            <li key={p.title} className="border-t border-line pt-6">
              <p className="label tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 font-display text-[26px] leading-[1.1] sm:text-[30px]">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="how" eyebrow="The process" title="From application to first payout">
        <Rows numbered items={STEPS} />
      </Block>

      <Block eyebrow="Ideas" title="Posts your audience will love" intro="The best partner content is real: your dog, your home, your genuine reaction.">
        <Rows items={IDEAS} />
      </Block>

      <Block
        eyebrow="Always disclose"
        title="#ad, every time"
        intro="Because you receive a free portrait and earn commission, every post about Pup Prints is an ad. It's the law, and it's our rule."
      >
        <Bullets items={DISCLOSE} />
      </Block>

      <Block
        titleStyle="label"
        title="Creator questions"
        intro={
          <>
            Something else?{" "}
            <a href={`mailto:${site.partnersEmail}`} className={`${textLink} break-all`}>
              {site.partnersEmail}
            </a>
          </>
        }
      >
        <FaqList items={FAQ} />
      </Block>

      <Block
        id="apply"
        eyebrow="Apply"
        title="Let's make something beautiful"
        intro="Tell us about you and your dog. We read every application and reply within about a week."
      >
        <PartnerApplyForm partnersEmail={site.partnersEmail} />
      </Block>
    </>
  );
}
