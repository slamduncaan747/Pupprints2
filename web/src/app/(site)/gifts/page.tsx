import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, Mail, Package, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { GiftRevealMock } from "@/components/marketing/gift-reveal-mock";
import { FramedArt } from "@/components/marketing/framed-art";
import { PromiseRow } from "@/components/marketing/promise-row";
import { EVERYTHING_CARD, OCCASIONS } from "@/components/marketing/gift-occasions";
import { CHRISTMAS_US_CUTOFF, PRICE_BANDS, itemLabel, itemsInBand } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Gifts for Dog Lovers — Custom Dog Portrait Gift Guide",
  description:
    "The gift guide for dog people: custom portraits of their dog for birthdays, Christmas, Mother's Day, memorials and new puppies. Preview free, send a Gift Reveal instantly, free US shipping.",
  alternates: { canonical: "/gifts" },
};

const REVEAL_STEPS = [
  { icon: Sparkles, title: "Make it from any photo", body: "Grab a photo of their dog from your phone or their social media and see the portrait free." },
  { icon: Mail, title: "Reveal it instantly", body: "The moment you order, you get a beautiful digital reveal to send by text or email, or show in person." },
  { icon: Package, title: "The real thing follows", body: "We print, check and ship the piece. Send it to them directly, or to you to wrap." },
];

export default function GiftsPage() {
  const cards = [
    ...OCCASIONS.map((o) => ({ href: `/gifts/${o.slug}`, name: o.name, icon: o.icon, card: o.card })),
    EVERYTHING_CARD,
    { href: "/gift-cards", name: "Gift cards", icon: CreditCard, card: "Let them choose the photo and style. Coming soon." },
  ];

  return (
    <>
      <PageHero
        tone="paper"
        eyebrow="The gift guide"
        title="A portrait of their dog. The gift they keep."
        lede={
          <p>
            Make it from a photo you already have, see it free before you buy, and send a Gift Reveal the moment you
            order. The print follows, with free US shipping.
          </p>
        }
        actions={
          <>
            <ButtonLink href="/create" variant="accent" size="lg">
              Start a gift portrait <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#occasions" variant="secondary" size="lg">
              Ideas by occasion
            </ButtonLink>
          </>
        }
        note={<>Christmas: order physical pieces by {CHRISTMAS_US_CUTOFF} for standard US delivery. Gift Reveal any time.</>}
        aside={
          <div className="relative mx-auto max-w-[480px] px-6 sm:px-0">
            <div className="absolute -left-2 top-10 w-[42%] -rotate-3 sm:left-0">
              <FramedArt style="holiday" finish="oak" priority sizes="(max-width: 1024px) 40vw, 16vw" />
            </div>
            <GiftRevealMock style="royal" className="ml-auto mr-0 w-[66%] max-w-[300px]" />
          </div>
        }
      />

      <Section id="occasions" className="scroll-mt-20 bg-paper-2">
        <Container>
          <SectionHeading eyebrow="Ideas by occasion" title="Who's it for?" />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ href, name, icon: Icon, card }) => (
              <li key={href + name}>
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-card bg-paper p-6 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-soft sm:p-7"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-clay-soft">
                    <Icon className="h-5 w-5 text-clay-dark" aria-hidden="true" />
                  </span>
                  <span className="mt-6 font-display text-2xl leading-tight">{name}</span>
                  <span className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-2">{card}</span>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark">
                    See ideas <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow className="mb-4">Gift Reveal</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">Give it today. Hang it in days.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              The best part of a gift is the moment they see it. With a Gift Reveal, that moment doesn&apos;t have to wait
              for the mail.
            </p>
            <ol className="mt-10 space-y-8">
              {REVEAL_STEPS.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="grid grid-cols-[3rem_1fr] gap-5">
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 ring-1 ring-line">
                    <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <h3 className="font-display text-2xl">{title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-2">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[2rem] bg-blush/50 px-6 py-12 sm:px-12">
            <GiftRevealMock style="watercolor" />
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2">
        <Container>
          <SectionHeading
            eyebrow="By budget"
            title="Gifts at every price"
            subtitle="Real prices, including free US shipping. Every physical piece comes with the hi-res digital file."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRICE_BANDS.map((band) => {
              const items = itemsInBand(band.min, band.max);
              if (items.length === 0) return null;
              return (
                <div key={band.title} className="flex flex-col rounded-card bg-paper p-6 ring-1 ring-line sm:p-7">
                  <h3 className="font-display text-3xl">{band.title}</h3>
                  <p className="mt-1 text-sm text-ink-3">{band.note}</p>
                  <ul className="mt-6 divide-y divide-line border-t border-line">
                    {items.map((item) => (
                      <li key={item.variant.id}>
                        <Link
                          href={`/shop/${item.product.type}`}
                          className="flex items-baseline justify-between gap-4 py-3 text-[15px] hover:text-clay-dark"
                        >
                          <span>{itemLabel(item)}</span>
                          <span className="shrink-0 font-medium">{formatPrice(item.variant.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-8 rounded-[2rem] bg-butter-soft p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow className="mb-3 text-[#7a5a12]">Coming soon</Eyebrow>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">Not sure which photo or style?</h2>
              <p className="mt-3 max-w-xl text-ink-2">
                Digital gift cards are on the way, so they can choose the photo and style themselves. Join the list and
                we&apos;ll tell you when they&apos;re ready.
              </p>
            </div>
            <ButtonLink href="/gift-cards" variant="primary" size="lg" className="self-start lg:self-auto">
              About gift cards <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section className="bg-paper-2 py-16 sm:py-20">
        <Container>
          <PromiseRow />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Free preview, instant Gift Reveal"
        title="Make a gift they'll never see coming"
        body="Upload a photo of their dog and see the portrait free in about a minute. Only pay if you love it."
        cta="Start a gift portrait"
      />
    </>
  );
}
