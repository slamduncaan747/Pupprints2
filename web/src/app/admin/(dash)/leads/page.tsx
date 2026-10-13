import type { Metadata } from "next";
import { Download, Search } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { escapeLike } from "@/components/partners/program";
import { Card, DbMissing, EmptyState, ErrorNote, PageHeader, Table, Td, Th, adminButton, fmtDate, inputClass } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };

type Lead = {
  id: string;
  created_at: string;
  email: string;
  source: string | null;
  pet_name: string | null;
  generation_id: string | null;
  referral_code: string | null;
  utm: Record<string, string> | null;
  consent: boolean;
  unsubscribed_at: string | null;
};

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Leads" />
        <DbMissing />
      </>
    );
  }

  let query = c
    .from("leads")
    .select("id, created_at, email, source, pet_name, generation_id, referral_code, utm, consent, unsubscribed_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .limit(500);
  if (q) query = query.ilike("email", `%${escapeLike(q.toLowerCase())}%`);
  const { data, error, count } = await query;
  const leads = (data ?? []) as Lead[];

  const bySource = new Map<string, number>();
  for (const l of leads) bySource.set(l.source ?? "unknown", (bySource.get(l.source ?? "unknown") ?? 0) + 1);

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${count ?? leads.length} ${q ? "matching" : "total"} · showing latest ${leads.length}`}
        actions={
          <a href="/api/admin/leads.csv" className={adminButton("primary")} download>
            <Download className="h-4 w-4" /> Export CSV
          </a>
        }
      />
      <form method="get" className="mb-4 flex max-w-md gap-2">
        <label htmlFor="q" className="sr-only">
          Search email
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Search email" className={inputClass} />
        <button type="submit" className={adminButton("secondary")} aria-label="Search">
          <Search className="h-4 w-4" />
        </button>
      </form>
      {bySource.size > 0 && (
        <p className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
          {[...bySource.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([s, n]) => (
              <span key={s}>
                <span className="font-medium text-ink-2">{s}</span> {n}
              </span>
            ))}
        </p>
      )}
      {error && <ErrorNote message={error.message} />}
      <Card>
        {leads.length === 0 ? (
          <EmptyState title={q ? "No leads match" : "No leads yet"}>
            Newsletter sign-ups and saved previews land here.
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Captured</Th>
                <Th>Source</Th>
                <Th>Pet</Th>
                <Th>Ref</Th>
                <Th>UTM</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-paper/50">
                  <Td className="max-w-[260px] truncate font-medium">{l.email}</Td>
                  <Td className="whitespace-nowrap text-ink-2">{fmtDate(l.created_at)}</Td>
                  <Td className="text-ink-2">{l.source ?? "—"}</Td>
                  <Td className="text-ink-2">{l.pet_name ?? ""}</Td>
                  <Td className="font-mono text-xs">{l.referral_code ?? ""}</Td>
                  <Td className="max-w-[200px] truncate text-xs text-ink-3">
                    {l.utm ? [l.utm.utm_source, l.utm.utm_medium, l.utm.utm_campaign].filter(Boolean).join(" / ") : ""}
                  </Td>
                  <Td className="text-xs">
                    {l.unsubscribed_at ? (
                      <span className="text-clay-dark">Unsubscribed</span>
                    ) : l.consent ? (
                      <span className="text-moss">Subscribed</span>
                    ) : (
                      <span className="text-ink-3">No consent</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
