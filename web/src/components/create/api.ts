"use client";

import type { StyleSlug } from "@/lib/catalog";
import type { OfferStatus } from "@/lib/offer";
import type { Generation, ShipCountry, UploadInfo } from "./store";

/** Error from one of our API routes, carrying the `error` code from the JSON body. */
export class ApiError extends Error {
  code: string;
  status: number;
  /** The full JSON error body (may carry extras, e.g. `generationId` on ai_unavailable). */
  data: Record<string, unknown>;
  constructor(code: string, message: string, status: number, data: Record<string, unknown> = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

const NETWORK_MESSAGE = "We couldn't reach our studio. Please check your connection and try again.";

async function parse<T>(res: Response): Promise<T> {
  let body: Record<string, unknown> = {};
  try {
    body = await res.json();
  } catch {
    // non-JSON (e.g. platform error page)
  }
  if (!res.ok) {
    const code = typeof body.error === "string" ? body.error : res.status === 404 ? "not_found" : "server_error";
    const message = typeof body.message === "string" ? body.message : "Something went wrong. Please try again.";
    throw new ApiError(code, message, res.status, body);
  }
  return body as T;
}

async function postJson<T>(url: string, payload: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("network", NETWORK_MESSAGE, 0);
  }
  return parse<T>(res);
}

/** POST /api/upload with upload progress (fetch can't report upload progress). */
export function uploadPhoto(blob: Blob, onProgress: (fraction: number) => void): Promise<UploadInfo> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onerror = () => reject(new ApiError("network", NETWORK_MESSAGE, 0));
    xhr.ontimeout = () => reject(new ApiError("network", NETWORK_MESSAGE, 0));
    xhr.onload = () => {
      const body = (xhr.response ?? {}) as Record<string, unknown>;
      if (xhr.status >= 200 && xhr.status < 300 && typeof body.uploadId === "string") {
        resolve(body as unknown as UploadInfo);
      } else {
        reject(
          new ApiError(
            typeof body.error === "string" ? body.error : "upload_failed",
            typeof body.message === "string" ? body.message : "We couldn't upload that photo. Please try again.",
            xhr.status,
          ),
        );
      }
    };
    xhr.timeout = 90_000;
    const form = new FormData();
    form.append("file", blob, "photo.jpg");
    xhr.send(form);
  });
}

export type GenerateResponse = {
  generationId: string;
  status: "succeeded";
  previewUrl: string;
  style: StyleSlug;
  width: number;
  height: number;
};

export function generatePortrait(body: { uploadId: string; style: StyleSlug; petName?: string }, signal?: AbortSignal) {
  return postJson<GenerateResponse>("/api/generate", body, signal);
}

export type GenerationsResponse = {
  generations: (Omit<Generation, "style"> & { style: string })[];
  upload: (UploadInfo & { createdAt: string }) | null;
};

export async function fetchGenerations(): Promise<GenerationsResponse> {
  const res = await fetch("/api/generations", { cache: "no-store" });
  return parse<GenerationsResponse>(res);
}

export type GiftPortraitResponse = {
  generationId: string;
  style: string;
  petName: string | null;
  previewUrl: string;
  createdAt: string;
};

/** GET /api/gift-portrait: the portrait behind a gift reveal link, ready to order. */
export async function fetchGiftPortrait(token: string): Promise<GiftPortraitResponse> {
  let res: Response;
  try {
    res = await fetch(`/api/gift-portrait?token=${encodeURIComponent(token)}`, { cache: "no-store" });
  } catch {
    throw new ApiError("network", NETWORK_MESSAGE, 0);
  }
  return parse<GiftPortraitResponse>(res);
}

export type CheckoutItem = { generationId: string; variantId: string; frameColor?: string; quantity: number };

export type CheckoutRequest = {
  items: CheckoutItem[];
  shipCountry?: ShipCountry;
  giftMessage?: string;
  giftSenderName?: string;
  giftRecipientName?: string;
  giftRecipientEmail?: string;
  /** Reveal token when buying a gift portrait from its reveal page. */
  giftToken?: string;
  /** A creator code entered on the product step. */
  code?: string;
};

export function startCheckout(body: CheckoutRequest) {
  return postJson<{ url: string }>("/api/checkout", body);
}

export type LeadSource = "save_preview" | "checkout_unavailable" | "ai_unavailable";

export function saveLead(body: { email: string; source: LeadSource; generationId?: string; petName?: string }) {
  return postJson<{ ok?: boolean }>("/api/leads", body);
}

type OfferEntry = { at: number; value: Promise<OfferStatus>; resolved?: OfferStatus };
const offerCache = new Map<string, OfferEntry>();
const OFFER_TTL_MS = 60_000;
const offerKey = (code?: string) => code?.trim().toUpperCase() ?? "";

/**
 * GET /api/offer (optionally checking a creator code). Cached for a minute per code in this tab,
 * so the flow can prefetch it and the product step renders the real price without waiting.
 */
export function fetchOffer(code?: string): Promise<OfferStatus> {
  const key = offerKey(code);
  const hit = offerCache.get(key);
  if (hit && Date.now() - hit.at < OFFER_TTL_MS) return hit.value;
  const entry = { at: Date.now() } as OfferEntry;
  entry.value = fetch(`/api/offer${key ? `?code=${encodeURIComponent(key)}` : ""}`, { cache: "no-store" })
    .then((res) => parse<OfferStatus>(res))
    .then((offer) => {
      entry.resolved = offer;
      return offer;
    })
    .catch((err) => {
      if (offerCache.get(key) === entry) offerCache.delete(key);
      throw err;
    });
  offerCache.set(key, entry);
  return entry.value;
}

/** The last answer from /api/offer for this code, if it already arrived (no request). */
export function peekOffer(code?: string): OfferStatus | null {
  return offerCache.get(offerKey(code))?.resolved ?? null;
}
