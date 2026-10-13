import { site } from "@/lib/config";
import { db } from "@/lib/supabase/server";
import { normalizeEmail, verifyUnsubscribeToken } from "@/lib/email/unsubscribe";
import { escapeLike } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function unsubscribe(email: string): Promise<boolean> {
  const c = db();
  if (!c) return false;
  const now = new Date().toISOString();
  const { data, error } = await c
    .from("leads")
    .update({ unsubscribed_at: now, consent: false })
    .ilike("email", escapeLike(email))
    .select("id");
  if (error) {
    console.error("[unsubscribe] update failed", error.message);
    return false;
  }
  if (data && data.length > 0) return true;
  // Buyers who never joined the list: store a suppression row so lifecycle emails stop too.
  const { error: insertError } = await c
    .from("leads")
    .insert({ email, source: "unsubscribe", consent: false, unsubscribed_at: now });
  if (insertError && insertError.code !== "23505") {
    console.error("[unsubscribe] insert failed", insertError.message);
    return false;
  }
  return true;
}

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} · Pup Prints</title></head>
<body style="margin:0;background:#faf6ef;color:#1b1814;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<main style="max-width:480px;margin:12vh auto;padding:0 24px;text-align:center;">
<p style="font-family:Georgia,serif;font-size:22px;margin:0 0 28px;"><span style="color:#c8553d;">&#9679;</span> Pup Prints</p>
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:32px;line-height:1.15;margin:0 0 14px;">${title}</h1>
<p style="font-size:16px;line-height:1.6;color:#4a443c;margin:0 0 28px;">${body}</p>
<a href="${site.url}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1b1814;color:#faf6ef;text-decoration:none;font-weight:600;">Back to Pup Prints</a>
</main></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function params(req: Request) {
  const url = new URL(req.url);
  return { email: normalizeEmail(url.searchParams.get("e") ?? ""), token: url.searchParams.get("t") ?? "" };
}

/** Link from the email footer: /api/unsubscribe?e=<email>&t=<hmac> */
export async function GET(req: Request) {
  const { email, token } = params(req);
  if (!verifyUnsubscribeToken(email, token)) {
    return page("That link didn't work", `Please reply to any of our emails or write to ${site.supportEmail} and we'll remove you right away.`, 400);
  }
  const done = await unsubscribe(email);
  return done
    ? page("You're unsubscribed", "You won't get any more marketing emails from us. Order updates (like shipping notices) will still arrive if you place an order.")
    : page("Something went wrong", `Please try again, or write to ${site.supportEmail} and we'll remove you by hand.`, 500);
}

/** RFC 8058 one-click unsubscribe (List-Unsubscribe-Post). */
export async function POST(req: Request) {
  const { email, token } = params(req);
  if (!verifyUnsubscribeToken(email, token)) return Response.json({ ok: false }, { status: 400 });
  const done = await unsubscribe(email);
  return Response.json({ ok: done }, { status: done ? 200 : 500 });
}
