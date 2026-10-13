"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  revealUrl: string;
  sessionId: string;
  petName: string | null;
  recipientName: string | null;
  senderName: string | null;
  sentTo: string | null;
  emailEnabled: boolean;
};

const input =
  "mt-1 block h-11 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none";
const label = "label text-ink-3";

export function GiftRevealCard(p: Props) {
  const [copied, setCopied] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; message?: string }>({ status: "idle" });
  const [sentTo, setSentTo] = useState(p.sentTo);

  async function copy() {
    try {
      await navigator.clipboard.writeText(p.revealUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link", p.revealUrl);
    }
  }

  async function share() {
    const text = p.petName ? `I made you something: a portrait of ${p.petName}.` : "I made you something.";
    if (navigator.share) {
      try {
        await navigator.share({ title: "A gift for you", text, url: p.revealUrl });
        return;
      } catch {
        // dismissed: fall through to copy
      }
    }
    await copy();
  }

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/reveal/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: p.sessionId,
          recipientEmail: String(form.get("recipientEmail") ?? ""),
          recipientName: String(form.get("recipientName") ?? "") || undefined,
          senderName: String(form.get("senderName") ?? "") || undefined,
          message: String(form.get("message") ?? "") || undefined,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "We couldn't send it just now.");
      setSentTo(String(form.get("recipientName") || form.get("recipientEmail")));
      setState({ status: "sent" });
      setFormOpen(false);
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "We couldn't send it just now." });
    }
  }

  return (
    <section aria-labelledby="gift-reveal-title" className="grid gap-5 py-12 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-12 sm:py-14">
      <h2 id="gift-reveal-title" className="font-display text-[30px] leading-[1.08] sm:text-[34px]">
        The Gift Reveal
      </h2>
      <div className="min-w-0">
        <p className="max-w-md text-[14px] leading-relaxed text-ink-2">
          A private unveiling of the finished portrait, without prices. Send it today; the piece follows in days.
        </p>

        {sentTo && (
          <p className="label mt-5 text-ink" role="status">
            Sent to {sentTo}
          </p>
        )}

        <div className="mt-6 flex items-end gap-6">
          <label htmlFor="reveal-link" className="sr-only">
            Reveal link
          </label>
          <input
            id="reveal-link"
            readOnly
            value={p.revealUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="h-11 min-w-0 flex-1 truncate rounded-none border-0 border-b border-line bg-transparent px-0 text-[13px] text-ink-2 outline-none focus:border-ink focus-visible:outline-none"
          />
          <button type="button" onClick={copy} className={cn(textLink, "shrink-0")} aria-live="polite">
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-1">
          <button type="button" onClick={share} className={textLink}>
            Share the reveal
          </button>
          {p.emailEnabled && (
            <button
              type="button"
              onClick={() => setFormOpen((v) => !v)}
              aria-expanded={formOpen}
              aria-controls="reveal-email-form"
              className={textLink}
            >
              Email it
            </button>
          )}
          <a href={p.revealUrl} target="_blank" rel="noreferrer" className={cn(textLink, "text-ink-3")}>
            Preview
          </a>
        </div>

        {formOpen && (
          <form id="reveal-email-form" onSubmit={send} className="mt-8 grid gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <label htmlFor="rv-name" className={label}>
                Their name
              </label>
              <input id="rv-name" name="recipientName" defaultValue={p.recipientName ?? ""} maxLength={80} autoComplete="off" className={input} />
            </div>
            <div>
              <label htmlFor="rv-email" className={label}>
                Their email <span aria-hidden="true">*</span>
              </label>
              <input id="rv-email" name="recipientEmail" type="email" required maxLength={254} autoComplete="off" className={input} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="rv-from" className={label}>
                From
              </label>
              <input id="rv-from" name="senderName" defaultValue={p.senderName ?? ""} maxLength={80} placeholder="Your name" className={input} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="rv-msg" className={label}>
                A note for the reveal — optional
              </label>
              <textarea
                id="rv-msg"
                name="message"
                rows={3}
                maxLength={500}
                className="mt-2.5 block w-full resize-none rounded-none border border-line bg-transparent px-3.5 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus-visible:outline-none"
                placeholder="Happy birthday. I couldn't resist."
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" size="lg" disabled={state.status === "sending"} className="w-full sm:w-auto">
                {state.status === "sending" ? "Sending…" : "Send the Gift Reveal"}
              </Button>
              {state.status === "error" && (
                <p className="mt-3 text-[14px] text-ink" role="alert">
                  {state.message}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

const textLink = "link-cta inline-flex min-h-11 items-center";
