import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { getStyle } from "@/lib/catalog";
import type { GiftView } from "@/components/admin/gifts";
import { CopyButton } from "@/components/admin/partner-controls";
import { EmptyState, fmtDate } from "@/components/admin/ui";

/** Gift cards: portrait, who it's for, reveal stats and copy actions. */
export function GiftList({ gifts, showPartner = true }: { gifts: GiftView[]; showPartner?: boolean }) {
  if (gifts.length === 0) {
    return <EmptyState title="No gifts yet">Gift portraits you create show up here with their reveal links and view counts.</EmptyState>;
  }
  return (
    <ul className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
      {gifts.map((g) => (
        <li key={g.id} className="flex gap-3 rounded-lg border border-line bg-white p-3">
          <a
            href={g.revealUrl}
            target="_blank"
            rel="noreferrer"
            className="relative block h-28 w-22 shrink-0 overflow-hidden rounded-md bg-paper-2"
            title="Open reveal page"
          >
            {g.imageUrl ? (
              // Signed URL (expires in 1h), so skip the image optimizer.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.imageUrl} alt={`Gift portrait${g.pet_name ? ` of ${g.pet_name}` : ""}`} className="h-full w-full object-cover" />
            ) : (
              <span className="absolute inset-0 grid place-items-center text-[10px] text-ink-3">No image</span>
            )}
          </a>
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium text-ink">
              {g.pet_name || "Unnamed pup"}
              {g.recipient_name && <span className="font-normal text-ink-3"> · for {g.recipient_name}</span>}
            </p>
            <p className="truncate text-xs text-ink-3">
              {g.style ? (getStyle(g.style)?.name ?? g.style) : "—"} · {fmtDate(g.created_at)}
            </p>
            {showPartner && g.partner && (
              <Link href={`/admin/partners/${g.partner.id}`} className="block truncate text-xs text-ink-2 hover:underline">
                {g.partner.name || (g.partner.handle ? `@${g.partner.handle}` : "Partner")}
                {g.partner.platform && <span className="text-ink-3"> · {g.partner.platform}</span>}
              </Link>
            )}
            <p className="mt-1 inline-flex items-center gap-1 text-xs">
              {g.view_count > 0 ? (
                <span className="inline-flex items-center gap-1 text-moss">
                  <Eye className="h-3.5 w-3.5" /> {g.view_count} view{g.view_count === 1 ? "" : "s"}
                  {g.viewed_at && <span className="text-ink-3">· first {fmtDate(g.viewed_at)}</span>}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-ink-3">
                  <EyeOff className="h-3.5 w-3.5" /> Not opened yet
                </span>
              )}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <CopyButton value={g.dm} label="Copy DM" />
              <CopyButton value={g.revealUrl} label="Link" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
