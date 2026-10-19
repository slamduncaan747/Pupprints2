import { SHIPPING_RATES } from "@/lib/catalog";
import { GIFT_TWO, HOLIDAY, giftTwoActive, holidayNotice, OFFER } from "@/lib/offer";
import { TopLineBar, type TopLineMessage } from "@/components/site/top-line-bar";
import { TOP_LINE_ID, TOP_LINE_STORAGE_KEY } from "@/components/site/top-line-keys";

/**
 * The single most compelling real message right now, in date order. Every line is true when shown:
 * "two portraits, two ornaments" with the Christmas cutoff (both end Dec 10) from Nov 1, Gift
 * Reveal up to Christmas Day, otherwise the standing promise (free US shipping, free preview).
 */
function message(now: number = Date.now()): TopLineMessage {
  // Nov 1–Dec 10: two portraits, two ornaments on us (it ends with the US Christmas cutoff).
  if (giftTwoActive(now)) {
    return { key: "gift-two-2026", short: GIFT_TWO.short, long: `${GIFT_TWO.short}. ${HOLIDAY.label}.`, href: "/create" };
  }
  // From Nov 1 to the Dec 10 cutoff: the US Christmas cutoff; then Gift Reveal until Christmas Day.
  const holiday = holidayNotice(now, { physical: true, shipCountry: "US" });
  if (holiday) {
    return { key: holiday === HOLIDAY.label ? "holiday-2026" : "reveal-2026", short: holiday, long: holiday, href: "/create" };
  }
  // The standing promise. "Free US shipping" only while the catalog really charges $0 for it.
  // Phones: no-break spaces keep each phrase whole, so a wrap falls at the dot.
  const freeShipping = SHIPPING_RATES.US === 0;
  const keep = (t: string) => t.replace(/ /g, "\u00a0");
  return {
    key: "shipping-preview",
    short: `${freeShipping ? `${keep("Free US shipping")} · ` : ""}${keep("See it free before you pay")}`,
    long: `${freeShipping ? "Free US shipping · " : ""}See your portrait free before you pay`,
    href: "/create",
  };
}

/**
 * Slim, dismissible line above the header. Rendered on the server (pages revalidate hourly, so the
 * message moves on with the calendar); a tiny inline script hides it before first paint for anyone
 * who already dismissed this exact message, so there is no flash and no layout shift.
 */
export function TopLine() {
  const current = message();
  const hideIfDismissed = `try{var k=localStorage.getItem(${JSON.stringify(TOP_LINE_STORAGE_KEY)});if(k){var s=document.createElement("style");s.textContent="#${TOP_LINE_ID}[data-key='"+k.replace(/[^a-z0-9-]/gi,"")+"']{display:none}";document.head.appendChild(s)}}catch(e){}`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideIfDismissed }} />
      <TopLineBar message={current} cta={OFFER.ctaShort} />
    </>
  );
}
