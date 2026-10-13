import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";

export type FrameFinish = "black" | "white" | "oak" | "walnut" | "gold" | "canvas";

/** A sensible default frame for each style, so samples look the way they'd hang. */
export const STYLE_FRAME: Record<StyleSlug, FrameFinish> = {
  royal: "gold",
  admiral: "oak",
  "oil-classic": "walnut",
  watercolor: "white",
  "fine-line": "black",
  "pop-art": "black",
  storybook: "white",
  botanical: "oak",
  astronaut: "black",
  charcoal: "white",
  "mid-century": "oak",
  holiday: "walnut",
};

const FRAME_CLASS: Record<FrameFinish, string> = {
  black: "frame-black",
  white: "frame-white",
  walnut: "frame-wood",
  gold: "frame-gold",
  oak: "",
  canvas: "canvas-wrap overflow-hidden rounded-[2px]",
};

const OAK_STYLE = {
  background: "linear-gradient(135deg, #b98f5f, #dcbb8c 42%, #c49a68 68%, #a57a4a)",
  padding: 14,
  boxShadow: "var(--shadow-frame)",
} as const;

/**
 * A sample portrait presented in a frame. Pass `src` + `alt` to show a specific image
 * (e.g. a breed portrait); otherwise the style's catalog sample is used.
 */
export function FramedSample({
  style,
  src,
  alt,
  finish,
  mat = false,
  className,
  sizes = "(max-width: 768px) 60vw, 25vw",
  priority,
}: {
  style: StyleSlug;
  src?: string;
  alt?: string;
  finish?: FrameFinish;
  mat?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const s = STYLE_MAP[style];
  const f = finish ?? STYLE_FRAME[style];
  const art = (
    <SampleImage
      src={src ?? STYLE_SAMPLES[style]}
      alt={alt ?? `Example ${s.name} dog portrait`}
      swatch={s.swatch}
      label={s.name}
      sizes={sizes}
      priority={priority}
    />
  );
  if (f === "canvas") return <div className={cn(FRAME_CLASS.canvas, className)}>{art}</div>;
  return (
    <div className={cn(FRAME_CLASS[f], className)} style={f === "oak" ? OAK_STYLE : undefined}>
      <div className={cn("shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]", mat && "mat")}>{art}</div>
    </div>
  );
}

/** A framed sample hung on a softly lit "wall" panel. */
export function SampleOnWall({
  style,
  src,
  alt,
  finish,
  className,
  frameClassName,
  sizes,
  priority,
  mat,
}: {
  style: StyleSlug;
  src?: string;
  alt?: string;
  finish?: FrameFinish;
  className?: string;
  frameClassName?: string;
  sizes?: string;
  priority?: boolean;
  mat?: boolean;
}) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-card bg-paper-2", className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_30%,rgb(255_255_255/0.8),transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[14%] bg-paper-3/60" />
      <FramedSample
        style={style}
        src={src}
        alt={alt}
        finish={finish}
        mat={mat}
        sizes={sizes}
        priority={priority}
        className={cn("relative", frameClassName)}
      />
    </div>
  );
}
