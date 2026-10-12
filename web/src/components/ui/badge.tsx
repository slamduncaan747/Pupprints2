import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "clay" | "butter" | "sage" | "ink" | "paper";

const tones: Record<Tone, string> = {
  clay: "bg-clay-soft text-clay-dark",
  butter: "bg-butter-soft text-[#7a5a12]",
  sage: "bg-sage-soft text-moss",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink ring-1 ring-line",
};

export function Badge({ tone = "clay", className, ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
