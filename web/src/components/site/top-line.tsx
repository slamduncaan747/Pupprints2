import { FOUNDING_OFFER, GUARANTEE, HOLIDAY, OFFER, holidayNotice } from "@/lib/offer";
import { FOUNDING, foundingOfferOpen } from "@/lib/launch";
import { TopLineBar, TOP_LINE_ID, TOP_LINE_STORAGE_KEY, type TopLineMessage } from "@/components/site/top-line-bar";

/**
 * The single most compelling real offer right now, in date order. Every line is true when shown:
 * the founding offer until its deadline (the browser swaps it for the next line if the cap is
 * reached first), the Christmas cutoff from Nov 1, Gift Reveal up to Christmas Day, then the
 * standing promise.
 */
function messages(now: number = Date.now()): TopLineMessage[] {
  const list: TopLineMessage[] = [];
  if (foundingOfferOpen(now)) {
    list.push({
      key: "founding-2026",
      kind: "founding",
      short: `${FOUNDING_OFFER.headline}, through ${FOUNDING.deadlineLabel}`,
      long: `${FOUNDING_OFFER.headline} for our first ${FOUNDING.maxRedemptions} orders, through ${FOUNDING.deadlineLabel}`,
      href: "/create",
    });
  }
  // From Nov 1 to the Dec 10 cutoff: the US Christmas cutoff; then Gift Reveal until Christmas Day.
  const holiday = holidayNotice(now, { physical: true, shipCountry: "US" });
  if (holiday) {
    const key = holiday === HOLIDAY.label ? "holiday-2026" : "reveal-2026";
    list.push({ key, kind: "other", short: holiday, long: holiday, href: "/create" });
  }
  list.push({
    key: "promise",
    kind: "other",
    short: `Free preview in about a minute. ${GUARANTEE.short}.`,
    long: OFFER.promise,
    href: "/create",
  });
  return list;
}

/**
 * Slim, dismissible line above the header. Rendered on the server (pages revalidate hourly, so the
 * message moves on with the calendar); a tiny inline script hides it before first paint for anyone
 * who already dismissed this exact message, so there is no flash and no layout shift.
 */
export function TopLine() {
  const [primary, ...rest] = messages();
  const fallback = rest.find((m) => m.kind !== "founding") ?? null;
  const hideIfDismissed = `try{var k=localStorage.getItem(${JSON.stringify(TOP_LINE_STORAGE_KEY)});if(k){var s=document.createElement("style");s.textContent="#${TOP_LINE_ID}[data-key='"+k.replace(/[^a-z0-9-]/gi,"")+"']{display:none}";document.head.appendChild(s)}}catch(e){}`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideIfDismissed }} />
      <TopLineBar primary={primary} fallback={fallback} cta={OFFER.ctaShort} />
    </>
  );
}
