import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { PawMark } from "@/components/ui/paw";
import { AdminNav } from "@/components/admin/nav";
import { isAdmin } from "@/components/admin/guard";

export const dynamic = "force-dynamic";

export default async function AdminDashLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already guards /admin; this is defense in depth.
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-2 py-3" aria-label="Admin dashboard">
            <PawMark className="h-6 w-6 text-clay" />
            <span className="hidden text-sm font-semibold sm:inline">Pup Prints</span>
            <span className="rounded bg-paper/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-paper/70">
              Admin
            </span>
          </Link>
          <div className="min-w-0 flex-1">
            <AdminNav />
          </div>
          <form action="/api/admin/logout" method="post" className="shrink-0">
            <button
              type="submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-paper/70 hover:bg-paper/10 hover:text-paper"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Log out</span>
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </>
  );
}
