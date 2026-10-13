import Link from "next/link";
import { ArrowRight, CalendarHeart, Gift, Send } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PawMark } from "@/components/ui/paw";
import { SampleImage } from "@/components/ui/sample-image";
import { PRODUCT_MAP, STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER, STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { Accent, HomeHeading } from "./typography";

const POINTS = [
  { icon: Send, text: "Send it by text or email the moment you order, or save the link for the big day." },
  { icon: CalendarHeart, text: "Birthdays, holidays, and the gifts you remembered at 11pm." },
  { icon: Gift, text: "Included with every order. The framed piece follows to their door." },
];

const CONFETTI = [
  { cls: "left-[2%] top-[30%] h-2 w-2 rounded-full bg-butter", delay: "0ms" },
  { cls: "left-[8%] top-[8%] h-1.5 w-3 rotate-12 bg-clay", delay: "60ms" },
  { cls: "right-[4%] top-[18%] h-2 w-2 rounded-full bg-sage", delay: "120ms" },
  { cls: "right-[10%] top-[2%] h-1.5 w-3 -rotate-12 bg-butter", delay: "30ms" },
  { cls: "left-[0%] top-[62%] h-1.5 w-1.5 rounded-full bg-clay", delay: "90ms" },
  { cls: "right-[0%] top-[55%] h-2.5 w-1.5 rotate-45 bg-clay", delay: "150ms" },
];

function Phone() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];
  const [a, b] = PRODUCT_MAP.framed.shipDays;

  return (
    <div className="relative mx-auto w-[258px] sm:w-[284px]" aria-hidden="true">
      <div className="rounded-[2.9rem] bg-[#141210] p-[9px] shadow-[0_2px_0_1px_rgb(255_255_255/0.06)_inset,0_40px_80px_-30px_rgb(27_24_20/0.55),0_18px_36px_-18px_rgb(27_24_20/0.35)] ring-1 ring-black/60">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2.35rem] bg-[linear-gradient(180deg,#fbf7f1_0%,#f7ebe2_60%,#f2dccf_100%)]">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-2.5 z-20 h-[24px] w-[86px] -translate-x-1/2 rounded-full bg-[#141210]" />

          {/* Header */}
          <div className="px-6 pt-14 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-clay-dark">
              <PawMark className="h-3.5 w-3.5" /> A gift for you
            </div>
            <p className="mt-2 font-display text-[22px] leading-tight text-ink">Happy birthday, Alex!</p>
            <p className="mt-1 text-[11.5px] text-ink-2/85">With love from Sam</p>
          </div>

          {/* Envelope */}
          <div className="absolute inset-x-0 bottom-[21%] flex justify-center">
            <div className="relative h-[112px] w-[74%] ph-envelope">
              {/* Back */}
              <div className="absolute inset-0 rounded-[3px] bg-[#9a3c29]" />
              {/* Card that rises (clipped at the envelope's bottom edge) */}
              <div className="absolute inset-x-[7%] bottom-0 top-[-260px] overflow-hidden">
                <div className="absolute inset-x-0 top-[268px] bg-white p-[7px] shadow-soft ph-card">
                  <SampleImage src={STYLE_SAMPLES[pair.style]} alt="" swatch={style.swatch} sizes="180px" />
                </div>
              </div>
              {/* Confetti */}
              <div className="pointer-events-none absolute inset-x-[-12%] top-[-150px] z-[5] h-[150px]">
                {CONFETTI.map((c, i) => (
                  <span key={i} className={cn("absolute", c.cls, "ph-confetti")} style={{ animationDelay: c.delay }} />
                ))}
              </div>
              {/* Front pocket with folds */}
              <div className="absolute inset-0 overflow-hidden rounded-[3px] ph-pocket">
                <div className="absolute inset-0 bg-[#c8553d]" />
                <div className="absolute inset-0 bg-[#b94c35] [clip-path:polygon(0_0,52%_56%,0_100%)]" />
                <div className="absolute inset-0 bg-[#b94c35] [clip-path:polygon(100%_0,48%_56%,100%_100%)]" />
                <div className="absolute inset-0 bg-[#d2644b] [clip-path:polygon(0_100%,50%_46%,100%_100%)]" />
              </div>
              {/* Flap */}
              <div
                className="absolute inset-x-0 top-0 h-[62%] bg-[#ad4731] [backface-visibility:visible] [clip-path:polygon(0_0,100%_0,50%_100%)] ph-flap"
              />
              {/* Wax seal (fades as the flap opens) */}
              <div className="ph-seal absolute left-1/2 top-[44%] z-[5] grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#e9c88a,#b8913f)] text-[#6e521f] shadow-[0_2px_4px_rgb(0_0_0/0.25)]">
                <PawMark className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-[14%] text-center ph-caption">
            <p className="font-display text-[15px] text-ink">
              Biscuit, as {style.name}
            </p>
          </div>

          {/* Footer bar */}
          <div className="absolute inset-x-4 bottom-5 rounded-full bg-ink py-2.5 text-center text-[11.5px] font-medium text-paper">
            Framed print arriving in {a}–{b} days
          </div>
        </div>
      </div>
    </div>
  );
}

export function GiftReveal() {
  return (
    <Section
      aria-labelledby="gift-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-paper-2),#f5e3d8)]"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="relative order-2 lg:order-1 ph-reveal">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[118%] w-[118%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.85),rgb(255_255_255/0))]"
          />
          <Phone />
        </div>

        <div className="order-1 lg:order-2 ph-reveal">
          <HomeHeading
            id="gift-title"
            eyebrow="Instant Gift Reveal"
            title={
              <>
                Give it today, <Accent>even if it ships tomorrow.</Accent>
              </>
            }
            subtitle="The moment you order, you get a beautiful reveal to share. They open it, watch their portrait unwrap, and the real thing follows to their door."
          />
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4 text-[16px] leading-relaxed text-ink-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-clay-dark shadow-soft">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href="/create?gift=1" size="lg" className="group w-full sm:w-auto">
              Create a gift portrait
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
            <Link
              href="/gifts"
              className="inline-flex items-center justify-center gap-1.5 text-[15px] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] transition hover:decoration-ink"
            >
              Browse gift ideas
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
