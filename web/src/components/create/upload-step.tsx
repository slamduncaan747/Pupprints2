"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { ArrowRight, CircleAlert, ImagePlus, LoaderCircle, Lock, RefreshCw } from "lucide-react";
import { track } from "@/lib/analytics";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/container";
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

  const continueLabel = style
    ? `Paint ${dogName || "my dog"} as ${style.name}`
    : "Continue — pick a style";

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-6 pb-16 sm:px-8 sm:pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <div className="min-w-0">
        <Eyebrow className="hidden sm:block">Step 1 of 3 · Your photo</Eyebrow>
        <h1 className="font-display text-[2.15rem] leading-[1.05] sm:mt-3 sm:text-5xl">
          Start with a photo you love.
        </h1>
        <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-lg">
          {style ? (
            <>
              We&apos;ll paint your dog as <span className="font-medium text-ink">{style.name}</span> and show you
              the portrait free in about a minute.
            </>
          ) : (
            <>See your dog as a fine-art portrait in about a minute. Free to preview, no card needed.</>
          )}
        </p>

        <div className="mt-6 sm:mt-8">
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
            <div className="flex flex-col gap-4 rounded-card bg-white p-3 shadow-soft ring-1 ring-line sm:flex-row sm:items-center sm:gap-6 sm:p-4">
              <div className="relative mx-auto w-full max-w-[260px] overflow-hidden rounded-xl bg-paper-3 sm:mx-0 sm:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayUrl}
                  alt="Your uploaded photo"
                  className={cn("aspect-[4/5] w-full object-cover transition", busy && "opacity-70 blur-[1px]")}
                />
                {busy && (
                  <div className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 p-1 shadow-sm">
                    <div className="h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-clay transition-[width] duration-200"
                        style={{ width: `${phase === "preparing" ? 8 : Math.max(8, Math.round(progress * 100))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 px-1 pb-1 sm:px-0">
                <p className="flex items-center gap-2 text-[15px] font-medium" role="status" aria-live="polite">
                  {busy ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin text-clay" aria-hidden />
                      {phase === "preparing" ? "Preparing your photo…" : "Uploading…"}
                    </>
                  ) : (
                    <>Looking good.</>
                  )}
                </p>
                {smallWarning && !busy && (
                  <p className="flex gap-2 rounded-xl bg-butter-soft px-3 py-2 text-[13px] leading-snug text-[#6b4f12]">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    This photo is on the small side, so large prints may look soft. The original photo from your
                    camera roll works best.
                  </p>
                )}
                <label
                  htmlFor={inputId}
                  className={cn(
                    "inline-flex h-11 w-fit cursor-pointer items-center gap-2 rounded-full px-4 text-[14px] font-medium text-ink ring-1 ring-ink/20 transition hover:ring-ink/50",
                    busy && "pointer-events-none opacity-50",
                  )}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden />
                  Change photo
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor={inputId}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-card border-2 border-dashed px-6 py-10 text-center transition sm:py-14",
                dragging ? "border-clay bg-clay-soft/50" : "border-ink/15 bg-white hover:border-clay/60 hover:bg-white",
              )}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-clay-soft text-clay transition group-hover:scale-105">
                <ImagePlus className="h-7 w-7" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-2xl">Choose a photo</span>
                <span className="mt-1 block text-[14px] text-ink-2">
                  <span className="sm:hidden">Take one or pick from your camera roll</span>
                  <span className="hidden sm:inline">or drag and drop it here</span>
                </span>
              </span>
              <span className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper shadow-[0_6px_20px_-6px_rgb(27_24_20/0.5)]">
                Upload your dog&apos;s photo
              </span>
              <span className="text-[12px] text-ink-3">JPG, PNG or WebP · one dog per photo</span>
            </label>
          )}

          {error && (
            <p role="alert" className="mt-3 flex gap-2 rounded-xl bg-clay-soft px-4 py-3 text-[14px] leading-snug text-clay-dark">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 max-w-md">
          <label htmlFor={nameId} className="text-[14px] font-medium text-ink">
            Your dog&apos;s name <span className="font-normal text-ink-3">(optional)</span>
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
            className="mt-2 h-12 w-full rounded-xl bg-white px-4 text-[16px] ring-1 ring-line outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-ink"
          />
          <p className="mt-1.5 text-[12.5px] text-ink-3">So we can make this feel like theirs. It never appears on the art.</p>
        </div>

        <div className={cn("mt-8 flex-col gap-3 sm:flex-row sm:items-center", displayUrl ? "flex" : "hidden sm:flex")}>
          <button
            type="button"
            onClick={onContinue}
            disabled={!ready}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-clay px-8 text-[16px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(200_85_61/0.7)] transition hover:bg-clay-dark active:scale-[0.98] disabled:bg-ink/15 disabled:text-ink-3 disabled:shadow-none"
          >
            {continueLabel}
            <ArrowRight className="h-4.5 w-4.5" aria-hidden />
          </button>
          <p className="flex items-center gap-1.5 text-[13px] text-ink-3">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Your photo stays private and is only used to paint your portrait.
          </p>
        </div>
      </div>

      <PhotoTips className="h-fit lg:sticky lg:top-24" />
    </section>
  );
}
