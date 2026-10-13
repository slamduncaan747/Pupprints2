import type { Metadata } from "next";
import { db } from "@/lib/supabase/server";
import { aiAvailable } from "@/lib/ai";
import { GiftStudio } from "@/components/admin/gift-studio";
import { GiftList } from "@/components/admin/gift-list";
import { loadGifts } from "@/components/admin/gifts";
import { Card, DbMissing, ErrorNote, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gifts", robots: { index: false, follow: false } };

export default async function GiftsPage() {
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Gifts" />
        <DbMissing />
      </>
    );
  }
  let gifts: Awaited<ReturnType<typeof loadGifts>> = [];
  let error: string | null = null;
  try {
    gifts = await loadGifts(c, { limit: 200 });
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load gifts";
  }
  const opened = gifts.filter((g) => g.view_count > 0).length;
  const views = gifts.reduce((s, g) => s + g.view_count, 0);

  return (
    <>
      <PageHeader
        title="Gifts"
        subtitle={`${gifts.length} gift portraits · ${opened} opened (${gifts.length ? Math.round((opened / gifts.length) * 100) : 0}%) · ${views} total views`}
      />
      {error && <ErrorNote message={error} />}
      <Card title="All gifts" className="mb-6">
        <GiftList gifts={gifts} />
      </Card>

      <details className="group rounded-xl border border-line bg-white">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          <span className="mr-1 inline-block transition group-open:rotate-90">›</span> New gift without a partner record
          <span className="ml-2 font-normal text-ink-3">(usually start from a partner instead, so the CRM stays in sync)</span>
        </summary>
        <div className="border-t border-line p-4">
          {!aiAvailable() && <ErrorNote message="No AI image provider is configured yet, so portraits can't be created." />}
          <GiftStudio />
        </div>
      </details>
    </>
  );
}
