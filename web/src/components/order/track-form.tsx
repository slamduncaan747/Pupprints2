"use client";

import { useState } from "react";
import { ExternalLink, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "./order-timeline";
import type { TrackResponse } from "./track";
import { formatDay } from "./timeline";

const input =
  "mt-1.5 block h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

export function TrackForm({ initialOrder = "", supportEmail }: { initialOrder?: string; supportEmail: string }) {
  const [state, setState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "error"; message: string } | { status: "found"; data: TrackResponse }
  >({ status: "idle" });

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
      <form onSubmit={submit} className="rounded-card bg-white p-6 shadow-soft ring-1 ring-line sm:p-8" noValidate={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="t-order" className="text-sm font-medium text-ink-2">
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
            <label htmlFor="t-email" className="text-sm font-medium text-ink-2">
              Email used at checkout
            </label>
            <input id="t-email" name="email" type="email" required autoComplete="email" maxLength={254} placeholder="you@example.com" className={input} />
          </div>
        </div>
        <Button type="submit" variant="primary" size="lg" className="mt-5 w-full sm:w-auto" disabled={state.status === "loading"}>
          <PackageSearch className="h-5 w-5" aria-hidden="true" />
          {state.status === "loading" ? "Looking it up…" : "Track order"}
        </Button>
        <p className="mt-4 text-sm text-ink-3">Your order number is in your confirmation email (it starts with PP-).</p>
      </form>

      <div aria-live="polite" className="mt-8">
        {state.status === "error" && (
          <div className="rounded-card bg-clay-soft/60 p-5 text-[15px] text-clay-dark" role="alert">
            {state.message}{" "}
            <a className="underline underline-offset-2" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </div>
        )}
        {state.status === "found" && <TrackResult data={state.data} />}
      </div>
    </div>
  );
}

function TrackResult({ data }: { data: TrackResponse }) {
  return (
    <section aria-labelledby="track-result-title" className="rounded-card bg-white p-6 ring-1 ring-line sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
        Order {data.orderNumber} · placed {formatDay(new Date(data.placedAt), { month: "short", day: "numeric" })}
      </p>
      <h2 id="track-result-title" className="mt-3 font-display text-3xl leading-tight">
        {data.title}
      </h2>
      <p className="mt-2 text-ink-2">{data.body}</p>
      {data.arrival && (
        <p className="mt-4 inline-flex rounded-full bg-sage-soft px-4 py-1.5 text-[15px] text-moss">
          Estimated arrival <span className="ml-1.5 font-semibold">{data.arrival}</span>
        </p>
      )}

      {data.tracking?.url && (
        <a
          href={data.tracking.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-ink px-5 py-4 text-paper transition-colors hover:bg-ink/90"
        >
          <span>
            <span className="block font-medium">Track your package{data.tracking.carrier ? ` with ${data.tracking.carrier}` : ""}</span>
            {data.tracking.number && <span className="block font-mono text-sm text-paper/70">{data.tracking.number}</span>}
          </span>
          <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
        </a>
      )}
      {!data.tracking?.url && data.tracking?.number && (
        <p className="mt-6 text-[15px] text-ink-2">
          Tracking number{data.tracking.carrier ? ` (${data.tracking.carrier})` : ""}:{" "}
          <span className="font-mono text-ink">{data.tracking.number}</span>
        </p>
      )}

      <OrderTimeline steps={data.timeline} className="mt-8" />

      <div className="mt-8 border-t border-line pt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-3">In this order</h3>
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
