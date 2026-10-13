"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "./order-timeline";
import type { TrackResponse } from "./track";
import { formatDay } from "./timeline";

const input =
  "mt-2 block h-12 w-full rounded-[3px] border border-line bg-white px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink";

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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="t-order" className="text-[13px] text-ink-2">
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
            <label htmlFor="t-email" className="text-[13px] text-ink-2">
              Email used at checkout
            </label>
            <input id="t-email" name="email" type="email" required autoComplete="email" maxLength={254} placeholder="you@example.com" className={input} />
          </div>
        </div>
        <Button type="submit" variant="primary" size="lg" className="mt-6 w-full sm:w-auto" disabled={state.status === "loading"}>
          {state.status === "loading" ? "Looking it up…" : "Track order"}
        </Button>
        <p className="mt-4 text-[13px] text-ink-3">Your order number is in your confirmation email (it starts with PP-).</p>
      </form>

      <div ref={resultRef} aria-live="polite" className="mt-12 scroll-mt-24">
        {state.status === "error" && (
          <p className="border-t border-line pt-6 text-[15px] leading-relaxed text-ink" role="alert">
            {state.message}{" "}
            <a className="underline decoration-ink/25 underline-offset-4 hover:decoration-ink" href={`mailto:${supportEmail}`}>
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
    <section aria-labelledby="track-result-title" className="border-t border-line pt-10">
      <p className="text-[12px] tracking-[0.14em] text-ink-3 uppercase">
        Order {data.orderNumber} · placed {formatDay(new Date(data.placedAt), { month: "short", day: "numeric" })}
      </p>
      <h2 id="track-result-title" className="mt-3 font-display text-[2.4rem] leading-[1.04] sm:text-5xl">
        {data.title}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{data.body}</p>
      {data.arrival && (
        <p className="mt-6 flex items-baseline justify-between gap-4 border-y border-line py-3.5 text-[15px]">
          <span className="text-ink-2">Estimated arrival</span>
          <span className="text-ink">{data.arrival}</span>
        </p>
      )}

      {data.tracking?.url && (
        <a
          href={data.tracking.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center justify-between gap-4 rounded-[3px] bg-ink px-5 py-4 text-paper transition-colors hover:bg-ink/85"
        >
          <span>
            <span className="block text-[15px] font-medium">Track your package{data.tracking.carrier ? ` with ${data.tracking.carrier}` : ""}</span>
            {data.tracking.number && <span className="block text-[13px] text-paper/70 tabular-nums">{data.tracking.number}</span>}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      )}
      {!data.tracking?.url && data.tracking?.number && (
        <p className="mt-6 text-[15px] text-ink-2">
          Tracking number{data.tracking.carrier ? ` (${data.tracking.carrier})` : ""}:{" "}
          <span className="text-ink tabular-nums">{data.tracking.number}</span>
        </p>
      )}

      <OrderTimeline steps={data.timeline} className="mt-8" />

      <div className="mt-10">
        <h3 className="font-sans text-[12px] tracking-[0.14em] text-ink-3 uppercase">In this order</h3>
        <ul className="mt-3 space-y-1.5 text-[15px] text-ink-2">
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
