"use client";

import { Printer } from "lucide-react";
import { adminButton } from "@/components/admin/ui";

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={adminButton("primary")}>
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
