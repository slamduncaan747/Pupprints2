"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Read-only value with a copy button (share link, discount code). */
export function CopyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const id = `copy-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="label mb-1 block text-ink-3">
        {label}
      </label>
      <div className="flex items-end gap-5 border-b border-ink/25 focus-within:border-ink">
        <input
          id={id}
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-[15px] text-ink outline-none focus-visible:outline-none",
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
          className="link-cta h-12 shrink-0 text-ink"
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
