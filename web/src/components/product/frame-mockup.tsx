import type { CSSProperties, ReactNode } from "react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Quiet, pure-CSS product mockups for a portrait: framed print (thin flat moulding), gallery
 * canvas (shallow wrapped edges), fine-art print (paper with a white border) and digital file.
 * Everything is sized in container-query units, so a mockup looks identical at thumbnail size
 * and full width.
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
  /** Show the piece hanging above a sofa, drawn to scale for `printSize`. Ignored for digital. */
  room?: boolean;
  /** Physical size: sets the crop aspect ratio and the scale in the room scene. Default 3:4 (12×16). */
  printSize?: { widthIn: number; heightIn: number };
  /** Framed only: white mat around the art. Default false (Printful framed posters have no mat). */
  mat?: boolean;
  /** Wall color for the room scene. */
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
const ROOM_MAX_W = { sm: "max-w-[380px]", md: "max-w-[580px]", lg: "max-w-[780px]" } as const;

/** A soft, close shadow: the piece sits on the wall, it doesn't float above it. */
const HANG_SHADOW = "0 0.2cqw 0.5cqw rgb(0 0 0 / 0.10), 0 2.4cqw 4.4cqw -2cqw rgb(0 0 0 / 0.22)";

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
  const ratio = printSize && printSize.widthIn > 0 && printSize.heightIn > 0 ? printSize.widthIn / printSize.heightIn : 3 / 4;
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
    <div className="relative w-full overflow-hidden bg-paper-3" style={{ aspectRatio: String(ratio) }}>
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

/** Thin moulding: about 8px on a 340px-wide piece. */
const FRAME_W = "2.4cqw";

const MOULDING: Record<FrameColor, string> = {
  black: "#161616",
  white: "#fbfbfa",
  oak: "#c9a77f",
};

function Framed({ color, mat, children }: { color: FrameColor; mat: boolean; children: ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        padding: FRAME_W,
        background: MOULDING[color],
        // White needs a hairline to read against a pale wall.
        boxShadow: color === "white" ? `inset 0 0 0 1px rgb(0 0 0 / 0.08), ${HANG_SHADOW}` : HANG_SHADOW,
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

const DEPTH = "1.4cqw";

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
      ? { right: 0, top: 0, height: "100%", aspectRatio: String(ratio), transform: "scaleX(-1)", transformOrigin: "right" }
      : { left: 0, bottom: 0, width: "100%", aspectRatio: String(ratio), transform: "scaleY(-1)", transformOrigin: "bottom" };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" aria-hidden draggable={false} className="absolute max-w-none object-cover" style={style} />
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
  return <div className="relative overflow-hidden rounded-[3px] ring-1 ring-ink/10">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Room scene                                                          */
/* ------------------------------------------------------------------ */

// Scene coordinates in inches. The view spans 78" of wall, from 20" to 84" above the floor.
const SCENE_W = 78;
const VIEW_BOTTOM = 20;
const VIEW_TOP = 84;
const SCENE_H = VIEW_TOP - VIEW_BOTTOM;
const SOFA_BACK = 33;
const HANG_GAP = 7;

/** How much wider the hanging piece is than the print itself (frame + mat, canvas depth...). */
function outerScale(type: ProductType, mat: boolean) {
  if (type === "framed") return 1 / (1 - 2 * (mat ? 0.104 : 0.024));
  if (type === "canvas") return 1.014;
  return 1 / (1 - 2 * 0.04);
}

function RoomScene({
  productType,
  printSize,
  mat,
  wall = "#efeeea",
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
  const outerW = printSize.widthIn * outerScale(productType, mat);
  const bottomPct = ((SOFA_BACK + HANG_GAP - VIEW_BOTTOM) / SCENE_H) * 100;
  const y = (h: number) => VIEW_TOP - h; // inches above floor → SVG y

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}`, backgroundColor: wall }}
    >
      {/* Artwork, to scale */}
      <div
        className="@container absolute left-1/2 -translate-x-1/2 transition-[width] duration-500 ease-out"
        style={{ width: `${(outerW / SCENE_W) * 100}%`, bottom: `${bottomPct}%` }}
      >
        {children}
      </div>

      {/* A 6-ft sofa as a hairline drawing, so the piece reads to scale without a furnished room. */}
      <svg
        aria-hidden
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-x-0 bottom-0 h-full w-full"
        fill="none"
        stroke="rgb(0 0 0 / 0.22)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* back */}
        <path
          vectorEffect="non-scaling-stroke"
          d={`M 10 ${y(26)} L 10 ${y(SOFA_BACK - 3)} Q 10 ${y(SOFA_BACK)} 13 ${y(SOFA_BACK)} L 65 ${y(SOFA_BACK)} Q 68 ${y(SOFA_BACK)} 68 ${y(SOFA_BACK - 3)} L 68 ${y(26)}`}
        />
        {/* arms */}
        <path
          vectorEffect="non-scaling-stroke"
          d={`M 4 ${y(VIEW_BOTTOM)} L 4 ${y(23.5)} Q 4 ${y(26)} 6.5 ${y(26)} L 12.5 ${y(26)} Q 15 ${y(26)} 15 ${y(23.5)} L 15 ${y(VIEW_BOTTOM)}`}
        />
        <path
          vectorEffect="non-scaling-stroke"
          d={`M 63 ${y(VIEW_BOTTOM)} L 63 ${y(23.5)} Q 63 ${y(26)} 65.5 ${y(26)} L 71.5 ${y(26)} Q 74 ${y(26)} 74 ${y(23.5)} L 74 ${y(VIEW_BOTTOM)}`}
        />
        {/* seat */}
        <path vectorEffect="non-scaling-stroke" d={`M 15 ${y(21.5)} L 63 ${y(21.5)}`} />
      </svg>
    </div>
  );
}
