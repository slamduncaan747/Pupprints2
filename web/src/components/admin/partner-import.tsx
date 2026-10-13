"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload } from "lucide-react";
import { adminButton, inputClass, labelClass } from "@/components/admin/ui";
import { IMPORT_HEADER } from "@/components/admin/constants";

type Result = { inserted: number; updated: number; skipped: number; errors: { line: number; error: string }[] };

export function PartnerImport() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setCsv(await file.text());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/partners/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      const json = (await res.json().catch(() => ({}))) as Partial<Result> & { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setResult({ inserted: json.inserted ?? 0, updated: json.updated ?? 0, skipped: json.skipped ?? 0, errors: json.errors ?? [] });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  const rows = csv.trim() ? csv.trim().split(/\r?\n/).length - 1 : 0;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="csv-file" className={labelClass}>
          CSV file
        </label>
        <input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={onFile}
          className="block w-full text-sm text-ink-2 file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:text-sm file:font-medium file:text-paper"
        />
      </div>
      <div>
        <label htmlFor="csv-text" className={labelClass}>
          …or paste CSV
        </label>
        <textarea
          id="csv-text"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={10}
          spellCheck={false}
          placeholder={`${IMPORT_HEADER}\nBella,bella.the.doodle,instagram,,24.5k,doodles,bella@example.com,Found via #doodlesofinstagram`}
          className={`${inputClass} h-auto py-2 font-mono text-xs`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy || !csv.trim()} className={adminButton("primary")}>
          <Upload className="h-4 w-4" />
          {busy ? "Importing…" : `Import${rows > 0 ? ` ${rows} row${rows === 1 ? "" : "s"}` : ""}`}
        </button>
        {error && (
          <span role="alert" className="text-sm text-clay-dark">
            {error}
          </span>
        )}
      </div>
      {result && (
        <div role="status" className="rounded-lg border border-line bg-paper-2/60 p-3 text-sm">
          <p>
            <strong>{result.inserted}</strong> added · <strong>{result.updated}</strong> updated · <strong>{result.skipped}</strong>{" "}
            skipped
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-clay-dark">
              {result.errors.map((e, i) => (
                <li key={i}>
                  Line {e.line}: {e.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
