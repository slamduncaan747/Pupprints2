"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { PARTNER_STATUSES, PLATFORMS, PLATFORM_LABELS, PROGRAM, tierForFollowers } from "@/components/partners/program";
import { labelize } from "@/components/admin/constants";
import { adminButton, inputClass, labelClass } from "@/components/admin/ui";

export type PartnerFormValues = {
  name: string | null;
  handle: string | null;
  platform: string | null;
  profile_url: string | null;
  followers: number | null;
  niche: string | null;
  email: string | null;
  status: string;
  code: string | null;
  commission_rate: number | string;
  discount_percent: number;
  notes: string | null;
};

export function PartnerForm({ id, initial }: { id?: string; initial?: Partial<PartnerFormValues> }) {
  const router = useRouter();
  const [f, setF] = useState({
    name: initial?.name ?? "",
    handle: initial?.handle ?? "",
    platform: initial?.platform ?? "instagram",
    profile_url: initial?.profile_url ?? "",
    followers: initial?.followers != null ? String(initial.followers) : "",
    niche: initial?.niche ?? "",
    email: initial?.email ?? "",
    status: initial?.status ?? "prospect",
    code: initial?.code ?? "",
    commissionPct: String(Math.round(Number(initial?.commission_rate ?? PROGRAM.commissionRate) * 1000) / 10),
    discount: String(initial?.discount_percent ?? PROGRAM.discountPercent),
    notes: initial?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const followersNum = f.followers.trim() ? Number(f.followers.replace(/[,\s]/g, "")) : null;
  const tier = tierForFollowers(followersNum);
  const platformOptions = PLATFORMS.includes(f.platform as (typeof PLATFORMS)[number]) ? PLATFORMS : [...PLATFORMS, f.platform];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const body = {
      name: f.name,
      handle: f.handle,
      platform: f.platform,
      profile_url: f.profile_url,
      followers: followersNum,
      niche: f.niche,
      email: f.email,
      status: f.status,
      code: f.code,
      commission_rate: Number(f.commissionPct) / 100,
      discount_percent: Number(f.discount),
      notes: f.notes,
    };
    try {
      const res = await fetch(id ? `/api/admin/partners/${id}` : "/api/admin/partners", {
        method: id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; partner?: { id: string } };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      if (!id && json.partner) {
        router.push(`/admin/partners/${json.partner.id}`);
        return;
      }
      setMsg({ ok: true, text: "Saved" });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof typeof f, label: string, props: React.ComponentProps<"input"> = {}) => (
    <div>
      <label htmlFor={`pf-${key}`} className={labelClass}>
        {label}
      </label>
      <input id={`pf-${key}`} value={f[key]} onChange={set(key)} className={inputClass} {...props} />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Name", { autoComplete: "off" })}
        {field("email", "Email", { type: "email", autoComplete: "off" })}
        <div>
          <label htmlFor="pf-platform" className={labelClass}>
            Platform
          </label>
          <select id="pf-platform" value={f.platform} onChange={set("platform")} className={inputClass}>
            {platformOptions.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p as keyof typeof PLATFORM_LABELS] ?? p}
              </option>
            ))}
          </select>
        </div>
        {field("handle", "Handle", { placeholder: "@bella.the.doodle", autoComplete: "off" })}
        {field("profile_url", "Profile URL", { type: "url", placeholder: "Auto-filled from handle if empty" })}
        <div>
          <label htmlFor="pf-followers" className={labelClass}>
            Followers {tier && <span className="ml-1 normal-case tracking-normal text-ink-2">· {tier}</span>}
          </label>
          <input
            id="pf-followers"
            inputMode="numeric"
            value={f.followers}
            onChange={set("followers")}
            placeholder="e.g. 24500"
            className={inputClass}
          />
        </div>
        {field("niche", "Niche", { placeholder: "doodles, rescue, dog training…" })}
        <div>
          <label htmlFor="pf-status" className={labelClass}>
            Status
          </label>
          <select id="pf-status" value={f.status} onChange={set("status")} className={inputClass}>
            {PARTNER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {labelize(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="grid gap-4 rounded-lg border border-line p-3 sm:grid-cols-3">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-ink-3">Terms</legend>
        {field("commissionPct", "Commission %", { type: "number", min: 0, max: 90, step: 0.5 })}
        {field("discount", "Audience discount %", { type: "number", min: 0, max: 90, step: 1 })}
        {field("code", "Code", {
          placeholder: "BELLA15",
          className: `${inputClass} font-mono uppercase`,
          autoComplete: "off",
        })}
      </fieldset>

      <div>
        <label htmlFor="pf-notes" className={labelClass}>
          Notes
        </label>
        <textarea id="pf-notes" value={f.notes} onChange={set("notes")} rows={4} className={`${inputClass} h-auto py-2`} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className={adminButton("primary")}>
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : id ? "Save changes" : "Create partner"}
        </button>
        {msg && (
          <span role="status" className={`text-sm ${msg.ok ? "text-moss" : "text-clay-dark"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
