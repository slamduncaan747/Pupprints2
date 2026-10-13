import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { site } from "@/lib/config";
import { BUCKETS } from "@/lib/supabase/server";
import { giftDm } from "@/components/admin/constants";

/** Unwatermarked web-size JPEG for the reveal page (gifts are free, so no watermark). */
export function giftImagePath(giftId: string) {
  return `gifts/${giftId}.jpg`;
}

export function giftRevealUrl(token: string) {
  return `${site.url}/reveal/${token}`;
}

export type GiftRow = {
  id: string;
  created_at: string;
  reveal_token: string;
  generation_id: string | null;
  partner_id: string | null;
  recipient_name: string | null;
  pet_name: string | null;
  sender_name: string | null;
  message: string | null;
  source_photo_url: string | null;
  viewed_at: string | null;
  view_count: number;
};

export type GiftView = GiftRow & {
  imageUrl: string | null;
  revealUrl: string;
  dm: string;
  style: string | null;
  partner: { id: string; name: string | null; handle: string | null; platform: string | null } | null;
};

/** Gifts (newest first) with signed image URLs, reveal links and the outreach DM. */
export async function loadGifts(c: SupabaseClient, opts: { partnerId?: string; limit?: number } = {}): Promise<GiftView[]> {
  let q = c
    .from("gifts")
    .select(
      "id, created_at, reveal_token, generation_id, partner_id, recipient_name, pet_name, sender_name, message, source_photo_url, viewed_at, view_count, generations(style), partners(id, name, handle, platform)",
    )
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 200);
  if (opts.partnerId) q = q.eq("partner_id", opts.partnerId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);

  type Joined = GiftRow & {
    generations: { style: string } | { style: string }[] | null;
    partners: GiftView["partner"] | GiftView["partner"][] | null;
  };
  const rows = (data ?? []) as Joined[];
  const first = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? (v[0] ?? null) : v);

  const signed = new Map<string, string>();
  if (rows.length) {
    const { data: urls } = await c.storage
      .from(BUCKETS.portraits)
      .createSignedUrls(
        rows.map((r) => giftImagePath(r.id)),
        60 * 60,
      );
    for (const u of urls ?? []) if (u.path && u.signedUrl && !u.error) signed.set(u.path, u.signedUrl);
  }

  return rows.map(({ generations, partners, ...g }) => {
    const revealUrl = giftRevealUrl(g.reveal_token);
    return {
      ...g,
      imageUrl: signed.get(giftImagePath(g.id)) ?? null,
      revealUrl,
      dm: giftDm({ name: g.recipient_name, pet: g.pet_name, link: revealUrl }),
      style: first(generations)?.style ?? null,
      partner: first(partners),
    };
  });
}
