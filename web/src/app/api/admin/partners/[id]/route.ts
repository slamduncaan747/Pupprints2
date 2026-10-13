import { after, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { syncPartnerPromo, uniquePartnerCode } from "@/lib/partners";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { PartnerPatch, partnerPatchFrom } from "@/components/admin/partner-schema";

export const dynamic = "force-dynamic";

/**
 * Update a partner. Body is either a partial set of fields, or an action:
 *   { action: "generate_code" } – assign a unique BELLA15-style code
 *   { action: "log_contact" }   – stamp last_contacted_at (prospect → contacted)
 */
export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/partners/[id]">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success) return jsonError("Invalid partner id");
  const c = db();
  if (!c) return jsonError("Database not configured", 503);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON");
  }

  const now = new Date().toISOString();
  let patch: Record<string, unknown>;
  let previousCode: string | null = null;

  if (body.action === "generate_code" || body.action === "log_contact") {
    const { data: current, error } = await c
      .from("partners")
      .select("id, name, handle, status, discount_percent, code")
      .eq("id", id)
      .maybeSingle();
    if (error) return jsonError(error.message, 500);
    if (!current) return jsonError("Partner not found", 404);
    previousCode = current.code ?? null;
    if (body.action === "generate_code") {
      const seed = current.handle || current.name || "PUP";
      patch = { code: await uniquePartnerCode(seed, Number(current.discount_percent ?? 15), id) };
    } else {
      patch = { last_contacted_at: now };
      if (current.status === "prospect") patch.status = "contacted";
    }
  } else {
    const parsed = PartnerPatch.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");
    patch = partnerPatchFrom(body, parsed.data);
    if (Object.keys(patch).length === 0) return jsonError("Nothing to update");
    if ("code" in patch) {
      const { data: prev } = await c.from("partners").select("code").eq("id", id).maybeSingle<{ code: string | null }>();
      previousCode = prev?.code ?? null;
    }
  }

  patch.updated_at = now;
  const { data, error } = await c.from("partners").update(patch).eq("id", id).select("*").maybeSingle();
  if (error?.code === "23505") {
    return jsonError(
      error.message.includes("code") ? "That code is already in use" : "Another partner already has this platform + handle",
      409,
    );
  }
  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Partner not found", 404);
  // Keep the typeable Stripe promotion code (e.g. RUFUS15) in step with code/status/discount.
  if ("code" in patch || "status" in patch || "discount_percent" in patch) {
    const partner = data as { code: string | null; status: string; discount_percent: number | null };
    after(() => syncPartnerPromo(partner, "code" in patch ? previousCode : null));
  }
  return NextResponse.json({ ok: true, partner: data });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/partners/[id]">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success) return jsonError("Invalid partner id");
  const c = db();
  if (!c) return jsonError("Database not configured", 503);
  const { error } = await c.from("partners").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}
