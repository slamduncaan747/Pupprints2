import "server-only";
import { Resend } from "resend";
import { env, features } from "@/lib/env";
import { site } from "@/lib/config";

export * from "./templates";
export { unsubscribeUrl, unsubscribeHeaders, verifyUnsubscribeToken, normalizeEmail } from "./unsubscribe";

let resend: Resend | null = null;

function client(): Resend | null {
  if (!features.email) return null;
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

/** Subjects can carry customer-typed names: keep them to one line, without control characters. */
function oneLine(s: string): string {
  return Array.from(s, (ch) => (ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 ? " " : ch))
    .join("")
    .replace(/ {2,}/g, " ")
    .trim();
}

export type SendResult = { ok: boolean; id?: string; skipped?: boolean; error?: string };

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  /** Short tag for Resend analytics, e.g. "order_confirmation". */
  tag?: string;
  /** Resend de-duplicates sends with the same key for 24h (safe webhook retries). */
  idempotencyKey?: string;
};

/**
 * Send one email through Resend. When RESEND_API_KEY is missing this logs and returns
 * `{ ok: false, skipped: true }` so callers can carry on (and retry later if they want).
 * Never throws.
 */
export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  const c = client();
  if (!c) {
    console.info(`[email] RESEND_API_KEY not set; skipped "${msg.subject}" (${msg.tag ?? "untagged"})`);
    return { ok: false, skipped: true };
  }
  try {
    const { data, error } = await c.emails.send(
      {
        from: env.emailFrom,
        to: [msg.to],
        replyTo: process.env.EMAIL_REPLY_TO || site.supportEmail,
        subject: oneLine(msg.subject).slice(0, 200),
        html: msg.html,
        text: msg.text,
        headers: msg.headers,
        tags: msg.tag ? [{ name: "type", value: msg.tag.replace(/[^a-zA-Z0-9_-]/g, "_") }] : undefined,
      },
      msg.idempotencyKey ? { idempotencyKey: msg.idempotencyKey.slice(0, 256) } : undefined,
    );
    if (error) {
      console.error(`[email] send failed (${msg.tag})`, error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[email] send threw (${msg.tag})`, message);
    return { ok: false, error: message };
  }
}
