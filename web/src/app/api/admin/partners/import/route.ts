import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { parseCsv, parseFollowers } from "@/components/admin/csv";
import { PLATFORMS, cleanHandle, profileUrlFor, tierForFollowers } from "@/components/partners/program";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COLUMNS = ["name", "handle", "platform", "profile_url", "followers", "niche", "email", "notes"] as const;
const PLATFORM_ALIASES: Record<string, string> = {
  ig: "instagram",
  insta: "instagram",
  tt: "tiktok",
  "tik tok": "tiktok",
  yt: "youtube",
  pin: "pinterest",
  fb: "facebook",
};
const MAX_ROWS = 2000;

type ExistingRow = { id: string; platform: string | null; handle: string | null };

/**
 * Bulk CSV import of researched creators. Columns (header row required, any order):
 * name,handle,platform,profile_url,followers,niche,email,notes
 * Upserts on (platform, lower(handle)): new rows get status prospect + source research;
 * existing rows only get the non-empty fields from the CSV (status/source untouched).
 */
export async function POST(req: Request) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const c = db();
  if (!c) return jsonError("Database not configured", 503);

  let csvText = "";
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) {
      const body = (await req.json()) as { csv?: unknown };
      csvText = typeof body.csv === "string" ? body.csv : "";
    } else if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      csvText = file instanceof File ? await file.text() : String(form.get("csv") ?? "");
    } else {
      csvText = await req.text();
    }
  } catch {
    return jsonError("Could not read the CSV");
  }
  if (!csvText.trim()) return jsonError("The CSV is empty");
  if (csvText.length > 2_000_000) return jsonError("CSV too large (max 2 MB)", 413);

  const rows = parseCsv(csvText);
  const header = (rows.shift() ?? []).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const idx = Object.fromEntries(COLUMNS.map((col) => [col, header.indexOf(col)])) as Record<(typeof COLUMNS)[number], number>;
  if (idx.handle < 0 || idx.platform < 0) return jsonError("CSV needs at least 'handle' and 'platform' columns");
  if (rows.length > MAX_ROWS) return jsonError(`Too many rows (max ${MAX_ROWS})`, 413);

  // Load existing (platform, handle) keys once.
  const existing = new Map<string, string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await c.from("partners").select("id, platform, handle").range(from, from + 999);
    if (error) return jsonError(error.message, 500);
    for (const r of (data ?? []) as ExistingRow[]) {
      if (r.handle) existing.set(`${r.platform ?? ""}|${r.handle.toLowerCase()}`, r.id);
    }
    if (!data || data.length < 1000) break;
  }

  const result = { inserted: 0, updated: 0, skipped: 0, errors: [] as { line: number; error: string }[] };
  const inserts: Record<string, unknown>[] = [];
  const insertLines: number[] = [];
  const updates: { id: string; line: number; patch: Record<string, unknown> }[] = [];
  const seen = new Set<string>();
  const now = new Date().toISOString();

  rows.forEach((cells, i) => {
    const line = i + 2;
    if (cells.every((v) => !v.trim())) return;
    const get = (col: (typeof COLUMNS)[number]) => (idx[col] >= 0 ? (cells[idx[col]] ?? "").trim() : "");
    const handle = cleanHandle(get("handle"));
    let platform = get("platform").toLowerCase();
    platform = PLATFORM_ALIASES[platform] ?? platform;
    if (!handle || !platform) {
      result.skipped++;
      result.errors.push({ line, error: "missing handle or platform" });
      return;
    }
    if (!(PLATFORMS as readonly string[]).includes(platform) && !/^[a-z0-9 _-]{2,30}$/.test(platform)) {
      result.skipped++;
      result.errors.push({ line, error: `unknown platform "${platform}"` });
      return;
    }
    const key = `${platform}|${handle.toLowerCase()}`;
    if (seen.has(key)) {
      result.skipped++;
      result.errors.push({ line, error: "duplicate of an earlier row" });
      return;
    }
    seen.add(key);

    const followers = parseFollowers(get("followers"));
    const email = get("email").toLowerCase();
    const profileUrl = get("profile_url");
    const fields: Record<string, unknown> = {
      name: get("name").slice(0, 120) || null,
      profile_url: /^https?:\/\//i.test(profileUrl) ? profileUrl.slice(0, 500) : null,
      followers,
      tier: tierForFollowers(followers),
      niche: get("niche").slice(0, 120) || null,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.slice(0, 254) : null,
      notes: get("notes").slice(0, 5000) || null,
    };

    const id = existing.get(key);
    if (id) {
      const patch = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== null && v !== ""));
      updates.push({ id, line, patch: { ...patch, updated_at: now } });
    } else {
      inserts.push({
        ...fields,
        handle,
        platform,
        profile_url: fields.profile_url ?? profileUrlFor(platform, handle),
        status: "prospect",
        source: "research",
      });
      insertLines.push(line);
    }
  });

  for (let i = 0; i < inserts.length; i += 500) {
    const chunk = inserts.slice(i, i + 500);
    const { error } = await c.from("partners").insert(chunk);
    if (!error) {
      result.inserted += chunk.length;
      continue;
    }
    // Fall back to row-by-row so one bad row doesn't sink the batch.
    for (let j = 0; j < chunk.length; j++) {
      const { error: rowErr } = await c.from("partners").insert(chunk[j]);
      if (rowErr) result.errors.push({ line: insertLines[i + j], error: rowErr.message });
      else result.inserted++;
    }
  }

  const queue = [...updates];
  await Promise.all(
    Array.from({ length: 5 }, async () => {
      for (let u = queue.shift(); u; u = queue.shift()) {
        const { error } = await c.from("partners").update(u.patch).eq("id", u.id);
        if (error) result.errors.push({ line: u.line, error: error.message });
        else result.updated++;
      }
    }),
  );

  result.errors.sort((a, b) => a.line - b.line);
  return NextResponse.json({ ok: true, ...result, errors: result.errors.slice(0, 50) });
}
