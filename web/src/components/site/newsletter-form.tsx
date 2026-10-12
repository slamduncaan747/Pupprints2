"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function NewsletterForm({
  source,
  className,
  cta = "Join",
  dark = false,
}: {
  source: string;
  className?: string;
  cta?: string;
  dark?: boolean;
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
        <Check className="h-4 w-4" /> You&apos;re in. Your code <span className="font-semibold">WELCOME10</span> is on its way.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full max-w-md gap-2", className)}>
      <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
      <input
        id={`nl-${source}`}
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          "h-11 min-w-0 flex-1 rounded-full px-5 text-[15px] outline-none ring-1 transition",
          dark
            ? "bg-white/10 text-paper placeholder:text-paper/50 ring-white/20 focus:ring-paper"
            : "bg-white text-ink placeholder:text-ink-3 ring-line focus:ring-ink",
        )}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={cn(
          "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-5 text-[15px] font-medium transition",
          dark ? "bg-paper text-ink hover:bg-white" : "bg-ink text-paper hover:bg-ink/90",
        )}
      >
        {state === "loading" ? "…" : cta} <ArrowRight className="h-4 w-4" />
      </button>
      {state === "error" && <span className="sr-only" role="alert">Something went wrong, please try again.</span>}
    </form>
  );
}
