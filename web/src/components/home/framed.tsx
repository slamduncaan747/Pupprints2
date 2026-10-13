import type { ReactNode } from "react";
import type { FrameColor } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import "./home.css";

/** Only the frame colors we actually sell (catalog FrameColor), so mockups never promise a finish we don't offer. */
export type FrameKind = FrameColor;

const FRAME: Record<FrameKind, string> = {
  black: "frame-black",
  white: "frame-white",
  oak: "ph-frame-oak",
};

/**
 * Lightweight gallery-frame presentation for the home page: moulding, a bevel line around the art
 * and a faint glazing glare. Our framed prints have no mat, so `mat` is off by default; only use it
 * for things that genuinely have one.
 */
export function Framed({
  frame = "black",
  mat = false,
  thin = false,
  className,
  children,
}: {
  frame?: FrameKind;
  mat?: boolean;
  /** Narrower moulding for small thumbnails. */
  thin?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative", FRAME[frame], thin && "p-[6px]", className)}>
      <div
        className={cn(
          "relative",
          mat && "mat",
          mat ? "shadow-[inset_0_1px_4px_rgb(0_0_0/0.22)]" : "shadow-[inset_0_1px_3px_rgb(0_0_0/0.3)]",
        )}
      >
        <div className="relative overflow-hidden shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_0_0_3px_rgb(255_255_255/0.7)]">
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.14)_0%,rgb(255_255_255/0)_38%)]"
      />
    </div>
  );
}
