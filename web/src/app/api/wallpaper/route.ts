import { cookies } from "next/headers";
import { z } from "zod";
import { features, env } from "@/lib/env";
import { getSessionId } from "@/lib/session";
import { getStyle } from "@/lib/catalog";
import { db } from "@/lib/supabase/server";
import { ensureWallpaper, wallpaperUrl } from "@/lib/wallpaper";
import { escapeLike, normalizeCode } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BODY_BYTES = 4096;
/** Different addresses one portrait can send its wallpaper to per day (keeps it from being a mailer). */
const MAX_LEADS_PER_GENERATION_PER_DAY = 5;

const Body = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  generationId: z.uuid(),
  petName: z.string().trim().max(60).nullish(),
  /** "This portrait is in memory of my dog": nurture skips every offer for this lead. */
  memorial: z.boolean().optional(),
  // Honeypots: real users never fill these.
  website: z.string().max(500).optional(),
  company: z.string().max(500).optional(),
});

type Result = { ok: true; emailed: boolean; url?: string } | { ok: false; error: string; message: string };

function json(body: Result, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
const fail = (error: string, message: string, status: number) => json({ ok: false, error, message }, status);

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function parseUtm(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(safeDecode(raw));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && /^[a-z_]{1,20}$/.test(k)) out[k] = v.slice(0, 100);
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/wallpaper: the Free Phone Portrait lead magnet. For a portrait made in this browser,
 * crops its master to a 1080×1920 wallpaper (no watermark), records the lead
 * (source 'phone_wallpaper') and emails a download link. Without an email provider (or if the
 * send fails) the link is returned to show on screen instead.
 */
export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail("too_large", "That request was too large.", 413);
  let body: z.infer<typeof Body>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return fail("too_large", "That request was too large.", 413);
    const parsed = Body.safeParse(JSON.parse(text));
    if (!parsed.success) {
      const emailIssue = parsed.error.issues.some((i) => i.path[0] === "email");
      return fail("invalid_request", emailIssue ? "Please enter a valid email address." : "Something didn't look right. Please try again.", 400);
    }
    body = parsed.data;
  } catch {
    return fail("invalid_request", "Something didn't look right. Please try again.", 400);
  }
  if (body.website || body.company) return json({ ok: true, emailed: true });

  const c = db();
  if (!c) return fail("unavailable", "This isn't available just now. Please try again later.", 503);

  const sessionId = await getSessionId();
  const { data: gen, error: genError } = await c
    .from("generations")
    .select("id, session_id, status, full_path, pet_name, style, preview_path, memorial")
    .eq("id", body.generationId)
    .maybeSingle<{
      id: string;
      session_id: string | null;
      status: string;
      full_path: string | null;
      pet_name: string | null;
      style: string;
      preview_path: string | null;
      memorial: boolean | null;
    }>();
  if (genError) {
    console.error("[wallpaper] generation lookup failed", genError.message);
    return fail("unavailable", "This isn't available just now. Please try again.", 503);
  }
  if (!gen || gen.status !== "succeeded" || !gen.full_path) {
    return fail("portrait_not_found", "We couldn't find that portrait. Please create it again.", 404);
  }
  if (!sessionId || gen.session_id !== sessionId) {
    return fail("forbidden", "That portrait belongs to a different browser session.", 403);
  }

  // Abuse guard: a portrait can't be used to email lots of different addresses.
  const { count } = await c
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("generation_id", gen.id)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  if ((count ?? 0) >= MAX_LEADS_PER_GENERATION_PER_DAY) {
    return fail("rate_limited", "This portrait has been sent a few times today. Please try again tomorrow.", 429);
  }

  try {
    await ensureWallpaper({ id: gen.id, full_path: gen.full_path });
  } catch (err) {
    console.error("[wallpaper] render failed", gen.id, err instanceof Error ? err.message : err);
    return fail("unavailable", "We couldn't prepare your wallpaper just now. Please try again.", 503);
  }

  const petName = body.petName || gen.pet_name || null;
  const memorial = body.memorial === true || gen.memorial === true;
  await recordLead(body.email, gen.id, petName, memorial).catch((err) => console.error("[wallpaper] lead failed", err));

  const url = wallpaperUrl(gen.id);
  if (!features.email) return json({ ok: true, emailed: false, url });

  const { phoneWallpaperEmail, sendEmail, transactionalCtx, unsubscribeHeaders, unsubscribeUrl } = await import("@/lib/email");
  const ctx = { ...transactionalCtx(), ...(env.businessPostalAddress ? { postalAddress: env.businessPostalAddress } : {}) };
  const rendered = phoneWallpaperEmail({
    ctx,
    petName,
    styleName: getStyle(gen.style)?.name ?? null,
    downloadUrl: url,
    createUrl: `${ctx.siteUrl}/create?step=piece&utm_source=email&utm_medium=lead_magnet&utm_campaign=phone_wallpaper`,
    unsubscribeUrl: unsubscribeUrl(body.email),
  });
  const res = await sendEmail({
    to: body.email,
    ...rendered,
    headers: unsubscribeHeaders(body.email),
    tag: "phone_wallpaper",
    idempotencyKey: `wallpaper-${gen.id}-${body.email}`,
  });
  // If the email can't go out, never leave them empty-handed: show the link.
  return res.ok ? json({ ok: true, emailed: true }) : json({ ok: true, emailed: false, url });
}

/** Upsert the lead on lower(email): first source wins; this portrait becomes their preview. */
async function recordLead(email: string, generationId: string, petName: string | null, memorial: boolean) {
  const c = db()!;
  const store = await cookies();
  const referralCode = normalizeCode(safeDecode(store.get("pp_ref")?.value ?? ""));
  const utm = parseUtm(store.get("pp_utm")?.value);
  type LeadRow = { id: string; referral_code: string | null; utm: unknown };
  const find = async () =>
    (
      await c
        .from("leads")
        .select("id, referral_code, utm")
        .ilike("email", escapeLike(email))
        .limit(1)
        .maybeSingle<LeadRow>()
    ).data;
  const update = async (lead: LeadRow) => {
    const patch: Record<string, unknown> = { generation_id: generationId };
    if (petName) patch.pet_name = petName;
    if (!lead.referral_code && referralCode) patch.referral_code = referralCode;
    if (!lead.utm && utm) patch.utm = utm;
    if (memorial) patch.memorial = true;
    const { error } = await c.from("leads").update(patch).eq("id", lead.id);
    if (error) throw new Error(error.message);
  };
  const existing = await find();
  if (existing) return update(existing);
  const { error } = await c.from("leads").insert({
    email,
    source: "phone_wallpaper",
    pet_name: petName,
    generation_id: generationId,
    referral_code: referralCode,
    utm,
    ...(memorial ? { memorial: true } : {}),
  });
  if (error?.code === "23505") {
    const again = await find();
    if (again) await update(again);
    return;
  }
  if (error) throw new Error(error.message);
}
