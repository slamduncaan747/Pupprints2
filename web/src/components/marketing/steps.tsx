import { Camera, Frame, Sparkles, Truck, type LucideIcon } from "lucide-react";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { cn } from "@/lib/utils";

export type Step = { icon: LucideIcon; title: string; body: string };

export function defaultSteps(styleName?: string): Step[] {
  return [
    {
      icon: Camera,
      title: "Upload a photo",
      body: "Any clear phone photo of your dog will do. Close-up, good light, both eyes visible.",
    },
    {
      icon: Sparkles,
      title: styleName ? `See them in ${styleName}, free` : "See your portrait, free",
      body: "Your portrait appears in about a minute. Try every style and redo it as often as you like.",
    },
    {
      icon: Frame,
      title: "Choose how to hang it",
      body: "Fine art print, framed print or gallery canvas. The hi-res digital file is included with each.",
    },
    {
      icon: Truck,
      title: "We check, print and ship",
      body: `A person on our team checks your art before it's printed. It arrives in ${PHYSICAL_SHIP_WINDOW}.`,
    },
  ];
}

/** Numbered 4-step explainer. */
export function Steps({ steps = defaultSteps(), className }: { steps?: Step[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map(({ icon: Icon, title, body }, i) => (
        <li key={title} className="relative">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper ring-1 ring-line">
              <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
            </span>
            <span className="font-display text-sm text-ink-3">Step {i + 1}</span>
          </div>
          <h3 className="mt-5 font-display text-2xl leading-tight">{title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
        </li>
      ))}
    </ol>
  );
}
