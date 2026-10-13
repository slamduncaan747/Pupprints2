import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type Tone = "paper" | "paper-2" | "sage" | "blush" | "butter";

const TONES: Record<Tone, string> = {
  paper: "bg-paper",
  "paper-2": "bg-paper-2",
  sage: "bg-sage-soft",
  blush: "bg-blush/50",
  butter: "bg-butter-soft",
};

/** Standard top-of-page hero for secondary pages: eyebrow, big serif headline, lede, actions, optional visual. */
export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  note,
  aside,
  breadcrumbs,
  tone = "paper",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  aside?: ReactNode;
  breadcrumbs?: ReactNode;
  tone?: Tone;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center" && !aside;
  return (
    <section className={cn("relative overflow-hidden", TONES[tone], className)}>
      <Container
        className={cn(
          "grid items-center gap-12 pb-16 pt-8 sm:pb-20 sm:pt-10 lg:gap-16 lg:pb-24",
          aside && "lg:grid-cols-[1.05fr_0.95fr]",
        )}
      >
        <div className={cn(centered && "mx-auto max-w-3xl text-center")}>
          {breadcrumbs && <div className="mb-8 sm:mb-10">{breadcrumbs}</div>}
          {!breadcrumbs && <div className="h-4 sm:h-8 lg:h-10" />}
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">{title}</h1>
          {lede && (
            <div
              className={cn(
                "mt-6 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl sm:leading-relaxed",
                centered && "mx-auto",
              )}
            >
              {lede}
            </div>
          )}
          {actions && (
            <div className={cn("mt-9 flex flex-wrap items-center gap-3", centered && "justify-center")}>{actions}</div>
          )}
          {note && <div className={cn("mt-5 text-sm text-ink-3", centered && "mx-auto")}>{note}</div>}
        </div>
        {aside && <div className="relative">{aside}</div>}
      </Container>
    </section>
  );
}
