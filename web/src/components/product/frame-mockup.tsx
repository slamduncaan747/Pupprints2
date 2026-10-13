import type { CSSProperties, ReactNode } from "react";
import { Download } from "lucide-react";
import type { FrameColor, ProductType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Realistic, pure-CSS product mockups for a portrait: framed print (mitred moulding, mat,
 * bevel and glass sheen), gallery canvas (wrapped edges with depth), fine-art print (paper +
 * washi tape) and digital file. Everything is sized in container-query units, so a mockup
 * looks identical at thumbnail size and full width.
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
  /** Framed only: white mat around the art. Default true. */
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

export function FrameMockup({
  src,
  alt,
  productType,
  frameColor = "black",
  size = "md",
  room = false,
  printSize,
  mat = true,
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

const FRAME_W = "4.4cqw";

/** Moulding profile (outer edge → inner lip) per finish. */
const PROFILE: Record<FrameColor, string[]> = {
  black: ["#34302c", "#1a1816", "#0f0e0d", "#262320", "#080707"],
  white: ["#ffffff", "#f4f1ea", "#e7e2d8", "#f7f5f0", "#cfc9bd"],
  oak: ["#d9b98c", "#c49a68", "#b5895a", "#cba174", "#8f6a42"],
};

/** Directional light from the top-left: top lit, bottom in shadow. */
const LIGHT = {
  top: "rgb(255 255 255 / 0.10)",
  left: "rgb(255 255 255 / 0.04)",
  right: "rgb(0 0 0 / 0.10)",
  bottom: "rgb(0 0 0 / 0.20)",
} as const;

type Side = keyof typeof LIGHT;

function sideBackground(color: FrameColor, side: Side) {
  const dir = { top: "to bottom", bottom: "to top", left: "to right", right: "to left" }[side];
  const p = PROFILE[color];
  const profile = `linear-gradient(${dir}, ${p[0]} 0%, ${p[1]} 22%, ${p[2]} 55%, ${p[3]} 80%, ${p[4]} 100%)`;
  const light = `linear-gradient(${LIGHT[side]}, ${LIGHT[side]})`;
  if (color !== "oak") return `${light}, ${profile}`;
  // Wood grain runs along the length of each moulding piece.
  const along = side === "top" || side === "bottom" ? "0deg" : "90deg";
  const grain = [
    `repeating-linear-gradient(${along}, rgb(110 70 35 / 0) 0 1.1px, rgb(110 70 35 / 0.16) 1.1px 1.6px, rgb(255 240 210 / 0.06) 1.6px 2.9px)`,
    `repeating-linear-gradient(${along}, rgb(90 55 25 / 0) 0 3.7px, rgb(90 55 25 / 0.12) 3.7px 4.4px)`,
  ];
  return `${light}, ${grain.join(", ")}, ${profile}`;
}

const SIDE_STYLE: Record<Side, CSSProperties> = {
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: FRAME_W,
    clipPath: `polygon(0 0, 100% 0, calc(100% - ${FRAME_W}) 100%, ${FRAME_W} 100%)`,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: FRAME_W,
    clipPath: `polygon(${FRAME_W} 0, calc(100% - ${FRAME_W}) 0, 100% 100%, 0 100%)`,
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    width: FRAME_W,
    clipPath: `polygon(0 0, 100% ${FRAME_W}, 100% calc(100% - ${FRAME_W}), 0 100%)`,
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    width: FRAME_W,
    clipPath: `polygon(0 ${FRAME_W}, 100% 0, 100% 100%, 0 calc(100% - ${FRAME_W}))`,
  },
};

const WALL_SHADOW =
  "0 0.25cqw 0.4cqw rgb(20 16 12 / 0.22), 0 2.2cqw 3.4cqw -0.8cqw rgb(20 16 12 / 0.32), 0 5cqw 8cqw -3cqw rgb(20 16 12 / 0.28)";

function Framed({ color, mat, children }: { color: FrameColor; mat: boolean; children: ReactNode }) {
  return (
    <div className="relative" style={{ padding: FRAME_W, boxShadow: WALL_SHADOW, background: PROFILE[color][2] }}>
      {(Object.keys(SIDE_STYLE) as Side[]).map((side) => (
        <div
          key={side}
          aria-hidden
          className="absolute"
          style={{ ...SIDE_STYLE[side], background: sideBackground(color, side) }}
        />
      ))}
      <div
        className="relative"
        style={{
          padding: mat ? "8.5cqw" : 0,
          background: mat ? "linear-gradient(160deg, #fdfcf8, #f6f3ec)" : undefined,
        }}
      >
        {mat ? (
          // Bevel-cut window: a bright core edge with a hairline shadow.
          <div
            className="relative"
            style={{
              padding: "0.45cqw",
              background: "linear-gradient(135deg, #ffffff, #efe9dd)",
              boxShadow: "0 0 0 0.12cqw rgb(60 50 35 / 0.12)",
            }}
          >
            {children}
            <div aria-hidden className="pointer-events-none absolute inset-[0.45cqw] shadow-[inset_0_0.25cqw_0.6cqw_rgb(0_0_0/0.28)]" />
          </div>
        ) : (
          children
        )}
        {/* Shadow cast by the frame lip onto the mat/art */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow:
              "inset 0 0.7cqw 1.1cqw -0.4cqw rgb(0 0 0 / 0.34), inset 0.4cqw 0 0.8cqw -0.5cqw rgb(0 0 0 / 0.16), inset 0 0 0 0.12cqw rgb(0 0 0 / 0.18)",
          }}
        />
        {/* Glazing sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(118deg, rgb(255 255 255 / 0.20) 0%, rgb(255 255 255 / 0.05) 26%, rgb(255 255 255 / 0) 38%, rgb(255 255 255 / 0) 62%, rgb(255 255 255 / 0.08) 72%, rgb(255 255 255 / 0) 84%)",
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery canvas                                                      */
/* ------------------------------------------------------------------ */

const DEPTH = "2.4cqw";

function Canvas({ src, ratio, children }: { src: string; ratio: number; children: ReactNode }) {
  return (
    <div style={{ marginRight: DEPTH, marginBottom: DEPTH }}>
      <div
        className="relative"
        style={{
          boxShadow:
            "0.8cqw 1.2cqw 1.6cqw rgb(20 16 12 / 0.22), 2.4cqw 4cqw 6cqw -1.5cqw rgb(20 16 12 / 0.34)",
        }}
      >
        {children}
        {/* Canvas tooth (film grain) + face edge highlight */}
        <div
          aria-hidden
          className="grain pointer-events-none absolute inset-0"
          style={{
            boxShadow: "inset 0.15cqw 0.15cqw 0 rgb(255 255 255 / 0.18), inset -0.1cqw -0.1cqw 0 rgb(0 0 0 / 0.18)",
          }}
        />
        {/* Right wrapped edge */}
        <div
          aria-hidden
          className="absolute top-0 left-full h-full overflow-hidden"
          style={{ width: DEPTH, transformOrigin: "0 0", transform: "skewY(45deg)" }}
        >
          <EdgeImage src={src} ratio={ratio} side="right" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/45" />
        </div>
        {/* Bottom wrapped edge */}
        <div
          aria-hidden
          className="absolute top-full left-0 w-full overflow-hidden"
          style={{ height: DEPTH, transformOrigin: "0 0", transform: "skewX(45deg)" }}
        >
          <EdgeImage src={src} ratio={ratio} side="bottom" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/60" />
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
    <div className="relative pt-[2cqw]">
      {/* Lifted-corner shadows */}
      <div
        aria-hidden
        className="absolute bottom-[1.6cqw] left-[3cqw] h-[20%] w-[45%] -rotate-3 bg-black/30 blur-[1.4cqw]"
      />
      <div
        aria-hidden
        className="absolute right-[3cqw] bottom-[1.6cqw] h-[20%] w-[45%] rotate-3 bg-black/30 blur-[1.4cqw]"
      />
      <div
        className="relative"
        style={{
          padding: "3.6cqw",
          background: "linear-gradient(170deg, #fffefb 0%, #faf8f3 55%, #f1ede5 100%)",
          boxShadow: "0 0.2cqw 0.5cqw rgb(20 16 12 / 0.16), 0 1cqw 2cqw -1cqw rgb(20 16 12 / 0.2)",
        }}
      >
        {children}
        {/* Subtle paper curl */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgb(0 0 0 / 0.05) 0%, rgb(0 0 0 / 0) 12%, rgb(0 0 0 / 0) 88%, rgb(0 0 0 / 0.06) 100%)",
          }}
        />
      </div>
      <Tape className="top-[0.4cqw] left-[6cqw] -rotate-[7deg]" />
      <Tape className="top-[0.4cqw] right-[6cqw] rotate-[6deg]" />
    </div>
  );
}

function Tape({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={cn("absolute h-[5.5cqw] w-[17cqw]", className)}
      style={{
        background:
          "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.18) 0 0.8cqw, rgb(255 255 255 / 0) 0.8cqw 1.6cqw), rgb(236 226 200 / 0.82)",
        boxShadow: "0 0.15cqw 0.35cqw rgb(0 0 0 / 0.12)",
        clipPath: "polygon(2% 8%, 100% 0, 98% 92%, 0 100%)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Digital file                                                        */
/* ------------------------------------------------------------------ */

function Digital({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[2.4cqw] shadow-frame ring-1 ring-ink/10">{children}</div>
      <div className="absolute top-[4cqw] left-[4cqw] inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-semibold tracking-wide whitespace-nowrap text-paper uppercase backdrop-blur @max-[13rem]:hidden">
        <Download className="h-3.5 w-3.5" aria-hidden />
        High-res digital file
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Room scene                                                          */
/* ------------------------------------------------------------------ */

// Scene coordinates in inches. The view spans 78" of wall, from 16" to 92" above the floor.
const SCENE_W = 78;
const VIEW_BOTTOM = 16;
const VIEW_TOP = 92;
const SCENE_H = VIEW_TOP - VIEW_BOTTOM;
const SOFA_BACK = 33;
const HANG_GAP = 7;

/** How much wider the hanging piece is than the print itself (frame + mat, canvas depth...). */
function outerScale(type: ProductType, mat: boolean) {
  if (type === "framed") return 1 / (1 - 2 * (mat ? 0.129 : 0.044));
  if (type === "canvas") return 1.03;
  return 1.08;
}

function RoomScene({
  productType,
  printSize,
  mat,
  wall = "#e9e1d3",
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
      className={cn("relative w-full overflow-hidden rounded-card", className)}
      style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}`, backgroundColor: wall }}
    >
      {/* Wall light: soft daylight from the top-left */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 0%, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0) 55%), linear-gradient(180deg, rgb(0 0 0 / 0) 55%, rgb(60 40 20 / 0.10) 100%)",
        }}
      />
      <div aria-hidden className="grain absolute inset-0" />

      {/* Artwork, to scale */}
      <div
        className="@container absolute left-1/2 -translate-x-1/2 transition-[width] duration-500 ease-out"
        style={{ width: `${(outerW / SCENE_W) * 100}%`, bottom: `${bottomPct}%` }}
      >
        {children}
      </div>

      {/* Sofa silhouette */}
      <svg
        aria-hidden
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-x-0 bottom-0 h-full w-full"
      >
        <defs>
          <linearGradient id="pp-sofa-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8e978a" />
            <stop offset="1" stopColor="#737c70" />
          </linearGradient>
          <linearGradient id="pp-sofa-arm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9aa396" />
            <stop offset="1" stopColor="#7a8376" />
          </linearGradient>
          <filter id="pp-soft" x="-10%" y="-10%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        {/* contact shadow on the wall */}
        <ellipse cx={SCENE_W / 2} cy={y(SOFA_BACK - 1)} rx="34" ry="2.2" fill="rgb(40 30 20 / 0.16)" filter="url(#pp-soft)" />
        <rect x="9" y={y(SOFA_BACK)} width="60" height={SOFA_BACK} rx="4.5" fill="url(#pp-sofa-back)" />
        <rect x="16" y={y(31.2)} width="13" height="11" rx="2.6" transform="rotate(-9 22.5 62)" fill="#e7cdbf" />
        <rect x="49" y={y(31.2)} width="13" height="11" rx="2.6" transform="rotate(8 55.5 62)" fill="#d9c9a4" />
        <rect x="27" y={y(29.5)} width="11" height="10" rx="2.4" transform="rotate(-3 32.5 64)" fill="#c8b8a0" />
        <rect x="12" y={y(21.5)} width="54" height="8" rx="2.2" fill="#8a9386" />
        <line x1="39" y1={y(21.3)} x2="39" y2={y(16)} stroke="rgb(0 0 0 / 0.12)" strokeWidth="0.35" />
        <rect x="3.5" y={y(26)} width="11" height="26" rx="4" fill="url(#pp-sofa-arm)" />
        <rect x="63.5" y={y(26)} width="11" height="26" rx="4" fill="url(#pp-sofa-arm)" />
      </svg>
    </div>
  );
}
