import { cn } from "@/lib/utils";

/** Photo guidance as three quiet lines. Good input photos are the biggest single lever on likeness. */
const TIPS = ["One dog, face filling the frame", "Eye level, both ears in the shot", "Bright, natural light"];

export function PhotoTips({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="sr-only">Tips for a great likeness</h2>
      <ul className={cn("space-y-1 text-center text-[13px] leading-relaxed text-ink-3")}>
        {TIPS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
