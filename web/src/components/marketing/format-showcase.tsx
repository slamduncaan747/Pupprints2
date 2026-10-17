import Link from "next/link";
import { PRODUCTS, type FrameColor, type Product, type ProductType } from "@/lib/catalog";
import { FORMAT_SHOWCASE } from "@/lib/offer";
import { FrameMockup } from "@/components/product/frame-mockup";
import { fromPrice, shipWindow } from "@/components/marketing/commerce";
import { Photo } from "@/components/marketing/photo";
import { FORMAT_SCENE, campaign, formatScenesLive } from "@/lib/campaign";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Every format shown with the SAME portrait (FORMAT_SHOWCASE), so a visitor compares the formats,
 * never the pictures. Facts (sizes, prices, timing) come from the catalog.
 *
 * When all four campaign scenes exist (web/public/campaign/format-*.webp, the same Royal portrait
 * as each piece in a room), the showcase portrait is shown in its scene; until then, and wherever a
 * different portrait is passed in, the drawn mockups. A row never mixes the two.
 */

/** 4:5, the shape of every sample portrait, so the art is never cropped differently between formats. */
const SHOWCASE_SIZE = { widthIn: 8, heightIn: 10 };

/** One factual line per format: what it physically is. */
export const FORMAT_WHAT: Record<ProductType, string> = {
  canvas: "Stretched over solid wood, the image wrapping the edges. Ready to hang.",
  framed: "Archival paper in a solid wood frame, behind acrylic. Ready to hang.",
  poster: "Archival matte paper and pigment inks, for a frame of your own.",
  digital: "The full-resolution file, emailed the moment you order.",
};

/** A very short note for compact grids. */
export const FORMAT_NOTE: Record<ProductType, string> = {
  canvas: "Gallery-wrapped, ready to hang",
  framed: "Black, white or oak, ready to hang",
  poster: "Archival paper, for your own frame",
  digital: "Free with every physical piece",
};

export function priceFrom(product: Product) {
  return `${product.variants.length > 1 ? "From " : ""}${formatPrice(fromPrice(product))}`;
}

export function sizeRange(product: Product) {
  if (product.type === "digital") return "High-res file";
  const first = product.variants[0];
  const last = product.variants[product.variants.length - 1];
  return product.variants.length > 1 ? `${first.label} to ${last.label}` : first.label;
}

/**
 * One format as a product photograph: the piece centered on a 4:5 ivory backdrop. Pass `src` to show a
 * different (single) portrait, e.g. a style's own sample on its style page.
 */
export function FormatTile({
  type,
  src = FORMAT_SHOWCASE.src,
  alt,
  frameColor = "black",
  priority,
  zoom = true,
  backdrop = true,
  scene = true,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
}: {
  type: ProductType;
  src?: string;
  alt?: string;
  frameColor?: FrameColor;
  priority?: boolean;
  /** Slow zoom when a parent `.group` is hovered. */
  zoom?: boolean;
  /** The ivory backdrop. Turn off when the section itself is ivory (the pieces hang on its wall). */
  backdrop?: boolean;
  /** Show the campaign scene when every scene exists and this is the showcase portrait. */
  scene?: boolean;
  /** For the campaign scene. */
  sizes?: string;
  className?: string;
}) {
  if (scene && src === FORMAT_SHOWCASE.src && formatScenesLive()) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <Photo photo={campaign(FORMAT_SCENE[type])} ratio="4 / 5" sizes={sizes} eager={priority} zoom={zoom} />
      </div>
    );
  }
  const product = PRODUCTS.find((p) => p.type === type);
  return (
    <div className={cn("overflow-hidden", backdrop && "bg-paper-2", className)}>
      <div
        className={cn(
          "flex aspect-[4/5] items-center justify-center",
          zoom &&
            "motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.035]",
        )}
      >
        <FrameMockup
          src={src}
          alt={alt ?? `${product?.name ?? "Portrait"}: ${FORMAT_SHOWCASE.alt.toLowerCase()}`}
          productType={type}
          frameColor={frameColor}
          printSize={SHOWCASE_SIZE}
          priority={priority}
          // One width for every format: FrameMockup draws the art at the same size in each and only
          // the format changes around it. Without a backdrop the piece hangs on the section's own wall,
          // so it can be larger.
          className={cn("max-w-none", backdrop ? "w-[66%]" : "w-[80%]")}
        />
      </div>
    </div>
  );
}

/**
 * The four formats side by side. `compact` (home): name, a short note and the from-price. `compare`
 * (/shop): what it is, sizes, arrival and from-price, aligned row by row on desktop.
 */
export function FormatShowcase({
  variant = "compact",
  backdrop = true,
  className,
}: {
  variant?: "compact" | "compare";
  /** See FormatTile. */
  backdrop?: boolean;
  className?: string;
}) {
  if (variant === "compact") {
    // Edge to edge, like an e-shop grid: four across from laptop up, two by two on phones.
    return (
      <ul className={cn("grid grid-cols-2 gap-x-[2px] gap-y-12 sm:gap-y-16 lg:grid-cols-4", className)}>
        {PRODUCTS.map((p) => (
          <li key={p.type} className="min-w-0">
            <Link href={`/shop/${p.type}`} className="group block">
              <FormatTile
                type={p.type}
                alt={`The same portrait as a ${p.name.toLowerCase()}`}
                backdrop={backdrop}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="mt-4 flex items-baseline justify-between gap-3 px-3 sm:mt-5 sm:px-6">
                <h3 className="label text-ink">{p.shortName}</h3>
                <p className="label tabular-nums text-ink">{priceFrom(p)}</p>
              </div>
              <p className="mt-1.5 px-3 text-[13px] leading-snug text-ink-3 sm:px-6">{FORMAT_NOTE[p.type]}</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const rows: { label: string; value: (p: Product) => string }[] = [
    { label: "What it is", value: (p) => FORMAT_WHAT[p.type] },
    { label: "Sizes", value: sizeRange },
    { label: "Arrives", value: (p) => (p.type === "digital" ? "Instantly, by email" : `${shipWindow(p)} (US)`) },
  ];

  return (
    // On desktop the four columns share one subgrid, so each fact lines up across formats.
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 lg:[grid-template-rows:repeat(5,auto)]",
        className,
      )}
    >
      {PRODUCTS.map((p) => (
        <li key={p.type} className="lg:row-span-5 lg:grid lg:grid-rows-subgrid">
          <Link href={`/shop/${p.type}`} className="group block pb-5">
            <FormatTile
              type={p.type}
              alt={`The same portrait as a ${p.name.toLowerCase()}`}
              backdrop={backdrop}
              sizes="(min-width: 1440px) 320px, (min-width: 1024px) 23vw, 45vw"
            />
            <h3 className="label mt-4 text-ink">{p.name}</h3>
          </Link>
          {rows.map((r) => (
            <div key={r.label} className="border-t border-line pb-4 pt-3">
              <p className="label text-ink-3">{r.label}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-ink-2 sm:text-[14px]">{r.value(p)}</p>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 border-y border-ink py-3">
            <p className="label text-ink">{p.variants.length > 1 ? "From" : "Price"}</p>
            <p className="label tabular-nums text-ink">{formatPrice(fromPrice(p))}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
