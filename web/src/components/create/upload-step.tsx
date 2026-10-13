"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { track } from "@/lib/analytics";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ApiError, uploadPhoto } from "./api";
import { PhotoTips } from "./photo-tips";
import { prepareImage, PrepareError } from "./prepare-image";
import { updateFlow, type FlowState } from "./store";

type Phase = "idle" | "preparing" | "uploading" | "error";

export function UploadStep({
  flow,
  preselected,
  onContinue,
}: {
  flow: FlowState;
  preselected?: StyleSlug;
  onContinue: () => void;
}) {
  const inputId = useId();
  const nameId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [smallWarning, setSmallWarning] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!localUrl) return;
    return () => URL.revokeObjectURL(localUrl);
  }, [localUrl]);

  const busy = phase === "preparing" || phase === "uploading";
  const displayUrl = localUrl ?? flow.upload?.url ?? null;
  const ready = Boolean(flow.upload) && !busy;
  const style = preselected ? getStyle(preselected) : undefined;
  const dogName = flow.petName.trim();

  async function handleFile(file: File | undefined | null) {
    if (!file || busy) return;
    setError(null);
    setSmallWarning(false);
    setPhase("preparing");
    setProgress(0);
    try {
      const prepared = await prepareImage(file);
      setLocalUrl(URL.createObjectURL(prepared.blob));
      setSmallWarning(prepared.small);
      setPhase("uploading");
      const upload = await uploadPhoto(prepared.blob, setProgress);
      updateFlow((s) => ({ ...s, upload, activeId: null }));
      track("UploadPhoto", { width: upload.width, height: upload.height });
      setPhase("idle");
    } catch (err) {
      const message =
        err instanceof PrepareError || err instanceof ApiError
          ? err.message
          : "Something went wrong with that photo. Please try another.";
      setError(message);
      setLocalUrl(null);
      setPhase("error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files?.[0]);
  }

  const continueLabel = style ? `Paint ${dogName || "my dog"} as ${style.name}` : "Continue";

  return (
    <section className="mx-auto w-full max-w-md px-5 pt-6 pb-16 sm:max-w-lg sm:px-8 sm:pt-14">
      <h1 className="text-center font-display text-[2.6rem] leading-[1.02] sm:text-[3.5rem]">Start with a photo you love.</h1>
      <p className="mx-auto mt-4 max-w-sm text-center text-[15px] leading-relaxed text-ink-2">
        {style ? (
          <>
            We&apos;ll paint your dog as {style.name}. Free preview in about a minute.
          </>
        ) : (
          <>See your dog as a fine-art portrait in about a minute. Free, no card needed.</>
        )}
      </p>

      <div className="mt-7 sm:mt-10">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*,.heic,.heif"
          className="sr-only"
          onChange={(e) => void handleFile(e.target.files?.[0])}
          disabled={busy}
        />

        {displayUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[200px] sm:max-w-[260px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt="Your uploaded photo"
                className={cn("aspect-[4/5] w-full bg-paper-3 object-cover transition-opacity duration-300", busy && "opacity-50")}
              />
              {busy && (
                <div className="absolute inset-x-0 -bottom-3 h-px bg-line" aria-hidden>
                  <div
                    className="h-full bg-ink transition-[width] duration-200"
                    style={{ width: `${phase === "preparing" ? 8 : Math.max(8, Math.round(progress * 100))}%` }}
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-[13px]">
              <p className="text-ink-2" role="status" aria-live="polite">
                {busy ? (phase === "preparing" ? "Preparing your photo…" : "Uploading…") : "Looking good."}
              </p>
              <label
                htmlFor={inputId}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink",
                  busy && "pointer-events-none opacity-40",
                )}
              >
                Change photo
              </label>
            </div>
            {smallWarning && !busy && (
              <p className="max-w-xs text-center text-[13px] leading-snug text-ink-3">
                This photo is on the small side, so large prints may look soft. The original from your camera roll
                works best.
              </p>
            )}
          </div>
        ) : (
          <>
          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex aspect-[5/4] cursor-pointer flex-col items-center justify-center gap-3 rounded-[3px] border px-6 text-center transition-colors",
              dragging ? "border-ink bg-paper-2" : "border-line bg-white hover:border-ink/40",
            )}
          >
            <Upload className="h-5 w-5 text-ink-2" strokeWidth={1.5} aria-hidden />
            <span>
              <span className="block text-[16px] font-medium text-ink">Choose a photo</span>
              <span className="mt-1 block text-[13px] text-ink-3">
                <span className="sm:hidden">From your camera roll</span>
                <span className="hidden sm:inline">or drag it here</span>
              </span>
            </span>
          </label>
          <PhotoTips className="mt-6" />
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 text-center text-[14px] leading-snug text-ink">
            {error}
          </p>
        )}
      </div>

      <div className={displayUrl ? "mt-4" : "mt-8"}>
        <label htmlFor={nameId} className="text-[13px] text-ink-2">
          Your dog&apos;s name <span className="text-ink-3">(optional)</span>
        </label>
        <input
          id={nameId}
          type="text"
          maxLength={40}
          autoComplete="off"
          autoCapitalize="words"
          placeholder="e.g. Biscuit"
          value={flow.petName}
          onChange={(e) => {
            const petName = e.target.value;
            updateFlow((s) => ({ ...s, petName }));
          }}
          className="mt-2 h-12 w-full rounded-[3px] border border-line bg-white px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink"
        />
        <p className="mt-2 text-[12.5px] text-ink-3">It never appears on the art.</p>
      </div>

      {displayUrl && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onContinue}
            disabled={!ready}
            className="inline-flex h-14 w-full items-center justify-center rounded-[3px] bg-ink px-6 text-[15px] font-medium text-paper transition-colors hover:bg-ink/85 disabled:bg-ink/15 disabled:text-ink-3"
          >
            {continueLabel}
          </button>
          <p className="mt-3 text-center text-[12.5px] text-ink-3">Your photo stays private and is only used for your portrait.</p>
        </div>
      )}
    </section>
  );
}
