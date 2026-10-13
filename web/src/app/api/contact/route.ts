import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { CONTACT_TOPIC_VALUES } from "@/components/marketing/contact-topics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_384;

const Body = z.object({
  name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email({ error: "Please enter a valid email address." })),
  orderNumber: z.string().trim().max(40).optional().default(""),
  topic: z.enum(CONTACT_TOPIC_VALUES).catch("other"),
  message: z
    .string()
    .trim()
    .min(10, { error: "Please write a little more so we can help (at least 10 characters)." })
    .max(5000, { error: "Please keep your message under 5,000 characters." }),
  // Honeypot: hidden from people, filled in by bots. Bots get a fake success.
  website: z.string().max(500).optional(),
});

type Fields = "name" | "email" | "orderNumber" | "topic" | "message";

function isForm(req: Request) {
  const type = req.headers.get("content-type") ?? "";
  return type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");
}

function respond(req: Request, form: boolean, status: number, body: Record<string, unknown>) {
  // No-JS fallback: a plain HTML form post gets redirected back to the contact page.
  if (form) {
    const url = new URL("/contact", req.url);
    url.searchParams.set(status < 400 ? "sent" : "error", "1");
    return NextResponse.redirect(url, 303);
  }
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}

/** Contact form submissions → contact_messages. Degrades to a logged 200 when Supabase isn't configured. */
export async function POST(req: Request) {
  const form = isForm(req);
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) return respond(req, form, 413, { ok: false, error: "Message is too long." });

  let input: unknown;
  try {
    if (form) {
      input = Object.fromEntries([...(await req.formData()).entries()].filter(([, v]) => typeof v === "string"));
    } else {
      const text = await req.text();
      if (text.length > MAX_BODY_BYTES) return respond(req, form, 413, { ok: false, error: "Message is too long." });
      input = JSON.parse(text);
    }
  } catch {
    return respond(req, form, 400, { ok: false, error: "Invalid request." });
  }

  const parsed = Body.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<Fields, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as Fields | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return respond(req, form, 400, {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors,
    });
  }

  const { name, email, orderNumber, topic, message, website } = parsed.data;
  if (website) return respond(req, form, 200, { ok: true });

  const row = {
    name: name || null,
    email,
    order_number: orderNumber ? orderNumber.toUpperCase() : null,
    topic,
    message,
  };

  const c = db();
  if (!c) {
    console.warn("[contact] Supabase not configured; message not stored", { email, topic, length: message.length });
    return respond(req, form, 200, { ok: true });
  }

  const { error } = await c.from("contact_messages").insert(row);
  if (error) {
    console.error("[contact] insert failed", error.message);
    return respond(req, form, 500, {
      ok: false,
      error: "Sorry, we couldn't send your message. Please email us directly.",
    });
  }

  return respond(req, form, 200, { ok: true });
}
