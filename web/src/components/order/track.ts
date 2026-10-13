import type { OrderStatus, TimelineStep } from "./timeline";

/** "10241", "pp10241", "#PP-10241" → "PP-10241" */
export function normalizeOrderNumber(input: string): string | null {
  const digits = input.replace(/[^0-9]/g, "");
  return digits.length >= 3 && digits.length <= 12 ? `PP-${digits}` : null;
}

/** Response of POST /api/track. */
export type TrackResponse = {
  orderNumber: string;
  status: OrderStatus;
  title: string;
  body: string;
  placedAt: string;
  arrival: string | null;
  hasPhysical: boolean;
  items: { label: string; quantity: number; styleName: string }[];
  timeline: TimelineStep[];
  tracking: { url: string | null; number: string | null; carrier: string | null } | null;
};
