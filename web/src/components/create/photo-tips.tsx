import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Photo guidance with tiny illustrated good/bad examples (drawn in SVG, no stock photos).
 * Good input photos are the biggest single lever on likeness.
 */

type Variant = "close" | "eye" | "light" | "ears" | "far" | "dark" | "cropped";

function DogSketch({ variant }: { variant: Variant }) {
  const scale = variant === "far" ? 0.38 : variant === "cropped" ? 1.5 : 1;
  const dy = variant === "cropped" ? -14 : variant === "eye" ? 2 : 0;
  const dark = variant === "dark";
  const fur = dark ? "#5b5249" : "#c9925b";
  const fur2 = dark ? "#463e36" : "#a8713f";
  const bg = dark ? "#3a342e" : variant === "light" ? "#f6e7c4" : "#ece3d3";
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" fill={bg} />
      {variant === "light" && <circle cx="52" cy="10" r="8" fill="#ffd77a" opacity="0.9" />}
      <g
        transform={`translate(32 ${36 + dy}) scale(${scale}) translate(-32 -36)`}
        style={dark ? { filter: "blur(0.9px)" } : undefined}
      >
        <path d="M14 22c-4 6-5 17 1 23 3 3 7-4 8-10l1-11c-3-3-7-5-10-2z" fill={fur2} />
        <path d="M50 22c4 6 5 17-1 23-3 3-7-4-8-10l-1-11c3-3 7-5 10-2z" fill={fur2} />
        <ellipse cx="32" cy="36" rx="15" ry="17" fill={fur} />
        <ellipse cx="32" cy="45" rx="8.5" ry="6.5" fill={dark ? "#6b6056" : "#ecd2b0"} />
        <circle cx="26" cy="33" r="2.1" fill="#1b1814" />
        <circle cx="38" cy="33" r="2.1" fill="#1b1814" />
        <circle cx="26.7" cy="32.3" r="0.6" fill="#fff" />
        <circle cx="38.7" cy="32.3" r="0.6" fill="#fff" />
        <ellipse cx="32" cy="42" rx="3.4" ry="2.4" fill="#1b1814" />
      </g>
      {variant === "eye" && <path d="M4 33h56" stroke="#c8553d" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />}
    </svg>
  );
}

const GOOD: { variant: Variant; label: string }[] = [
  { variant: "close", label: "Face fills the frame" },
  { variant: "eye", label: "Taken at eye level" },
  { variant: "light", label: "Bright, natural light" },
];

const BAD: { variant: Variant; label: string }[] = [
  { variant: "far", label: "Too far away" },
  { variant: "dark", label: "Dark or blurry" },
  { variant: "cropped", label: "Ears cut off" },
];

function Tile({ variant, label, good }: { variant: Variant; label: string; good: boolean }) {
  return (
    <li className="flex flex-col items-center gap-2 text-center">
      <span className="relative block aspect-square w-full max-w-[84px] overflow-hidden rounded-xl ring-1 ring-ink/10">
        <DogSketch variant={variant} />
        <span
          className={cn(
            "absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm",
            good ? "bg-moss" : "bg-clay",
          )}
        >
          {good ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden /> : <X className="h-3 w-3" strokeWidth={3} aria-hidden />}
        </span>
      </span>
      <span className="text-[12px] leading-tight text-ink-2">
        <span className="sr-only">{good ? "Good: " : "Avoid: "}</span>
        {label}
      </span>
    </li>
  );
}

export function PhotoTips({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-card bg-paper-2/70 p-5 ring-1 ring-line sm:p-6", className)}>
      <h2 className="font-display text-xl">Tips for a great likeness</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
        Our artist works from your photo, so a clear, close shot of one dog gives the best result. Phone photos are
        perfect.
      </p>
      <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-moss uppercase">Great photos</p>
      <ul className="mt-2.5 grid grid-cols-3 gap-3">
        {GOOD.map((t) => (
          <Tile key={t.variant} {...t} good />
        ))}
      </ul>
      <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-clay-dark uppercase">Avoid</p>
      <ul className="mt-2.5 grid grid-cols-3 gap-3">
        {BAD.map((t) => (
          <Tile key={t.variant} {...t} good={false} />
        ))}
      </ul>
      <ul className="mt-5 space-y-1.5 text-[13px] text-ink-2">
        <li className="flex gap-2">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" aria-hidden />
          One dog per photo (more pets coming soon)
        </li>
        <li className="flex gap-2">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" aria-hidden />
          Both eyes visible, ears fully in the shot
        </li>
      </ul>
    </div>
  );
}
