import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { ORDER_STATUSES } from "@/components/admin/constants";

export const dynamic = "force-dynamic";

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v ? v : null));

const Patch = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    tracking_number: text(120),
    tracking_url: z
      .string()
      .trim()
      .max(500)
      .nullish()
      .refine((v) => !v || /^https?:\/\//i.test(v), "Tracking URL must start with http(s)://")
      .transform((v) => (v ? v : null)),
    carrier: text(60),
    fulfillment_status: text(60),
    notes: text(5000),
  })
  .partial();

/** Update an order's status, tracking and notes. */
export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success) return jsonError("Invalid order id");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON");
  }
  const parsed = Patch.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");

  // Only send keys that were present in the request.
  const raw = body as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(parsed.data)) if (k in raw) patch[k] = v;
  if (Object.keys(patch).length === 0) return jsonError("Nothing to update");

  const c = db();
  if (!c) return jsonError("Database not configured", 503);
  patch.updated_at = new Date().toISOString();
  const { data, error } = await c.from("orders").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Order not found", 404);
  return NextResponse.json({ ok: true, order: data });
}
