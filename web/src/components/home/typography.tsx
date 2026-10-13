import { Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fraunces italic for editorial accent words in headlines. The root layout only loads the
 * upright style; this keeps the italic scoped to the home page (no faux-italic).
 */
const frauncesItalic = Fraunces({
  subsets: ["latin"],
  style: "italic",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

/** An italic serif accent, e.g. <Accent>work of art.</Accent> */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <em className={cn(frauncesItalic.className, "font-[inherit]", className)}>{children}</em>;
}

type Tone = "light" | "dark" | "sage";

const eyebrowTone: Record<Tone, string> = {
  light: "text-clay-dark",
  dark: "text-butter",
  sage: "text-moss",
};

/** Section heading for the home page: eyebrow, big serif title, optional subtitle. */
export function HomeHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: Tone;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("mb-4 text-xs font-semibold uppercase tracking-[0.2em]", eyebrowTone[tone])}>{eyebrow}</p>
      )}
      <h2
        id={id}
        className={cn(
          "font-display text-[2.5rem] leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]",
          tone === "dark" ? "text-paper" : tone === "sage" ? "text-moss" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-[17px] leading-relaxed sm:text-lg",
            tone === "dark" ? "text-paper/70" : tone === "sage" ? "text-moss/80" : "text-ink-2",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
