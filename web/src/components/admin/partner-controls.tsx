"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Copy, MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";
import { PARTNER_STATUSES } from "@/components/partners/program";
import { labelize } from "@/components/admin/constants";
import { adminButton, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

async function patchPartner(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/partners/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

/** Inline status change in the CRM table. */
export function PartnerStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const prev = value;
    setValue(next);
    setState("saving");
    try {
      await patchPartner(id, { status: next });
      setState("saved");
      router.refresh();
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setValue(prev);
      setState("error");
    }
  }

  return (
    <span className="inline-flex items-center gap-1">
      <label className="sr-only" htmlFor={`st-${id}`}>
        Status
      </label>
      <select
        id={`st-${id}`}
        value={value}
        onChange={onChange}
        disabled={state === "saving"}
        className={cn(
          "h-8 rounded-md border border-line bg-white pl-2 pr-7 text-xs font-medium outline-none focus:border-ink",
          state === "error" && "border-clay text-clay-dark",
        )}
      >
        {PARTNER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {labelize(s)}
          </option>
        ))}
      </select>
      <span aria-live="polite" className="w-3 text-moss">
        {state === "saved" && <Check className="h-3.5 w-3.5" />}
      </span>
    </span>
  );
}

export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={adminButton("secondary", cn("h-8 text-xs", className))}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          window.prompt("Copy this:", value);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

/** Code generation, contact logging and deletion on the partner detail page. */
export function PartnerQuickActions({
  id,
  code,
  lastContactedAt,
}: {
  id: string;
  code: string | null;
  lastContactedAt: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(name: string, fn: () => Promise<unknown>) {
    setBusy(name);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => {
            if (code && !window.confirm(`Replace the current code ${code}? Links using the old code stop tracking.`)) return;
            void run("code", () => patchPartner(id, { action: "generate_code" }));
          }}
          className={adminButton(code ? "secondary" : "primary", "h-8 text-xs")}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {busy === "code" ? "Generating…" : code ? "Regenerate code" : "Generate code"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run("contact", () => patchPartner(id, { action: "log_contact" }))}
          className={adminButton("secondary", "h-8 text-xs")}
          title={lastContactedAt ? `Last contacted ${new Date(lastContactedAt).toLocaleString()}` : "Never contacted"}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          {busy === "contact" ? "Logging…" : "Log contact"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => {
            if (!window.confirm("Delete this partner? Their referral history stays, but the CRM row is gone.")) return;
            void run("delete", async () => {
              const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
              const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
              if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
              router.push("/admin/partners");
            });
          }}
          className={adminButton("danger", "h-8 text-xs")}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-clay-dark">
          {error}
        </p>
      )}
    </div>
  );
}

/** Text input that auto-submits its GET form on change (filters). */
export function AutoSubmitSelect(props: React.ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={cn(inputClass, "pr-8", props.className)}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    />
  );
}
