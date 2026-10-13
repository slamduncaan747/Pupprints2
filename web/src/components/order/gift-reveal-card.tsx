"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Gift, Mail, Share2 } from "lucide-react";
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
  "mt-1.5 block h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-3 focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

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
    <section aria-labelledby="gift-reveal-title" className="rounded-card bg-white p-6 shadow-soft ring-1 ring-line sm:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-butter-soft text-[#7a5a12]">
          <Gift className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="gift-reveal-title" className="font-display text-2xl leading-tight">
            Your Gift Reveal is ready
          </h2>
          <p className="mt-1.5 text-ink-2">
            A beautiful, shareable unveiling of the finished portrait, with no prices. Send it today; the print follows in days.
          </p>
        </div>
      </div>

      {sentTo && (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-sage-soft px-4 py-3 text-sm text-moss" role="status">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> Emailed to {sentTo}. You can also share the link yourself.
        </p>
      )}

      <div className="mt-5">
        <label htmlFor="reveal-link" className="text-sm font-medium text-ink-2">
          Reveal link
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="reveal-link"
            readOnly
            value={p.revealUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="h-11 min-w-0 flex-1 truncate rounded-xl border border-line bg-paper px-3.5 font-mono text-[13px] text-ink-2"
          />
          <Button type="button" variant="secondary" onClick={copy} className="shrink-0 px-4" aria-live="polite">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button type="button" variant="accent" onClick={share}>
          <Share2 className="h-4 w-4" aria-hidden="true" /> Share
        </Button>
        {p.emailEnabled && (
          <Button type="button" variant="secondary" onClick={() => setFormOpen((v) => !v)} aria-expanded={formOpen} aria-controls="reveal-email-form">
            <Mail className="h-4 w-4" aria-hidden="true" /> Email it
          </Button>
        )}
        <a
          href={p.revealUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium text-ink hover:bg-ink/5",
            !p.emailEnabled && "sm:col-span-2",
          )}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> Preview
        </a>
      </div>

      {formOpen && (
        <form id="reveal-email-form" onSubmit={send} className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <label htmlFor="rv-name" className="text-sm font-medium text-ink-2">
              Their name
            </label>
            <input id="rv-name" name="recipientName" defaultValue={p.recipientName ?? ""} maxLength={80} autoComplete="off" className={input} />
          </div>
          <div>
            <label htmlFor="rv-email" className="text-sm font-medium text-ink-2">
              Their email <span className="text-clay">*</span>
            </label>
            <input id="rv-email" name="recipientEmail" type="email" required maxLength={254} autoComplete="off" className={input} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rv-from" className="text-sm font-medium text-ink-2">
              From
            </label>
            <input id="rv-from" name="senderName" defaultValue={p.senderName ?? ""} maxLength={80} placeholder="Your name" className={input} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rv-msg" className="text-sm font-medium text-ink-2">
              A note for the reveal <span className="font-normal text-ink-3">(optional)</span>
            </label>
            <textarea
              id="rv-msg"
              name="message"
              rows={3}
              maxLength={500}
              className={cn(input, "h-auto py-2.5")}
              placeholder="Happy birthday! I couldn't resist."
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" disabled={state.status === "sending"} className="w-full sm:w-auto">
              {state.status === "sending" ? "Sending…" : "Send the Gift Reveal"}
            </Button>
            {state.status === "error" && (
              <p className="mt-3 text-sm text-clay-dark" role="alert">
                {state.message}
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
