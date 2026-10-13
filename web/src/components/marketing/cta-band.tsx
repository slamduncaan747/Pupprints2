import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/container";
import { PROMISES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Tone = "ink" | "moss" | "clay";

const TONES: Record<Tone, { box: string; eyebrow: string; text: string; check: string }> = {
  ink: { box: "bg-ink text-paper", eyebrow: "text-butter", text: "text-paper/75", check: "text-butter" },
  moss: { box: "bg-moss text-paper", eyebrow: "text-sage-soft", text: "text-paper/80", check: "text-sage-soft" },
  clay: { box: "bg-clay-soft text-ink", eyebrow: "text-clay-dark", text: "text-ink-2", check: "text-clay-dark" },
};

/** Closing call to action used at the bottom of every marketing page. Always points at the free preview. */
export function CtaBand({
  eyebrow = "Free preview, no card needed",
  title = "See your dog as a work of art",
  body = "Upload a favorite photo and see your portrait in about a minute. Try every style, then only pay if you love it.",
  href = "/create",
  cta = "Create your free preview",
  tone = "ink",
  promises = [PROMISES.guarantee, PROMISES.shipping],
  children,
  className,
}: {
  eyebrow?: string;
  title?: ReactNode;
  body?: ReactNode;
  href?: string;
  cta?: string;
  tone?: Tone;
  promises?: string[];
  children?: ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <section className={cn("px-4 py-16 sm:px-8 sm:py-24", className)}>
      <div
        className={cn(
          "grain relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20",
          t.box,
        )}
      >
        <Eyebrow className={cn("mb-5", t.eyebrow)}>{eyebrow}</Eyebrow>
        <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl">{title}</h2>
        <p className={cn("mx-auto mt-5 max-w-xl text-lg leading-relaxed", t.text)}>{body}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={href} variant={tone === "clay" ? "primary" : tone === "moss" ? "light" : "accent"} size="lg">
            {cta} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          {children}
        </div>
        {promises.length > 0 && (
          <ul className={cn("mt-8 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm sm:flex-row", t.text)}>
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className={cn("h-4 w-4", t.check)} aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
