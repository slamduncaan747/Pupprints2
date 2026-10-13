import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminEnabled, isValidAdminSession } from "@/lib/admin-auth";

/** True when the current request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  if (!adminEnabled()) return false;
  const store = await cookies();
  return isValidAdminSession(store.get(ADMIN_COOKIE)?.value);
}

/** For /api/admin route handlers: returns a 401 response when not authorized, else null. */
export async function adminApiGuard(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: { "cache-control": "no-store" } });
}

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status, headers: { "cache-control": "no-store" } });
}
