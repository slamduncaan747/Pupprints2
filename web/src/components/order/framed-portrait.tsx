import Image from "next/image";
import type { CSSProperties } from "react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type PortraitFinish = FrameColor | "canvas" | "print" | "gold";

const OAK: CSSProperties = { background: "#c9a77f", padding: 8, boxShadow: "var(--shadow-frame)" };

export function finishFor(productType: ProductType | "addon" | null | undefined, frame?: FrameColor | null): PortraitFinish {
  if (productType === "framed") return frame ?? "black";
  if (productType === "canvas") return "canvas";
  if (productType === "poster") return "print";
  return "gold";
}

/**
 * A customer's portrait presented as the finished piece. The image is a short-lived signed
 * URL, so it's served unoptimized (no image-optimizer cache churn).
 */
export function FramedPortrait({
  src,
  alt,
  finish = "black",
  className,
  priority,
}: {
  src: string;
  alt: string;
  finish?: PortraitFinish;
  className?: string;
  priority?: boolean;
}) {
  const img = (
    <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
      <Image src={src} alt={alt} fill unoptimized priority={priority} sizes="(max-width: 768px) 80vw, 420px" className="object-cover" />
    </div>
  );
  if (finish === "canvas") return <div className={cn("canvas-wrap overflow-hidden", className)}>{img}</div>;
  if (finish === "print") {
    return (
      <div className={cn("bg-[#fdfdfb] p-[4%] shadow-frame ring-1 ring-black/5", className)}>
        {img}
      </div>
    );
  }
  // Digital file: the image itself, no frame.
  if (finish === "gold") return <div className={cn("shadow-frame ring-1 ring-black/5", className)}>{img}</div>;
  const frameClass = finish === "black" ? "frame-black" : finish === "white" ? "frame-white ring-1 ring-black/5" : "";
  return (
    <div className={cn(frameClass, className)} style={finish === "oak" ? OAK : undefined}>
      {img}
    </div>
  );
}
