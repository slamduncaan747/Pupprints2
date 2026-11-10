import type { ReactNode } from "react";
import { HOLIDAY } from "@/lib/offer";
import { STARTING_PHYSICAL_PRICE, STARTING_PRICE } from "@/lib/catalog";
import { site } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

/** The one call to action and the prices that sit beside it. Every screen leads to /create. */

/** True until the US Christmas shipping cutoff (HOLIDAY.cutoffIso) has passed. */
export function beforeHolidayCutoff(now: number = Date.now()) {
  return now < Date.parse(HOLIDAY.cutoffIso);
}

/** "From $35": the lowest physical price, straight from the catalog. */
export const FROM_PRICE = `From ${formatPrice(STARTING_PHYSICAL_PRICE)}`;
export const FROM_ANY_PRICE = `From ${formatPrice(STARTING_PRICE)}`;

/**
 * The primary call to action: one black button to /create and nothing else, unless a page passes a
 * factual `note` (a date, a price). The button runs full width on phones.
 */
export function OfferCta({
  href = "/create",
  label = site.cta,
  note,
  align = "start",
  inline = false,
  tone = "light",
  className,
}: {
  href?: string;
  label?: string;
  note?: ReactNode;
  align?: "start" | "center";
  inline?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-stretch text-left sm:items-start",
        inline && "sm:flex-row sm:items-center sm:gap-7",
        inline && align === "center" && "sm:justify-center",
        className,
      )}
    >
      <ButtonLink href={href} size="lg" variant={tone === "dark" ? "light" : "primary"} className="w-full sm:w-auto">
        {label}
      </ButtonLink>
      {note && <p className={cn("label", tone === "dark" ? "text-paper/70" : "text-ink-3")}>{note}</p>}
    </div>
  );
}
