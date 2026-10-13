/**
 * Pure order-timeline helpers shared by the success page, /track and emails.
 * Safe to import on client and server (no secrets, no DB).
 */

export type OrderStatus =
  | "pending"
  | "paid"
  | "in_production"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded"
  | "needs_attention";

/** Extra transit days for Canada on top of the catalog's US production + shipping estimate. */
export const COUNTRY_EXTRA_DAYS: Record<string, [number, number]> = { US: [0, 0], CA: [2, 4] };

export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  let left = Math.max(0, Math.round(days));
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) left--;
  }
  return d;
}

export function formatDay(d: Date, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "America/New_York" }).format(d);
}

export function shipWindow(shipDays: [number, number], country?: string | null): [number, number] {
  const extra = COUNTRY_EXTRA_DAYS[country ?? "US"] ?? [3, 6];
  return [shipDays[0] + extra[0], shipDays[1] + extra[1]];
}

export type Eta = {
  checkedBy: Date;
  printedBy: Date;
  arriveFrom: Date;
  arriveTo: Date;
};

/** Delivery estimate from the order date: checked within 1 business day, printed within ~4. */
export function computeEta(orderedAt: Date, shipDays: [number, number], country?: string | null): Eta {
  const [min, max] = shipWindow(shipDays, country);
  return {
    checkedBy: addBusinessDays(orderedAt, 1),
    printedBy: addBusinessDays(orderedAt, Math.max(2, Math.min(4, min - 1))),
    arriveFrom: addBusinessDays(orderedAt, min),
    arriveTo: addBusinessDays(orderedAt, max),
  };
}

export function formatArrival(eta: Eta) {
  return `${formatDay(eta.arriveFrom, { month: "short", day: "numeric" })} – ${formatDay(eta.arriveTo, { month: "short", day: "numeric" })}`;
}

export type StepState = "done" | "current" | "upcoming";
export type TimelineStep = { key: string; label: string; detail: string; state: StepState };

const ORDER: OrderStatus[] = ["paid", "in_production", "shipped", "delivered"];

/**
 * The customer-facing journey. "Checked by hand" is complete once an order is approved
 * for production (in_production or later).
 */
export function buildTimeline(input: {
  status: OrderStatus | string;
  orderedAt: Date;
  shipDays: [number, number];
  country?: string | null;
  hasPhysical: boolean;
  carrier?: string | null;
}): TimelineStep[] {
  const status = input.status as OrderStatus;
  const placed = { key: "placed", label: "Order placed", detail: formatDay(input.orderedAt), state: "done" as StepState };

  if (!input.hasPhysical) {
    const ready = status !== "pending";
    return [
      placed,
      {
        key: "digital",
        label: "Your digital portrait",
        detail: ready ? "Ready to download" : "Waiting for payment confirmation",
        state: ready ? "done" : "current",
      },
    ];
  }

  const eta = computeEta(input.orderedAt, input.shipDays, input.country);
  const idx = Math.max(-1, ORDER.indexOf(status));
  const state = (stepIdx: number): StepState => (idx > stepIdx ? "done" : idx === stepIdx ? "current" : "upcoming");

  if (status === "pending") {
    return [
      { ...placed, detail: "Waiting for payment confirmation", state: "current" },
      { key: "checked", label: "Checked by our team", detail: "Every portrait is checked by a person", state: "upcoming" },
      { key: "printed", label: "Printed & finished", detail: "Usually 2–4 business days", state: "upcoming" },
      { key: "shipped", label: "Shipped with tracking", detail: `Arrives ${formatArrival(eta)}`, state: "upcoming" },
    ];
  }

  const attention = status === "needs_attention";
  return [
    placed,
    {
      key: "checked",
      label: "Checked by our team",
      detail: attention
        ? "We're taking a closer look and will email you if we need anything"
        : idx >= 1
          ? "Approved for printing"
          : `By ${formatDay(eta.checkedBy)}`,
      state: attention ? "current" : idx >= 1 ? "done" : "current",
    },
    {
      key: "printed",
      label: "Printed & finished",
      detail: idx >= 2 ? "Done" : `Expected by ${formatDay(eta.printedBy)}`,
      state: attention ? "upcoming" : idx >= 2 ? "done" : state(1) === "current" ? "current" : "upcoming",
    },
    {
      key: "shipped",
      label: idx >= 2 ? `Shipped${input.carrier ? ` via ${input.carrier}` : ""}` : "Shipped with tracking",
      detail: idx >= 3 ? "Delivered" : `Arrives ${formatArrival(eta)}`,
      state: attention ? "upcoming" : state(2) === "current" ? "current" : idx >= 3 ? "done" : "upcoming",
    },
  ];
}

export const STATUS_COPY: Record<OrderStatus, { title: string; body: string }> = {
  pending: { title: "Awaiting payment", body: "We haven't received payment confirmation for this order yet." },
  paid: { title: "Order received", body: "Your portrait is in line to be checked by our team before it's printed." },
  in_production: { title: "Being made", body: "Checked and approved. Your piece is being printed and finished now." },
  shipped: { title: "On its way", body: "Your order has shipped. Use the tracking link for live updates." },
  delivered: { title: "Delivered", body: "Your order has been delivered. We hope it gets the gasp." },
  canceled: { title: "Canceled", body: "This order was canceled. Questions? Just reply to any of our emails." },
  refunded: { title: "Refunded", body: "This order was refunded. Refunds take 5–10 business days to show on your statement." },
  needs_attention: {
    title: "Getting extra care",
    body: "We're taking a closer look at your order and will email you if we need anything.",
  },
};
