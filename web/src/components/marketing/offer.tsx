import Link from "next/link";
import type { ReactNode } from "react";
import { FOUNDING_OFFER, GUARANTEE, HOLIDAY, OFFER, VALUE_STACK } from "@/lib/offer";
import { foundingOfferOpen } from "@/lib/launch";
import { STARTING_PHYSICAL_PRICE, STARTING_PRICE } from "@/lib/catalog";
import { ButtonLink } from "@/components/ui/button";
import { FoundingGate, FoundingRemaining } from "@/components/marketing/offer-status";
import { cn, formatPrice } from "@/lib/utils";

/**
 * The Grand Slam Offer, set in the maison's type: hairline value stack, the guarantee, the founding
 * line and the effort line under every primary CTA. All offer copy comes from @/lib/offer.
 */

/** True until the US Christmas shipping cutoff (HOLIDAY.cutoffIso) has passed. */
export function beforeHolidayCutoff(now: number = Date.now()) {
  return now < Date.parse(HOLIDAY.cutoffIso);
}

/** Keeps hyphenated words whole in large display type ("Love-It" never breaks after the hyphen). */
export function keepHyphenated(text: string): ReactNode {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    /\S+-\S+/.test(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** The guarantee's name mid-sentence: "covered by the Love-It Guarantee". */
export const GUARANTEE_IN_SENTENCE = GUARANTEE.name.replace(/^The\s+/, "the ");

/** The effort lever, said plainly under every primary call to action. */
export const EFFORT_LINE = "No account. No card. About a minute.";

/** "From $35": the lowest physical price, straight from the catalog. */
export const FROM_PRICE = `From ${formatPrice(STARTING_PHYSICAL_PRICE)}`;
export const FROM_ANY_PRICE = `From ${formatPrice(STARTING_PRICE)}`;

/**
 * The primary call to action: one black button to /create, the effort line beneath it (or beside it
 * with `inline`, from tablet up). The button runs full width on phones.
 */
export function OfferCta({
  href = "/create",
  label = OFFER.cta,
  note = EFFORT_LINE,
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

/**
 * Everything included, as a hairline list: the item on the left, its value on the right. Ends with an
 * optional total row (e.g. "Your price · From $35").
 */
export function ValueStack({
  items = VALUE_STACK,
  total,
  className,
}: {
  items?: { item: string; value: string }[];
  total?: { label: ReactNode; value: ReactNode };
  className?: string;
}) {
  return (
    <dl className={cn("border-t border-ink", className)}>
      {items.map((row) => (
        <div key={row.item} className="flex items-baseline justify-between gap-6 border-b border-line py-4 sm:py-[18px]">
          <dt className="min-w-0 text-[15px] leading-snug text-ink">{row.item}</dt>
          <dd className="label shrink-0 text-right text-ink-2">{row.value}</dd>
        </div>
      ))}
      {total && (
        <div className="flex items-baseline justify-between gap-6 border-b border-ink py-5">
          <dt className="label text-ink">{total.label}</dt>
          <dd className="label shrink-0 text-right tabular-nums text-ink">{total.value}</dd>
        </div>
      )}
    </dl>
  );
}

/** The honest market anchor, in small grey type. */
export function PriceAnchor({ className }: { className?: string }) {
  return <p className={cn("text-[13px] leading-relaxed text-ink-3", className)}>{OFFER.anchor}</p>;
}

/** The guarantee, small: name as a label, the body beneath, a link to the full page. */
export function GuaranteeNote({ className, link = true }: { className?: string; link?: boolean }) {
  return (
    <div className={cn("border-t border-line pt-6", className)}>
      <p className="label text-ink">{GUARANTEE.name}</p>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-2">{GUARANTEE.body}</p>
      {link && (
        <Link href="/guarantee" className="link-cta mt-5 inline-block text-ink">
          The guarantee
        </Link>
      )}
    </div>
  );
}

/**
 * The Founding 100 line with the live count when the API has a real one. Renders nothing once the
 * offer has closed (deadline on the server, cap or deadline in the browser).
 */
export function FoundingLine({
  className,
  tone = "light",
  showHeadline = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  showHeadline?: boolean;
}) {
  if (!foundingOfferOpen()) return null;
  return (
    <FoundingGate>
      <div className={cn("text-[14px] leading-relaxed", tone === "dark" ? "text-paper/80" : "text-ink-2", className)}>
        {showHeadline && (
          <p className={cn("label mb-2", tone === "dark" ? "text-paper" : "text-ink")}>{FOUNDING_OFFER.headline}</p>
        )}
        <p>
          {FOUNDING_OFFER.line}{" "}
          <FoundingRemaining className={cn("label whitespace-nowrap", tone === "dark" ? "text-paper" : "text-ink")} />
        </p>
      </div>
    </FoundingGate>
  );
}
