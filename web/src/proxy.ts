import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminEnabled, isValidAdminSession } from "@/lib/admin-auth";

/**
 * Guards the admin: every /admin/** page and /api/admin/** route requires a valid
 * `pp_admin` session cookie, except the login page and the login/logout endpoints.
 * Route handlers and the admin layout re-check the session (defense in depth).
 */
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (PUBLIC_PATHS.has(normalized)) return NextResponse.next();

  const isApi = normalized.startsWith("/api/");
  const ok = adminEnabled() && (await isValidAdminSession(req.cookies.get(ADMIN_COOKIE)?.value));
  if (ok) {
    const res = NextResponse.next();
    res.headers.set("x-robots-tag", "noindex, nofollow");
    res.headers.set("cache-control", "private, no-store");
    return res;
  }

  if (isApi) {
    return NextResponse.json(
      { ok: false, error: adminEnabled() ? "Unauthorized" : "Admin is disabled (ADMIN_PASSWORD not set)" },
      { status: adminEnabled() ? 401 : 503, headers: { "cache-control": "no-store" } },
    );
  }

  const login = new URL("/admin/login", req.url);
  login.searchParams.set("next", `${normalized}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
