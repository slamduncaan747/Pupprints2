import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { GiftList } from "@/components/admin/gift-list";
import { loadGifts } from "@/components/admin/gifts";
import { Card, DbMissing, ErrorNote, PageHeader, adminButton } from "@/components/admin/ui";

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
        actions={
          <Link href="/admin/gifts/new" className={adminButton("primary")}>
            <Plus className="h-4 w-4" /> New gift
          </Link>
        }
      />
      {error && <ErrorNote message={error} />}
      <Card title="All gifts">
        <GiftList gifts={gifts} />
      </Card>
    </>
  );
}
