import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-3 rounded-none font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 select-none disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/80",
  accent: "bg-ink text-paper hover:bg-ink/80",
  secondary: "bg-transparent text-ink ring-1 ring-inset ring-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink underline decoration-1 underline-offset-[6px] hover:opacity-60",
  light: "bg-paper text-ink hover:bg-paper/85",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-6",
  md: "h-12 px-8",
  lg: "h-14 px-10",
  xl: "h-14 px-12",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
