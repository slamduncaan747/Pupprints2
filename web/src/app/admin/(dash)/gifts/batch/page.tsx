import type { Metadata } from "next";
import { aiAvailable } from "@/lib/ai";
import { db } from "@/lib/supabase/server";
import { BatchGiftStudio, type BatchPartner } from "@/components/admin/batch-gifts";
import { DbMissing, ErrorNote, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Batch gifts", robots: { index: false, follow: false } };

/** Up to 20 gift portraits in one go ("we paint your dogs" rounds, Groomed Portrait Day, B2B outreach). */
export default async function BatchGiftsPage({ searchParams }: PageProps<"/admin/gifts/batch">) {
  const sp = await searchParams;
  const back = { href: "/admin/gifts", label: "Gifts" };
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Batch gifts" back={back} />
        <DbMissing />
      </>
    );
  }

  const { data, error } = await c
    .from("partners")
    .select("id, name, handle, platform, niche, status")
    .order("name", { ascending: true, nullsFirst: false })
    .limit(2000);
  const partners: BatchPartner[] = ((data ?? []) as BatchPartner[]).sort((a, b) =>
    (a.name || a.handle || "").localeCompare(b.name || b.handle || "", "en", { sensitivity: "base" }),
  );
  const requested = typeof sp.partner === "string" ? sp.partner : "";
  const defaultPartnerId = partners.some((p) => p.id === requested) ? requested : "";

  return (
    <>
      <PageHeader
        title="Batch gifts"
        back={back}
        subtitle="Up to 20 photos at a time. Portraits are created one after another (about 20–60 s each); keep this tab open until the run finishes."
      />
      {!aiAvailable() && <ErrorNote message="No AI image provider is configured yet, so portraits can't be created." />}
      {error && <ErrorNote message={`Couldn't load partners: ${error.message}`} />}
      <BatchGiftStudio partners={partners} defaultPartnerId={defaultPartnerId} />
      <p className="mt-6 text-xs text-ink-3">
        Rows with a partner mark that partner as <strong>gifted</strong> and contacted, and give them a referral code if
        they have none (same as the single gift tool). For a salon&apos;s Groomed Portrait Day, set the sender to the
        salon&apos;s name so their clients see it on the reveal page. If anyone posts about a gift, it needs #ad or the
        Paid partnership label.
      </p>
    </>
  );
}
