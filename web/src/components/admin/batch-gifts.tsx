"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, ImageUp, Link2, Loader2, RotateCcw, Square, Trash2, Wand2, X } from "lucide-react";
import { STYLES } from "@/lib/catalog";
import { prepareImage } from "@/components/create/prepare-image";
import { csvCell } from "@/components/admin/csv";
import { labelize } from "@/components/admin/constants";
import { CopyButton } from "@/components/admin/partner-controls";
import { adminButton, inputClass, labelClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type BatchPartner = {
  id: string;
  name: string | null;
  handle: string | null;
  platform: string | null;
  niche: string | null;
  status: string;
};

const MAX_ROWS = 20;
/** /api/admin/gifts has maxDuration 120 s (105 s AI budget); allow for the upload on top. */
const REQUEST_TIMEOUT_MS = 150_000;
const DEFAULT_STYLE = STYLES.some((s) => s.slug === "royal") ? "royal" : STYLES[0].slug;

type Source = { kind: "file"; file: File; preview: string } | { kind: "url"; url: string };
type Status = "ready" | "queued" | "running" | "done" | "failed";
type Result = { giftId: string; imageUrl: string; revealUrl: string; dm: string; style: string; durationMs?: number };
type Row = {
  key: number;
  source: Source;
  recipientName: string;
  petName: string;
  partnerId: string;
  style: string;
  status: Status;
  error?: string;
  result?: Result;
};

/** Stops the whole run (every following row would fail the same way). */
class FatalError extends Error {}

function partnerLabel(p: BatchPartner): string {
  const who = p.name || (p.handle ? `@${p.handle}` : "Unnamed partner");
  return p.niche ? `${who} · ${p.niche}` : who;
}

function styleName(slug: string): string {
  return STYLES.find((s) => s.slug === slug)?.name ?? slug;
}

/**
 * One URL per line, optionally followed by recipient and dog name separated by tabs, commas,
 * semicolons or pipes (so rows pasted from a spreadsheet work).
 */
function parseUrlLines(text: string): { rows: { url: string; recipient: string; pet: string }[]; invalid: number } {
  let invalid = 0;
  const rows: { url: string; recipient: string; pet: string }[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^(\S+)\s*(.*)$/);
    const url = (m?.[1] ?? "").replace(/[,;|]+$/, "");
    if (!/^https?:\/\/\S+$/i.test(url)) {
      invalid++;
      continue;
    }
    const [recipient = "", pet = ""] = (m?.[2] ?? "")
      .replace(/^[\s,;|]+/, "")
      .split(/\s*[\t,;|]\s*/)
      .map((s) => s.trim());
    rows.push({ url, recipient: recipient.slice(0, 80), pet: pet.slice(0, 40) });
  }
  return { rows, invalid };
}

export function BatchGiftStudio({ partners, defaultPartnerId = "" }: { partners: BatchPartner[]; defaultPartnerId?: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [urlText, setUrlText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [defaultStyle, setDefaultStyle] = useState<string>(DEFAULT_STYLE);
  const [defaultPartner, setDefaultPartner] = useState(defaultPartnerId);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [current, setCurrent] = useState<{ key: number; startedAt: number } | null>(null);
  const [now, setNow] = useState(0);
  const [runError, setRunError] = useState<string | null>(null);
  const [csvCopied, setCsvCopied] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const nextKey = useRef(1);
  const stopRef = useRef(false);
  const previews = useRef(new Set<string>());
  const fileInput = useRef<HTMLInputElement>(null);

  // Revoke local photo previews on unmount.
  useEffect(() => {
    const urls = previews.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  // Tick the elapsed timer and warn before closing the tab mid-run.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => {
      clearInterval(t);
      window.removeEventListener("beforeunload", warn);
    };
  }, [running]);

  const partnerById = new Map(partners.map((p) => [p.id, p]));

  function addRows(items: { source: Source; recipient?: string; pet?: string }[]) {
    const room = MAX_ROWS - rows.length;
    const accepted = items.slice(0, Math.max(0, room));
    const skipped = items.length - accepted.length;
    for (const it of items.slice(accepted.length)) {
      if (it.source.kind === "file") {
        URL.revokeObjectURL(it.source.preview);
        previews.current.delete(it.source.preview);
      }
    }
    setRows((prev) => [
      ...prev,
      ...accepted.map(
        (it): Row => ({
          key: nextKey.current++,
          source: it.source,
          recipientName: it.recipient ?? "",
          petName: it.pet ?? "",
          partnerId: defaultPartner,
          style: defaultStyle,
          status: "ready",
        }),
      ),
    ]);
    return skipped;
  }

  function onFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const items = Array.from(list).map((file) => {
      const preview = URL.createObjectURL(file);
      previews.current.add(preview);
      return { source: { kind: "file", file, preview } as Source };
    });
    const skipped = addRows(items);
    setNotice(skipped ? `A batch holds ${MAX_ROWS} photos; ${skipped} file${skipped === 1 ? " was" : "s were"} not added.` : null);
    if (fileInput.current) fileInput.current.value = "";
  }

  function onAddUrls() {
    const { rows: parsed, invalid } = parseUrlLines(urlText);
    const skipped = addRows(parsed.map((p) => ({ source: { kind: "url", url: p.url } as Source, recipient: p.recipient, pet: p.pet })));
    const notes = [
      invalid ? `${invalid} line${invalid === 1 ? "" : "s"} didn't start with an http(s) URL and ${invalid === 1 ? "was" : "were"} skipped.` : "",
      skipped ? `A batch holds ${MAX_ROWS} photos; ${skipped} URL${skipped === 1 ? " was" : "s were"} not added.` : "",
    ].filter(Boolean);
    setNotice(notes.length ? notes.join(" ") : null);
    if (parsed.length) setUrlText("");
  }

  function update(key: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function remove(keys: number[]) {
    setRows((prev) =>
      prev.filter((r) => {
        if (!keys.includes(r.key)) return true;
        if (r.source.kind === "file") {
          URL.revokeObjectURL(r.source.preview);
          previews.current.delete(r.source.preview);
        }
        return false;
      }),
    );
  }

  function applyToAll(patch: Partial<Pick<Row, "style" | "partnerId">>) {
    setRows((prev) => prev.map((r) => (r.status === "done" ? r : { ...r, ...patch })));
  }

  async function generateOne(row: Row, sender: string, note: string): Promise<Result> {
    const fd = new FormData();
    fd.set("style", row.style);
    if (row.partnerId) fd.set("partnerId", row.partnerId);
    if (row.petName.trim()) fd.set("petName", row.petName.trim());
    if (row.recipientName.trim()) fd.set("recipientName", row.recipientName.trim());
    if (sender) fd.set("senderName", sender);
    if (note) fd.set("message", note);
    if (row.source.kind === "file") {
      // Downscale in the browser: Vercel rejects request bodies over 4.5 MB.
      const prepared = await prepareImage(row.source.file);
      fd.set("file", new File([prepared.blob], "photo.jpg", { type: "image/jpeg" }));
    } else {
      fd.set("imageUrl", row.source.url);
    }

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/admin/gifts", { method: "POST", body: fd, signal: ctrl.signal });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        gift?: { id: string };
        imageUrl?: string;
        revealUrl?: string;
        dm?: string;
        style?: string;
        durationMs?: number;
      };
      if (res.status === 401) throw new FatalError("Your admin session expired. Log in again in another tab, then retry the failed rows.");
      if (json.error === "ai_unavailable") throw new FatalError(json.message ?? "No AI image provider is configured.");
      if (!res.ok || !json.ok || !json.gift) throw new Error(json.message ?? json.error ?? `HTTP ${res.status}`);
      return {
        giftId: json.gift.id,
        imageUrl: json.imageUrl ?? "",
        revealUrl: json.revealUrl ?? "",
        dm: json.dm ?? "",
        style: json.style ?? row.style,
        durationMs: json.durationMs,
      };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Timed out after ${REQUEST_TIMEOUT_MS / 1000} s (the AI provider was too slow). Retry this row.`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async function run(onlyKeys?: number[]) {
    const targets = rows.filter((r) => (onlyKeys ? onlyKeys.includes(r.key) : r.status === "ready" || r.status === "failed"));
    if (targets.length === 0) return;
    const sender = senderName.trim();
    const note = message.trim();
    const keys = new Set(targets.map((t) => t.key));
    stopRef.current = false;
    setStopping(false);
    setRunError(null);
    setRunning(true);
    setNow(Date.now());
    setRows((prev) => prev.map((r) => (keys.has(r.key) ? { ...r, status: "queued", error: undefined } : r)));

    for (const row of targets) {
      if (stopRef.current) break;
      const startedAt = Date.now();
      setCurrent({ key: row.key, startedAt });
      setNow(startedAt);
      update(row.key, { status: "running" });
      try {
        const result = await generateOne(row, sender, note);
        update(row.key, { status: "done", result, error: undefined });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        update(row.key, { status: "failed", error: msg });
        if (err instanceof FatalError) {
          setRunError(msg);
          break;
        }
      }
    }

    // Anything not reached (stopped or fatal error) goes back to ready.
    setRows((prev) => prev.map((r) => (r.status === "queued" ? { ...r, status: "ready" } : r)));
    setCurrent(null);
    setRunning(false);
  }

  /** Undo a gift made by mistake (only while its reveal link is unopened; the API enforces it). */
  async function deleteGift(row: Row) {
    if (!row.result) return;
    if (!window.confirm(`Delete the gift portrait${row.petName ? ` of ${row.petName}` : ""}? Its reveal link stops working.`)) return;
    setDeleting(row.key);
    try {
      const res = await fetch(`/api/admin/gifts/${row.result.giftId}`, { method: "DELETE" });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      remove([row.key]);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  const done = rows.filter((r) => r.status === "done");
  const failed = rows.filter((r) => r.status === "failed");
  const pending = rows.filter((r) => r.status === "ready" || r.status === "failed");
  const inRun = rows.filter((r) => r.status === "queued" || r.status === "running");
  const finishedInRun = running ? rows.filter((r) => r.status === "done" || r.status === "failed").length : 0;
  const results = rows.filter((r) => r.status === "done" || r.status === "failed");

  function csv(): string {
    const header = ["recipient_name", "dog_name", "partner", "style", "status", "reveal_url", "dm", "error"];
    const lines = results.map((r) => {
      const p = r.partnerId ? partnerById.get(r.partnerId) : undefined;
      return [
        r.recipientName,
        r.petName,
        p ? p.name || (p.handle ? `@${p.handle}` : "") : "",
        styleName(r.result?.style ?? r.style),
        r.status === "done" ? "created" : "failed",
        r.result?.revealUrl ?? "",
        r.result?.dm ?? "",
        r.error ?? "",
      ]
        .map(csvCell)
        .join(",");
    });
    return [header.join(","), ...lines].join("\n");
  }

  async function copyCsv() {
    const text = csv();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy this:", text);
    }
    setCsvCopied(true);
    setTimeout(() => setCsvCopied(false), 1500);
  }

  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([csv()], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `pupprints-gifts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const elapsed = current ? Math.max(0, Math.round((now - current.startedAt) / 1000)) : 0;
  const runTotal = finishedInRun + inRun.length;
  const currentIndex = current ? rows.findIndex((r) => r.key === current.key) + 1 : 0;

  return (
    <div className="space-y-6">
      {/* 1) Add photos */}
      <section className="rounded-xl border border-line bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="font-sans text-sm font-semibold tracking-normal">1 · Add photos</h2>
          <span className="text-xs tabular-nums text-ink-3">
            {rows.length} / {MAX_ROWS}
          </span>
        </header>
        <div className="grid gap-6 p-4 lg:grid-cols-2">
          <div>
            <label htmlFor="batch-files" className={labelClass}>
              <ImageUp className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              Upload photos
            </label>
            <input
              ref={fileInput}
              id="batch-files"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
              disabled={running || rows.length >= MAX_ROWS}
              onChange={(e) => onFiles(e.target.files)}
              className="block w-full text-sm text-ink-2 file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:text-sm file:font-medium file:text-paper disabled:opacity-50"
            />
            <p className="mt-2 text-xs text-ink-3">Select several at once. Photos are downscaled in the browser before upload.</p>
          </div>
          <div>
            <label htmlFor="batch-urls" className={labelClass}>
              <Link2 className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              Or paste image URLs, one per line
            </label>
            <textarea
              id="batch-urls"
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
              rows={4}
              disabled={running || rows.length >= MAX_ROWS}
              placeholder={"https://…/bella.jpg, Sarah, Bella\nhttps://…/max.jpg"}
              className={`${inputClass} h-auto py-2 font-mono text-xs`}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-ink-3">Optional after the URL: recipient, dog (comma or tab; pastes from a sheet work).</p>
              <button
                type="button"
                onClick={onAddUrls}
                disabled={running || !urlText.trim() || rows.length >= MAX_ROWS}
                className={adminButton("secondary", "h-8 text-xs")}
              >
                Add URLs
              </button>
            </div>
          </div>
        </div>
        {notice && (
          <p role="status" className="mx-4 mb-4 rounded-lg bg-paper-2 px-3 py-2 text-xs text-ink-2">
            {notice}
          </p>
        )}
      </section>

      {/* 2) Batch settings */}
      <section className="rounded-xl border border-line bg-white">
        <header className="border-b border-line px-4 py-3">
          <h2 className="font-sans text-sm font-semibold tracking-normal">2 · Settings for this batch</h2>
        </header>
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="batch-style" className={labelClass}>
              Default style
            </label>
            <div className="flex gap-2">
              <select id="batch-style" value={defaultStyle} onChange={(e) => setDefaultStyle(e.target.value)} className={cn(inputClass, "pr-8")} disabled={running}>
                {STYLES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => applyToAll({ style: defaultStyle })}
                disabled={running || rows.length === 0}
                className={adminButton("secondary", "h-10 shrink-0 text-xs")}
                title="Set every row that isn't finished to this style"
              >
                All rows
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="batch-partner" className={labelClass}>
              Default partner (optional)
            </label>
            <div className="flex gap-2">
              <select id="batch-partner" value={defaultPartner} onChange={(e) => setDefaultPartner(e.target.value)} className={cn(inputClass, "pr-8")} disabled={running}>
                <option value="">No partner</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {partnerLabel(p)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => applyToAll({ partnerId: defaultPartner })}
                disabled={running || rows.length === 0}
                className={adminButton("secondary", "h-10 shrink-0 text-xs")}
                title="Set every row that isn't finished to this partner"
              >
                All rows
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="batch-sender" className={labelClass}>
              Sender on reveal page
            </label>
            <div className="flex gap-2">
              <input
                id="batch-sender"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={80}
                placeholder="The Pup Prints studio"
                className={inputClass}
                disabled={running}
              />
              {defaultPartner && partnerById.get(defaultPartner)?.name && senderName !== partnerById.get(defaultPartner)?.name && (
                <button
                  type="button"
                  onClick={() => setSenderName(partnerById.get(defaultPartner)?.name ?? "")}
                  disabled={running}
                  className={adminButton("secondary", "h-10 shrink-0 text-xs")}
                  title="Use the default partner's name (e.g. the salon for Groomed Portrait Day)"
                >
                  Use partner
                </button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="batch-note" className={labelClass}>
              Note on every reveal (optional)
            </label>
            <input
              id="batch-note"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              placeholder="Fresh from the salon chair…"
              className={inputClass}
              disabled={running}
            />
          </div>
        </div>
      </section>

      {/* 3) Rows */}
      <section className="rounded-xl border border-line bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="font-sans text-sm font-semibold tracking-normal">3 · Review and create</h2>
          <div className="flex flex-wrap items-center gap-2">
            {!running && rows.length > 0 && (
              <button type="button" onClick={() => remove(rows.map((r) => r.key))} className={adminButton("secondary", "h-8 text-xs")}>
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </button>
            )}
            {running ? (
              <button type="button" onClick={() => {
                  stopRef.current = true;
                  setStopping(true);
                }} className={adminButton("danger", "h-9")}>
                <Square className="h-3.5 w-3.5" /> Stop after this one
              </button>
            ) : (
              <button type="button" onClick={() => run()} disabled={pending.length === 0} className={adminButton("accent", "h-9")}>
                <Wand2 className="h-4 w-4" />
                {failed.length > 0 && failed.length === pending.length
                  ? `Retry ${failed.length} failed`
                  : `Create ${pending.length} portrait${pending.length === 1 ? "" : "s"}`}
              </button>
            )}
          </div>
        </header>

        {running && (
          <div className="border-b border-line px-4 py-3" aria-live="polite">
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span>
                Creating row {currentIndex} · <span className="tabular-nums">{elapsed}s</span>
                {stopping && <span className="text-ink-3"> · stopping after this one</span>}
              </span>
              <span className="tabular-nums text-ink-3">
                {finishedInRun} of {runTotal} finished
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-paper-2">
              <div className="h-1.5 rounded-full bg-ink transition-all" style={{ width: `${runTotal ? (finishedInRun / runTotal) * 100 : 0}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-ink-3">One at a time (about 20–60 s each). Keep this tab open; failed rows are skipped and can be retried.</p>
          </div>
        )}
        {runError && (
          <p role="alert" className="mx-4 mt-3 rounded-lg bg-clay-soft px-3 py-2 text-sm text-clay-dark">
            {runError}
          </p>
        )}

        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink-3">Add photos above. Each one becomes a row you can name and style.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-ink-3">
                  <th className="border-b border-line bg-paper/60 py-2 pl-4 pr-2 font-semibold">#</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Photo</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Recipient</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Dog</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Partner</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Style</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Status</th>
                  <th className="border-b border-line bg-paper/60 py-2 pl-2 pr-4">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const locked = running || r.status === "done";
                  const src = r.source.kind === "file" ? r.source.preview : r.source.url;
                  return (
                    <tr key={r.key} className={cn(r.status === "running" && "bg-paper-2/60")}>
                      <td className="border-b border-line/70 py-2 pl-4 pr-2 align-middle tabular-nums text-ink-3">{i + 1}</td>
                      <td className="border-b border-line/70 px-2 py-2 align-middle">
                        {/* Admin-only local blob / pasted URL preview. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Source photo ${i + 1}`}
                          title={r.source.kind === "file" ? r.source.file.name : r.source.url}
                          className="h-14 w-12 rounded object-cover ring-1 ring-line"
                        />
                      </td>
                      <td className="border-b border-line/70 px-2 py-2 align-middle">
                        <label htmlFor={`r-${r.key}-to`} className="sr-only">
                          Recipient name, row {i + 1}
                        </label>
                        <input
                          id={`r-${r.key}-to`}
                          value={r.recipientName}
                          onChange={(e) => update(r.key, { recipientName: e.target.value })}
                          maxLength={80}
                          placeholder="Recipient"
                          disabled={locked}
                          className={cn(inputClass, "h-9 min-w-[130px]")}
                        />
                      </td>
                      <td className="border-b border-line/70 px-2 py-2 align-middle">
                        <label htmlFor={`r-${r.key}-pet`} className="sr-only">
                          Dog&apos;s name, row {i + 1}
                        </label>
                        <input
                          id={`r-${r.key}-pet`}
                          value={r.petName}
                          onChange={(e) => update(r.key, { petName: e.target.value })}
                          maxLength={40}
                          placeholder="Dog"
                          disabled={locked}
                          className={cn(inputClass, "h-9 min-w-[110px]")}
                        />
                      </td>
                      <td className="border-b border-line/70 px-2 py-2 align-middle">
                        <label htmlFor={`r-${r.key}-partner`} className="sr-only">
                          Partner, row {i + 1}
                        </label>
                        <select
                          id={`r-${r.key}-partner`}
                          value={r.partnerId}
                          onChange={(e) => update(r.key, { partnerId: e.target.value })}
                          disabled={locked}
                          className={cn(inputClass, "h-9 max-w-[220px] pr-7")}
                        >
                          <option value="">No partner</option>
                          {partners.map((p) => (
                            <option key={p.id} value={p.id}>
                              {partnerLabel(p)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-b border-line/70 px-2 py-2 align-middle">
                        <label htmlFor={`r-${r.key}-style`} className="sr-only">
                          Style, row {i + 1}
                        </label>
                        <select
                          id={`r-${r.key}-style`}
                          value={r.style}
                          onChange={(e) => update(r.key, { style: e.target.value })}
                          disabled={locked}
                          className={cn(inputClass, "h-9 min-w-[130px] pr-7")}
                        >
                          {STYLES.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-b border-line/70 px-2 py-2 align-middle text-xs">
                        {r.status === "running" ? (
                          <span className="inline-flex items-center gap-1 font-medium text-ink">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> {elapsed}s
                          </span>
                        ) : r.status === "failed" ? (
                          <span className="font-medium text-clay-dark" title={r.error}>
                            Failed
                          </span>
                        ) : r.status === "done" ? (
                          <span className="font-medium text-moss">Created</span>
                        ) : (
                          <span className="text-ink-3">{labelize(r.status)}</span>
                        )}
                      </td>
                      <td className="border-b border-line/70 py-2 pl-2 pr-4 text-right align-middle">
                        {!running && (
                          <button
                            type="button"
                            onClick={() => remove([r.key])}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink"
                            aria-label={`Remove row ${i + 1}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4) Results */}
      {results.length > 0 && (
        <section className="rounded-xl border border-line bg-white">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 className="font-sans text-sm font-semibold tracking-normal">
              Results · {done.length} created{failed.length > 0 && `, ${failed.length} failed`}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyCsv} className={adminButton("primary", "h-8 text-xs")}>
                {csvCopied ? "Copied" : "Copy all as CSV"}
              </button>
              <button type="button" onClick={downloadCsv} className={adminButton("secondary", "h-8 text-xs")}>
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
              <Link href="/admin/gifts" className={adminButton("secondary", "h-8 text-xs")}>
                All gifts
              </Link>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-ink-3">
                  <th className="border-b border-line bg-paper/60 py-2 pl-4 pr-2 font-semibold">#</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Portrait</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">For</th>
                  <th className="border-b border-line bg-paper/60 px-2 py-2 font-semibold">Reveal link / DM</th>
                  <th className="border-b border-line bg-paper/60 py-2 pl-2 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const idx = rows.findIndex((x) => x.key === r.key) + 1;
                  const p = r.partnerId ? partnerById.get(r.partnerId) : undefined;
                  return (
                    <tr key={r.key}>
                      <td className="border-b border-line/70 py-2 pl-4 pr-2 align-top tabular-nums text-ink-3">{idx}</td>
                      <td className="border-b border-line/70 px-2 py-2 align-top">
                        {r.result?.imageUrl ? (
                          <a href={r.result.revealUrl} target="_blank" rel="noreferrer" title="Open reveal page">
                            {/* Signed URL (1 h), so skip the image optimizer. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={r.result.imageUrl}
                              alt={`${styleName(r.result.style)} portrait${r.petName ? ` of ${r.petName}` : ""}`}
                              className="h-20 w-16 rounded object-cover ring-1 ring-line"
                            />
                          </a>
                        ) : (
                          <span className="grid h-20 w-16 place-items-center rounded bg-paper-2 text-[10px] text-ink-3">—</span>
                        )}
                      </td>
                      <td className="border-b border-line/70 px-2 py-2 align-top">
                        <p className="font-medium">{r.petName || "Unnamed pup"}</p>
                        <p className="text-xs text-ink-3">
                          {r.recipientName ? `for ${r.recipientName}` : "no recipient"} · {styleName(r.result?.style ?? r.style)}
                        </p>
                        {p && <p className="text-xs text-ink-2">{p.name || (p.handle ? `@${p.handle}` : "Partner")}</p>}
                      </td>
                      <td className="max-w-[420px] border-b border-line/70 px-2 py-2 align-top">
                        {r.status === "done" && r.result ? (
                          <>
                            <p className="break-all font-mono text-xs">{r.result.revealUrl}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-ink-3">{r.result.dm}</p>
                          </>
                        ) : (
                          <p role="alert" className="text-xs text-clay-dark">
                            {r.error ?? "Failed"}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-line/70 py-2 pl-2 pr-4 align-top">
                        {r.status === "done" && r.result ? (
                          <div className="flex flex-wrap gap-1.5">
                            <CopyButton value={r.result.dm} label="Copy DM" />
                            <CopyButton value={r.result.revealUrl} label="Link" />
                            <a href={r.result.revealUrl} target="_blank" rel="noreferrer" className={adminButton("secondary", "h-8 text-xs")}>
                              Open <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteGift(r)}
                              disabled={running || deleting !== null}
                              className={adminButton("danger", "h-8 w-8 px-0")}
                              aria-label={`Delete gift ${idx}`}
                              title="Delete this gift (only before the link is opened)"
                            >
                              {deleting === r.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => run([r.key])} disabled={running} className={adminButton("secondary", "h-8 text-xs")}>
                            <RotateCcw className="h-3.5 w-3.5" /> Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
