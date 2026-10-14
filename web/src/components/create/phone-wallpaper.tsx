"use client";

import { useId, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { PRODUCT_MAP } from "@/lib/catalog";
import { buttonClasses } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { isEmail } from "./email-capture";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "emailed"; email: string }
  | { kind: "link"; url: string }
  | { kind: "error"; message: string };

const digitalPrice = PRODUCT_MAP.digital.variants[0].price;

/**
 * The Free Phone Portrait: email capture → POST /api/wallpaper → a 1080×1920 crop of this
 * portrait, no watermark, emailed as a download link (or shown here when email isn't available).
 */
export function PhoneWallpaper({
  generationId,
  petName,
  memorial,
  className,
}: {
  generationId: string;
  petName?: string;
  /** The gentle track: the lead's emails skip any offer. */
  memorial?: boolean;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), generationId, petName: petName || undefined, ...(memorial ? { memorial: true } : {}) }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; emailed?: boolean; url?: string; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "We couldn't prepare your wallpaper just now. Please try again.");
      track("Lead", { source: "phone_wallpaper" });
      setState(json.emailed || !json.url ? { kind: "emailed", email: email.trim() } : { kind: "link", url: json.url });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }

  if (state.kind === "emailed") {
    return (
      <p role="status" className={cn("text-[14px] leading-relaxed text-ink", className)}>
        Sent to {state.email}. Your phone portrait is in your inbox.
      </p>
    );
  }
  if (state.kind === "link") {
    return (
      <div role="status" className={cn("text-left", className)}>
        <p className="text-[14px] leading-relaxed text-ink">Your phone portrait is ready.</p>
        <a href={state.url} target="_blank" rel="noreferrer" className="link-cta mt-2 inline-flex min-h-11 items-center">
          Open the wallpaper
        </a>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-3">
          On iPhone: open it, tap Share, then Use as Wallpaper. On Android: open it, then Set as wallpaper.
        </p>
      </div>
    );
  }

  const sending = state.kind === "sending";
  return (
    <div className={cn("text-left", className)}>
      <p className="text-[13px] leading-relaxed text-ink-2">
        {petName ? `${petName}'s portrait` : "Your portrait"}, sized for your lock screen (1080 × 1920), without the watermark. We&apos;ll
        email it to you.
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-2 w-full">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <div className="flex items-end gap-4">
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error || state.kind === "error" ? `${id}-err` : `${id}-note`}
            className="h-12 min-w-0 flex-1 rounded-none border-0 border-b border-line bg-transparent px-0 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none"
          />
          <button type="submit" disabled={sending} className={buttonClasses("primary", "md", "shrink-0 px-6")}>
            {sending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
            Send
          </button>
        </div>
        {(error || state.kind === "error") && (
          <p id={`${id}-err`} role="alert" className="mt-2.5 text-[13px] text-ink">
            {error ?? (state.kind === "error" ? state.message : null)}
          </p>
        )}
      </form>
      <p id={`${id}-note`} className="mt-3 text-[12px] leading-relaxed text-ink-3">
        Phone resolution only. The print-quality file comes with every piece, or alone for {formatPrice(digitalPrice)}. We may
        send a note or two about your portrait; unsubscribe any time.
      </p>
    </div>
  );
}
