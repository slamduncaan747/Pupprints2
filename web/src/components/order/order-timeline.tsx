import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineStep } from "./timeline";

/** Vertical progress timeline (server-safe, no client JS). */
export function OrderTimeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[15px] top-8 bottom-0 w-px",
                  step.state === "done" ? "bg-moss/40" : "bg-line",
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                step.state === "done" && "bg-moss text-paper",
                step.state === "current" && "bg-clay text-white ring-4 ring-clay-soft",
                step.state === "upcoming" && "bg-paper-2 text-ink-3 ring-1 ring-line",
              )}
            >
              {step.state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
            </span>
            <div className="pt-1">
              <p className={cn("font-medium leading-snug", step.state === "upcoming" ? "text-ink-2" : "text-ink")}>
                {step.label}
                <span className="sr-only">
                  {step.state === "done" ? " (done)" : step.state === "current" ? " (in progress)" : " (upcoming)"}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-ink-3">{step.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
