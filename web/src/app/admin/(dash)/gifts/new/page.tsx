import type { Metadata } from "next";
import { aiAvailable } from "@/lib/ai";
import { FOUNDING, foundingOfferOpen } from "@/lib/launch";
import { db } from "@/lib/supabase/server";
import { GiftStudio } from "@/components/admin/gift-studio";
import { Card, DbMissing, ErrorNote, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New gift", robots: { index: false, follow: false } };

/** Standalone gift portrait (friends, past customers, local shops): no partner record needed. */
export default function NewGiftPage() {
  const back = { href: "/admin/gifts", label: "Gifts" };
  if (!db()) {
    return (
      <>
        <PageHeader title="New gift" back={back} />
        <DbMissing />
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="New gift"
        back={back}
        subtitle="A free portrait for someone who isn't in the partner CRM. For creators, start from their partner page so the CRM and their code stay in sync."
      />
      {!aiAvailable() && <ErrorNote message="No AI image provider is configured yet, so portraits can't be created." />}
      <Card className="mb-6">
        <div className="p-4">
          <GiftStudio />
        </div>
      </Card>
      <p className="text-xs text-ink-3">
        {foundingOfferOpen()
          ? `The prefilled DM for gifts without a partner mentions ${FOUNDING.code} (${FOUNDING.percentOff}% off through ${FOUNDING.deadlineLabel}, first ${FOUNDING.maxRedemptions} orders).`
          : "The prefilled DM is a plain no-strings gift note."}{" "}
        If the recipient posts about it, it needs #ad or the Paid partnership label.
      </p>
    </>
  );
}
