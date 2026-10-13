import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { FrameColor, Product, StyleSlug } from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { ProductScene } from "@/components/marketing/framed-art";
import { FRAME_LABELS, fromPrice, shipWindow } from "@/components/marketing/commerce";

const SWATCH: Record<FrameColor, string> = {
  black: "#151311",
  white: "#fbfaf7",
  oak: "#cfa877",
};

export function FrameSwatches({ colors, className }: { colors: FrameColor[]; className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)} aria-label="Frame colors">
      {colors.map((c) => (
        <li key={c} className="flex items-center gap-1.5 text-sm text-ink-2">
          <span className="h-4 w-4 rounded-full ring-1 ring-ink/20" style={{ background: SWATCH[c] }} aria-hidden="true" />
          {FRAME_LABELS[c]}
        </li>
      ))}
    </ul>
  );
}

/** Product overview tile linking to /shop/[type]. */
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
    <article className={cn("group flex flex-col", className)}>
      <Link href={`/shop/${product.type}`} className="block" aria-label={`${product.name} details`}>
        <ProductScene type={product.type} style={style} priority={priority} className="transition-colors group-hover:bg-paper-3" />
      </Link>
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl">
            <Link href={`/shop/${product.type}`} className="hover:text-clay-dark">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 text-ink-2">
            {product.variants.length > 1 ? "from " : ""}
            <span className="font-medium text-ink">{formatPrice(fromPrice(product))}</span>
          </p>
        </div>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{product.tagline}</p>
        {product.frameColors && <FrameSwatches colors={product.frameColors} className="mt-3" />}
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-3">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {instant ? "Delivered instantly by email" : `Arrives in ${shipWindow(product)}`}
        </p>
        <Link
          href={`/shop/${product.type}`}
          className="mt-4 inline-flex items-center gap-1.5 self-start text-[15px] font-medium text-clay-dark underline-offset-4 hover:underline"
        >
          Sizes &amp; details <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
