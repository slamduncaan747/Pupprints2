import { ArrowRight, Check, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PawMark } from "@/components/ui/paw";
import { cn } from "@/lib/utils";
import { Accent, HomeHeading } from "./typography";

const ROWS = [
  {
    topic: "Seeing your portrait",
    us: "See it free, before you pay",
    them: "Pay first, then wait 1–3 days for a proof",
  },
  {
    topic: "Pricing",
    us: "One honest price. No fake sales, no pre-checked add-ons",
    them: "“Limited-time” sales that never end, plus surprise add-ons",
  },
  {
    topic: "Hi-res digital file",
    us: "Included free with every print",
    them: "Sold as a $10+ add-on",
  },
  {
    topic: "If it’s not right",
    us: "Love-it guarantee: free remake or full refund",
    them: "Custom work is often final sale",
  },
  {
    topic: "Gifting",
    us: "An instant Gift Reveal they can open today",
    them: "The gift shows up late, sometimes after the day",
  },
  {
    topic: "Quality",
    us: "Curated styles, every portrait checked by a person",
    them: "Thousands of templates, results vary",
  },
];

export function Comparison() {
  return (
    <Section aria-labelledby="why-title" className="grain relative overflow-hidden bg-ink text-paper">
      <Container className="relative">
        <HomeHeading
          id="why-title"
          tone="dark"
          align="center"
          eyebrow="Why Pup Prints"
          title={
            <>
              All of the art. <Accent className="text-butter">None of the catch.</Accent>
            </>
          }
          subtitle="Typical portrait shops make you pay first, wait for a proof and hope for the best. We thought that was backwards."
          className="ph-reveal"
        />

        <div className="mx-auto mt-12 max-w-5xl sm:mt-16 ph-reveal">
          {/* Column headers (desktop) */}
          <div className="hidden grid-cols-[1fr_1.25fr_1.25fr] gap-6 px-6 pb-4 md:grid">
            <span />
            <span className="flex items-center gap-2 font-display text-xl text-paper">
              <PawMark className="h-6 w-6 text-clay" /> Pup Prints
            </span>
            <span className="text-[15px] text-paper/60">Typical portrait shops</span>
          </div>

          <ul className="overflow-hidden rounded-card ring-1 ring-white/10">
            {ROWS.map((row, i) => (
              <li
                key={row.topic}
                className={cn(
                  "grid gap-3 px-5 py-6 sm:px-6 md:grid-cols-[1fr_1.25fr_1.25fr] md:items-center md:gap-6 md:py-5",
                  i > 0 && "border-t border-white/10",
                  i % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/50 md:text-[13px] md:normal-case md:tracking-normal md:text-paper/60">
                  {row.topic}
                </p>
                <p className="flex items-start gap-3 text-[16px] leading-snug text-paper">
                  <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-clay text-white">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="sr-only">Pup Prints: </span>
                    {row.us}
                  </span>
                </p>
                <p className="flex items-start gap-3 text-[15px] leading-snug text-paper/55">
                  <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full ring-1 ring-white/25">
                    <X className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="sr-only">Typical portrait shops: </span>
                    {row.them}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center ph-reveal">
          <ButtonLink href="/create" variant="light" size="lg" className="group w-full sm:w-auto">
            See yours before you pay
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </ButtonLink>
          <p className="text-sm text-paper/55">No card, no catch. Just your dog, looking magnificent.</p>
        </div>
      </Container>
    </Section>
  );
}
