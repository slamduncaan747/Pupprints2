import { SHIPPING_RATES } from "@/lib/catalog";
import { site } from "@/lib/config";
import { GIFT_TWO, HOLIDAY, giftTwoActive, holidayNotice } from "@/lib/offer";
import { TopLineBar, type TopLineMessage } from "@/components/site/top-line-bar";
import { TOP_LINE_ID, TOP_LINE_STORAGE_KEY } from "@/components/site/top-line-keys";

/**
 * One plain, factual line, in date order, or none. Every line is true when shown: the dated "two
 * portraits, two ornaments" offer (Nov 1 to Dec 10, driven by @/lib/offer), then the US Christmas
 * order-by date until it passes, otherwise free US shipping while the catalog really charges $0.
 */
function message(now: number = Date.now()): TopLineMessage | null {
  // Nov 1–Dec 10: two portraits, two ornaments on us (it ends with the US Christmas cutoff).
  if (giftTwoActive(now)) {
    return { key: "gift-two-2026", short: GIFT_TWO.short, long: `${GIFT_TWO.short}. ${HOLIDAY.label}.`, href: "/create" };
  }
  // Up to the Dec 10 cutoff: the US Christmas order-by date. Nothing after it.
  if (holidayNotice(now, { physical: true, shipCountry: "US" }) === HOLIDAY.label) {
    return { key: "holiday-2026", short: HOLIDAY.label, long: HOLIDAY.label, href: "/create" };
  }
  if (SHIPPING_RATES.US !== 0) return null;
  return { key: "free-us-shipping", short: "Free US shipping", long: "Free US shipping on every order", href: "/create" };
}

/**
 * Slim, dismissible line above the header. Rendered on the server (pages revalidate hourly, so the
 * message moves on with the calendar); a tiny inline script hides it before first paint for anyone
 * who already dismissed this exact message, so there is no flash and no layout shift.
 */
export function TopLine() {
  const current = message();
  if (!current) return null;
  const hideIfDismissed = `try{var k=localStorage.getItem(${JSON.stringify(TOP_LINE_STORAGE_KEY)});if(k){var s=document.createElement("style");s.textContent="#${TOP_LINE_ID}[data-key='"+k.replace(/[^a-z0-9-]/gi,"")+"']{display:none}";document.head.appendChild(s)}}catch(e){}`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideIfDismissed }} />
      <TopLineBar message={current} cta={site.cta} />
    </>
  );
}
