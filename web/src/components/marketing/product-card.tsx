import Link from "next/link";
import type { Product, StyleSlug } from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { ProductArt } from "@/components/marketing/framed-art";
import { fromPrice } from "@/components/marketing/commerce";

/** Product tile linking to /shop/[type]: the piece on an ivory backdrop, then `.label` name and price. */
export function ProductCard({
  product,
  style,
  className,
  priority,
  sizes,
  bleed = false,
}: {
  product: Product;
  style: StyleSlug;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** The image runs edge to edge on phones, so inset the text a little. */
  bleed?: boolean;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/shop/${product.type}`} className="block">
        <div className="overflow-hidden">
          <ProductArt
            type={product.type}
            style={style}
            priority={priority}
            sizes={sizes}
            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
        </div>
        <h3 className={cn("label mt-4 text-ink", bleed && "px-3 sm:px-0")}>{product.name}</h3>
        <p className={cn("label mt-1.5 text-ink-3", bleed && "px-3 sm:px-0")}>
          {product.variants.length > 1 && "From "}
          {formatPrice(fromPrice(product))}
        </p>
      </Link>
    </article>
  );
}
