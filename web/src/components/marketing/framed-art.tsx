import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP, type FrameColor, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { styleContent } from "@/components/marketing/style-content";
import { cn } from "@/lib/utils";

/** Frames we sell, plus canvas, a loose print, and "plain" (the image alone, e.g. the digital file). */
export type Finish = FrameColor | "canvas" | "print" | "plain";

const FRAME_CLASS: Record<FrameColor, string> = {
  black: "frame-black",
  white: "frame-white",
  oak: "frame-oak",
};

/**
 * A sample portrait shown the way it would hang: in a thin frame, on canvas, as a loose print or plain.
 * Pass `src` + `alt` to show a specific image (e.g. a breed portrait); otherwise the style's sample is
 * used. Without a `finish`, each style gets the frame that suits it. Purely presentational.
 */
export function FramedArt({
  style,
  src,
  alt,
  finish,
  mat = false,
  className,
  sizes = "(max-width: 768px) 70vw, 30vw",
  priority,
  showLabel = true,
}: {
  style: StyleSlug;
  src?: string;
  alt?: string;
  finish?: Finish;
  mat?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Show the style name on the placeholder used while a sample image is missing. */
  showLabel?: boolean;
}) {
  const s = STYLE_MAP[style];
  const f = finish ?? styleContent(s).frame;
  const art = (
    <SampleImage
      src={src ?? STYLE_SAMPLES[style]}
      alt={alt ?? `Example ${s.name} portrait of a dog`}
      swatch={s.swatch}
      label={showLabel ? s.name : undefined}
      sizes={sizes}
      priority={priority}
    />
  );

  if (f === "plain") return <div className={className}>{art}</div>;
  if (f === "canvas") return <div className={cn("canvas-wrap overflow-hidden", className)}>{art}</div>;
  if (f === "print") return <div className={cn("bg-white p-[6%] shadow-frame", className)}>{art}</div>;
  return (
    <div className={cn(FRAME_CLASS[f], className)}>
      <div className={cn(mat && "mat")}>{art}</div>
    </div>
  );
}
