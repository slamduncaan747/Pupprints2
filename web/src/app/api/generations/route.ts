import { BUCKETS, db, previewUrl, signedUrl } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerationRow = {
  id: string;
  created_at: string;
  style: string;
  pet_name: string | null;
  preview_path: string | null;
  upload_id: string | null;
  width: number | null;
  height: number | null;
};

type UploadRow = { id: string; created_at: string; storage_path: string; width: number | null; height: number | null };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

/**
 * This browser session's recent successful previews (newest first), plus a fresh signed URL
 * for the most recent upload so the create flow can restore itself after a reload.
 */
export async function GET() {
  const sessionId = await getSessionId();
  const supabase = db();
  if (!sessionId || !supabase) return json({ generations: [], upload: null });

  const [{ data: gens }, { data: uploads }] = await Promise.all([
    supabase
      .from("generations")
      .select("id, created_at, style, pet_name, preview_path, upload_id, width, height")
      .eq("session_id", sessionId)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("uploads")
      .select("id, created_at, storage_path, width, height")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const generations = ((gens ?? []) as GenerationRow[])
    .filter((g) => g.preview_path)
    .map((g) => ({
      generationId: g.id,
      style: g.style,
      previewUrl: previewUrl(g.preview_path as string),
      createdAt: g.created_at,
      petName: g.pet_name,
      uploadId: g.upload_id,
      width: g.width,
      height: g.height,
    }));

  let upload: { uploadId: string; url: string; width: number | null; height: number | null; createdAt: string } | null =
    null;
  const latest = (uploads as UploadRow[] | null)?.[0];
  if (latest) {
    try {
      upload = {
        uploadId: latest.id,
        url: await signedUrl(BUCKETS.uploads, latest.storage_path, 60 * 60 * 24),
        width: latest.width,
        height: latest.height,
        createdAt: latest.created_at,
      };
    } catch {
      upload = null;
    }
  }

  return json({ generations, upload });
}
