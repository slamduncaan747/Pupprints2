"use client";

import { useId, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { HEARD_FROM, HEARD_FROM_DETAIL_MAX, heardFromLabel, type HeardFrom } from "@/lib/heard-from";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "saved" } | { kind: "error"; message: string };

/**
 * "How did you hear about us?": one optional question on the success page. Plain radio rows,
 * nothing preselected; saved to the order through /api/heard-from (authorized by the Checkout
 * Session id in the page URL). An answer already given shows as a thank-you that can be changed.
 */
export function HeardFromCard({
  sessionId,
  initial,
  initialDetail,
}: {
  sessionId: string;
  initial: string | null;
  initialDetail: string | null;
}) {
  const id = useId();
  const known = HEARD_FROM.some((o) => o.id === initial) ? (initial as HeardFrom) : null;
  const [answer, setAnswer] = useState<HeardFrom | null>(known);
  const [detail, setDetail] = useState(initialDetail ?? "");
  const [state, setState] = useState<State>(known ? { kind: "saved" } : { kind: "idle" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!answer) return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/heard-from", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, answer, ...(answer === "other" && detail.trim() ? { detail: detail.trim() } : {}) }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "We couldn't save that just now. Please try again.");
      track("HeardFrom", { answer });
      setState({ kind: "saved" });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "We couldn't save that just now. Please try again." });
    }
  }

  return (
    <section aria-labelledby={`${id}-title`} className="grid gap-5 py-12 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-12 sm:py-14">
      <h2 id={`${id}-title`} className="font-display text-[30px] leading-[1.08] sm:text-[34px]">
        One question
      </h2>
      <div className="min-w-0">
        {state.kind === "saved" && answer ? (
          <div role="status">
            <p className="max-w-md text-[14px] leading-relaxed text-ink-2">
              Thank you. You told us: <span className="text-ink">{answer === "other" && detail.trim() ? detail.trim() : heardFromLabel(answer)}</span>.
            </p>
            <button type="button" onClick={() => setState({ kind: "idle" })} className="link-cta mt-3 inline-flex min-h-11 items-center text-ink-3">
              Change
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <fieldset>
              <legend className="max-w-md text-[14px] leading-relaxed text-ink-2">
                How did you hear about us? <span className="text-ink-3">Optional, and it helps a new studio more than you&apos;d think.</span>
              </legend>
              <div className="mt-5 border-t border-line">
                {HEARD_FROM.map((o) => (
                  <label key={o.id} className="flex min-h-12 cursor-pointer items-center gap-3.5 border-b border-line py-2.5 text-[14px] text-ink">
                    <input
                      type="radio"
                      name={`${id}-heard`}
                      value={o.id}
                      checked={answer === o.id}
                      onChange={() => setAnswer(o.id)}
                      className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-none border border-ink-3 bg-paper transition-colors checked:border-ink checked:bg-ink checked:shadow-[inset_0_0_0_3px_var(--color-paper)] hover:border-ink"
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
            {answer === "other" && (
              <div className="mt-5">
                <label htmlFor={`${id}-detail`} className="label text-ink-3">
                  Where? — optional
                </label>
                <input
                  id={`${id}-detail`}
                  type="text"
                  value={detail}
                  maxLength={HEARD_FROM_DETAIL_MAX}
                  autoComplete="off"
                  onChange={(e) => setDetail(e.target.value)}
                  className="mt-1 h-11 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-[16px] text-ink outline-none transition-colors focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={!answer || state.kind === "sending"}
              className={cn(buttonClasses("secondary", "md", "mt-6 px-8 disabled:opacity-40"))}
            >
              {state.kind === "sending" && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />}
              Send
            </button>
            {state.kind === "error" && (
              <p role="alert" className="mt-3 text-[13px] text-ink">
                {state.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
