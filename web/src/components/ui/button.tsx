import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[3px] font-medium tracking-[-0.005em] transition-colors duration-150 select-none disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/85",
  accent: "bg-ink text-paper hover:bg-ink/85",
  secondary: "bg-transparent text-ink ring-1 ring-inset ring-ink/25 hover:ring-ink",
  ghost: "bg-transparent text-ink underline-offset-4 hover:underline",
  light: "bg-paper text-ink hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-[15px]",
  xl: "h-14 px-9 text-base",
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
