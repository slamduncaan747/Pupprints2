import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { getTrackablePartner } from "@/lib/partners";
import { normalizeCode } from "@/components/partners/program";

export const dynamic = "force-dynamic";

/** Codes clicked by this visitor recently; a repeat within the window is not re-counted. */
const DEDUPE_COOKIE = "pp_refc";
const DEDUPE_SECONDS = 30 * 60;
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|python-requests|curl\/|wget/i;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const opt = z.string().trim().max(100).optional();
const Body = z.object({
  code: z.string().trim().max(64),
  landing: z.string().trim().max(300).optional(),
  utm_source: opt,
  utm_medium: opt,
  utm_campaign: opt,
  utm_content: opt,
  utm_term: opt,
});

/** Records a referral link click (`?ref=CODE`). Always answers 200 so it never affects the page. */
export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  try {
    const text = await req.text();
    if (text.length > 4096) return res;
    const parsed = Body.safeParse(JSON.parse(text));
    if (!parsed.success) return res;
    const code = normalizeCode(parsed.data.code);
    if (!code || !db()) return res;
    if (BOT_UA.test(req.headers.get("user-agent") ?? "")) return res;

    const store = await cookies();
    const seen = (store.get(DEDUPE_COOKIE)?.value ?? "").split(".").filter(Boolean);
    if (seen.includes(code)) return res;

    const partner = await getTrackablePartner(code);
    if (!partner) return res;

    const { landing } = parsed.data;
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = parsed.data[key];
      if (v) utm[key] = v;
    }
    const { error } = await db()!
      .from("referral_events")
      .insert({
        code: partner.code,
        type: "click",
        landing: landing?.startsWith("/") ? landing : null,
        utm: Object.keys(utm).length ? utm : null,
      });
    if (error) {
      console.error("[ref] click insert failed", error.message);
      return res;
    }

    res.cookies.set(DEDUPE_COOKIE, [...seen.slice(-9), code].join("."), {
      path: "/",
      maxAge: DEDUPE_SECONDS,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } catch (err) {
    console.error("[ref] failed", err);
  }
  return res;
}
