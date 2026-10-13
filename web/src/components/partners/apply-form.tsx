"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const CHANNELS = [
  { platform: "instagram", label: "Instagram", placeholder: "@yourdog", audience: "Followers" },
  { platform: "tiktok", label: "TikTok", placeholder: "@yourdog", audience: "Followers" },
  { platform: "youtube", label: "YouTube", placeholder: "@yourchannel", audience: "Subscribers" },
  { platform: "pinterest", label: "Pinterest", placeholder: "yourprofile", audience: "Followers" },
  { platform: "other", label: "Blog / other", placeholder: "yourblog.com", audience: "Readers/mo" },
] as const;

type Platform = (typeof CHANNELS)[number]["platform"];

const field =
  "h-12 w-full rounded-xl bg-white px-4 text-[15px] text-ink outline-none ring-1 ring-line transition placeholder:text-ink-3 focus:ring-2 focus:ring-ink";
const label = "mb-1.5 block text-sm font-medium text-ink";

function parseCount(v: string): number | null {
  const s = v.trim().toLowerCase().replace(/[,\s]/g, "");
  if (!s) return null;
  const m = s.match(/^(\d+(?:\.\d+)?)([km])?$/);
  if (!m) return null;
  return Math.round(Number(m[1]) * (m[2] === "k" ? 1_000 : m[2] === "m" ? 1_000_000 : 1));
}

export function PartnerApplyForm({ partnersEmail }: { partnersEmail: string }) {
  const [handles, setHandles] = useState<Record<Platform, { handle: string; followers: string }>>({
    instagram: { handle: "", followers: "" },
    tiktok: { handle: "", followers: "" },
    youtube: { handle: "", followers: "" },
    pinterest: { handle: "", followers: "" },
    other: { handle: "", followers: "" },
  });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");

  function setChannel(p: Platform, key: "handle" | "followers", value: string) {
    setHandles((h) => ({ ...h, [p]: { ...h[p], [key]: value } }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const channels = CHANNELS.filter((c) => handles[c.platform].handle.trim()).map((c) => ({
      platform: c.platform,
      handle: handles[c.platform].handle.trim(),
      followers: parseCount(handles[c.platform].followers),
    }));
    if (channels.length === 0) {
      setError("Add at least one channel so we can see your content.");
      document.getElementById("ch-instagram")?.focus();
      return;
    }
    const name = String(form.get("name") ?? "").trim();
    const payload = {
      name,
      email: String(form.get("email") ?? ""),
      channels,
      dogName: String(form.get("dogName") ?? ""),
      dogBreed: String(form.get("dogBreed") ?? ""),
      contentLinks: String(form.get("contentLinks") ?? "")
        .split(/[\n\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5),
      why: String(form.get("why") ?? ""),
      shippingCountry: String(form.get("shippingCountry") ?? ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
    };
    setState("sending");
    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      track("PartnerApply", { platform: channels[0].platform });
      setFirstName(name.split(/\s+/)[0] ?? "");
      setState("done");
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-card bg-white p-8 text-center shadow-soft ring-1 ring-line sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-soft text-moss">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-3xl sm:text-4xl">Thank you{firstName ? `, ${firstName}` : ""}!</h3>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-2">
          Your application is in. A real person on our team reads every one, and we&apos;ll reply by email within about a
          week.
        </p>
        <p className="mt-6 text-sm text-ink-3">
          Questions in the meantime?{" "}
          <a href={`mailto:${partnersEmail}`} className="font-medium text-ink underline underline-offset-4">
            {partnersEmail}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="rounded-card bg-white p-5 shadow-soft ring-1 ring-line sm:p-10">
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="pa-website">Website</label>
        <input id="pa-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-2xl">About you</legend>
        <div>
          <label htmlFor="pa-name" className={label}>
            Your name
          </label>
          <input id="pa-name" name="name" required maxLength={120} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="pa-email" className={label}>
            Email
          </label>
          <input id="pa-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-display text-2xl">Where you post</legend>
        <p className="mt-1 text-sm text-ink-2">Add at least one. Rough audience numbers are fine; we look at engagement, not just size.</p>
        <div className="mt-5 space-y-3">
          {CHANNELS.map((c) => (
            <div key={c.platform} className="grid grid-cols-[1fr_7.5rem] gap-2 sm:grid-cols-[8.5rem_1fr_10rem] sm:items-center sm:gap-3">
              <label htmlFor={`ch-${c.platform}`} className="col-span-2 text-sm font-medium text-ink sm:col-span-1">
                {c.label}
              </label>
              <input
                id={`ch-${c.platform}`}
                value={handles[c.platform].handle}
                onChange={(e) => setChannel(c.platform, "handle", e.target.value)}
                placeholder={c.placeholder}
                maxLength={200}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className={field}
              />
              <div>
                <label htmlFor={`fc-${c.platform}`} className="sr-only">
                  {c.label} {c.audience.toLowerCase()}
                </label>
                <input
                  id={`fc-${c.platform}`}
                  value={handles[c.platform].followers}
                  onChange={(e) => setChannel(c.platform, "followers", e.target.value)}
                  placeholder={c.audience}
                  inputMode="decimal"
                  maxLength={12}
                  className={field}
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-10 grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-2xl">Your dog (the real star)</legend>
        <div>
          <label htmlFor="pa-dog" className={label}>
            Dog&apos;s name
          </label>
          <input id="pa-dog" name="dogName" maxLength={80} className={field} />
        </div>
        <div>
          <label htmlFor="pa-breed" className={label}>
            Breed <span className="font-normal text-ink-3">(or best guess)</span>
          </label>
          <input id="pa-breed" name="dogBreed" maxLength={120} className={field} />
        </div>
      </fieldset>

      <div className="mt-10 grid gap-5">
        <div>
          <label htmlFor="pa-links" className={label}>
            Links to 1–3 posts you&apos;re proud of <span className="font-normal text-ink-3">(optional)</span>
          </label>
          <textarea
            id="pa-links"
            name="contentLinks"
            rows={3}
            maxLength={1500}
            placeholder="One link per line"
            className={cn(field, "h-auto py-3")}
          />
        </div>
        <div>
          <label htmlFor="pa-why" className={label}>
            What would you make with your portrait? <span className="font-normal text-ink-3">(optional)</span>
          </label>
          <textarea id="pa-why" name="why" rows={4} maxLength={2000} className={cn(field, "h-auto py-3")} />
        </div>
        <div className="sm:max-w-sm">
          <label htmlFor="pa-country" className={label}>
            Where should we ship your portrait?
          </label>
          <input
            id="pa-country"
            name="shippingCountry"
            required
            minLength={2}
            maxLength={80}
            autoComplete="country-name"
            placeholder="Country"
            className={field}
          />
        </div>
        <label className="flex items-start gap-3 rounded-xl bg-paper-2/70 p-4 text-[15px] leading-relaxed text-ink-2">
          <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 shrink-0 accent-[#1b1814]" />
          <span>
            I&apos;ll clearly disclose every partnered or gifted post (<strong className="text-ink">#ad</strong> or the
            platform&apos;s <strong className="text-ink">Paid partnership</strong> label), and Pup Prints may email me about the
            program.
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-clay-soft px-4 py-3 text-[15px] text-clay-dark">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-3">Takes about two minutes. We reply to everyone.</p>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-8 text-base font-medium text-paper transition hover:bg-ink/90 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send application"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
