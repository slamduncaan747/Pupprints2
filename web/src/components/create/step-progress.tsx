"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { Step } from "./store";

const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Photograph" },
  { id: "style", label: "Style" },
  { id: "product", label: "Your piece" },
];

/** Step indicator as a single tracked line: 01 Photograph — 02 Style — 03 Your piece. Current step in ink. */
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
    <nav aria-label="Progress" className="mx-auto w-full max-w-[1440px] px-4 sm:px-10">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const canGo = reachable[s.id] && !active;
          return (
            <Fragment key={s.id}>
              {i > 0 && <li aria-hidden className="h-px w-3 shrink-0 bg-ink-3/70 sm:w-6" />}
              <li>
                <button
                  type="button"
                  disabled={!canGo}
                  onClick={() => onSelect(s.id)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "label inline-flex min-h-11 items-center gap-[0.5em] whitespace-nowrap tracking-[0.14em] transition-colors disabled:cursor-default sm:tracking-[0.18em]",
                    active ? "text-ink" : "text-ink-3",
                    canGo && "cursor-pointer hover:text-ink",
                  )}
                >
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.label}</span>
                  <span className="sr-only">{done ? " (completed)" : active ? " (current step)" : ""}</span>
                </button>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
