import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";

export const dynamic = "force-dynamic";

const Patch = z.object({ handled: z.boolean() });

/** Mark a contact message handled / unhandled. */
export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success) return jsonError("Invalid message id");
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON");
  }
  const parsed = Patch.safeParse(body);
  if (!parsed.success) return jsonError("Body must be { handled: boolean }");
  const c = db();
  if (!c) return jsonError("Database not configured", 503);
  const { data, error } = await c
    .from("contact_messages")
    .update({ handled: parsed.data.handled })
    .eq("id", id)
    .select("id, handled")
    .maybeSingle();
  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Message not found", 404);
  return NextResponse.json({ ok: true, message: data });
}
