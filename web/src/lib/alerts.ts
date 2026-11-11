import "server-only";
import { sendEmail } from "@/lib/email";
import type { OrderRow } from "@/lib/orders";
import { BUCKETS, db, signedUrl } from "@/lib/supabase/server";
import { absoluteUrl, formatPrice } from "@/lib/utils";

/**
 * Emails to the shop owner (OWNER_EMAIL): one per paid order, and one when the AI credit balance
 * runs low. They go through Resend like every other email. Until the sending domain is verified in
 * Resend, OWNER_ALERT_FROM defaults to Resend's test sender, which can only deliver to the email
 * address the Resend account was opened with, so OWNER_EMAIL should be that address.
 *
 * Without RESEND_API_KEY or OWNER_EMAIL these log and do nothing; they never throw.
 */
function ownerEmail(): string | null {
  const to = process.env.OWNER_EMAIL?.trim();
  return to && to.includes("@") ? to : null;
}

function alertFrom(): string {
  return process.env.OWNER_ALERT_FROM?.trim() || "Pup Prints <onboarding@resend.dev>";
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

async function sendToOwner(subject: string, lines: string[], links: { label: string; url: string }[], key: string) {
  const to = ownerEmail();
  if (!to) {
    console.info(`[alerts] OWNER_EMAIL not set; skipped "${subject}"`);
    return;
  }
  const body = lines.map((l) => (l ? `<p style="margin:0 0 6px">${esc(l)}</p>` : `<p style="margin:0 0 14px"></p>`)).join("\n");
  const linkHtml = links.length
    ? `<p style="margin:18px 0 0">${links.map((l) => `<a href="${esc(l.url)}">${esc(l.label)}</a>`).join("<br>")}</p>`
    : "";
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">${body}${linkHtml}</div>`;
  const text = [...lines, "", ...links.map((l) => `${l.label}: ${l.url}`)].join("\n");
  const res = await sendEmail({ to, subject, html, text, tag: "owner_alert", idempotencyKey: key, from: alertFrom() });
  if (!res.ok && !res.skipped) console.error(`[alerts] "${subject}" failed: ${res.error}`);
}

/** Paid order: everything needed to make it by hand, with links to the full-resolution files. */
export async function notifyOwnerOfOrder(order: OrderRow): Promise<void> {
  try {
    const items = order.items ?? [];
    const lines: string[] = [
      `Order ${order.order_number}: ${formatPrice(order.total_cents ?? 0)}`,
      `Customer: ${order.customer_name ?? "-"} <${order.email ?? "no email"}>${order.phone ? `, ${order.phone}` : ""}`,
    ];
    const a = order.shipping_address?.address;
    if (a) {
      const parts = [order.shipping_address?.name, a.line1, a.line2, a.city, a.state, a.postal_code, a.country];
      lines.push(`Ship to: ${parts.filter(Boolean).join(", ")}`);
    }
    lines.push("");
    for (const i of items) {
      const price = i.unitAmount ? ` (${formatPrice(i.unitAmount)} each)` : i.included ? " (included)" : "";
      lines.push(`${i.quantity} × ${i.label}${price} | ${i.styleName}${i.petName ? ` | name: ${i.petName}` : ""}`);
    }
    if (order.gift_message) lines.push("", `Gift message: ${order.gift_message}`);
    if (order.notes) lines.push("", `Notes: ${order.notes}`);

    // Full-resolution portraits (the clean masters), signed for 7 days.
    const links: { label: string; url: string }[] = [
      { label: "Open the order in admin", url: absoluteUrl(`/admin/orders/${order.id}`) },
    ];
    const c = db();
    if (c) {
      const genIds = [...new Set(items.map((i) => i.generationId).filter(Boolean))];
      const { data: gens } = await c.from("generations").select("id, full_path, style").in("id", genIds);
      for (const g of gens ?? []) {
        if (!g.full_path) continue;
        const url = await signedUrl(BUCKETS.portraits, g.full_path, 7 * 24 * 60 * 60).catch(() => null);
        if (url) links.push({ label: `Full-resolution portrait (${g.style}), link valid 7 days`, url });
      }
    }
    await sendToOwner(
      `New order ${order.order_number}: ${formatPrice(order.total_cents ?? 0)}`,
      lines,
      links,
      `owner-order-${order.id}`,
    );
  } catch (err) {
    console.error("[alerts] order notification failed", err instanceof Error ? err.message : err);
  }
}

/** At or below this AI Gateway credit balance (USD), the owner gets one email a day. */
const LOW_CREDIT_USD = Math.max(0, Number(process.env.AI_CREDIT_ALERT_USD ?? 2) || 2);

/**
 * Check the AI Gateway credit balance (GET /v1/credits) and email the owner when it is at or below
 * AI_CREDIT_ALERT_USD (default $2). At most one email a day: a marker file in storage records it.
 */
export async function checkAiCredits(): Promise<void> {
  try {
    const { gatewayApiKey, gatewayConfigured, GATEWAY_BASE_URL } = await import("@/lib/ai/providers/gateway");
    if (!gatewayConfigured()) return;
    const res = await fetch(`${GATEWAY_BASE_URL}/credits`, {
      headers: { Authorization: `Bearer ${await gatewayApiKey()}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return;
    const body = (await res.json()) as { balance?: string; total_used?: string };
    const balance = Number(body.balance);
    if (!Number.isFinite(balance) || balance > LOW_CREDIT_USD) return;

    const c = db();
    if (!c) return;
    const day = new Date().toISOString().slice(0, 10);
    const name = `ai-credits-low-${day}.txt`;
    const { data: existing } = await c.storage.from(BUCKETS.portraits).list("alerts", { search: name });
    if (existing?.some((f) => f.name === name)) return;
    await c.storage
      .from(BUCKETS.portraits)
      .upload(`alerts/${name}`, new Blob([`balance ${balance}`], { type: "text/plain" }), { upsert: true });

    await sendToOwner(
      `AI credits low: $${balance.toFixed(2)} left`,
      [
        `The AI Gateway credit balance is $${balance.toFixed(2)} (alert at $${LOW_CREDIT_USD.toFixed(2)}).`,
        `Used so far: $${Number(body.total_used ?? 0).toFixed(2)}.`,
        "",
        "When it reaches $0, new previews stop and visitors are asked to leave their email instead.",
        "Top up in Vercel: AI Gateway, then Credits.",
      ],
      [{ label: "Vercel AI Gateway", url: "https://vercel.com/dashboard/ai" }],
      `owner-credits-${day}`,
    );
  } catch (err) {
    console.error("[alerts] credit check failed", err instanceof Error ? err.message : err);
  }
}
