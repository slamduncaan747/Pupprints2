import { cn } from "@/lib/utils";
import type { TimelineStep } from "./timeline";

/** Order progress as quiet text rows (server-safe, no client JS). */
export function OrderTimeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("border-t border-line", className)}>
      {steps.map((step) => (
        <li key={step.key} className="flex items-baseline gap-3 border-b border-line py-3.5">
          <span
            aria-hidden="true"
            className={cn(
              "relative top-[-1px] h-1.5 w-1.5 shrink-0 rounded-full",
              step.state === "done" && "bg-ink-2",
              step.state === "current" && "bg-ink outline-1 outline-offset-2 outline-ink",
              step.state === "upcoming" && "border border-ink/25",
            )}
          />
          <p
            className={cn(
              "min-w-0 flex-1 text-[15px] leading-snug",
              step.state === "current" ? "text-ink" : step.state === "done" ? "text-ink-2" : "text-ink-3",
            )}
          >
            {step.label}
            <span className="sr-only">
              {step.state === "done" ? " (done)" : step.state === "current" ? " (in progress)" : " (upcoming)"}
            </span>
          </p>
          <p className="max-w-[55%] text-right text-[13px] leading-snug text-ink-3">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
