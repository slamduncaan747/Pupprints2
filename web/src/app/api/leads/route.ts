import { cookies } from "next/headers";
import { after, NextResponse } from "next/server";
import { z } from "zod";
import { isNewsletterSource, sendWelcomeEmail } from "@/lib/email";
import { features } from "@/lib/env";
import { db } from "@/lib/supabase/server";
import { escapeLike, normalizeCode } from "@/components/partners/program";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;

const Body = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  source: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9][a-z0-9_:./-]*$/i),
  petName: z.string().trim().max(60).nullish(),
  generationId: z.uuid().nullish(),
  // Honeypots: real users never fill these (hidden fields). Bots that do get a fake success.
  website: z.string().max(500).optional(),
  company: z.string().max(500).optional(),
});

const ok = () => NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

type LeadRow = {
  id: string;
  pet_name: string | null;
  generation_id: string | null;
  referral_code: string | null;
  utm: unknown;
};

function parseUtm(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  for (const candidate of [raw, safeDecode(raw)]) {
    try {
      const parsed: unknown = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          if (typeof v === "string" && /^[a-z_]{1,20}$/.test(k)) out[k] = v.slice(0, 100);
        }
        return Object.keys(out).length ? out : null;
      }
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/**
 * Email capture (newsletter, save-my-preview, exit intent…). Upserts on lower(email):
 * the first `source` wins; pet name / generation are updated when provided; first-touch
 * referral + UTM cookies are stored when the lead has none yet.
 */
export async function POST(req: Request) {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) return bad("Payload too large", 413);

  let json: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return bad("Payload too large", 413);
    json = JSON.parse(text);
  } catch {
    return bad("Invalid JSON");
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    const emailIssue = parsed.error.issues.some((i) => i.path[0] === "email");
    return bad(emailIssue ? "Please enter a valid email address." : "Invalid request");
  }
  const { email, source, petName, generationId, website, company } = parsed.data;
  if (website || company) return ok();

  const c = db();
  if (!c) return ok();

  const store = await cookies();
  const referralCode = normalizeCode(safeDecode(store.get("pp_ref")?.value ?? ""));
  const utm = parseUtm(store.get("pp_utm")?.value);

  try {
    const findExisting = async () => {
      const { data } = await c
        .from("leads")
        .select("id, pet_name, generation_id, referral_code, utm")
        .ilike("email", escapeLike(email))
        .limit(1)
        .maybeSingle<LeadRow>();
      return data;
    };

    const updateExisting = async (lead: LeadRow) => {
      const patch: Record<string, unknown> = {};
      if (petName) patch.pet_name = petName;
      if (generationId) patch.generation_id = generationId;
      if (!lead.referral_code && referralCode) patch.referral_code = referralCode;
      if (!lead.utm && utm) patch.utm = utm;
      if (Object.keys(patch).length === 0) return;
      let { error } = await c.from("leads").update(patch).eq("id", lead.id);
      if (error?.code === "23503" && patch.generation_id) {
        delete patch.generation_id;
        if (Object.keys(patch).length) ({ error } = await c.from("leads").update(patch).eq("id", lead.id));
        else error = null;
      }
      if (error) throw new Error(error.message);
    };

    const existing = await findExisting();
    if (existing) {
      await updateExisting(existing);
      return ok();
    }

    const row: Record<string, unknown> = {
      email,
      source,
      pet_name: petName || null,
      generation_id: generationId || null,
      referral_code: referralCode,
      utm,
    };
    let { error } = await c.from("leads").insert(row);
    if (error?.code === "23503") {
      // generation id doesn't exist (anymore) – keep the lead anyway
      row.generation_id = null;
      ({ error } = await c.from("leads").insert(row));
    }
    if (error?.code === "23505") {
      // raced with another request for the same email
      const again = await findExisting();
      if (again) await updateExisting(again);
      return ok();
    }
    if (error) throw new Error(error.message);
    // New newsletter-type sign-up: one welcome email (WELCOME10), sent after the response.
    if (features.email && isNewsletterSource(source)) after(() => sendWelcomeEmail(email, source));
    return ok();
  } catch (err) {
    console.error("[leads] upsert failed", err);
    return bad("Could not save right now, please try again.", 500);
  }
}
