import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { CHANNEL_IDS, addDays, dayKey, isDayKey } from "@/components/admin/scorecard";
import { isMissingTable } from "@/components/admin/scorecard-data";

export const dynamic = "force-dynamic";

const Day = z.string().refine(isDayKey, "Invalid day");
const Channel = z.enum(CHANNEL_IDS);

const Body = z.discriminatedUnion("op", [
  // +N / -N from the quick buttons (atomic in the database).
  z.object({
    op: z.literal("bump"),
    day: Day,
    channel: Channel,
    delta: z
      .number()
      .int()
      .min(-100)
      .max(100)
      .refine((n) => n !== 0, "delta must not be 0"),
  }),
  // Absolute values: typed count corrections, notes, ad spend.
  z.object({
    op: z.literal("set"),
    day: Day,
    channel: Channel,
    count: z.number().int().min(0).max(100_000).optional(),
    notes: z.string().max(500).optional(),
    adSpendCents: z.number().int().min(0).max(100_000_000).optional(),
  }),
]);

const MISSING = "The daily_actions table doesn't exist yet. Apply supabase/migrations/0006_daily_actions.sql.";

/** Log Rule-of-100 actions for a day (admin timezone). */
export async function POST(req: Request) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const c = db();
  if (!c) return jsonError("Database not configured", 503);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");
  const input = parsed.data;
  const today = dayKey();
  if (input.day > addDays(today, 1) || input.day < addDays(today, -366)) return jsonError("Pick a day within the last year");

  if (input.op === "bump") {
    const { data, error } = await c.rpc("bump_daily_action", { p_day: input.day, p_channel: input.channel, p_delta: input.delta });
    if (error) return jsonError(isMissingTable(error) || error.code === "PGRST202" ? MISSING : error.message, 500);
    return NextResponse.json({ ok: true, count: Number(data ?? 0) }, { headers: { "cache-control": "no-store" } });
  }

  const patch: Record<string, unknown> = { day: input.day, channel: input.channel, updated_at: new Date().toISOString() };
  if (input.count !== undefined) patch.count = input.count;
  if (input.notes !== undefined) patch.notes = input.notes.trim() || null;
  if (input.adSpendCents !== undefined) patch.ad_spend_cents = input.adSpendCents;
  if (Object.keys(patch).length === 3) return jsonError("Nothing to save");

  const { data, error } = await c
    .from("daily_actions")
    .upsert(patch, { onConflict: "day,channel" })
    .select("count, notes, ad_spend_cents")
    .single<{ count: number; notes: string | null; ad_spend_cents: number }>();
  if (error || !data) return jsonError(isMissingTable(error) ? MISSING : (error?.message ?? "Save failed"), 500);
  return NextResponse.json(
    { ok: true, count: data.count, notes: data.notes ?? "", adSpendCents: data.ad_spend_cents },
    { headers: { "cache-control": "no-store" } },
  );
}
