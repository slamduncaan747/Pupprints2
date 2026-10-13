import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/ui/paw";
import { adminEnabled, safeAdminNext } from "@/lib/admin-auth";
import { isAdmin } from "@/components/admin/guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const next = safeAdminNext(typeof sp.next === "string" ? sp.next : null);
  const error = sp.error === "1";
  const enabled = adminEnabled();
  if (enabled && (await isAdmin())) redirect(next);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper-2">
              <Lock className="h-4 w-4 text-ink-2" />
            </span>
            <div>
              <h1 className="font-sans text-lg font-semibold tracking-tight">Admin sign in</h1>
              <p className="text-sm text-ink-3">Orders, partners and ops.</p>
            </div>
          </div>

          {!enabled ? (
            <p className="rounded-lg bg-paper-2 p-4 text-sm text-ink-2">
              The admin is disabled because <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> is not set. Add it to
              the environment variables and redeploy.
            </p>
          ) : (
            <form action="/api/admin/login" method="post" className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  aria-invalid={error || undefined}
                  aria-describedby={error ? "login-error" : undefined}
                  className="h-11 w-full rounded-lg border border-line bg-white px-3 text-[15px] outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                />
                {error && (
                  <p id="login-error" role="alert" className="mt-2 text-sm text-clay-dark">
                    That password didn&apos;t work. Try again.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-ink text-[15px] font-medium text-paper transition hover:bg-ink/90"
              >
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
