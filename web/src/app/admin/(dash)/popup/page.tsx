import type { Metadata } from "next";
import Link from "next/link";
import { aiAvailable } from "@/lib/ai";
import { getStyle, styleAvailable } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { db } from "@/lib/supabase/server";
import { POPUP_STYLES } from "@/components/admin/popup";
import { PopupStudio, type PopupStyle } from "@/components/admin/popup-studio";
import { DbMissing, ErrorNote, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pop-up", robots: { index: false, follow: false } };

/**
 * Pop-up mode for selling in person: photograph the dog, make the portrait with the gift tool's
 * route (/api/admin/gifts), then hand the owner its reveal link by QR, text or email.
 */
export default function PopupPage() {
  const styles: PopupStyle[] = POPUP_STYLES.flatMap((slug) => {
    const s = getStyle(slug);
    return s && styleAvailable(s) ? [{ slug: s.slug, name: s.name, sample: STYLE_SAMPLES[s.slug] }] : [];
  });
  const cards = (
    <Link href="/admin/popup/card" className="text-sm font-medium text-ink underline underline-offset-4">
      Print cards
    </Link>
  );
  if (!db()) {
    return (
      <div className="mx-auto max-w-md">
        <PageHeader title="Pop-up" actions={cards} />
        <DbMissing />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Pop-up" subtitle="Photo, portrait in about a minute, then they scan to buy." actions={cards} />
      {!aiAvailable() && <ErrorNote message="No AI image provider is configured yet, so portraits can't be created." />}
      <PopupStudio styles={styles} />
    </div>
  );
}
