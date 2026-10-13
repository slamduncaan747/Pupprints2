import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, Gift, Mail, Package, Sparkles } from "lucide-react";
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
    ...OCCASIONS.map((o) => ({ href: `/gifts/${o.slug}`, name: o.name, icon: o.icon, card: o.card, cta: "See ideas" })),
    EVERYTHING_CARD,
    { href: "/gift-cards", name: "Gift cards", icon: CreditCard, card: "Let them choose the photo and style. Coming soon.", cta: "Learn more" },
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
          <div className="relative mx-auto max-w-[480px] rounded-[2rem] bg-blush/40 px-8 pb-14 pt-12 sm:px-12" aria-hidden="true">
            <div className="grid grid-cols-[1fr_0.8fr] items-end gap-6">
              <FramedArt style="holiday" finish="oak" priority sizes="(max-width: 1024px) 45vw, 18vw" />
              <FramedArt style="royal" finish="black" sizes="(max-width: 1024px) 35vw, 14vw" className="mb-6" />
            </div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 rotate-[-4deg] items-center gap-2 rounded-lg bg-paper px-4 py-2.5 shadow-soft ring-1 ring-line">
              <Gift className="h-4 w-4 text-clay" />
              <span className="font-display text-[15px]">For you, love from the dog</span>
            </div>
          </div>
        }
      />

      <Section id="occasions" className="scroll-mt-20 bg-paper-2">
        <Container>
          <SectionHeading eyebrow="Ideas by occasion" title="Who's it for?" />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
            {cards.map(({ href, name, icon: Icon, card, cta }) => (
              <li key={href + name}>
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-2xl bg-paper p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-soft sm:rounded-card sm:p-7"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-clay-soft sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5 text-clay-dark" aria-hidden="true" />
                  </span>
                  <span className="mt-4 font-display text-xl leading-tight sm:mt-6 sm:text-2xl">{name}</span>
                  <span className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-2 sm:mt-2 sm:text-[15px]">{card}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-clay-dark sm:mt-6 sm:text-[15px]">
                    {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
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
          <div className="mt-14 grid gap-5 md:grid-cols-3">
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
