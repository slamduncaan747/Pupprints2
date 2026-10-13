import "server-only";
import { env } from "@/lib/env";
import { PRINTFUL_VARIANTS, type PrintfulVariantRef } from "./printful-variants";

/**
 * Minimal Printful API v1 client (https://developers.printful.com/docs/).
 * Auth: private token as `Authorization: Bearer`; `X-PF-Store-Id` only for account-level tokens.
 * Rate limit 120 req/min: 429/5xx are retried with Retry-After / exponential backoff.
 */

const BASE = "https://api.printful.com";

export class PrintfulError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "PrintfulError";
  }
}

export type PfRecipient = {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
  phone?: string;
  email?: string;
};

export type PfItem = {
  external_id?: string;
  variant_id: number;
  quantity: number;
  name?: string;
  retail_price?: string;
  files: { type?: string; url: string; filename?: string }[];
};

export type PfOrderInput = {
  external_id: string;
  shipping?: string;
  recipient: PfRecipient;
  items: PfItem[];
  retail_costs?: { currency: string; subtotal: string; discount: string; shipping: string; tax: string };
  gift?: { subject: string; message: string };
  packing_slip?: {
    email?: string;
    phone?: string;
    message?: string;
    logo_url?: string;
    store_name?: string;
    custom_order_id?: string;
  };
};

export type PfShipment = {
  id: number;
  carrier: string;
  service: string;
  tracking_number: string | number;
  tracking_url: string;
  shipped_at?: string;
  reshipment?: boolean;
};

export type PfOrder = {
  id: number;
  external_id: string | null;
  status: "draft" | "pending" | "failed" | "canceled" | "inprocess" | "onhold" | "partial" | "fulfilled" | string;
  shipments?: PfShipment[];
  costs?: { total?: string; currency?: string } | null;
};

export function printfulConfigured() {
  return Boolean(env.printfulApiKey);
}

async function pf<T>(path: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  if (!env.printfulApiKey) throw new PrintfulError(503, "PRINTFUL_API_KEY is not set");
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${env.printfulApiKey}`,
      "Content-Type": "application/json",
      ...(process.env.PRINTFUL_STORE_ID ? { "X-PF-Store-Id": process.env.PRINTFUL_STORE_ID } : {}),
      ...(init.headers ?? {}),
    },
    signal: init.signal ?? AbortSignal.timeout(30_000),
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 3) {
    const wait = Number(res.headers.get("Retry-After")) || 2 ** attempt;
    await new Promise((r) => setTimeout(r, Math.min(wait, 20) * 1000));
    return pf<T>(path, init, attempt + 1);
  }
  const json = (await res.json().catch(() => ({}))) as { result?: unknown; error?: { message?: string } };
  if (!res.ok) {
    const message = json.error?.message ?? (typeof json.result === "string" ? json.result : res.statusText);
    throw new PrintfulError(res.status, message, json);
  }
  return json.result as T;
}

/** GET /orders/@{external_id}; null when it doesn't exist. */
export async function getOrderByExternalId(externalId: string): Promise<PfOrder | null> {
  try {
    return await pf<PfOrder>(`/orders/@${encodeURIComponent(externalId)}`);
  } catch (err) {
    if (err instanceof PrintfulError && err.status === 404) return null;
    throw err;
  }
}

export function getOrderById(id: number | string) {
  return pf<PfOrder>(`/orders/${encodeURIComponent(String(id))}`);
}

/**
 * Create an order (draft unless `confirm`). Idempotent on external_id: an existing order with
 * the same external id is returned instead of creating a duplicate.
 */
export async function createOrder(input: PfOrderInput, opts: { confirm: boolean }): Promise<PfOrder> {
  const existing = await getOrderByExternalId(input.external_id);
  if (existing) {
    if (opts.confirm && existing.status === "draft") return confirmOrder(existing.id);
    return existing;
  }
  try {
    return await pf<PfOrder>(`/orders?confirm=${opts.confirm ? "true" : "false"}`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (err) {
    // A parallel request may have created it first.
    if (err instanceof PrintfulError && err.status === 400 && /external/i.test(err.message)) {
      const again = await getOrderByExternalId(input.external_id);
      if (again) return again;
    }
    throw err;
  }
}

export function confirmOrder(id: number | string) {
  return pf<PfOrder>(`/orders/${encodeURIComponent(String(id))}/confirm`, { method: "POST" });
}

/** Exact print-file pixel sizes for a catalog product (needs an API key). */
export function getPrintfiles(productId: number) {
  return pf<{
    printfiles: { printfile_id: number; width: number; height: number; dpi: number; fill_mode: string; can_rotate: boolean }[];
    variant_printfiles: { variant_id: number; placements: Record<string, number> }[];
  }>(`/mockup-generator/printfiles/${productId}?technique=DIGITAL`);
}

/** One-time setup: register our webhook URL (v1 allows one URL per store; payloads are unsigned). */
export function registerWebhook(siteUrl: string, secret: string) {
  return pf("/webhooks", {
    method: "POST",
    body: JSON.stringify({
      url: `${siteUrl.replace(/\/$/, "")}/api/webhooks/printful/${secret}`,
      types: ["package_shipped", "package_returned", "order_failed", "order_canceled", "order_put_hold", "order_put_hold_approval", "order_remove_hold", "order_refunded"],
    }),
  });
}

/**
 * Re-check our variant table against the public catalog (no key needed).
 * Returns the mismatches, empty when everything matches.
 */
export async function verifyPrintfulVariants(): Promise<string[]> {
  const problems: string[] = [];
  const byProduct = new Map<number, Map<number, { product_id: number; name: string }>>();
  const refs = Object.entries(PRINTFUL_VARIANTS) as [string, PrintfulVariantRef][];
  for (const productId of new Set(refs.map(([, r]) => r.productId))) {
    const res = await fetch(`${BASE}/products/${productId}`, { cache: "no-store" });
    const json = (await res.json()) as { result?: { variants?: { id: number; product_id: number; name: string }[] } };
    byProduct.set(productId, new Map((json.result?.variants ?? []).map((v) => [v.id, v])));
  }
  for (const [sku, ref] of refs) {
    const found = byProduct.get(ref.productId)?.get(ref.variantId);
    if (!found) problems.push(`${sku}: variant ${ref.variantId} not found in product ${ref.productId}`);
  }
  return problems;
}
