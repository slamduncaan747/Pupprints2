"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only value with a copy button (share link, discount code). */
export function CopyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const id = `copy-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-xl bg-white px-4 text-[15px] text-ink outline-none ring-1 ring-line focus:ring-2 focus:ring-ink",
            mono && "font-mono tracking-wide",
          )}
        />
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              document.getElementById(id)?.focus();
            }
          }}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper transition hover:bg-ink/90"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
