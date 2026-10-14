"use client";

import { useEffect, useState, type ReactNode } from "react";
import { FOUNDING } from "@/lib/launch";
import { cn } from "@/lib/utils";

/**
 * Live state of the Founding 100 offer, read once per page view from GET /api/offer and shared by
 * every component that asks. Degrades quietly: if the endpoint is missing or fails, the server-rendered
 * founding line stays as it is and no count is shown. A count is only ever shown when the API returns
 * a real number, so it can never be invented or stale-by-design.
 */
export type OfferStatus = {
  founding: { open: boolean; remaining: number | null; percentOff: number; deadline: string };
};

let request: Promise<OfferStatus | null> | null = null;

function isOfferStatus(value: unknown): value is OfferStatus {
  const f = (value as OfferStatus | null)?.founding;
  return (
    !!f &&
    typeof f.open === "boolean" &&
    (f.remaining === null || (typeof f.remaining === "number" && Number.isFinite(f.remaining)))
  );
}

function loadOfferStatus(): Promise<OfferStatus | null> {
  request ??= fetch("/api/offer", { headers: { accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: unknown) => (isOfferStatus(data) ? data : null))
    .catch(() => null);
  return request;
}

type Live = {
  /** False once the API says the offer closed (cap reached) or the deadline has passed on this device. */
  open: boolean;
  /** Real spots left, or null when unknown. */
  remaining: number | null;
};

/** `undefined` while loading. */
export function useFoundingLive(): Live | undefined {
  const [live, setLive] = useState<Live | undefined>(undefined);
  useEffect(() => {
    let active = true;
    loadOfferStatus().then((status) => {
      if (!active) return;
      const expired = Date.now() >= FOUNDING.expiresAt.getTime();
      const remaining = status?.founding.remaining ?? null;
      setLive({
        open: !expired && (status ? status.founding.open : true) && (remaining === null || remaining > 0),
        remaining: typeof remaining === "number" ? Math.max(0, Math.floor(remaining)) : null,
      });
    });
    return () => {
      active = false;
    };
  }, []);
  return live;
}

/** Renders its children until we learn the founding offer has closed, then renders `closed` (default nothing). */
export function FoundingGate({ children, closed = null }: { children: ReactNode; closed?: ReactNode }) {
  const live = useFoundingLive();
  return <>{live && !live.open ? closed : children}</>;
}

/** "37 of 100 founding spots left": only when the API returns a real number. */
export function FoundingRemaining({ className }: { className?: string }) {
  const live = useFoundingLive();
  if (!live?.open || live.remaining === null) return null;
  return (
    <span className={cn("tabular-nums", className)}>
      {live.remaining} of {FOUNDING.maxRedemptions} founding spots left
    </span>
  );
}
