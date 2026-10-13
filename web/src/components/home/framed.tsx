import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./home.css";

export type FrameKind = "black" | "white" | "oak" | "walnut" | "gold";

const FRAME: Record<FrameKind, string> = {
  black: "frame-black",
  white: "frame-white",
  oak: "ph-frame-oak",
  walnut: "frame-wood",
  gold: "frame-gold",
};

/**
 * Lightweight gallery-frame presentation for the home page: moulding, optional mat with a
 * soft inner shadow, a bevel line around the art and a faint glazing glare.
 */
export function Framed({
  frame = "black",
  mat = true,
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
