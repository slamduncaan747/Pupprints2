"use client";

import { useSyncExternalStore } from "react";
import {
  getStyle,
  PRODUCT_MAP,
  PRODUCTS,
  type FrameColor,
  type ProductType,
  type StyleSlug,
} from "@/lib/catalog";

/**
 * Create-flow state, persisted to localStorage so a reload (or coming back from an Instagram
 * in-app browser) keeps the customer's photo, previews and choices. Implemented as a tiny
 * external store read with useSyncExternalStore: the server render uses INITIAL, the client
 * swaps in the saved state right after hydration without a mismatch.
 */

export type Step = "upload" | "style" | "product";
export type ShipCountry = "US" | "CA";

export type UploadInfo = { uploadId: string; url: string; width: number; height: number };

export type Generation = {
  generationId: string;
  style: StyleSlug;
  previewUrl: string;
  createdAt: string;
  uploadId: string | null;
  petName?: string | null;
};

export type Selection = {
  productType: ProductType;
  variantId: string;
  frameColor: FrameColor;
  addons: string[];
  shipCountry: ShipCountry;
};

export type Gift = {
  enabled: boolean;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
};

export type FlowState = {
  v: 1;
  step: Step;
  upload: UploadInfo | null;
  petName: string;
  generations: Generation[];
  activeId: string | null;
  selection: Selection;
  gift: Gift;
  /** Set by "Start over": server-side history older than this is not restored. */
  resetAt: number | null;
};

const DEFAULT_PRODUCT = PRODUCTS[0];

export const INITIAL: FlowState = {
  v: 1,
  step: "upload",
  upload: null,
  petName: "",
  generations: [],
  activeId: null,
  selection: {
    productType: DEFAULT_PRODUCT.type,
    variantId: DEFAULT_PRODUCT.defaultVariantId,
    frameColor: "black",
    addons: [],
    shipCountry: "US",
  },
  gift: { enabled: false, senderName: "", recipientName: "", recipientEmail: "", message: "" },
  resetAt: null,
};

const KEY = "pp_create_v1";

let state: FlowState = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): FlowState {
  if (!raw || typeof raw !== "object" || (raw as FlowState).v !== 1) return INITIAL;
  const s = raw as FlowState;
  const generations = Array.isArray(s.generations)
    ? s.generations.filter((g) => g && typeof g.generationId === "string" && getStyle(g.style) && g.previewUrl)
    : [];
  const product = PRODUCT_MAP[s.selection?.productType] ?? DEFAULT_PRODUCT;
  const variantOk = product.variants.some((v) => v.id === s.selection?.variantId);
  const selection: Selection = {
    productType: product.type,
    variantId: variantOk ? s.selection.variantId : product.defaultVariantId,
    frameColor: (["black", "white", "oak"] as const).includes(s.selection?.frameColor) ? s.selection.frameColor : "black",
    addons: Array.isArray(s.selection?.addons) ? s.selection.addons.filter((a) => typeof a === "string") : [],
    shipCountry: s.selection?.shipCountry === "CA" ? "CA" : "US",
  };
  const upload = s.upload && typeof s.upload.uploadId === "string" ? s.upload : null;
  const activeId = generations.some((g) => g.generationId === s.activeId) ? s.activeId : null;
  let step: Step = s.step === "style" || s.step === "product" ? s.step : "upload";
  if (!upload) step = "upload";
  if (step === "product" && !activeId) step = upload ? "style" : "upload";
  return {
    ...INITIAL,
    step,
    upload,
    petName: typeof s.petName === "string" ? s.petName.slice(0, 40) : "",
    generations,
    activeId,
    selection,
    gift: { ...INITIAL.gift, ...(s.gift ?? {}) },
    resetAt: typeof s.resetAt === "number" ? s.resetAt : null,
  };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {
    // private mode / blocked storage: start fresh
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return INITIAL;
}

export function useFlow(): FlowState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function readFlow(): FlowState {
  return getSnapshot();
}

export function updateFlow(updater: (s: FlowState) => FlowState) {
  load();
  const next = updater(state);
  if (next === state) return;
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function resetFlow() {
  updateFlow(() => ({ ...INITIAL, resetAt: Date.now() }));
}

/** Newest-first merge of generations by id. */
export function mergeGenerations(a: Generation[], b: Generation[]): Generation[] {
  const map = new Map<string, Generation>();
  for (const g of [...a, ...b]) map.set(g.generationId, { ...map.get(g.generationId), ...g });
  return [...map.values()].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
}
