import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Eye, HeartHandshake, Mail, MessageCircle, Package, Sparkles } from "lucide-react";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { site } from "@/lib/config";
import { cn } from "@/lib/utils";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { FramedArt } from "@/components/marketing/framed-art";
import { GiftRevealMock } from "@/components/marketing/gift-reveal-mock";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { PromiseRow } from "@/components/marketing/promise-row";
import { StyleCard } from "@/components/marketing/style-card";
import { OCCASIONS, getOccasion, type Occasion } from "@/components/marketing/gift-occasions";
import { stylesFor } from "@/components/marketing/style-content";
import {
  CHRISTMAS_2026,
  CHRISTMAS_CA_CUTOFF,
  CHRISTMAS_US_CUTOFF_FULL,
  PHYSICAL_SHIP_WINDOW,
  formatDay,
} from "@/components/marketing/commerce";

export const dynamicParams = false;

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ occasion: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gifts/[occasion]">): Promise<Metadata> {
  const { occasion } = await params;
  const o = getOccasion(occasion);
  if (!o) return {};
  return {
    title: o.title,
    description: o.metaDescription,
    alternates: { canonical: `/gifts/${o.slug}` },
    openGraph: {
      title: `${o.title} | ${site.name}`,
      description: o.metaDescription,
      url: `/gifts/${o.slug}`,
      type: "website",
      siteName: site.name,
      locale: "en_US",
      // The featured style sample first; the site-wide card is the fallback while samples are still being generated.
      images: [
        { url: STYLE_SAMPLES[o.feature], width: 960, height: 1200, alt: `${STYLE_MAP[o.feature]?.name} dog portrait` },
        DEFAULT_OG_IMAGE,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${o.title} | ${site.name}`,
      description: o.metaDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

const HERO_TONE: Record<Occasion["tone"], "blush" | "sage" | "butter" | "paper-2"> = {
  clay: "paper-2",
  sage: "sage",
  butter: "butter",
  blush: "blush",
};

export default async function OccasionPage({ params }: PageProps<"/gifts/[occasion]">) {
  const { occasion } = await params;
  const o = getOccasion(occasion);
  if (!o) notFound();

  const memorial = o.slug === "memorial";
  const christmas = o.slug === "christmas";
  const feature = STYLE_MAP[o.feature];
  const styles = [...(feature ? [feature] : []), ...stylesFor(o.goodFor, 4, o.feature)].slice(0, 4);

  return (
    <>
      <JsonLd data={faqJsonLd(o.faq)} />

      <PageHero
        tone={HERO_TONE[o.tone]}
        breadcrumbs={<Breadcrumbs items={[{ href: "/gifts", label: "Gifts" }, { href: `/gifts/${o.slug}`, label: o.name }]} />}
        eyebrow={o.eyebrow}
        title={o.h1}
        lede={<p>{o.lede}</p>}
        actions={
          <>
            <ButtonLink href="/create" variant={memorial ? "primary" : "accent"} size="lg">
              {o.cta.button} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#styles" variant="secondary" size="lg">
              {memorial ? "Gentle styles" : "Suggested styles"}
            </ButtonLink>
          </>
        }
        note={memorial ? "Free preview. No pressure, no obligation." : "Free preview · Instant Gift Reveal · Free US shipping"}
        aside={
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className={cn("rounded-[2rem] px-[13%] py-[11%]", memorial ? "bg-paper/70" : "bg-paper/70")}>
              <FramedArt style={o.feature} finish={memorial ? "oak" : "black"} priority sizes="(max-width: 1024px) 75vw, 32vw" />
            </div>
          </div>
        }
      />

      {o.timing && (
        <section className="border-b border-line bg-paper py-12 sm:py-16">
          <Container>
            {christmas ? (
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
                <div>
                  <Eyebrow className="mb-3 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" /> {o.timing.title}
                  </Eyebrow>
                  <p className="text-lg leading-relaxed text-ink-2">{o.timing.body}</p>
                  <Link href="/shipping#holidays" className="mt-4 inline-flex items-center gap-1.5 font-medium text-clay-dark underline-offset-4 hover:underline">
                    All shipping dates <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <dl className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "US · physical pieces", value: CHRISTMAS_US_CUTOFF_FULL, sub: "Standard delivery" },
                    { label: "Canada · physical", value: CHRISTMAS_CA_CUTOFF, sub: "Allow extra transit time" },
                    { label: "Gift Reveal", value: `Until ${formatDay(CHRISTMAS_2026.revealUntil, { long: true })}`, sub: "Sent instantly, any time" },
                  ].map((d) => (
                    <div key={d.label} className="rounded-card bg-paper-2 p-5 ring-1 ring-line">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">{d.label}</dt>
                      <dd className="mt-2 font-display text-2xl leading-tight">{d.value}</dd>
                      <dd className="mt-1 text-sm text-ink-2">{d.sub}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="flex flex-col gap-4 rounded-card bg-paper-2 p-6 ring-1 ring-line sm:flex-row sm:items-start sm:gap-6 sm:p-8">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-line">
                  <CalendarDays className="h-5 w-5 text-clay" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-2xl">{o.timing.title}</h2>
                  <p className="mt-2 max-w-3xl leading-relaxed text-ink-2">{o.timing.body}</p>
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      <Section className={memorial ? "bg-paper" : undefined}>
        <Container>
          <SectionHeading
            eyebrow={memorial ? "Gently does it" : "Gift ideas"}
            title={memorial ? "Some things that may help" : `${o.name} ideas`}
          />
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {o.ideas.map((idea) => (
              <li
                key={idea.title}
                className={cn("rounded-card p-7 ring-1 sm:p-8", memorial ? "bg-sage-soft/60 ring-sage/30" : "bg-paper-2 ring-line")}
              >
                <h3 className="font-display text-2xl leading-tight">{idea.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{idea.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="styles" className={cn("scroll-mt-20", memorial ? "bg-sage-soft/50" : "bg-paper-2")}>
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow={memorial ? "Styles" : "Suggested styles"}
              title={memorial ? "Soft, timeless styles" : `Styles we love for ${o.forLabel}`}
              subtitle={memorial ? "Try any of them with your photo. You'll see it before you decide anything." : undefined}
            />
            <ButtonLink href="/styles" variant="secondary" className="self-start sm:self-auto">
              All styles
            </ButtonLink>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {styles.map((s) => (
              <li key={s.slug}>
                <StyleCard style={s} showTags={false} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {memorial ? (
        <Section>
          <Container>
            <PromiseRow
              items={[
                { icon: Eye, title: "See it first", body: "You'll see the portrait free before you decide anything" },
                { icon: Sparkles, title: "Older photos welcome", body: "Old, blurry or low-resolution photos usually work" },
                { icon: Package, title: "Memorial orders first", body: "Tell us it's a memorial piece and we'll move it to the front of our queue" },
                { icon: MessageCircle, title: "Real help", body: "Not sure which photo to use? Write to us and we'll help you choose" },
              ]}
            />
          </Container>
        </Section>
      ) : (
        <Section>
          <Container className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <div>
              <Eyebrow className="mb-4">Gift Reveal</Eyebrow>
              <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">The moment they see it, without waiting for the mail</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
                Order a portrait as a gift and you get a beautiful digital reveal right away. Send it by text or email, or show it
                in person. The print follows in {PHYSICAL_SHIP_WINDOW}.
              </p>
              <ul className="mt-8 space-y-3 text-[15px] text-ink-2">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-clay" aria-hidden="true" /> Send it instantly, even on the day
                </li>
                <li className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-clay" aria-hidden="true" /> Ship the print straight to them, or to you
                </li>
                <li className="flex items-center gap-3">
                  <HeartHandshake className="h-4 w-4 text-clay" aria-hidden="true" /> Covered by our love-it guarantee
                </li>
              </ul>
            </div>
            <div className="rounded-[2rem] bg-paper-2 px-6 py-12 sm:px-12">
              <GiftRevealMock style={o.feature} />
            </div>
          </Container>
        </Section>
      )}

      <Section className={memorial ? "bg-sage-soft/40" : "bg-paper-2"}>
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Questions</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">{memorial ? "If you're wondering" : "Good to know"}</h2>
            <p className="mt-5 text-lg text-ink-2">
              {memorial ? "Or simply " : "More in our "}
              <Link
                href={memorial ? "/contact" : "/faq"}
                className="text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay"
              >
                {memorial ? "write to us" : "FAQ"}
              </Link>
              .
            </p>
          </div>
          <FaqList items={o.faq} tone={memorial ? "sage" : "paper"} />
        </Container>
      </Section>

      <CtaBand
        tone={memorial ? "moss" : "ink"}
        eyebrow={memorial ? "Free preview" : "Free preview, instant Gift Reveal"}
        title={o.cta.title}
        body={o.cta.body}
        cta={o.cta.button}
        promises={memorial ? ["See it before you decide", "Love it or we'll remake or refund it"] : undefined}
      />
    </>
  );
}
