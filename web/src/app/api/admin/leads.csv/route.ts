import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { csvCell } from "@/components/admin/csv";
import { fetchAll } from "@/components/admin/queries";

export const dynamic = "force-dynamic";

type Lead = {
  created_at: string;
  email: string;
  source: string | null;
  pet_name: string | null;
  generation_id: string | null;
  referral_code: string | null;
  utm: Record<string, string> | null;
  consent: boolean;
  unsubscribed_at: string | null;
};

const HEADER = [
  "email",
  "created_at",
  "source",
  "pet_name",
  "generation_id",
  "referral_code",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "consent",
  "unsubscribed_at",
];

/** All leads as CSV (newest first). */
export async function GET() {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const c = db();
  if (!c) return jsonError("Database not configured", 503);

  let leads: Lead[];
  try {
    leads = await fetchAll<Lead>(
      (from, to) =>
        c
          .from("leads")
          .select("created_at, email, source, pet_name, generation_id, referral_code, utm, consent, unsubscribed_at")
          .order("created_at", { ascending: false })
          .range(from, to),
      100_000,
    );
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Export failed", 500);
  }

  const lines = [HEADER.join(",")];
  for (const l of leads) {
    lines.push(
      [
        l.email,
        l.created_at,
        l.source,
        l.pet_name,
        l.generation_id,
        l.referral_code,
        l.utm?.utm_source,
        l.utm?.utm_medium,
        l.utm?.utm_campaign,
        l.consent,
        l.unsubscribed_at,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const date = new Date().toISOString().slice(0, 10);
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="pupprints-leads-${date}.csv"`,
      "cache-control": "no-store",
    },
  });
}
