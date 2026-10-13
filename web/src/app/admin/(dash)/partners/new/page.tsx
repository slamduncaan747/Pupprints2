import type { Metadata } from "next";
import { PartnerForm } from "@/components/admin/partner-form";
import { Card, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add partner", robots: { index: false, follow: false } };

export default function NewPartnerPage() {
  return (
    <>
      <PageHeader title="Add partner" back={{ href: "/admin/partners", label: "Partners" }} />
      <Card className="max-w-3xl">
        <div className="p-4">
          <PartnerForm />
        </div>
      </Card>
    </>
  );
}
