import type { Metadata } from "next";
import { PartnerImport } from "@/components/admin/partner-import";
import { IMPORT_HEADER } from "@/components/admin/constants";
import { Card, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Import partners", robots: { index: false, follow: false } };

export default function ImportPartnersPage() {
  return (
    <>
      <PageHeader
        title="Import partners"
        subtitle="Bulk-add researched creators from a spreadsheet"
        back={{ href: "/admin/partners", label: "Partners" }}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="p-4">
            <PartnerImport />
          </div>
        </Card>
        <Card title="Format">
          <div className="space-y-3 p-4 text-sm text-ink-2">
            <p>First row must be a header. Columns (any order; handle + platform required):</p>
            <code className="block break-all rounded bg-paper-2 p-2 font-mono text-xs text-ink">{IMPORT_HEADER}</code>
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>Matches existing rows on platform + handle (case-insensitive) and fills in non-empty fields.</li>
              <li>New rows are added as <strong>prospect</strong> with source <strong>research</strong>.</li>
              <li>Followers accept 12400, 12,400, 12.4k or 1.2M; tier is set automatically.</li>
              <li>Platforms: instagram, tiktok, youtube, pinterest, facebook, blog, other (ig/tt/yt work too).</li>
              <li>Up to 2,000 rows per import.</li>
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
}
