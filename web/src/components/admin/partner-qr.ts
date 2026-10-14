import "server-only";
import QRCode from "qrcode";
import { site } from "@/lib/config";

/** utm_campaign value for a partner's niche ("Groomer — Chicago" → "groomer-chicago"). */
export function nicheCampaign(niche: string | null | undefined): string {
  const slug = (niche ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return slug || "general";
}

/** The link a partner's printed QR code opens: their `?ref=` code plus QR-specific UTMs. */
export function partnerQrUrl(code: string, niche: string | null | undefined): string {
  const params = new URLSearchParams({
    ref: code,
    utm_source: "partner",
    utm_medium: "qr",
    utm_campaign: nicheCampaign(niche),
  });
  return `${site.url}/?${params.toString()}`;
}

// Medium error correction keeps the code small enough to scan at ~4 cm; margin 4 is the
// spec quiet zone, so the code scans even when printed edge-to-edge on a dark surface.
const BASE = { errorCorrectionLevel: "M", margin: 4, color: { dark: "#000000", light: "#ffffff" } } as const;

/** Vector QR (scales to its container when `size` is omitted). */
export function qrSvg(text: string, size?: number): Promise<string> {
  return QRCode.toString(text, { ...BASE, type: "svg", ...(size ? { width: size } : {}) });
}

export function qrSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Print-resolution PNG (1200 px ≈ 5 cm at 600 dpi). */
export function qrPng(text: string, width = 1200): Promise<Buffer> {
  return QRCode.toBuffer(text, { ...BASE, type: "png", width });
}
