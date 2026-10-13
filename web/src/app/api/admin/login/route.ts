import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminEnabled,
  adminSessionValue,
  checkAdminPassword,
  safeAdminNext,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Accepts the login form (form-encoded → 303 redirect) or JSON (→ JSON). */
export async function POST(req: Request) {
  const isForm = (req.headers.get("content-type") ?? "").includes("form");
  let password = "";
  let next: string | null = null;
  try {
    if (isForm) {
      const form = await req.formData();
      password = String(form.get("password") ?? "");
      next = form.get("next") ? String(form.get("next")) : null;
    } else {
      const body = (await req.json()) as { password?: unknown; next?: unknown };
      password = typeof body.password === "string" ? body.password : "";
      next = typeof body.next === "string" ? body.next : null;
    }
  } catch {
    // fall through with empty password
  }
  const target = safeAdminNext(next);

  if (!adminEnabled()) {
    return isForm
      ? NextResponse.redirect(new URL("/admin/login", req.url), 303)
      : NextResponse.json({ ok: false, error: "Admin is disabled (ADMIN_PASSWORD not set)" }, { status: 503 });
  }

  const valid = password.length > 0 && password.length <= 256 && (await checkAdminPassword(password));
  if (!valid) {
    // Small fixed delay to blunt brute-force attempts.
    await new Promise((r) => setTimeout(r, 600));
    if (isForm) {
      const back = new URL("/admin/login", req.url);
      back.searchParams.set("error", "1");
      if (target !== "/admin") back.searchParams.set("next", target);
      return NextResponse.redirect(back, 303);
    }
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  const value = (await adminSessionValue())!;
  const res = isForm ? NextResponse.redirect(new URL(target, req.url), 303) : NextResponse.json({ ok: true, next: target });
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || new URL(req.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  res.headers.set("cache-control", "no-store");
  return res;
}
