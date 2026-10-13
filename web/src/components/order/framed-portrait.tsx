import Image from "next/image";
import type { CSSProperties } from "react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type PortraitFinish = FrameColor | "canvas" | "print" | "gold";

const OAK: CSSProperties = {
  background: "linear-gradient(135deg, #b98f5f, #dcbb8c 42%, #c49a68 68%, #a57a4a)",
  padding: 14,
  boxShadow: "var(--shadow-frame)",
};

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
  if (finish === "canvas") return <div className={cn("canvas-wrap overflow-hidden rounded-[2px]", className)}>{img}</div>;
  if (finish === "print") {
    return (
      <div className={cn("bg-[#fdfcf9] p-[5%] shadow-frame", className)}>
        <div className="ring-1 ring-black/5">{img}</div>
      </div>
    );
  }
  const frameClass = finish === "black" ? "frame-black" : finish === "white" ? "frame-white" : finish === "gold" ? "frame-gold" : "";
  return (
    <div className={cn(frameClass, className)} style={finish === "oak" ? OAK : undefined}>
      <div className="mat shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]">{img}</div>
    </div>
  );
}
