import { timingSafeEqual } from "node:crypto";
import { getOrderByExternalId, printfulConfigured, type PfShipment } from "@/lib/fulfillment/printful";
import { appendNote, sendShippedEmail, updateOrder, type OrderRow } from "@/lib/orders";
import { db } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretMatches(got: string) {
  const expected = process.env.PRINTFUL_WEBHOOK_SECRET ?? "";
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

type PrintfulEvent = {
  type?: string;
  data?: {
    reason?: string;
    shipment?: Partial<PfShipment>;
    order?: { id?: number; external_id?: string | null; status?: string };
  };
};

const ok = () => Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });

/**
 * Printful v1 webhook. v1 payloads are unsigned, so the URL carries a secret path segment
 * (PRINTFUL_WEBHOOK_SECRET) and we re-fetch the order from the Printful API before acting.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/webhooks/printful/[secret]">) {
  const { secret } = await ctx.params;
  if (!secretMatches(secret)) return Response.json({ error: "forbidden" }, { status: 403 });

  let event: PrintfulEvent;
  try {
    event = (await req.json()) as PrintfulEvent;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const externalId = event.data?.order?.external_id;
  const c = db();
  if (!externalId || !c || !printfulConfigured()) return ok();

  try {
    // Source of truth: Printful's API, not the (unsigned) payload.
    const pfOrder = await getOrderByExternalId(externalId);
    if (!pfOrder) return ok();
    const { data: order } = await c.from("orders").select("*").eq("order_number", externalId).maybeSingle<OrderRow>();
    if (!order) return ok();
    if (order.fulfillment_order_id && String(pfOrder.id) !== order.fulfillment_order_id) {
      await appendNote(order.id, `Printful webhook for unexpected order #${pfOrder.id}; ignored.`);
      return ok();
    }

    switch (event.type) {
      case "package_shipped": {
        const claimed = event.data?.shipment;
        const shipments = pfOrder.shipments ?? [];
        const shipment = shipments.find((s) => claimed?.id && s.id === claimed.id) ?? shipments[shipments.length - 1];
        if (!shipment) {
          await appendNote(order.id, "Printful reported a shipment but the order has none yet.");
          return ok();
        }
        const updated = await updateOrder(order.id, {
          status: order.status === "delivered" ? "delivered" : "shipped",
          fulfillment_status: pfOrder.status,
          tracking_number: String(shipment.tracking_number ?? ""),
          tracking_url: shipment.tracking_url || null,
          carrier: shipment.carrier || null,
        });
        if (updated) await sendShippedEmail(updated);
        return ok();
      }
      case "order_failed":
      case "order_put_hold":
      case "order_put_hold_approval": {
        const reason = event.data?.reason ? `: ${event.data.reason}` : "";
        await updateOrder(order.id, { status: "needs_attention", fulfillment_status: pfOrder.status });
        await appendNote(order.id, `Printful ${event.type.replace(/_/g, " ")}${reason}`);
        return ok();
      }
      case "order_remove_hold":
        await updateOrder(order.id, {
          fulfillment_status: pfOrder.status,
          ...(order.status === "needs_attention" ? { status: "in_production" as const } : {}),
        });
        await appendNote(order.id, "Printful removed the hold.");
        return ok();
      case "order_canceled":
      case "order_refunded":
      case "package_returned":
        await updateOrder(order.id, { status: "needs_attention", fulfillment_status: pfOrder.status });
        await appendNote(order.id, `Printful ${event.type.replace(/_/g, " ")}${event.data?.reason ? `: ${event.data.reason}` : ""}`);
        return ok();
      default:
        await updateOrder(order.id, { fulfillment_status: pfOrder.status });
        return ok();
    }
  } catch (err) {
    console.error("[printful-webhook] failed", event.type, err);
    return Response.json({ error: "handler_failed" }, { status: 500 });
  }
}
