import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { hasPhysical, itemsOf, orderShipDays, type OrderRow } from "@/lib/orders";
import { buildTimeline, computeEta, formatArrival, STATUS_COPY } from "@/components/order/timeline";
import { normalizeOrderNumber, type TrackResponse } from "@/components/order/track";
import { escapeLike } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  orderNumber: z.string().trim().min(3).max(24),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
});

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Order lookup for /track: needs the order number AND the email used at checkout. */
export async function POST(req: Request) {
  let input: z.infer<typeof Body>;
  try {
    input = Body.parse(await req.json());
  } catch {
    return json({ error: "invalid_request", message: "Please enter your order number and email." }, 400);
  }
  const orderNumber = normalizeOrderNumber(input.orderNumber);
  const c = db();
  if (!c) return json({ error: "unavailable", message: "Order tracking is temporarily unavailable." }, 503);
  const notFound = () =>
    json({ error: "not_found", message: "We couldn't find an order with that number and email. Check your confirmation email, or contact us." }, 404);
  if (!orderNumber) return notFound();

  const { data: order } = await c
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .ilike("email", escapeLike(input.email))
    .maybeSingle<OrderRow>();
  if (!order || order.status === "pending") return notFound();

  const physical = hasPhysical(order);
  const copy = STATUS_COPY[order.status] ?? STATUS_COPY.paid;
  const eta = physical ? computeEta(new Date(order.created_at), orderShipDays(order), order.ship_country) : null;
  const res: TrackResponse = {
    orderNumber: order.order_number,
    status: order.status,
    title: physical ? copy.title : "Digital portrait",
    body: physical ? copy.body : "Your hi-res file is in your confirmation email. Reply to it if you need a fresh link.",
    placedAt: order.created_at,
    arrival: eta && ["paid", "in_production", "shipped", "needs_attention"].includes(order.status) ? formatArrival(eta) : null,
    hasPhysical: physical,
    items: itemsOf(order).map((i) => ({ label: i.label, quantity: i.quantity, styleName: i.styleName })),
    timeline: buildTimeline({
      status: order.status,
      orderedAt: new Date(order.created_at),
      shipDays: orderShipDays(order),
      country: order.ship_country,
      hasPhysical: physical,
      carrier: order.carrier,
    }),
    tracking:
      order.tracking_url || order.tracking_number
        ? { url: order.tracking_url, number: order.tracking_number, carrier: order.carrier }
        : null,
  };
  return json(res);
}
