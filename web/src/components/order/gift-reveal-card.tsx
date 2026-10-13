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
  "mt-2 block h-12 w-full rounded-[3px] border border-line bg-white px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink";
const label = "text-[13px] text-ink-2";

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
    <section aria-labelledby="gift-reveal-title" className="grid gap-4 py-10 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-10">
      <h2 id="gift-reveal-title" className="font-display text-[1.75rem] leading-tight">
        Your Gift Reveal
      </h2>
      <div className="min-w-0">
        <p className="text-[15px] leading-relaxed text-ink-2">
          A shareable unveiling of the finished portrait, with no prices. Send it today; the print follows in days.
        </p>

        {sentTo && (
          <p className="mt-4 text-[14px] text-ink" role="status">
            Emailed to {sentTo}. You can also share the link yourself.
          </p>
        )}

        <div className="mt-5">
          <label htmlFor="reveal-link" className="sr-only">
            Reveal link
          </label>
          <div className="flex gap-2">
            <input
              id="reveal-link"
              readOnly
              value={p.revealUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="h-11 min-w-0 flex-1 truncate rounded-[3px] border border-line bg-white px-3.5 text-[13px] text-ink-2 outline-none focus:border-ink"
            />
            <Button type="button" variant="secondary" onClick={copy} className="shrink-0 px-5" aria-live="polite">
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Button type="button" variant="primary" onClick={share} className="min-w-32">
            Share
          </Button>
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
          <a href={p.revealUrl} target="_blank" rel="noreferrer" className={textLink}>
            Preview
          </a>
        </div>

        {formOpen && (
          <form id="reveal-email-form" onSubmit={send} className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
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
                A note for the reveal <span className="text-ink-3">(optional)</span>
              </label>
              <textarea
                id="rv-msg"
                name="message"
                rows={3}
                maxLength={500}
                className={cn(input, "h-auto resize-none py-3")}
                placeholder="Happy birthday! I couldn't resist."
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" disabled={state.status === "sending"} className="w-full sm:w-auto">
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

const textLink =
  "inline-flex min-h-11 items-center text-[14px] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink";
