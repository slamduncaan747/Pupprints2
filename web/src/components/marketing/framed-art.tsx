import type { CSSProperties } from "react";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP, type FrameColor, type ProductType, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";

export type Finish = FrameColor | "canvas" | "print" | "phone";

/** Natural oak is lighter than the walnut-toned .frame-wood helper, so it gets its own gradient. */
const OAK: CSSProperties = {
  background: "linear-gradient(135deg, #b98f5f, #dcbb8c 42%, #c49a68 68%, #a57a4a)",
  padding: 14,
  boxShadow: "var(--shadow-frame)",
};

const FRAME_CLASS: Record<FrameColor, string> = {
  black: "frame-black",
  white: "frame-white",
  oak: "",
};

/**
 * A style sample presented the way it would hang: in a frame, on canvas, as a loose print
 * or on a phone (digital). Purely presentational; the real product mockup lives in /create.
 */
export function FramedArt({
  style,
  finish = "black",
  mat = false,
  className,
  sizes = "(max-width: 768px) 70vw, 30vw",
  priority,
}: {
  style: StyleSlug;
  finish?: Finish;
  mat?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const s = STYLE_MAP[style];
  const art = (
    <SampleImage
      src={STYLE_SAMPLES[style]}
      alt={`Example ${s.name} portrait of a dog`}
      swatch={s.swatch}
      label={s.name}
      sizes={sizes}
      priority={priority}
    />
  );

  if (finish === "canvas") {
    return <div className={cn("canvas-wrap overflow-hidden rounded-[2px]", className)}>{art}</div>;
  }
  if (finish === "print") {
    return (
      <div className={cn("bg-[#fdfcf9] p-[5%] shadow-soft", className)}>
        <div className="ring-1 ring-black/5">{art}</div>
      </div>
    );
  }
  if (finish === "phone") {
    return (
      <div className={cn("rounded-[2.2rem] bg-ink p-2.5 shadow-frame", className)}>
        <div className="overflow-hidden rounded-[1.7rem] bg-paper">
          <div className="flex h-6 items-center justify-center">
            <span className="h-1.5 w-12 rounded-full bg-ink/15" />
          </div>
          {art}
          <div className="space-y-1.5 px-4 py-4">
            <span className="block h-2 w-2/3 rounded-full bg-ink/10" />
            <span className="block h-2 w-1/3 rounded-full bg-ink/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(FRAME_CLASS[finish], className)} style={finish === "oak" ? OAK : undefined}>
      <div className={cn("shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]", mat && "mat")}>{art}</div>
    </div>
  );
}

/** Default way to show each product type. */
export const FINISH_FOR_PRODUCT: Record<ProductType, Finish> = {
  digital: "phone",
  poster: "print",
  framed: "black",
  canvas: "canvas",
};

/** A product presented on a softly lit "wall". */
export function ProductScene({
  type,
  style,
  finish,
  className,
  priority,
}: {
  type: ProductType;
  style: StyleSlug;
  finish?: Finish;
  className?: string;
  priority?: boolean;
}) {
  const f = finish ?? FINISH_FOR_PRODUCT[type];
  return (
    <div
      className={cn(
        "relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-card bg-paper-2",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_25%,rgb(255_255_255/0.75),transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[18%] bg-paper-3/70" />
      <FramedArt
        style={style}
        finish={f}
        priority={priority}
        sizes="(max-width: 768px) 45vw, 18vw"
        className={cn("relative", f === "phone" ? "w-[34%]" : "w-[44%]", f === "print" && "-rotate-1")}
      />
    </div>
  );
}
