import "server-only";

/** Per-provider ceiling; routes allow up to 120s so one fallback provider fits. */
export const PROVIDER_TIMEOUT_MS = 50_000;

/** Fetch a remote image (provider CDN URL or data URI) as bytes. */
export async function fetchImageBytes(url: string, signal?: AbortSignal): Promise<{ bytes: Buffer; mime: string }> {
  if (url.startsWith("data:")) {
    const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(url);
    if (!match) throw new Error("Malformed data URI");
    const mime = match[1] || "application/octet-stream";
    const bytes = match[2] ? Buffer.from(match[3], "base64") : Buffer.from(decodeURIComponent(match[3]));
    return { bytes, mime };
  }
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`Downloading result failed: HTTP ${res.status}`);
  const mime = res.headers.get("content-type")?.split(";")[0] ?? "image/png";
  return { bytes: Buffer.from(await res.arrayBuffer()), mime };
}

export function dataUri(bytes: Buffer, mime: string) {
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

/** Turn unknown thrown values (SDK errors, aborts) into a short, loggable message. */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "AbortError" || /aborted|abort/i.test(err.message)) return "timed out";
    const status = (err as { status?: number }).status;
    const msg = err.message.replace(/\s+/g, " ").slice(0, 300);
    return status ? `HTTP ${status}: ${msg}` : msg;
  }
  return String(err).slice(0, 300);
}
