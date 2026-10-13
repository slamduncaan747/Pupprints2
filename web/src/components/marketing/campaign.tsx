import type { ReactNode } from "react";
import { SampleImage } from "@/components/ui/sample-image";
import { cn } from "@/lib/utils";
import { BLEED_PAD_LEFT, BLEED_PAD_RIGHT } from "@/components/marketing/page-hero";

/**
 * Campaign photography helpers: portraits shown unframed and edge to edge, product shots on an
 * ivory backdrop, and the two-column product page (gallery left, sticky details right).
 */

/** An unframed 4:5 portrait. `fill` lets it take the full height of a split-hero column on desktop. */
export function CampaignImage({
  src,
  alt,
  swatch = "#d9d6cf",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
  fill = false,
  className,
}: {
  src: string;
  alt: string;
  swatch?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
}) {
  return (
    <SampleImage
      src={src}
      alt={alt}
      swatch={swatch}
      sizes={sizes}
      priority={priority}
      className={cn(fill && "lg:aspect-auto lg:h-full", className)}
    />
  );
}

/** Image that eases in slightly when its parent `.group` is hovered. */
export function ZoomImage({
  src,
  alt,
  swatch,
  label,
  sizes,
  priority,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  swatch?: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden bg-paper-2", className)}>
      <SampleImage
        src={src}
        alt={alt}
        swatch={swatch}
        label={label}
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]",
          imageClassName,
        )}
      />
    </div>
  );
}

/** A 4:5 ivory backdrop with a piece of framed art centered on it, like a product photograph. */
export function ProductShot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex aspect-[4/5] items-center justify-center bg-paper-2", className)}>
      <div className="w-[58%]">{children}</div>
    </div>
  );
}

/**
 * Product page layout: gallery on the left (a swipeable row on phones, stacked full-size images on
 * desktop) and the details on the right, sticky while the gallery scrolls.
 */
export function ProductLayout({
  gallery,
  galleryLabel = "Gallery",
  children,
}: {
  gallery: ReactNode[];
  galleryLabel?: string;
  children: ReactNode;
}) {
  const single = gallery.length < 2;
  return (
    <section className="lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="min-w-0">
        <ul
          aria-label={galleryLabel}
          className={cn(
            "flex gap-0.5 lg:flex-col lg:overflow-visible",
            !single && "snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {gallery.map((item, i) => (
            <li key={i} className={cn("shrink-0 snap-start lg:w-full", single ? "w-full" : "w-[86%] sm:w-[70%]")}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          "min-w-0 px-5 pb-20 pt-10 sm:px-10 sm:pt-14 lg:sticky lg:top-20 lg:self-start lg:py-16 lg:pl-16 xl:pl-20",
          BLEED_PAD_RIGHT,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Product-page title block: kicker, Bodoni name, optional price line. */
export function ProductTitle({
  kicker,
  title,
  price,
  className,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  price?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {kicker && <div className="mb-8">{kicker}</div>}
      <h1 className="font-display text-[42px] leading-[1.02] tracking-[-0.02em] sm:text-[56px] xl:text-[64px]">{title}</h1>
      {price && <p className="label mt-5 text-ink">{price}</p>}
    </div>
  );
}

/**
 * One chapter of an editorial story: a large image running to the edge of the screen on one side,
 * a numeral, a short Bodoni line and a sentence or two on the other.
 */
export function Chapter({
  id,
  kicker,
  title,
  children,
  media,
  side = "left",
}: {
  id?: string;
  kicker: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  media: ReactNode;
  /** Which side the image sits on (desktop). */
  side?: "left" | "right";
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24 md:grid md:grid-cols-2 md:items-center">
      <div className={cn("min-w-0", side === "right" && "md:order-2")}>{media}</div>
      <div
        className={cn(
          "min-w-0 px-5 pb-20 pt-10 sm:px-10 sm:pb-24 sm:pt-14 md:py-24",
          side === "left" ? cn("md:pl-16 xl:pl-28", BLEED_PAD_RIGHT) : cn("md:pr-16 xl:pr-28", BLEED_PAD_LEFT),
        )}
      >
        <p className="label text-ink-3">{kicker}</p>
        <h2 id={headingId} className="mt-6 max-w-lg font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[56px] xl:text-[68px]">
          {title}
        </h2>
        {children && <div className="mt-7 max-w-sm text-[15px] leading-relaxed text-ink-2">{children}</div>}
      </div>
    </section>
  );
}
