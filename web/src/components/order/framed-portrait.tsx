import Image from "next/image";
import type { CSSProperties } from "react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type PortraitFinish = FrameColor | "canvas" | "print" | "gold";

/** A soft campaign shadow, close to the wall. */
const SHADOW = "0 2px 4px rgb(0 0 0 / 0.06), 0 28px 48px -30px rgb(0 0 0 / 0.38)";
const MOULDING: Record<FrameColor, CSSProperties> = {
  black: { background: "#121212", padding: 6, boxShadow: SHADOW },
  white: { background: "#fcfcfb", padding: 6, boxShadow: `inset 0 0 0 1px rgb(0 0 0 / 0.09), ${SHADOW}` },
  oak: { background: "#c4a582", padding: 6, boxShadow: SHADOW },
};

export function finishFor(productType: ProductType | "addon" | null | undefined, frame?: FrameColor | null): PortraitFinish {
  if (productType === "framed") return frame ?? "black";
  if (productType === "canvas") return "canvas";
  if (productType === "poster") return "print";
  return "gold";
}

/**
 * A customer's portrait presented as the finished piece: a fine moulding, a gallery canvas, a
 * bordered print, or (digital) the image alone. The image is a short-lived signed URL, so it's
 * served unoptimized (no image-optimizer cache churn).
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
    <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
      <Image src={src} alt={alt} fill unoptimized priority={priority} sizes="(max-width: 768px) 86vw, 480px" className="object-cover" />
    </div>
  );
  if (finish === "canvas") {
    return (
      <div className={className} style={{ boxShadow: `3px 3px 0 -1px rgb(0 0 0 / 0.16), ${SHADOW}` }}>
        {img}
      </div>
    );
  }
  if (finish === "print") {
    return (
      <div className={cn("bg-[#fdfdfb] p-[4%]", className)} style={{ boxShadow: `inset 0 0 0 1px rgb(0 0 0 / 0.05), ${SHADOW}` }}>
        {img}
      </div>
    );
  }
  // Digital file: the image itself, as a campaign image.
  if (finish === "gold") return <div className={className}>{img}</div>;
  return (
    <div className={className} style={MOULDING[finish]}>
      {img}
    </div>
  );
}
