import "server-only";
import { requireDb } from "@/lib/supabase/server";

type Bucket = "uploads" | "portraits" | "previews";
type UploadOptions = { contentType: string; upsert?: boolean; cacheControl?: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Write an object to Supabase Storage, retrying transient failures (network blips surface as
 * `StorageUnknownError`). Used for customer photos and AI results — losing a paid generation
 * to a one-off 5xx would be the worst outcome.
 */
export async function storeObject(bucket: Bucket, path: string, bytes: Buffer, options: UploadOptions, attempts = 3) {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    const { error } = await requireDb().storage.from(bucket).upload(path, bytes, options);
    if (!error) return;
    lastError = error;
    const cause = (error as { originalError?: unknown }).originalError;
    console.warn(`[storage] ${bucket}/${path} attempt ${i + 1} failed: ${error.message}`, cause ?? "");
    if (i < attempts - 1) await sleep(400 * 2 ** i);
  }
  throw new Error(`Storage write failed for ${bucket}/${path}: ${(lastError as Error)?.message ?? lastError}`);
}
