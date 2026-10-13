"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Printer, Save } from "lucide-react";
import { ORDER_STATUSES, labelize } from "@/components/admin/constants";
import { adminButton, inputClass, labelClass } from "@/components/admin/ui";

type OrderFields = {
  id: string;
  status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  fulfillment_status: string | null;
  notes: string | null;
};

const FULFILLABLE = new Set(["paid", "needs_attention"]);

export function OrderActions({ order }: { order: OrderFields }) {
  const router = useRouter();
  const [form, setForm] = useState({
    status: order.status,
    carrier: order.carrier ?? "",
    tracking_number: order.tracking_number ?? "",
    tracking_url: order.tracking_url ?? "",
    notes: order.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [fulfilling, setFulfilling] = useState(false);
  const [fulfillResult, setFulfillResult] = useState<{ ok: boolean; body: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setMsg({ ok: true, text: "Saved" });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function fulfill() {
    if (!window.confirm("Approve this order and send it to the print partner?")) return;
    setFulfilling(true);
    setFulfillResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/fulfill`, { method: "POST" });
      const text = await res.text();
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // not JSON
      }
      setFulfillResult({ ok: res.ok, body: `HTTP ${res.status}\n${body}` });
      if (res.ok) router.refresh();
    } catch (err) {
      setFulfillResult({ ok: false, body: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setFulfilling(false);
    }
  }

  const canFulfill = FULFILLABLE.has(order.status);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-paper-2/70 p-3">
        <button
          type="button"
          onClick={fulfill}
          disabled={fulfilling}
          className={adminButton(canFulfill ? "accent" : "secondary", "h-10 w-full")}
        >
          <Printer className="h-4 w-4" />
          {fulfilling ? "Sending…" : "Approve & send to print"}
        </button>
        <p className="mt-2 text-xs text-ink-3">
          {canFulfill
            ? "Check the preview and print file first. This creates the order with the print partner."
            : `Order is ${labelize(order.status).toLowerCase()}; only send again if you're sure.`}
        </p>
        {fulfillResult && (
          <pre
            role="status"
            className={`mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-md p-3 font-mono text-xs ${
              fulfillResult.ok ? "bg-sage-soft text-moss" : "bg-clay-soft text-clay-dark"
            }`}
          >
            {fulfillResult.body}
          </pre>
        )}
      </div>

      <form onSubmit={save} className="space-y-3">
        <div>
          <label htmlFor="o-status" className={labelClass}>
            Status
          </label>
          <select id="o-status" value={form.status} onChange={set("status")} className={inputClass}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {labelize(s)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="o-carrier" className={labelClass}>
              Carrier
            </label>
            <input id="o-carrier" value={form.carrier} onChange={set("carrier")} placeholder="USPS" className={inputClass} />
          </div>
          <div>
            <label htmlFor="o-tn" className={labelClass}>
              Tracking #
            </label>
            <input id="o-tn" value={form.tracking_number} onChange={set("tracking_number")} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="o-turl" className={labelClass}>
            Tracking URL
          </label>
          <input
            id="o-turl"
            type="url"
            value={form.tracking_url}
            onChange={set("tracking_url")}
            placeholder="https://"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="o-notes" className={labelClass}>
            Internal notes
          </label>
          <textarea
            id="o-notes"
            value={form.notes}
            onChange={set("notes")}
            rows={4}
            className={`${inputClass} h-auto py-2`}
          />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className={adminButton("primary")}>
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save changes"}
          </button>
          {msg && (
            <span role="status" className={`text-sm ${msg.ok ? "text-moss" : "text-clay-dark"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
