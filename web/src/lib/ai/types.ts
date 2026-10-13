import type { StyleSlug } from "@/lib/catalog";

/** Ids accepted in AI_PROVIDER_ORDER. */
export type ProviderId = "fal" | "replicate" | "fal-gpt" | "gemini" | "openai" | "mock";

/**
 * Who actually runs the model. fal and Replicate both proxy Google for Nano Banana, so a
 * Google safety refusal will repeat on both; after one, we skip to a different family.
 */
export type ModelFamily = "google" | "openai" | "bfl" | "mock";

/** What every adapter receives. `imageUrl` is a short-lived signed URL to the same bytes. */
export type ProviderInput = {
  imageUrl?: string;
  imageBytes: Buffer;
  mime: string;
  /** Identity/system instruction. */
  system: string;
  /** Style instruction. */
  prompt: string;
  style: StyleSlug;
};

export type ProviderOutput = {
  bytes: Buffer;
  mime: string;
  model: string;
};

export interface PortraitProvider {
  id: ProviderId;
  /** True when the provider's credentials are present. */
  configured(): boolean;
  /** Model id this provider will call (for logging + the generations row). */
  model(): string;
  /** Underlying model vendor for the currently configured model. */
  family(): ModelFamily;
  generate(input: ProviderInput, signal: AbortSignal): Promise<ProviderOutput>;
}

export type GeneratePortraitInput = {
  imageUrl?: string;
  imageBytes: Buffer;
  mime: string;
  style: StyleSlug;
  petName?: string;
  /** Absolute epoch-ms deadline for the whole provider chain. */
  deadline?: number;
};

export type GeneratePortraitResult = {
  bytes: Buffer;
  mime: string;
  provider: ProviderId;
  model: string;
  width: number;
  height: number;
  attempts: ProviderAttempt[];
};

export type ProviderAttempt = { provider: ProviderId; model: string; ok: boolean; ms: number; error?: string };

/** One provider failed (bad response, safety block, timeout, HTTP error...). */
export class ProviderError extends Error {
  provider: ProviderId;
  /** The provider refused on content-policy grounds (retrying the same model won't help). */
  refused: boolean;
  constructor(provider: ProviderId, message: string, refused = false) {
    super(`[${provider}] ${message}`);
    this.name = "ProviderError";
    this.provider = provider;
    this.refused = refused;
  }
}

/** No provider is configured at all (no API keys, mock disabled). */
export class AiUnavailableError extends Error {
  constructor() {
    super("No AI image provider is configured");
    this.name = "AiUnavailableError";
  }
}

/** Every configured provider was tried and failed. */
export class GenerationFailedError extends Error {
  attempts: ProviderAttempt[];
  constructor(attempts: ProviderAttempt[]) {
    super(`All AI providers failed: ${attempts.map((a) => `${a.provider}: ${a.error ?? "unknown"}`).join(" | ")}`);
    this.name = "GenerationFailedError";
    this.attempts = attempts;
  }
}
