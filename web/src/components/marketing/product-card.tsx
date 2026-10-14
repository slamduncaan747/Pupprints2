import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { FormatTile, priceFrom } from "@/components/marketing/format-showcase";

/**
 * Product tile linking to /shop/[type]: the piece on an ivory backdrop, then `.label` name and price.
 * Every tile in a row shows the same portrait (FORMAT_SHOWCASE by default) so formats compare cleanly.
 */
export function ProductCard({
  product,
  src,
  className,
  priority,
  bleed = false,
}: {
  product: Product;
  /** One portrait for every tile in the row. Defaults to FORMAT_SHOWCASE. */
  src?: string;
  className?: string;
  priority?: boolean;
  /** The image runs edge to edge on phones, so inset the text a little. */
  bleed?: boolean;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/shop/${product.type}`} className="block">
        <FormatTile type={product.type} src={src} alt={`Portrait shown as a ${product.name.toLowerCase()}`} priority={priority} />
        <h3 className={cn("label mt-4 text-ink", bleed && "px-3 sm:px-0")}>{product.name}</h3>
        <p className={cn("label mt-1.5 tabular-nums text-ink-3", bleed && "px-3 sm:px-0")}>{priceFrom(product)}</p>
      </Link>
    </article>
  );
}
