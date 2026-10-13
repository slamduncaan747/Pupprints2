"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/generations", label: "Generations" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "/admin";
  return (
    <nav aria-label="Admin" className="-mb-px flex gap-1 overflow-x-auto">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-3 py-3 text-sm transition-colors",
              active ? "border-paper font-medium text-paper" : "border-transparent text-paper/60 hover:text-paper",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
