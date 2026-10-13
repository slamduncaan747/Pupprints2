import type { Metadata } from "next";
import Image from "next/image";
import { db, previewUrl } from "@/lib/supabase/server";
import { STYLES, getStyle } from "@/lib/catalog";
import { Card, DbMissing, EmptyState, ErrorNote, FilterTabs, PageHeader, StatusPill, adminButton, fmtDate, inputClass } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Generations", robots: { index: false, follow: false } };

type Gen = {
  id: string;
  created_at: string;
  session_id: string | null;
  pet_name: string | null;
  email: string | null;
  style: string;
  status: string;
  provider: string | null;
  model: string | null;
  preview_path: string | null;
  error: string | null;
  duration_ms: number | null;
  width: number | null;
  height: number | null;
};

const STATUS_TABS = ["all", "succeeded", "failed", "processing", "pending"] as const;

export default async function GenerationsPage({ searchParams }: PageProps<"/admin/generations">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (STATUS_TABS as readonly string[]).includes(sp.status) ? sp.status : "all";
  const style = typeof sp.style === "string" && getStyle(sp.style) ? sp.style : "";
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Generations" />
        <DbMissing />
      </>
    );
  }

  let q = c
    .from("generations")
    .select("id, created_at, session_id, pet_name, email, style, status, provider, model, preview_path, error, duration_ms, width, height")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") q = q.eq("status", status);
  if (style) q = q.eq("style", style);
  const { data, error } = await q;
  const gens = (data ?? []) as Gen[];

  const done = gens.filter((g) => g.status === "succeeded" && g.duration_ms);
  const avgMs = done.length ? done.reduce((s, g) => s + (g.duration_ms ?? 0), 0) / done.length : null;
  const failed = gens.filter((g) => g.status === "failed").length;

  const href = (s: string) => {
    const p = new URLSearchParams();
    if (s !== "all") p.set("status", s);
    if (style) p.set("style", style);
    const qs = p.toString();
    return qs ? `/admin/generations?${qs}` : "/admin/generations";
  };

  return (
    <>
      <PageHeader
        title="Generations"
        subtitle={`Latest ${gens.length} · avg ${avgMs ? `${(avgMs / 1000).toFixed(1)}s` : "—"} · ${failed} failed in view`}
      />
      <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <FilterTabs current={status} items={STATUS_TABS.map((s) => ({ value: s, label: s === "all" ? "All" : s[0].toUpperCase() + s.slice(1), href: href(s) }))} />
        <form method="get" className="mb-4 flex gap-2">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <label htmlFor="style" className="sr-only">
            Style
          </label>
          <select id="style" name="style" defaultValue={style} className={`${inputClass} w-44`}>
            <option value="">All styles</option>
            {STYLES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <button type="submit" className={adminButton("secondary")}>
            Apply
          </button>
        </form>
      </div>
      {error && <ErrorNote message={error.message} />}

      {gens.length === 0 ? (
        <Card>
          <EmptyState title="No generations match">Previews appear here as customers create them.</EmptyState>
        </Card>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {gens.map((g) => (
            <li key={g.id} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="relative aspect-[4/5] bg-paper-2">
                {g.preview_path ? (
                  <a href={previewUrl(g.preview_path)} target="_blank" rel="noreferrer" title="Open full preview">
                    <Image
                      src={previewUrl(g.preview_path)}
                      alt={`${getStyle(g.style)?.name ?? g.style} preview${g.pet_name ? ` of ${g.pet_name}` : ""}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 220px"
                      className="object-cover"
                    />
                  </a>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-ink-3">
                    {g.status === "failed" ? "Failed" : "No image"}
                  </div>
                )}
                <StatusPill status={g.status} className="absolute left-2 top-2 shadow-sm" />
              </div>
              <div className="space-y-0.5 p-2.5 text-xs">
                <p className="truncate text-sm font-medium text-ink">
                  {getStyle(g.style)?.name ?? g.style}
                  {g.pet_name && <span className="font-normal text-ink-3"> · {g.pet_name}</span>}
                </p>
                <p className="truncate text-ink-3" title={[g.provider, g.model].filter(Boolean).join(" / ")}>
                  {[g.provider, g.model].filter(Boolean).join(" / ") || "—"}
                  {g.duration_ms != null && ` · ${(g.duration_ms / 1000).toFixed(1)}s`}
                </p>
                <p className="text-ink-3">{fmtDate(g.created_at)}</p>
                {g.session_id && (
                  <p className="truncate font-mono text-[10px] text-ink-3" title={g.session_id}>
                    {g.session_id.slice(0, 12)}
                  </p>
                )}
                {g.error && (
                  <p className="line-clamp-3 rounded bg-clay-soft px-1.5 py-1 text-clay-dark" title={g.error}>
                    {g.error}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
