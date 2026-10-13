import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { PartnerCreate, partnerPatchFrom } from "@/components/admin/partner-schema";
import { profileUrlFor } from "@/components/partners/program";

export const dynamic = "force-dynamic";

/** Create a partner (CRM row). */
export async function POST(req: Request) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON");
  }
  const parsed = PartnerCreate.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");

  const row = partnerPatchFrom(body, parsed.data);
  row.status = parsed.data.status;
  if (!row.name && !row.handle && !row.email) return jsonError("Add at least a name, handle or email");
  if (!row.profile_url && row.platform && row.handle) row.profile_url = profileUrlFor(String(row.platform), String(row.handle));
  if (!row.source) row.source = "manual";

  const c = db();
  if (!c) return jsonError("Database not configured", 503);
  const { data, error } = await c.from("partners").insert(row).select("*").single();
  if (error?.code === "23505") {
    return jsonError(
      error.message.includes("code") ? "That code is already in use" : "A partner with this platform + handle already exists",
      409,
    );
  }
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true, partner: data });
}
