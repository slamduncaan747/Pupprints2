import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, Lock, Palette } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PawMark } from "@/components/ui/paw";
import { cn } from "@/lib/utils";
import { Accent } from "./typography";
import styles from "./home.module.css";

const PROMISE_ITEMS = [
  {
    icon: HeartHandshake,
    title: "Remake or full refund",
    body: "Not quite right? We'll remake it free or refund you in full. Your call.",
  },
  {
    icon: BadgeCheck,
    title: "Checked by a person",
    body: "Every portrait is reviewed by our team before it goes to print.",
  },
  {
    icon: Palette,
    title: "Archival quality",
    body: "Acid-free matte paper and fade-resistant pigment inks, made to last.",
  },
  {
    icon: Lock,
    title: "Secure, honest checkout",
    body: "Encrypted payments. No pre-checked add-ons, no surprise fees.",
  },
];

function Seal() {
  return (
    <div className="relative h-36 w-36 shrink-0 sm:h-44 sm:w-44" aria-hidden="true">
      <svg viewBox="0 0 200 200" className={cn("absolute inset-0 h-full w-full text-ink", styles.spin)}>
        <defs>
          <path id="seal-ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-current font-sans" style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "0.2em" }}>
          <textPath href="#seal-ring" textLength="500" lengthAdjust="spacing">
            LOVE-IT GUARANTEE · REMAKE OR REFUND ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[24%] grid place-items-center rounded-full bg-clay text-white shadow-[0_8px_24px_-8px_rgb(200_85_61/0.7)]">
        <PawMark className="h-1/2 w-1/2" />
      </div>
    </div>
  );
}

export function Guarantee() {
  return (
    <Section aria-labelledby="guarantee-title" className="bg-paper">
      <Container>
        <div
          className={cn(
            "grid gap-12 rounded-[1.75rem] bg-butter-soft/70 p-7 ring-1 ring-[#efdfb4] sm:p-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:p-16",
            styles.reveal,
          )}
        >
          <div className="flex flex-col items-start">
            <Seal />
            <h2
              id="guarantee-title"
              className="mt-8 font-display text-[2.5rem] leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]"
            >
              Love it, <Accent className="text-clay-dark">or it&apos;s on us.</Accent>
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-2 sm:text-lg">
              You see your portrait before you pay, so surprises are rare. If yours still isn&apos;t right when it
              arrives, we&apos;ll make it right.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <ButtonLink href="/create" size="lg" className="group w-full sm:w-auto">
                Create yours, risk-free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
              <Link
                href="/guarantee"
                className="inline-flex items-center justify-center text-[15px] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] transition hover:decoration-ink"
              >
                Read the guarantee
              </Link>
            </div>
          </div>

          <ul className="grid content-center gap-x-8 gap-y-8 sm:grid-cols-2">
            {PROMISE_ITEMS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="border-t border-ink/10 pt-6">
                <Icon className="h-6 w-6 text-clay-dark" strokeWidth={1.6} aria-hidden="true" />
                <p className="mt-4 font-display text-xl leading-snug">{title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
