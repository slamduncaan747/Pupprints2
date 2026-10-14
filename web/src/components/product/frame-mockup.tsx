import type { CSSProperties, ReactNode } from "react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Quiet, pure-CSS product mockups for a portrait: framed print (a fine flat moulding), gallery
 * canvas (shallow wrapped edges), fine-art print (paper with a white border) and digital file.
 * Everything is sized in container-query units, so a mockup looks identical at thumbnail size
 * and full width. The room scene is a flat ivory wall with the piece hung to scale: no furniture.
 *
 * The artwork window is the anchor: the same `src` is rendered at the same size, crop and position
 * for every `productType`, and only the format is drawn around it. Compare formats by rendering
 * the same image (e.g. FORMAT_SHOWCASE.src) at the same width.
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

/**
 * Outside the room scene every format sits on the same stage: the artwork is always ART% of the
 * stage width, centered, and the format (moulding, canvas edge, paper border, screen) is drawn
 * AROUND it. So the same image renders at the same size, crop and position in every format,
 * and side-by-side mockups differ only by the format itself.
 */
const ART = 92;

/* Format chrome, as fractions of the ARTWORK width (1cqw = 1% of the artwork). */
/** A fine moulding: about 6px on a 340px-wide piece. */
const FRAME_CQW = 1.8;
const MAT_CQW = 8;
const CANVAS_DEPTH_CQW = 1.2;
const PAPER_BORDER_CQW = 4;

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
  const piece = (
    <Piece
      productType={productType}
      frameColor={frameColor}
      mat={mat}
      ratio={ratio}
      src={src}
      alt={alt}
      priority={priority}
      imgClassName={imgClassName}
      imgStyle={imgStyle}
    >
      {children}
    </Piece>
  );

  if (room && productType !== "digital") {
    return (
      <RoomScene
        className={cn("w-full", ROOM_MAX_W[size], className)}
        printSize={printSize ?? { widthIn: 12, heightIn: 16 }}
        wall={wall}
      >
        {piece}
      </RoomScene>
    );
  }

  // Stage: 100 wide, the artwork ART wide and centered, the same margin above and below.
  const stageH = ART / ratio + (100 - ART);
  return (
    <div className={cn("w-full", MAX_W[size], className)}>
      <div className="flex w-full items-center justify-center" style={{ aspectRatio: `100 / ${stageH}` }}>
        <div style={{ width: `${ART}%` }}>{piece}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The piece: artwork window + the format drawn around it              */
/* ------------------------------------------------------------------ */

function Piece({
  productType,
  frameColor,
  mat,
  ratio,
  src,
  alt,
  priority,
  imgClassName,
  imgStyle,
  children,
}: {
  productType: ProductType;
  frameColor: FrameColor;
  mat: boolean;
  ratio: number;
  src: string;
  alt: string;
  priority?: boolean;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    // The artwork box is the container: chrome sizes are relative to the art, never the reverse.
    <div className="@container relative w-full" style={{ aspectRatio: String(ratio) }}>
      {productType === "framed" && <FrameChrome color={frameColor} mat={mat} />}
      {productType === "canvas" && <CanvasChrome src={src} ratio={ratio} />}
      {productType === "poster" && <PaperChrome />}

      <div className="absolute inset-0 overflow-hidden bg-paper-2">
        {/* Arbitrary sources (Supabase previews, blob: URLs, /samples) — plain img keeps this component universal. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className={cn("absolute inset-0 h-full w-full select-none object-cover", imgClassName)}
          style={imgStyle}
        />
        {children}
      </div>

      {/* Hairline where the moulding (or mat) meets the art. */}
      {productType === "framed" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]" />
      )}
      {productType === "digital" && <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-ink/10" />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Framed print                                                        */
/* ------------------------------------------------------------------ */

const MOULDING: Record<FrameColor, string> = {
  black: "#121212",
  white: "#fcfcfb",
  oak: "#c4a582",
};

function FrameChrome({ color, mat }: { color: FrameColor; mat: boolean }) {
  const matW = mat ? MAT_CQW : 0;
  return (
    <>
      <div
        aria-hidden
        className="absolute"
        style={{
          inset: `-${FRAME_CQW + matW}cqw`,
          background: MOULDING[color],
          // White needs a hairline to read against a pale wall.
          boxShadow: color === "white" ? `inset 0 0 0 1px rgb(0 0 0 / 0.09), ${HANG_SHADOW}` : HANG_SHADOW,
        }}
      />
      {mat && <div aria-hidden className="absolute" style={{ inset: `-${MAT_CQW}cqw`, background: "#fdfdfb" }} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery canvas                                                      */
/* ------------------------------------------------------------------ */

const DEPTH = `${CANVAS_DEPTH_CQW}cqw`;

function CanvasChrome({ src, ratio }: { src: string; ratio: number }) {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{ boxShadow: HANG_SHADOW }} />
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
    </>
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

function PaperChrome() {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        inset: `-${PAPER_BORDER_CQW}cqw`,
        background: "#fdfdfb",
        boxShadow: `inset 0 0 0 1px rgb(0 0 0 / 0.05), ${HANG_SHADOW}`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Room scene                                                          */
/* ------------------------------------------------------------------ */

// Scene coordinates in inches: a 40"-wide stretch of wall, 50" tall (4:5, like a campaign image).
// Wide enough for the largest piece (24×36) with air around it; small pieces read as small.
const SCENE_W = 40;
const SCENE_H = 50;
/** The artwork is centered a little above the middle of the view, at gallery eye level. */
const CENTER_FROM_TOP = 0.46;

function RoomScene({
  printSize,
  wall = "#f6f4ef",
  className,
  children,
}: {
  printSize: { widthIn: number; heightIn: number };
  wall?: string;
  className?: string;
  children: ReactNode;
}) {
  // The ARTWORK is drawn exactly to scale; the frame, canvas edge or paper border adds around it.
  const topPct = Math.max(4, ((SCENE_H * CENTER_FROM_TOP - printSize.heightIn / 2) / SCENE_H) * 100);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}`, backgroundColor: wall }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-[width,top] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${(printSize.widthIn / SCENE_W) * 100}%`, top: `${topPct}%` }}
      >
        {children}
      </div>
    </div>
  );
}
