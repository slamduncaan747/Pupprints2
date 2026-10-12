import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, features } from "@/lib/env";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client. Authenticates with the publishable key plus the
 * `x-pp-server-key` header that our RLS policies require (see supabase/migrations).
 * Returns null when Supabase is not configured so callers can degrade gracefully.
 */
export function db(): SupabaseClient | null {
  if (!features.supabase) return null;
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "x-pp-server-key": env.supabaseServerKey } },
    });
  }
  return client;
}

export function requireDb(): SupabaseClient {
  const c = db();
  if (!c) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVER_KEY)");
  return c;
}

export const BUCKETS = {
  uploads: "uploads",
  portraits: "portraits",
  previews: "previews",
} as const;

/** Public URL for an object in the public `previews` bucket. */
export function previewUrl(path: string) {
  return `${env.supabaseUrl}/storage/v1/object/public/${BUCKETS.previews}/${path}`;
}

/** Short-lived signed URL for a private object (uploads / portraits). */
export async function signedUrl(bucket: "uploads" | "portraits", path: string, expiresIn = 60 * 60) {
  const { data, error } = await requireDb().storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data) throw new Error(`Could not sign ${bucket}/${path}: ${error?.message}`);
  return data.signedUrl;
}
