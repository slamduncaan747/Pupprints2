import { cn } from "@/lib/utils";

/** Photo guidance as three quiet tracked lines. Good input photos are the biggest single lever on likeness. */
const TIPS = ["One dog, face filling the frame", "Eye level, both ears in view", "Bright, natural light"];

export function PhotoTips({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="sr-only">Tips for a true likeness</h2>
      <ul className={cn("label space-y-2.5 text-center text-ink-3")}>
        {TIPS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
