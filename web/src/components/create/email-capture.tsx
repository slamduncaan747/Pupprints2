"use client";

import { useId, useState, type FormEvent } from "react";
import { CircleCheck, LoaderCircle, Mail } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { saveLead, type LeadSource } from "./api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

/** Small inline email form that posts to /api/leads. */
export function EmailCapture({
  source,
  generationId,
  petName,
  cta = "Send it",
  doneMessage = "Sent! Check your inbox in a minute.",
  placeholder = "you@email.com",
  className,
  tone = "light",
}: {
  source: LeadSource;
  generationId?: string;
  petName?: string;
  cta?: string;
  doneMessage?: string;
  placeholder?: string;
  className?: string;
  tone?: "light" | "paper";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setState("sending");
    try {
      await saveLead({
        email: email.trim(),
        source,
        generationId,
        petName: petName || undefined,
      });
      track("Lead", { source });
      setState("done");
    } catch {
      setState("error");
      setError("We couldn't save that just now. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={cn("flex items-center gap-2 text-[14px] font-medium text-moss", className)}>
        <CircleCheck className="h-4.5 w-4.5" aria-hidden />
        {doneMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-err` : undefined}
            className={cn(
              "h-12 w-full rounded-full pr-4 pl-10 text-[15px] text-ink ring-1 ring-line outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-ink",
              tone === "light" ? "bg-white" : "bg-paper",
            )}
          />
        </div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-paper transition hover:bg-ink/90 disabled:opacity-60"
        >
          {state === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {cta}
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-[13px] text-clay-dark">
          {error}
        </p>
      )}
    </form>
  );
}
