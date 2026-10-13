import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { aiAvailable } from "@/lib/ai";
import type { PartnerRow } from "@/lib/partners";
import { GiftStudio } from "@/components/admin/gift-studio";
import { GiftList } from "@/components/admin/gift-list";
import { loadGifts } from "@/components/admin/gifts";
import { Card, DbMissing, ErrorNote, PageHeader, StatusPill, fmtNum } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gift a portrait", robots: { index: false, follow: false } };

export default async function PartnerGiftPage({ params }: PageProps<"/admin/partners/[id]/gift">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Gift a portrait" back={{ href: "/admin/partners", label: "Partners" }} />
        <DbMissing />
      </>
    );
  }
  const { data: partner } = await c.from("partners").select("*").eq("id", id).maybeSingle<PartnerRow>();
  if (!partner) notFound();

  let gifts: Awaited<ReturnType<typeof loadGifts>> = [];
  let error: string | null = null;
  try {
    gifts = await loadGifts(c, { partnerId: id, limit: 50 });
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load gifts";
  }

  const app = (partner.application ?? {}) as { dog?: { name?: string | null } };
  const display = partner.name || (partner.handle ? `@${partner.handle}` : "this creator");
  const defaultRecipient = partner.name?.split(/\s+/)[0] || (partner.handle ? `@${partner.handle}` : "");

  return (
    <>
      <PageHeader
        back={{ href: `/admin/partners/${id}`, label: display }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            Gift a portrait <StatusPill status={partner.status} />
          </span>
        }
        subtitle={
          <>
            For {display}
            {partner.platform && <> · {partner.platform}</>}
            {partner.followers != null && <> · {fmtNum(partner.followers)} followers</>}
            {partner.profile_url && (
              <>
                {" · "}
                <a href={partner.profile_url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                  open profile to grab a photo
                </a>
              </>
            )}
          </>
        }
      />
      {!aiAvailable() && (
        <ErrorNote message="No AI image provider is configured yet (OPENAI_API_KEY, GEMINI_API_KEY, FAL_KEY or REPLICATE_API_TOKEN). Gift portraits can't be created until one is set." />
      )}
      {error && <ErrorNote message={error} />}

      <Card className="mb-6">
        <div className="p-4">
          <GiftStudio partnerId={id} defaultRecipient={defaultRecipient} defaultPetName={app.dog?.name ?? null} />
        </div>
      </Card>
      <p className="mb-6 text-xs text-ink-3">
        Creating a gift marks {display} as <strong>gifted</strong>, logs today as last contacted (active partners keep
        their status) and assigns a referral code if they don&apos;t have one, so visits from their shared reveal page are
        attributed to them. If they post about it, it needs #ad or the Paid partnership label.
      </p>

      <Card title={`Gifts for ${display} (${gifts.length})`}>
        <GiftList gifts={gifts} showPartner={false} />
      </Card>
    </>
  );
}
