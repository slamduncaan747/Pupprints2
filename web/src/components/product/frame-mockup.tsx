import type { CSSProperties, ReactNode } from "react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Quiet, pure-CSS product mockups for a portrait: framed print (a fine flat moulding), gallery
 * canvas (shallow wrapped edges), fine-art print (paper with a white border) and digital file.
 * Everything is sized in container-query units, so a mockup looks identical at thumbnail size
 * and full width. The room scene is a flat ivory wall with the piece hung to scale: no furniture.
 *
 * Works in Server and Client Components (no hooks).
 *
 * @example
 * <FrameMockup src={previewUrl} alt="Biscuit as The Royal" productType="framed" frameColor="oak" size="lg" />
 * <FrameMockup src={src} alt="" productType="canvas" printSize={{ widthIn: 24, heightIn: 36 }} room />
 */
export type FrameMockupProps = {
  src: string;
  alt: string;
  productType: ProductType;
  /** Framed only. Default "black". */
  frameColor?: FrameColor;
  /** Max width preset. Mockups are fluid up to this width. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Show the piece hanging on a flat ivory wall, drawn to scale for `printSize`. Ignored for digital. */
  room?: boolean;
  /** Physical size: sets the crop aspect ratio and the scale in the room scene. Default 3:4 (12×16). */
  printSize?: { widthIn: number; heightIn: number };
  /** Framed only: white mat around the art. Default false (Printful framed posters have no mat). */
  mat?: boolean;
  /** Wall color for the room scene. Default warm ivory. */
  wall?: string;
  /** Eager-load the image (above the fold). */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  /** Rendered over the artwork window (e.g. a loading shimmer). */
  children?: ReactNode;
};

const MAX_W = { sm: "max-w-[220px]", md: "max-w-[340px]", lg: "max-w-[480px]" } as const;
const ROOM_MAX_W = { sm: "max-w-[320px]", md: "max-w-[480px]", lg: "max-w-[640px]" } as const;

/** A soft campaign shadow, close to the wall: the piece hangs, it doesn't float. */
const HANG_SHADOW = "0 0.25cqw 0.6cqw rgb(0 0 0 / 0.08), 0 3cqw 5cqw -2.4cqw rgb(0 0 0 / 0.24)";

export function FrameMockup({
  src,
  alt,
  productType,
  frameColor = "black",
  size = "md",
  room = false,
  printSize,
  mat = false,
  wall,
  priority,
  className,
  imgClassName,
  imgStyle,
  children,
}: FrameMockupProps) {
  const ratio =
    printSize && printSize.widthIn > 0 && printSize.heightIn > 0 ? printSize.widthIn / printSize.heightIn : 3 / 4;
  const art = (
    <Artwork src={src} alt={alt} ratio={ratio} priority={priority} className={imgClassName} style={imgStyle}>
      {children}
    </Artwork>
  );

  const piece =
    productType === "framed" ? (
      <Framed color={frameColor} mat={mat}>
        {art}
      </Framed>
    ) : productType === "canvas" ? (
      <Canvas src={src} ratio={ratio}>
        {art}
      </Canvas>
    ) : productType === "poster" ? (
      <Paper>{art}</Paper>
    ) : (
      <Digital>{art}</Digital>
    );

  if (room && productType !== "digital") {
    return (
      <RoomScene
        className={cn("w-full", ROOM_MAX_W[size], className)}
        productType={productType}
        printSize={printSize ?? { widthIn: 12, heightIn: 16 }}
        mat={mat}
        wall={wall}
      >
        {piece}
      </RoomScene>
    );
  }

  return <div className={cn("@container w-full", MAX_W[size], className)}>{piece}</div>;
}

/* ------------------------------------------------------------------ */
/* Artwork window                                                      */
/* ------------------------------------------------------------------ */

function Artwork({
  src,
  alt,
  ratio,
  priority,
  className,
  style,
  children,
}: {
  src: string;
  alt: string;
  ratio: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className="relative w-full overflow-hidden bg-paper-2" style={{ aspectRatio: String(ratio) }}>
      {/* Arbitrary sources (Supabase previews, blob: URLs, /samples) — plain img keeps this component universal. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className={cn("absolute inset-0 h-full w-full select-none object-cover", className)}
        style={style}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Framed print                                                        */
/* ------------------------------------------------------------------ */

/** A fine moulding: about 6px on a 340px-wide piece. */
const FRAME_W = "1.8cqw";
const FRAME_FRACTION = 0.018;

const MOULDING: Record<FrameColor, string> = {
  black: "#121212",
  white: "#fcfcfb",
  oak: "#c4a582",
};

function Framed({ color, mat, children }: { color: FrameColor; mat: boolean; children: ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        padding: FRAME_W,
        background: MOULDING[color],
        // White needs a hairline to read against a pale wall.
        boxShadow: color === "white" ? `inset 0 0 0 1px rgb(0 0 0 / 0.09), ${HANG_SHADOW}` : HANG_SHADOW,
      }}
    >
      <div className="relative" style={{ padding: mat ? "8cqw" : 0, background: mat ? "#fdfdfb" : undefined }}>
        {children}
        {/* Hairline where the moulding meets the art (or mat). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery canvas                                                      */
/* ------------------------------------------------------------------ */

const DEPTH = "1.2cqw";

function Canvas({ src, ratio, children }: { src: string; ratio: number; children: ReactNode }) {
  return (
    <div style={{ marginRight: DEPTH, marginBottom: DEPTH }}>
      <div className="relative" style={{ boxShadow: HANG_SHADOW }}>
        {children}
        {/* Right wrapped edge */}
        <div
          aria-hidden
          className="absolute top-0 left-full h-full overflow-hidden"
          style={{ width: DEPTH, transformOrigin: "0 0", transform: "skewY(45deg)" }}
        >
          <EdgeImage src={src} ratio={ratio} side="right" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        {/* Bottom wrapped edge */}
        <div
          aria-hidden
          className="absolute top-full left-0 w-full overflow-hidden"
          style={{ height: DEPTH, transformOrigin: "0 0", transform: "skewX(45deg)" }}
        >
          <EdgeImage src={src} ratio={ratio} side="bottom" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>
    </div>
  );
}

/** A mirrored slice of the artwork, as it wraps around the stretcher bars. */
function EdgeImage({ src, ratio, side }: { src: string; ratio: number; side: "right" | "bottom" }) {
  const style: CSSProperties =
    side === "right"
      ? {
          right: 0,
          top: 0,
          height: "100%",
          aspectRatio: String(ratio),
          transform: "scaleX(-1)",
          transformOrigin: "right",
        }
      : {
          left: 0,
          bottom: 0,
          width: "100%",
          aspectRatio: String(ratio),
          transform: "scaleY(-1)",
          transformOrigin: "bottom",
        };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className="absolute max-w-none object-cover"
      style={style}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Fine-art print                                                      */
/* ------------------------------------------------------------------ */

function Paper({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        padding: "4cqw",
        background: "#fdfdfb",
        boxShadow: `inset 0 0 0 1px rgb(0 0 0 / 0.05), ${HANG_SHADOW}`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Digital file                                                        */
/* ------------------------------------------------------------------ */

function Digital({ children }: { children: ReactNode }) {
  return <div className="relative overflow-hidden ring-1 ring-ink/10">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Room scene                                                          */
/* ------------------------------------------------------------------ */

// Scene coordinates in inches: a 40"-wide stretch of wall, 50" tall (4:5, like a campaign image).
// Wide enough for the largest piece (24×36) with air around it; small pieces read as small.
const SCENE_W = 40;
const SCENE_H = 50;
/** The piece is centered a little above the middle of the view, at gallery eye level. */
const CENTER_FROM_TOP = 0.46;

/** How much larger the hanging piece is than the print itself (frame + mat, canvas depth...). */
function outerScale(type: ProductType, mat: boolean) {
  if (type === "framed") return 1 / (1 - 2 * (mat ? FRAME_FRACTION + 0.08 : FRAME_FRACTION));
  if (type === "canvas") return 1.012;
  return 1 / (1 - 2 * 0.04);
}

function RoomScene({
  productType,
  printSize,
  mat,
  wall = "#f6f4ef",
  className,
  children,
}: {
  productType: ProductType;
  printSize: { widthIn: number; heightIn: number };
  mat: boolean;
  wall?: string;
  className?: string;
  children: ReactNode;
}) {
  const scale = outerScale(productType, mat);
  const outerW = printSize.widthIn * scale;
  const outerH = printSize.heightIn + (outerW - printSize.widthIn);
  const topPct = Math.max(2, ((SCENE_H * CENTER_FROM_TOP - outerH / 2) / SCENE_H) * 100);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}`, backgroundColor: wall }}
    >
      {/* Artwork, to scale on a flat wall */}
      <div
        className="@container absolute left-1/2 -translate-x-1/2 transition-[width,top] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${(outerW / SCENE_W) * 100}%`, top: `${topPct}%` }}
      >
        {children}
      </div>
    </div>
  );
}
