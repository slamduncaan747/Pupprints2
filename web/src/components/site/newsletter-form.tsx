"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function NewsletterForm({
  source,
  className,
  cta = "Subscribe",
  dark = false,
  successMessage,
}: {
  source: string;
  className?: string;
  cta?: string;
  dark?: boolean;
  /** Overrides the default "WELCOME10 is on its way" confirmation. */
  successMessage?: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error();
      track("Lead", { source });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className={cn("flex items-center gap-2 text-[15px] font-medium", dark ? "text-paper" : "text-moss", className)}>
        <Check className="h-4 w-4" />{" "}
        {successMessage ?? (
          <>
            You&apos;re in. Your code <span className="font-semibold">WELCOME10</span> is on its way.
          </>
        )}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full max-w-md items-end gap-4", className)}>
      <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
      <input size={1}
        id={`nl-${source}`}
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          "h-12 min-w-0 flex-1 rounded-none border-0 border-b bg-transparent px-0 text-[14px] outline-none ring-0 transition",
          dark
            ? "border-paper/40 text-paper placeholder:text-paper/50 focus:border-paper"
            : "border-ink/30 text-ink placeholder:text-ink-3 focus:border-ink",
        )}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={cn(
          "inline-flex h-12 shrink-0 items-center gap-2 rounded-none px-2 text-[11px] font-medium uppercase tracking-[0.2em] transition",
          dark ? "text-paper hover:opacity-60" : "text-ink hover:opacity-60",
        )}
      >
        {state === "loading" ? "…" : cta} <ArrowRight className="h-4 w-4" />
      </button>
      {state === "error" && <span className="sr-only" role="alert">Something went wrong, please try again.</span>}
    </form>
  );
}
