"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, Minus } from "lucide-react";
import { CHANNELS, DAILY_TARGET, MIN_DOSE, type Channel, type DayEntry } from "@/components/admin/scorecard";
import { adminButton, fmtMoney, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Entries = Record<Channel, DayEntry>;
type Draft = { count?: string; notes?: string; spend?: string };

function fill(initial: Partial<Entries>): Entries {
  return Object.fromEntries(
    CHANNELS.map((ch) => [ch.id, initial[ch.id] ?? { count: 0, notes: "", spendCents: 0 }]),
  ) as Entries;
}

async function post(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/scorecard", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    count?: number;
    notes?: string;
    adSpendCents?: number;
  };
  if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

/** Quick +1 / +5 / +10 logging per channel for one day, plus notes and ad spend. */
export function ScorecardLogger({
  day,
  dayTitle,
  initial,
  disabled = false,
}: {
  day: string;
  dayTitle: string;
  initial: Partial<Entries>;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entries>(() => fill(initial));
  const [drafts, setDrafts] = useState<Partial<Record<Channel, Draft>>>({});
  const [state, setState] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });
  const inflight = useRef(new Map<Channel, number>());
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    },
    [],
  );

  // Re-render the server tables (30-day grid, outcomes) shortly after the last change.
  function settled() {
    setState({ kind: "saved" });
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => router.refresh(), 1200);
  }

  function patch(ch: Channel, p: Partial<DayEntry>) {
    setEntries((prev) => ({ ...prev, [ch]: { ...prev[ch], ...p } }));
  }

  async function bump(ch: Channel, delta: number) {
    if (delta < 0 && entries[ch].count === 0) return;
    setEntries((prev) => ({ ...prev, [ch]: { ...prev[ch], count: Math.max(0, prev[ch].count + delta) } }));
    inflight.current.set(ch, (inflight.current.get(ch) ?? 0) + 1);
    setState({ kind: "saving" });
    try {
      const json = await post({ op: "bump", day, channel: ch, delta });
      const left = (inflight.current.get(ch) ?? 1) - 1;
      inflight.current.set(ch, left);
      // The database total is authoritative once no other tap for this channel is in flight.
      if (left === 0 && typeof json.count === "number") patch(ch, { count: json.count });
      settled();
    } catch (err) {
      inflight.current.set(ch, Math.max(0, (inflight.current.get(ch) ?? 1) - 1));
      setEntries((prev) => ({ ...prev, [ch]: { ...prev[ch], count: Math.max(0, prev[ch].count - delta) } }));
      setState({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    }
  }

  async function save(ch: Channel, body: { count?: number; notes?: string; adSpendCents?: number }) {
    setState({ kind: "saving" });
    try {
      const json = await post({ op: "set", day, channel: ch, ...body });
      patch(ch, { count: json.count ?? entries[ch].count, notes: json.notes ?? "", spendCents: json.adSpendCents ?? 0 });
      settled();
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setDrafts((prev) => ({ ...prev, [ch]: undefined }));
    }
  }

  function setDraft(ch: Channel, d: Draft) {
    setDrafts((prev) => ({ ...prev, [ch]: { ...prev[ch], ...d } }));
  }

  function commitCount(ch: Channel) {
    const raw = drafts[ch]?.count;
    if (raw === undefined) return;
    const n = Number(raw.trim());
    if (raw.trim() === "" || !Number.isInteger(n) || n < 0 || n === entries[ch].count) {
      setDrafts((prev) => ({ ...prev, [ch]: { ...prev[ch], count: undefined } }));
      return;
    }
    void save(ch, { count: n });
  }

  function commitNotes(ch: Channel) {
    const raw = drafts[ch]?.notes;
    if (raw === undefined) return;
    if (raw.trim() === entries[ch].notes.trim()) {
      setDrafts((prev) => ({ ...prev, [ch]: { ...prev[ch], notes: undefined } }));
      return;
    }
    void save(ch, { notes: raw.slice(0, 500) });
  }

  function commitSpend(ch: Channel) {
    const raw = drafts[ch]?.spend;
    if (raw === undefined) return;
    const dollars = Number(raw.replace(/[$,\s]/g, "") || "0");
    const cents = Math.round(dollars * 100);
    if (!Number.isFinite(dollars) || dollars < 0 || cents === entries[ch].spendCents) {
      setDrafts((prev) => ({ ...prev, [ch]: { ...prev[ch], spend: undefined } }));
      return;
    }
    void save(ch, { adSpendCents: cents });
  }

  const blurOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const total = CHANNELS.reduce((s, ch) => s + (ch.counts ? entries[ch.id].count : 0), 0);
  const spend = CHANNELS.reduce((s, ch) => s + entries[ch.id].spendCents, 0);
  const pct = Math.min(100, (total / DAILY_TARGET) * 100);

  return (
    <section className="min-w-0 rounded-xl border border-line bg-white">
      <header className="border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold">{dayTitle}</h2>
          <span aria-live="polite" className="text-xs text-ink-3">
            {state.kind === "saving" && "Saving…"}
            {state.kind === "saved" && (
              <span className="inline-flex items-center gap-1 text-moss">
                <Check className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="tabular-nums">
            <span className="text-4xl font-semibold tracking-tight">{total}</span>
            <span className="text-lg text-ink-3"> / {DAILY_TARGET}</span>
          </p>
          <p className="text-right text-xs text-ink-3">
            {total >= DAILY_TARGET
              ? "Target hit."
              : total >= MIN_DOSE
                ? `${DAILY_TARGET - total} to go · minimum dose done`
                : `${DAILY_TARGET - total} to go · ${MIN_DOSE - total} to the minimum dose`}
            {spend > 0 && <span className="block">Ad spend {fmtMoney(spend)}</span>}
          </p>
        </div>
        <div className="relative mt-2 h-2 rounded-full bg-paper-2" role="progressbar" aria-valuemin={0} aria-valuemax={DAILY_TARGET} aria-valuenow={total} aria-label="Actions toward 100">
          <div className={cn("h-2 rounded-full", total >= DAILY_TARGET ? "bg-moss" : "bg-ink")} style={{ width: `${pct}%` }} />
          <span className="absolute -top-0.5 h-3 w-px bg-ink-3" style={{ left: `${(MIN_DOSE / DAILY_TARGET) * 100}%` }} title="Minimum dose (50)" />
        </div>
      </header>

      {state.kind === "error" && (
        <p role="alert" className="mx-4 mt-3 rounded-lg bg-clay-soft px-3 py-2 text-sm text-clay-dark">
          {state.message}
        </p>
      )}

      <ul className="divide-y divide-line/70">
        {CHANNELS.map((ch) => {
          const e = entries[ch.id];
          const d = drafts[ch.id];
          return (
            <li
              key={ch.id}
              className={cn(
                "grid items-center gap-x-4 gap-y-2 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,200px)_104px]",
                !ch.counts && "bg-paper/50",
              )}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{ch.label}</p>
                <p className="text-xs text-ink-3">{ch.hint}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => bump(ch.id, -1)}
                  disabled={disabled || e.count === 0}
                  aria-label={`${ch.label}: minus 1`}
                  className={adminButton("secondary", "h-10 w-10 px-0")}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <label htmlFor={`sc-${ch.id}-count`} className="sr-only">
                  {ch.label} count
                </label>
                <input
                  id={`sc-${ch.id}-count`}
                  inputMode="numeric"
                  value={d?.count ?? String(e.count)}
                  onChange={(ev) => setDraft(ch.id, { count: ev.target.value.replace(/[^\d]/g, "") })}
                  onBlur={() => commitCount(ch.id)}
                  onKeyDown={blurOnEnter}
                  disabled={disabled}
                  className={cn(inputClass, "w-16 px-1 text-center text-base font-semibold tabular-nums")}
                />
                {[1, 5, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => bump(ch.id, n)}
                    disabled={disabled}
                    aria-label={`${ch.label}: plus ${n}`}
                    className={adminButton(n === 1 ? "primary" : "secondary", "h-10 min-w-11 px-2 tabular-nums")}
                  >
                    +{n}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor={`sc-${ch.id}-notes`} className="sr-only">
                  {ch.label} note
                </label>
                <input
                  id={`sc-${ch.id}-notes`}
                  value={d?.notes ?? e.notes}
                  onChange={(ev) => setDraft(ch.id, { notes: ev.target.value })}
                  onBlur={() => commitNotes(ch.id)}
                  onKeyDown={blurOnEnter}
                  maxLength={500}
                  placeholder="Note"
                  disabled={disabled}
                  className={cn(inputClass, "h-9 text-xs")}
                />
              </div>
              <div>
                {ch.paid && (
                  <>
                    <label htmlFor={`sc-${ch.id}-spend`} className="sr-only">
                      {ch.label} ad spend in dollars
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-3">$</span>
                      <input
                        id={`sc-${ch.id}-spend`}
                        inputMode="decimal"
                        value={d?.spend ?? (e.spendCents ? (e.spendCents / 100).toFixed(2) : "")}
                        onChange={(ev) => setDraft(ch.id, { spend: ev.target.value.replace(/[^\d.]/g, "") })}
                        onBlur={() => commitSpend(ch.id)}
                        onKeyDown={blurOnEnter}
                        placeholder="spend"
                        disabled={disabled}
                        className={cn(inputClass, "h-9 pl-6 text-xs tabular-nums")}
                      />
                    </div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-line px-4 py-3 text-xs text-ink-3">
        One tap = one primary action: a new person contacted, a post published, an ad launched. Type a number to correct a
        total. Ad spend is per channel per day and feeds paid CAC.
      </p>
    </section>
  );
}
