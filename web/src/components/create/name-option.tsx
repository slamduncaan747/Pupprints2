"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { updateFlow } from "./store";

/**
 * "Add the name to the portrait": one checkbox, shown wherever a name has been typed. On by
 * default; it applies to portraits made from then on, in any style.
 */
export function NameOption({
  checked,
  name,
  onChange,
  className,
}: {
  checked: boolean;
  /** The dog's name, to say exactly what will be added. */
  name?: string;
  /** Called after the choice is saved (e.g. to remake the portrait on screen). */
  onChange?: (checked: boolean) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-3 text-left", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          const nameOnArt = e.target.checked;
          updateFlow((s) => ({ ...s, nameOnArt }));
          onChange?.(nameOnArt);
        }}
        className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-none border border-ink-3 bg-paper transition-colors checked:border-ink checked:bg-ink checked:shadow-[inset_0_0_0_3px_var(--color-paper)] hover:border-ink"
      />
      <span className="text-[14px] text-ink">{name ? `Add “${name}” to the portrait` : "Add the name to the portrait"}</span>
    </label>
  );
}
