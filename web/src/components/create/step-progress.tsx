"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { Step } from "./store";

const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Photo" },
  { id: "style", label: "Style" },
  { id: "product", label: "Piece" },
];

/** Thin text step indicator: 1 Photo — 2 Style — 3 Piece, with the current step underlined. */
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
    <nav aria-label="Progress" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <ol className="flex items-center justify-center gap-2 text-[13px] sm:gap-3">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const canGo = reachable[s.id] && !active;
          return (
            <Fragment key={s.id}>
              {i > 0 && <li aria-hidden className="h-px w-5 bg-line sm:w-8" />}
              <li>
                <button
                  type="button"
                  disabled={!canGo}
                  onClick={() => onSelect(s.id)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1.5 px-1 transition-colors disabled:cursor-default",
                    active ? "text-ink" : done ? "text-ink-2 hover:text-ink" : "text-ink-3",
                    canGo && "cursor-pointer",
                  )}
                >
                  <span className="tabular-nums">{i + 1}</span>
                  <span className={cn(active && "underline decoration-1 underline-offset-[6px]")}>{s.label}</span>
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
