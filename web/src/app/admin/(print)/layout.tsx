import { redirect } from "next/navigation";
import { isAdmin } from "@/components/admin/guard";

export const dynamic = "force-dynamic";

/** Bare admin pages meant for printing (no admin header). proxy.ts guards /admin too. */
export default async function AdminPrintLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return <>{children}</>;
}
