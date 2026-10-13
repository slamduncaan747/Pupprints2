import Link from "next/link";
import type { Product, StyleSlug } from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { ProductArt } from "@/components/marketing/framed-art";
import { fromPrice, shipWindow } from "@/components/marketing/commerce";

/** Product tile linking to /shop/[type]: example art, name, starting price and delivery time. */
export function ProductCard({
  product,
  style,
  className,
  priority,
}: {
  product: Product;
  style: StyleSlug;
  className?: string;
  priority?: boolean;
}) {
  const instant = product.shipDays[1] === 0;
  return (
    <article className={cn("group", className)}>
      <Link href={`/shop/${product.type}`} className="block">
        <ProductArt type={product.type} style={style} priority={priority} />
        <h3 className="mt-4 font-display text-[21px] leading-tight sm:text-2xl">{product.name}</h3>
        <p className="mt-1 text-[15px] text-ink">
          {product.variants.length > 1 && <span className="text-ink-3">from </span>}
          {formatPrice(fromPrice(product))}
        </p>
        <p className="mt-0.5 text-[14px] leading-snug text-ink-3">
          {instant ? "Delivered instantly by email" : `Arrives in ${shipWindow(product)}`}
        </p>
      </Link>
    </article>
  );
}
