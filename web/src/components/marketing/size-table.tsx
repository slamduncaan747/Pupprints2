import type { Product } from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { sizeUse, variantDims } from "@/components/marketing/commerce";

/**
 * Sizes as hairline `.label` rows with prices right-aligned. Prices come straight from the catalog;
 * US shipping is free.
 */
export function SizeTable({ product, showUse = true, className }: { product: Product; showUse?: boolean; className?: string }) {
  return (
    <table className={cn("w-full border-collapse text-left", className)}>
      <caption className="sr-only">{product.name} sizes and prices</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Size</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody className="border-t border-line">
        {product.variants.map((v) => {
          const dims = variantDims(v);
          return (
            <tr key={v.id} className="border-b border-line">
              <th scope="row" className="py-4 pr-4 align-top font-normal">
                <span className="label text-ink">{v.label}</span>
                {dims && <span className="label ml-3 text-ink-3">{dims.cm}</span>}
                {showUse && <span className="mt-1.5 block text-[13px] leading-snug text-ink-3">{sizeUse(v)}</span>}
              </th>
              <td className="label py-4 text-right align-top tabular-nums text-ink">{formatPrice(v.price)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
