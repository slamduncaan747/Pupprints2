"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step } from "./store";

const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Photo" },
  { id: "style", label: "Style" },
  { id: "product", label: "Your piece" },
];

export function StepProgress({
  current,
  reachable,
  onSelect,
}: {
  current: Step;
  reachable: Record<Step, boolean>;
  onSelect: (step: Step) => void;
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Progress" className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-8 sm:pt-5">
      <ol className="grid grid-cols-3 gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const canGo = reachable[s.id] && !active;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!canGo}
                onClick={() => onSelect(s.id)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex min-h-11 w-full flex-col justify-center gap-2 rounded-md text-left disabled:cursor-default",
                  canGo && "cursor-pointer",
                )}
              >
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-line">
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full bg-clay transition-[width] duration-500 ease-out",
                      done || active ? "w-full" : "w-0",
                      active && "bg-ink",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-[12px] font-semibold tracking-wide uppercase sm:text-[12.5px]",
                    active ? "text-ink" : done ? "text-ink-2 group-hover:text-ink" : "text-ink-3",
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-clay" aria-hidden />
                  ) : (
                    <span className="tabular-nums">{i + 1}</span>
                  )}
                  {s.label}
                  <span className="sr-only">{done ? " (completed)" : active ? " (current step)" : ""}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
