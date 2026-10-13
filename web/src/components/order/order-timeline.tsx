import { cn } from "@/lib/utils";
import type { TimelineStep } from "./timeline";

/** Order progress as hairline rows: tracked label left, quiet detail right (server-safe, no client JS). */
export function OrderTimeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("border-t border-line", className)}>
      {steps.map((step, i) => (
        <li key={step.key} className="flex items-baseline gap-4 border-b border-line py-4">
          <span
            aria-hidden="true"
            className={cn(
              "label w-6 shrink-0 tabular-nums",
              step.state === "upcoming" ? "text-ink-3" : "text-ink",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p
            className={cn(
              "label min-w-0 flex-1",
              step.state === "current" && "text-ink underline decoration-ink underline-offset-[6px]",
              step.state === "done" && "text-ink",
              step.state === "upcoming" && "text-ink-3",
            )}
          >
            {step.label}
            <span className="sr-only">
              {step.state === "done" ? " (done)" : step.state === "current" ? " (in progress)" : " (upcoming)"}
            </span>
          </p>
          <p className="max-w-[48%] text-right text-[12.5px] leading-snug text-ink-3">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
