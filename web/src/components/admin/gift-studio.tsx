"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Gift, ImageUp, Link2, RefreshCw, Wand2 } from "lucide-react";
import { availableStyles, STYLES } from "@/lib/catalog";
import { CopyButton } from "@/components/admin/partner-controls";
import { adminButton, inputClass, labelClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Result = {
  giftId: string;
  imageUrl: string;
  revealUrl: string;
  dm: string;
  style: string;
  provider?: string;
  durationMs?: number;
};

export function GiftStudio({
  partnerId,
  defaultRecipient,
  defaultPetName,
}: {
  partnerId?: string;
  defaultRecipient?: string | null;
  defaultPetName?: string | null;
}) {
  const router = useRouter();
  const [source, setSource] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [style, setStyle] = useState<string>("royal");
  const [petName, setPetName] = useState(defaultPetName ?? "");
  const [recipientName, setRecipientName] = useState(defaultRecipient ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const previewRef = useRef<string | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  function pickFile(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setFile(next);
    setFilePreview(previewRef.current);
  }

  async function generate(regenerate: boolean) {
    setError(null);
    if (!regenerate && source === "url" && !imageUrl.trim()) return setError("Paste an image URL of the dog first.");
    if (!regenerate && source === "file" && !file) return setError("Choose a photo of the dog first.");

    const fd = new FormData();
    fd.set("style", style);
    if (partnerId) fd.set("partnerId", partnerId);
    if (petName.trim()) fd.set("petName", petName.trim());
    if (recipientName.trim()) fd.set("recipientName", recipientName.trim());
    fd.set("message", message.trim());
    if (regenerate && result) fd.set("giftId", result.giftId);
    else if (source === "file" && file) fd.set("file", file);
    else fd.set("imageUrl", imageUrl.trim());

    setBusy(true);
    setElapsed(0);
    const t0 = Date.now();
    timer.current = setInterval(() => setElapsed(Math.round((Date.now() - t0) / 1000)), 500);
    try {
      const res = await fetch("/api/admin/gifts", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        gift?: { id: string };
        imageUrl?: string;
        revealUrl?: string;
        dm?: string;
        style?: string;
        provider?: string;
        durationMs?: number;
      };
      if (!res.ok || !json.ok || !json.gift) {
        throw new Error(json.message ?? json.error ?? `HTTP ${res.status}`);
      }
      setResult({
        giftId: json.gift.id,
        imageUrl: json.imageUrl ?? "",
        revealUrl: json.revealUrl ?? "",
        dm: json.dm ?? "",
        style: json.style ?? style,
        provider: json.provider,
        durationMs: json.durationMs,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      if (timer.current) clearInterval(timer.current);
      setBusy(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setImageUrl("");
    pickFile(null);
  }

  const sourcePreview = source === "file" ? filePreview : /^https?:\/\//i.test(imageUrl) ? imageUrl : null;
  const styleName = STYLES.find((s) => s.slug === (result?.style ?? style))?.name ?? style;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Inputs */}
      <div className="space-y-5">
        {!result && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={labelClass}>Dog photo</span>
              <div className="flex rounded-lg bg-paper-2 p-0.5 text-xs" role="tablist" aria-label="Photo source">
                {(["url", "file"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={source === s}
                    onClick={() => setSource(s)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium",
                      source === s ? "bg-white text-ink shadow-sm" : "text-ink-3",
                    )}
                  >
                    {s === "url" ? <Link2 className="h-3.5 w-3.5" /> : <ImageUp className="h-3.5 w-3.5" />}
                    {s === "url" ? "Image URL" : "Upload"}
                  </button>
                ))}
              </div>
            </div>
            {source === "url" ? (
              <>
                <label htmlFor="gift-url" className="sr-only">
                  Image URL
                </label>
                <input
                  id="gift-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://… (right-click the photo → Copy image address)"
                  className={inputClass}
                />
              </>
            ) : (
              <>
                <label htmlFor="gift-file" className="sr-only">
                  Photo file
                </label>
                <input
                  id="gift-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-ink-2 file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:text-sm file:font-medium file:text-paper"
                />
              </>
            )}
            {sourcePreview && (
              // Admin-only preview of an arbitrary pasted URL / local blob: plain img is intentional.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sourcePreview} alt="Source photo" className="mt-3 h-32 w-auto rounded-lg object-cover ring-1 ring-line" />
            )}
          </div>
        )}

        <div>
          <span className={labelClass}>Style</span>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3" role="radiogroup" aria-label="Style">
            {availableStyles().map((s) => (
              <button
                key={s.slug}
                type="button"
                role="radio"
                aria-checked={style === s.slug}
                onClick={() => setStyle(s.slug)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm ring-1 transition",
                  style === s.slug ? "bg-ink text-paper ring-ink" : "bg-white text-ink ring-line hover:ring-ink/40",
                )}
              >
                <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: s.swatch }} />
                <span className="truncate">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="gift-recipient" className={labelClass}>
              Recipient name
            </label>
            <input id="gift-recipient" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} maxLength={80} className={inputClass} />
          </div>
          <div>
            <label htmlFor="gift-pet" className={labelClass}>
              Dog&apos;s name
            </label>
            <input id="gift-pet" value={petName} onChange={(e) => setPetName(e.target.value)} maxLength={40} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="gift-message" className={labelClass}>
            Note on the reveal page (optional)
          </label>
          <textarea
            id="gift-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="We loved your post about…"
            className={`${inputClass} h-auto py-2`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {result ? (
            <>
              <button type="button" onClick={() => generate(true)} disabled={busy} className={adminButton("primary")}>
                <RefreshCw className={cn("h-4 w-4", busy && "animate-spin")} />
                {busy ? `Creating… ${elapsed}s` : "Regenerate in this style"}
              </button>
              <button type="button" onClick={reset} disabled={busy} className={adminButton("secondary")}>
                <Gift className="h-4 w-4" /> New gift
              </button>
            </>
          ) : (
            <button type="button" onClick={() => generate(false)} disabled={busy} className={adminButton("accent")}>
              <Wand2 className={cn("h-4 w-4", busy && "animate-pulse")} />
              {busy ? `Creating portrait… ${elapsed}s` : "Create gift portrait"}
            </button>
          )}
        </div>
        {busy && <p className="text-xs text-ink-3">Usually 20–50 seconds. Keep this tab open.</p>}
        {error && (
          <p role="alert" className="rounded-lg bg-clay-soft px-3 py-2 text-sm text-clay-dark">
            {error}
          </p>
        )}
      </div>

      {/* Result */}
      <div className="rounded-xl bg-paper-2/60 p-4">
        {result ? (
          <div className="space-y-4">
            <div className="frame-black mx-auto w-full max-w-[340px]">
              {/* Signed, short-lived URL at its natural aspect ratio. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.imageUrl} alt={`${styleName} gift portrait`} className="block h-auto w-full bg-paper-2" />
            </div>
            <p className="text-center text-xs text-ink-3">
              {styleName}
              {result.provider && ` · ${result.provider}`}
              {result.durationMs && ` · ${(result.durationMs / 1000).toFixed(0)}s`}
            </p>
            <div>
              <p className={labelClass}>Reveal link</p>
              <p className="break-all rounded-md bg-white px-2 py-1.5 font-mono text-xs ring-1 ring-line">{result.revealUrl}</p>
            </div>
            <div>
              <p className={labelClass}>DM</p>
              <p className="rounded-md bg-white px-3 py-2 text-sm leading-relaxed ring-1 ring-line">{result.dm}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={result.dm} label="Copy DM" className="h-9 text-sm" />
              <CopyButton value={result.revealUrl} label="Copy link" className="h-9 text-sm" />
              <a href={result.revealUrl} target="_blank" rel="noreferrer" className={adminButton("secondary", "h-9")}>
                Open reveal <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="text-xs text-ink-3">Not quite right? Pick another style on the left and regenerate; the link stays the same.</p>
          </div>
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center text-center text-sm text-ink-3 lg:min-h-[260px]">
            {busy ? (
              <>
                <div className="skeleton aspect-[3/4] w-48 rounded-md" />
                <p className="mt-3">Creating the portrait…</p>
              </>
            ) : (
              <>
                <Gift className="mb-2 h-6 w-6" />
                <p>The finished portrait, reveal link and a ready-to-send DM appear here.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
