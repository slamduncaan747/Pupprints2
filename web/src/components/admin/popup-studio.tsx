"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import QRCode from "qrcode";
import { Camera, Check, Copy, ImageUp, Loader2, Mail, MessageSquare, RotateCcw } from "lucide-react";
import { track } from "@/lib/analytics";
import { prepareImage } from "@/components/create/prepare-image";
import { isoDay, withPopupUtm } from "@/components/admin/popup";
import { adminButton, ErrorNote, inputClass, labelClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type PopupStyle = { slug: string; name: string; sample: string };

/** /api/admin/gifts has maxDuration 120 s (105 s AI budget); allow for the upload on top. */
const REQUEST_TIMEOUT_MS = 150_000;
/** What the progress bar assumes a portrait takes; it holds at 95% until the answer arrives. */
const TYPICAL_MS = 70_000;

type Photo = { file: File; url: string };
type Result = { link: string; imageUrl: string; qr: string; petName: string; ownerName: string };
type Phase = "edit" | "making" | "done";

const BIG = "h-16 w-full rounded-xl text-[17px]";
const FIELD = cn(inputClass, "h-14 rounded-xl text-[17px]");

/**
 * Pop-up mode, built for one hand on a phone in daylight: take a photo, optional names, one of six
 * styles, then the portrait and a big QR of its reveal link (with pop-up UTMs, no code and no
 * discount) for the owner to scan and buy on their own phone. Portraits are made by the gift tool's
 * route, so the AI pipeline, storage and reveal page are the same as every other gift.
 */
export function PopupStudio({ styles }: { styles: PopupStyle[] }) {
  const ids = { pet: useId(), owner: useId() };
  const [phase, setPhase] = useState<Phase>("edit");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [style, setStyle] = useState(styles[0]?.slug ?? "royal");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const photoUrlRef = useRef<string | null>(null);

  // Release the photo preview and stop any request when leaving the page.
  useEffect(
    () => () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    const url = URL.createObjectURL(file);
    photoUrlRef.current = url;
    setPhoto({ file, url });
    setError(null);
  }

  function nextDog() {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = null;
    setPhoto(null);
    setPetName("");
    setOwnerName("");
    setResult(null);
    setError(null);
    setCopied(false);
    setPhase("edit");
    window.scrollTo({ top: 0 });
  }

  async function make() {
    if (!photo || phase === "making") return;
    setError(null);
    setElapsed(0);
    setPhase("making");
    window.scrollTo({ top: 0 });
    const started = Date.now();
    const tick = window.setInterval(() => setElapsed(Date.now() - started), 500);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = window.setTimeout(() => ctrl.abort("timeout"), REQUEST_TIMEOUT_MS);
    // Keep the screen awake while the portrait is made (unsupported browsers just skip it).
    let wakeLock: WakeLockSentinel | null = null;
    try {
      wakeLock = (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      wakeLock = null;
    }

    const pet = petName.trim();
    const owner = ownerName.trim();
    try {
      // Downscale in the browser: Vercel rejects request bodies over 4.5 MB.
      const prepared = await prepareImage(photo.file);
      const fd = new FormData();
      fd.set("style", style);
      fd.set("file", new File([prepared.blob], "photo.jpg", { type: "image/jpeg" }));
      if (pet) fd.set("petName", pet);
      if (owner) fd.set("recipientName", owner);

      const res = await fetch("/api/admin/gifts", { method: "POST", body: fd, signal: ctrl.signal });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        imageUrl?: string;
        revealUrl?: string;
        durationMs?: number;
      };
      if (res.status === 401) throw new Error("Your admin session expired. Log in again, then tap Make the portrait.");
      if (!res.ok || !json.ok || !json.revealUrl) throw new Error(json.message ?? json.error ?? `Something went wrong (HTTP ${res.status}).`);

      const link = withPopupUtm(json.revealUrl, "in_person", isoDay());
      const svg = await QRCode.toString(link, { type: "svg", errorCorrectionLevel: "M", margin: 4 });
      setResult({
        link,
        imageUrl: json.imageUrl ?? "",
        qr: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
        petName: pet,
        ownerName: owner,
      });
      setPhase("done");
      window.scrollTo({ top: 0 });
      track("PopupPortrait", { style, seconds: Math.round((json.durationMs ?? Date.now() - started) / 1000), named: Boolean(pet) });
    } catch (err) {
      setPhase("edit");
      if (ctrl.signal.aborted) {
        setError(ctrl.signal.reason === "timeout" ? "That took too long (the AI was slow). Tap Make the portrait to try again." : null);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      window.clearInterval(tick);
      window.clearTimeout(timer);
      abortRef.current = null;
      wakeLock?.release().catch(() => {});
    }
  }

  async function copy(link: string) {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt("Copy this link:", link);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  /* ------------------------------ result ------------------------------ */
  if (phase === "done" && result) {
    const pet = result.petName;
    const hello = result.ownerName ? `Hi ${result.ownerName}! ` : "";
    const text = `${hello}Here's ${pet ? `${pet}'s` : "your dog's"} portrait from Pup Prints: ${result.link}`;
    const subject = `${pet ? `${pet}'s` : "Your dog's"} portrait from Pup Prints`;
    return (
      <div className="space-y-6 pb-8">
        {result.imageUrl && (
          // Signed URL to the finished gift image (no watermark), straight from storage.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.imageUrl}
            alt={pet ? `Portrait of ${pet}` : "The finished portrait"}
            className="mx-auto max-h-[62dvh] w-auto max-w-full rounded-xl bg-paper-2 object-contain"
          />
        )}
        <div className="rounded-xl border border-line bg-white p-5 text-center">
          <p className="text-[19px] font-semibold text-ink">Scan to see it and order</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.qr} alt="QR code for the portrait's link" className="mx-auto mt-3 aspect-square w-full max-w-[300px]" />
          <p className="mt-2 break-all font-mono text-[11px] leading-snug text-ink-3">{result.link}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a href={`sms:?&body=${encodeURIComponent(text)}`} className={adminButton("secondary", "h-16 flex-col gap-1 rounded-xl text-[15px]")}>
            <MessageSquare className="h-5 w-5" aria-hidden /> Text it
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`}
            className={adminButton("secondary", "h-16 flex-col gap-1 rounded-xl text-[15px]")}
          >
            <Mail className="h-5 w-5" aria-hidden /> Email it
          </a>
          <button type="button" onClick={() => copy(result.link)} className={adminButton("secondary", "h-16 flex-col gap-1 rounded-xl text-[15px]")}>
            {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-5 w-5" aria-hidden />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <p aria-live="polite" className="sr-only">
          {copied ? "Link copied" : ""}
        </p>
        <button type="button" onClick={nextDog} className={adminButton("primary", BIG)}>
          Next dog
        </button>
        <p className="text-center text-xs text-ink-3">
          No code and no discount on this link. Orders from it count as pop-up sales in the scorecard.
        </p>
      </div>
    );
  }

  /* ------------------------------ making ------------------------------ */
  if (phase === "making") {
    const pct = Math.min(95, Math.round((elapsed / TYPICAL_MS) * 100));
    const secs = Math.floor(elapsed / 1000);
    return (
      <div className="space-y-5 pb-8" aria-live="polite">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt="" className="mx-auto aspect-[4/5] max-h-[48dvh] w-auto max-w-full rounded-xl object-cover opacity-60" />
        )}
        <div>
          <p className="flex items-center gap-2 text-[19px] font-semibold text-ink">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Making {petName.trim() ? `${petName.trim()}'s` : "the"} portrait
          </p>
          <div
            role="progressbar"
            aria-label="Portrait progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="mt-4 h-3 w-full overflow-hidden rounded-full bg-paper-3"
          >
            <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-[15px] text-ink-2 tabular-nums">
            {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")} · usually 30–90 seconds. Keep this screen open.
          </p>
        </div>
        <button type="button" onClick={() => abortRef.current?.abort("cancel")} className={adminButton("secondary", "h-14 w-full rounded-xl text-[16px]")}>
          Cancel
        </button>
      </div>
    );
  }

  /* ------------------------------ capture + edit ------------------------------ */
  return (
    <div className="space-y-6 pb-28">
      {error && <ErrorNote message={error} />}

      {photo ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt="The dog's photo" className="aspect-[4/5] w-28 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 space-y-2">
            <p className="text-[15px] font-medium text-ink">Photo ready</p>
            <label className={adminButton("secondary", "h-12 cursor-pointer rounded-xl px-4 text-[15px] focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2")}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Retake
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onPhoto} />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className={adminButton("primary", "h-24 w-full cursor-pointer gap-3 rounded-xl text-[20px] focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2")}>
            <Camera className="h-7 w-7" aria-hidden /> Take photo
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onPhoto} />
          </label>
          <label className={adminButton("secondary", "h-14 w-full cursor-pointer rounded-xl text-[16px] focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2")}>
            <ImageUp className="h-5 w-5" aria-hidden /> Choose from library
            <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
          </label>
          <p className="text-center text-sm text-ink-3">Face on, eye level, good light. One dog per photo.</p>
        </div>
      )}

      <div className="grid gap-4">
        <div>
          <label htmlFor={ids.pet} className={labelClass}>
            Dog&apos;s name <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id={ids.pet}
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            maxLength={40}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
            className={FIELD}
            placeholder="Biscuit"
          />
        </div>
        <div>
          <label htmlFor={ids.owner} className={labelClass}>
            Owner&apos;s first name <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id={ids.owner}
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            maxLength={80}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="done"
            className={FIELD}
            placeholder="Sam"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Style</legend>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {styles.map((s) => {
            const on = s.slug === style;
            return (
              <button
                key={s.slug}
                type="button"
                aria-pressed={on}
                onClick={() => setStyle(s.slug)}
                className={cn(
                  "overflow-hidden rounded-xl bg-white text-left outline-offset-2",
                  on ? "outline-[3px] outline-ink outline-solid" : "outline-1 outline-line outline-solid",
                )}
              >
                <Image src={s.sample} alt="" width={240} height={300} sizes="(max-width: 480px) 31vw, 140px" className="aspect-[4/5] w-full object-cover" />
                <span className={cn("block truncate px-1.5 py-2 text-[13px] leading-tight", on ? "font-semibold text-ink" : "text-ink-2")}>
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:px-0">
        <button type="button" onClick={make} disabled={!photo} className={adminButton("primary", BIG)}>
          {photo ? "Make the portrait" : "Take a photo first"}
        </button>
      </div>
    </div>
  );
}
