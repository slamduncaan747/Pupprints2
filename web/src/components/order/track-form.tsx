"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/button";
import { OrderTimeline } from "./order-timeline";
import type { TrackResponse } from "./track";
import { formatDay } from "./timeline";

const input =
  "mt-1 block h-12 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none";

export function TrackForm({ initialOrder = "", supportEmail }: { initialOrder?: string; supportEmail: string }) {
  const [state, setState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "error"; message: string } | { status: "found"; data: TrackResponse }
  >({ status: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "found" || state.status === "error") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.status]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderNumber: String(form.get("orderNumber") ?? ""), email: String(form.get("email") ?? "") }),
      });
      const json = (await res.json().catch(() => ({}))) as TrackResponse & { message?: string };
      if (!res.ok) throw new Error(json.message ?? "Something went wrong. Please try again.");
      setState({ status: "found", data: json });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }

  return (
    <div>
      <form onSubmit={submit} noValidate={false}>
        <div className="grid gap-8">
          <div>
            <label htmlFor="t-order" className="label text-ink-3">
              Order number
            </label>
            <input
              id="t-order"
              name="orderNumber"
              required
              defaultValue={initialOrder}
              placeholder="PP-10241"
              autoComplete="off"
              inputMode="text"
              maxLength={24}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="t-email" className="label text-ink-3">
              Email used at checkout
            </label>
            <input id="t-email" name="email" type="email" required autoComplete="email" maxLength={254} placeholder="you@example.com" className={input} />
          </div>
        </div>
        <Button type="submit" variant="primary" size="lg" className="mt-10 w-full" disabled={state.status === "loading"}>
          {state.status === "loading" ? "Looking it up…" : "Track order"}
        </Button>
        <p className="mt-4 text-center text-[12px] text-ink-3">Your order number is in your confirmation email. It begins with PP-.</p>
      </form>

      <div ref={resultRef} aria-live="polite" className="mt-14 scroll-mt-24">
        {state.status === "error" && (
          <p className="border-t border-line pt-8 text-[14px] leading-relaxed text-ink" role="alert">
            {state.message}{" "}
            <a className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        )}
        {state.status === "found" && <TrackResult data={state.data} />}
      </div>
    </div>
  );
}

function TrackResult({ data }: { data: TrackResponse }) {
  return (
    <section aria-labelledby="track-result-title" className="border-t border-line pt-12">
      <p className="label text-ink-3">
        Order {data.orderNumber} — Placed {formatDay(new Date(data.placedAt), { month: "short", day: "numeric" })}
      </p>
      <h2 id="track-result-title" className="mt-4 font-display text-[40px] leading-[1.04] sm:text-[52px]">
        {data.title}.
      </h2>
      <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{data.body}</p>
      {data.arrival && (
        <p className="mt-8 flex items-baseline justify-between gap-4 border-y border-line py-4">
          <span className="label text-ink-3">Estimated arrival</span>
          <span className="label text-ink">{data.arrival}</span>
        </p>
      )}

      {data.tracking?.url && (
        <div className="mt-8">
          <a
            href={data.tracking.url}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("primary", "lg", "w-full")}
          >
            Track with {data.tracking.carrier ?? "the carrier"}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          {data.tracking.number && (
            <p className="label mt-3 text-center text-ink-3 tabular-nums">{data.tracking.number}</p>
          )}
        </div>
      )}
      {!data.tracking?.url && data.tracking?.number && (
        <p className="mt-8 flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <span className="label text-ink-3">Tracking{data.tracking.carrier ? ` — ${data.tracking.carrier}` : ""}</span>
          <span className="label text-ink tabular-nums">{data.tracking.number}</span>
        </p>
      )}

      <OrderTimeline steps={data.timeline} className="mt-10" />

      <div className="mt-12">
        <h3 className="label text-ink">In this order</h3>
        <ul className="mt-4 space-y-2 text-[14px] text-ink-2">
          {data.items.map((i, n) => (
            <li key={n}>
              {i.label}
              {i.quantity > 1 ? ` × ${i.quantity}` : ""} <span className="text-ink-3">· {i.styleName}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
