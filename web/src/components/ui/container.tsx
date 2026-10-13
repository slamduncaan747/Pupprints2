import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-24 sm:py-32", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3", className)}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-4xl sm:text-[56px]">{title}</h2>
      {subtitle && <p className="mt-5 text-[17px] leading-relaxed text-ink-2">{subtitle}</p>}
    </div>
  );
}
