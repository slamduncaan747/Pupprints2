"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { track } from "@/lib/analytics";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiError, uploadPhoto } from "./api";
import { PhotoTips } from "./photo-tips";
import { prepareImage, PrepareError } from "./prepare-image";
import { updateFlow, type FlowState } from "./store";

type Phase = "idle" | "preparing" | "uploading" | "error";

/** Effort reduction, stated where the decision is made. */
const NO_FRICTION = "No account. No card.";

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
  const memorialId = useId();
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

  const continueLabel = style ? `Continue with ${style.name}` : "Continue";
  const fieldLabel = "label text-ink-3";

  return (
    <section className="mx-auto w-full max-w-[560px] px-5 pt-8 pb-20 sm:px-10 sm:pt-14">
      <h1 className="text-center font-display text-[44px] leading-[1.02] sm:text-[68px]">Begin with a photograph.</h1>
      <p className="mx-auto mt-5 max-w-[20rem] text-center text-[14px] leading-relaxed text-balance text-ink-2 sm:max-w-md sm:text-[15px]">
        {style ? (
          <>Your dog, as {style.name}. A complimentary preview in about a minute.</>
        ) : (
          <>A complimentary preview in about a minute.</>
        )}
      </p>

      <div className="mt-10 sm:mt-14">
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
            <div className="relative w-full max-w-[220px] sm:max-w-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt="Your uploaded photograph"
                className={cn(
                  "aspect-[4/5] w-full bg-paper-2 object-cover transition-opacity duration-700",
                  busy && "opacity-40",
                )}
              />
              {busy && (
                <div className="absolute inset-x-0 -bottom-4 h-px bg-line" aria-hidden>
                  <div
                    className="h-full bg-ink transition-[width] duration-300"
                    style={{ width: `${phase === "preparing" ? 8 : Math.max(8, Math.round(progress * 100))}%` }}
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center gap-6">
              <p className="label text-ink-3" role="status" aria-live="polite">
                {busy ? (phase === "preparing" ? "Preparing…" : "Uploading…") : "Received"}
              </p>
              <label
                htmlFor={inputId}
                className={cn(
                  "link-cta inline-flex min-h-11 cursor-pointer items-center",
                  busy && "pointer-events-none opacity-40",
                )}
              >
                Change photograph
              </label>
            </div>
            {smallWarning && !busy && (
              <p className="mt-2 max-w-xs text-center text-[13px] leading-snug text-ink-3">
                This photograph is on the small side, so large prints may look soft. The original from your camera
                roll works best.
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
                "group flex aspect-square cursor-pointer flex-col items-center justify-center gap-4 border px-6 text-center transition-colors duration-300 sm:aspect-[4/3]",
                dragging ? "border-ink bg-paper-2" : "border-line hover:border-ink-3",
              )}
            >
              <span className="link-cta text-ink group-hover:opacity-60">Select a photograph</span>
              <span className="label text-ink-3">
                <span className="sm:hidden">From your camera roll</span>
                <span className="hidden sm:inline">Or drop it here</span>
              </span>
            </label>
            <p className="label mt-4 text-center text-ink-2">{NO_FRICTION}</p>
            <PhotoTips className="mt-9" />
          </>
        )}

        {error && (
          <p role="alert" className="mt-5 text-center text-[14px] leading-snug text-ink">
            {error}
          </p>
        )}
      </div>

      <div className={displayUrl ? "mt-10" : "mt-12"}>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={nameId} className="label text-ink">
            Your dog&apos;s name
          </label>
          <span className={fieldLabel}>Optional</span>
        </div>
        <input
          id={nameId}
          type="text"
          maxLength={40}
          autoComplete="off"
          autoCapitalize="words"
          placeholder="Biscuit"
          value={flow.petName}
          onChange={(e) => {
            const petName = e.target.value;
            updateFlow((s) => ({ ...s, petName }));
          }}
          className="mt-1 h-12 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none"
        />
        <p className="mt-2.5 text-[12px] text-ink-3">It never appears on the art.</p>
      </div>

      {/* The gentle track: unchecked by default, never mentioned anywhere else. */}
      <div className="mt-8 border-y border-line">
        <label htmlFor={memorialId} className="flex min-h-14 cursor-pointer items-start gap-3.5 py-4">
          <input
            id={memorialId}
            type="checkbox"
            checked={flow.memorial}
            onChange={(e) => {
              const memorial = e.target.checked;
              updateFlow((s) => ({ ...s, memorial }));
              track("MemorialToggle", { on: memorial });
            }}
            aria-describedby={flow.memorial ? `${memorialId}-note` : undefined}
            className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-none border border-ink-3 bg-paper transition-colors checked:border-ink checked:bg-ink checked:shadow-[inset_0_0_0_3px_var(--color-paper)] hover:border-ink"
          />
          <span className="min-w-0">
            <span className="block text-[14px] text-ink">This portrait is in memory of my dog</span>
            {flow.memorial && (
              <span id={`${memorialId}-note`} className="mt-1.5 block text-[12px] leading-relaxed text-ink-3">
                We&apos;re so sorry. Take all the time you need: every preview is free and stays saved, and we&apos;ll
                show the gentlest styles first.
              </span>
            )}
          </span>
        </label>
      </div>

      {displayUrl && (
        <div className="mt-10">
          <Button type="button" size="lg" onClick={onContinue} disabled={!ready} className="w-full">
            {continueLabel}
          </Button>
          <p className="label mt-4 text-center text-ink-2">{NO_FRICTION}</p>
          <p className="mt-2 text-center text-[12px] text-ink-3">
            Your photograph stays private and is used only for your portrait.
          </p>
        </div>
      )}
    </section>
  );
}
