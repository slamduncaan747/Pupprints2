import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "good" | "far" | "blurry" | "dark" | "cropped";

const FUR = "#c99a5b";
const EAR = "#8a5f33";
const MUZZLE = "#f2e3c8";
const INK = "#1b1814";

function Dog({ x, y, s, dim = false }: { x: number; y: number; s: number; dim?: boolean }) {
  const fur = dim ? "#4a3a2a" : FUR;
  const ear = dim ? "#2e241a" : EAR;
  const muzzle = dim ? "#5c4c3c" : MUZZLE;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -36 70 Q -32 24 0 26 Q 32 24 36 70 Z" fill={fur} />
      <ellipse cx="-25" cy="-10" rx="11" ry="23" transform="rotate(22 -25 -10)" fill={ear} />
      <ellipse cx="25" cy="-10" rx="11" ry="23" transform="rotate(-22 25 -10)" fill={ear} />
      <ellipse cx="0" cy="0" rx="27" ry="29" fill={fur} />
      <ellipse cx="0" cy="-15" rx="4" ry="11" fill={muzzle} opacity="0.8" />
      <ellipse cx="0" cy="14" rx="15" ry="12" fill={muzzle} />
      <ellipse cx="0" cy="8" rx="5.5" ry="4" fill={INK} />
      <path d="M -5 15 Q 0 19.5 5 15" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="-11" cy="-5" r="3.4" fill={INK} />
      <circle cx="11" cy="-5" r="3.4" fill={INK} />
      {!dim && (
        <>
          <circle cx="-10" cy="-6.2" r="1" fill="#fff" />
          <circle cx="12" cy="-6.2" r="1" fill="#fff" />
        </>
      )}
    </g>
  );
}

/** A tiny illustrated "photo" of a dog, drawn in SVG to show good vs. bad reference photos. */
export function PhotoIllustration({ variant, className, title }: { variant: Variant; className?: string; title: string }) {
  const id = `pp-photo-${variant}`;
  return (
    <svg viewBox="0 0 120 150" role="img" aria-label={title} className={cn("block h-auto w-full", className)}>
      <defs>
        <radialGradient id={`${id}-light`} cx="0.35" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#e9dcc5" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <rect width="120" height="150" rx="6" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {variant === "good" && (
          <>
            <rect width="120" height="150" fill={`url(#${id}-light)`} />
            <Dog x={60} y={78} s={1.3} />
          </>
        )}
        {variant === "far" && (
          <>
            <rect width="120" height="150" fill="#e8dfcf" />
            <rect y="108" width="120" height="42" fill="#d6c8b0" />
            <rect x="12" y="40" width="34" height="44" rx="2" fill="#f7f1e6" stroke="#cbbca2" />
            <path d="M 18 108 L 22 92 L 30 92 L 34 108 Z" fill="#9fb09a" />
            <rect x="60" y="78" width="52" height="30" rx="6" fill="#b9a586" />
            <Dog x={92} y={112} s={0.28} />
          </>
        )}
        {variant === "blurry" && (
          <>
            <rect width="120" height="150" fill={`url(#${id}-light)`} />
            <g filter={`url(#${id}-blur)`}>
              <Dog x={64} y={80} s={1.3} />
            </g>
          </>
        )}
        {variant === "dark" && (
          <>
            <rect width="120" height="150" fill="#2b2622" />
            <rect x="22" y="14" width="76" height="70" rx="3" fill="#fff6dd" />
            <rect x="58" y="14" width="4" height="70" fill="#d8ccb2" />
            <rect x="22" y="47" width="76" height="4" fill="#d8ccb2" />
            <Dog x={60} y={86} s={1.25} dim />
          </>
        )}
        {variant === "cropped" && (
          <>
            <rect width="120" height="150" fill={`url(#${id}-light)`} />
            <Dog x={60} y={42} s={2.3} />
          </>
        )}
      </g>
    </svg>
  );
}

const DO = [
  "Close-up, at their eye level",
  "Soft natural light, like near a window",
  "Sharp focus on the eyes",
  "Whole head and both ears in the frame",
];

const AVOID: { variant: Variant; title: string; body: string }[] = [
  { variant: "far", title: "Too far away", body: "Their face needs to fill most of the photo." },
  { variant: "blurry", title: "Blurry or moving", body: "Tap to focus on the eyes and hold steady." },
  { variant: "dark", title: "Dark or backlit", body: "Face the window, not the other way round." },
  { variant: "cropped", title: "Ears cut off", body: "Leave a little room around the head." },
];

/** Good-vs-avoid photo guidance with drawn illustrations (no stock photos). */
export function PhotoTips({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[0.85fr_1.15fr]", className)}>
      <div className="flex flex-col rounded-card bg-white/70 p-6 ring-1 ring-line sm:p-8">
        <p className="inline-flex items-center gap-2 self-start rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-moss">
          <Check className="h-3.5 w-3.5" aria-hidden="true" /> Great photo
        </p>
        <div className="mx-auto mt-6 w-full max-w-[220px] overflow-hidden rounded-lg shadow-soft">
          <PhotoIllustration variant="good" title="Illustration of a good photo: a sharp close-up of a dog's face in soft light" />
        </div>
        <ul className="mt-7 space-y-3">
          {DO.map((d) => (
            <li key={d} className="flex items-start gap-3 text-[15px] text-ink-2">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss text-paper">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-card bg-white/70 p-6 ring-1 ring-line sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-clay-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-clay-dark">
          <X className="h-3.5 w-3.5" aria-hidden="true" /> Try to avoid
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6">
          {AVOID.map((a) => (
            <li key={a.variant}>
              <div className="relative overflow-hidden rounded-lg shadow-soft">
                <PhotoIllustration variant={a.variant} title={`Illustration of a photo to avoid: ${a.title.toLowerCase()}`} />
                <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-clay text-white">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 font-medium text-ink">{a.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{a.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-3">
          Not sure? Upload it anyway. Previews are free, and older or slightly blurry photos often work better than you&apos;d expect.
        </p>
      </div>
    </div>
  );
}
