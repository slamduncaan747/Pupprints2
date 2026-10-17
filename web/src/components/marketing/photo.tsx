import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/campaign";
import { cn } from "@/lib/utils";

/** Slow campaign zoom when a parent `.group` is hovered (motion-safe only). */
export const ZOOM =
  "motion-safe:transition-transform motion-safe:duration-[1600ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.035]";

/** Every sample portrait in web/public/samples is 4:5, 1200×1500. */
export const PORTRAIT_SIZE = { width: 1200, height: 1500 } as const;

/**
 * A campaign or sample photograph, server-rendered (no client JS). The box keeps the image's own
 * ratio unless `ratio` (a CSS aspect-ratio) or aspect classes in `className` set another; the image
 * covers the box, so nothing letterboxes. Width and height are always set, so nothing shifts.
 */
export function Photo({
  photo,
  sizes,
  eager = false,
  zoom = false,
  ratio,
  position,
  className,
}: {
  photo: PhotoData;
  sizes: string;
  /** Above the fold: load immediately at high priority. */
  eager?: boolean;
  zoom?: boolean;
  /** CSS aspect-ratio for the box, e.g. "4 / 5". `null` leaves it to `className`. Default: the image's own. */
  ratio?: string | null;
  /** CSS object-position, for crops into a different ratio. */
  position?: string;
  className?: string;
}) {
  const aspect = ratio === undefined ? `${photo.width} / ${photo.height}` : (ratio ?? undefined);
  return (
    <div className={cn("relative overflow-hidden bg-paper-2", className)} style={aspect ? { aspectRatio: aspect } : undefined}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        className={cn("absolute inset-0 h-full w-full object-cover", zoom && ZOOM)}
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
