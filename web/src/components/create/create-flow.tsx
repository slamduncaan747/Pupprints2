"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleAlert, Clock, Coffee, RefreshCw } from "lucide-react";
import { track } from "@/lib/analytics";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { ApiError, fetchGenerations, generatePortrait } from "./api";
import { EmailCapture } from "./email-capture";
import { GeneratingView } from "./generating-view";
import { ProductStep } from "./product-step";
import { ResultView } from "./result-view";
import { StepProgress } from "./step-progress";
import { StyleGrid } from "./style-grid";
import { UploadStep } from "./upload-step";
import {
  mergeGenerations,
  readFlow,
  resetFlow,
  updateFlow,
  useFlow,
  type Generation,
  type Step,
} from "./store";

type Job =
  | { kind: "idle" }
  | { kind: "generating"; style: StyleSlug; startedAt: number }
  | { kind: "error"; style: StyleSlug; code: string; message: string; generationId?: string };

function scrollTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

export function CreateFlow({ initialStyle }: { initialStyle?: StyleSlug }) {
  const flow = useFlow();
  const [job, setJob] = useState<Job>({ kind: "idle" });
  const [styleView, setStyleView] = useState<"grid" | "result">("result");
  const [preselected, setPreselected] = useState<StyleSlug | undefined>(initialStyle);
  const abortRef = useRef<AbortController | null>(null);

  // Restore from the server (fresh signed photo URL + previews made on this browser session).
  useEffect(() => {
    let cancelled = false;
    fetchGenerations()
      .then((res) => {
        if (cancelled) return;
        updateFlow((s) => {
          const serverGens: Generation[] = res.generations
            .filter((g) => getStyle(g.style))
            .filter((g) => !s.resetAt || Date.parse(g.createdAt) > s.resetAt)
            .map((g) => ({ ...g, style: g.style as StyleSlug }));
          let upload = s.upload;
          if (res.upload) {
            const fresh = { uploadId: res.upload.uploadId, url: res.upload.url, width: res.upload.width ?? 0, height: res.upload.height ?? 0 };
            if (upload?.uploadId === res.upload.uploadId) upload = { ...upload, url: res.upload.url };
            else if (!upload && (!s.resetAt || Date.parse(res.upload.createdAt) > s.resetAt)) upload = fresh;
          }
          const generations = mergeGenerations(s.generations, serverGens);
          const forUpload = generations.filter((g) => g.uploadId === upload?.uploadId);
          const activeId =
            s.activeId && forUpload.some((g) => g.generationId === s.activeId) ? s.activeId : (forUpload[0]?.generationId ?? null);
          const step = s.step === "upload" && !s.upload && upload && forUpload.length ? "style" : s.step;
          return { ...s, upload, generations, activeId, step };
        });
      })
      .catch(() => {
        // offline or API down: local state still works
      });
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, []);

  const uploadId = flow.upload?.uploadId ?? null;
  const currentGens = uploadId ? flow.generations.filter((g) => g.uploadId === uploadId) : [];
  const active = currentGens.find((g) => g.generationId === flow.activeId) ?? null;

  const goTo = useCallback((step: Step) => {
    updateFlow((s) => ({ ...s, step }));
    scrollTop();
  }, []);

  const generate = useCallback(async (style: StyleSlug, opts: { force?: boolean } = {}) => {
    const s = readFlow();
    if (!s.upload) {
      updateFlow((st) => ({ ...st, step: "upload" }));
      return;
    }
    const upload = s.upload;
    if (!opts.force) {
      const existing = s.generations.find((g) => g.uploadId === upload.uploadId && g.style === style);
      if (existing) {
        updateFlow((st) => ({ ...st, activeId: existing.generationId, step: "style" }));
        setJob({ kind: "idle" });
        setStyleView("result");
        scrollTop();
        return;
      }
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = Date.now();
    setJob({ kind: "generating", style, startedAt });
    setPreselected(style);
    updateFlow((st) => ({ ...st, step: "style" }));
    scrollTop();
    track("GeneratePreview", { style, regenerate: Boolean(opts.force) });

    try {
      const petName = s.petName.trim() || undefined;
      const res = await generatePortrait({ uploadId: upload.uploadId, style, petName }, controller.signal);
      const gen: Generation = {
        generationId: res.generationId,
        style: res.style,
        previewUrl: res.previewUrl,
        createdAt: new Date().toISOString(),
        uploadId: upload.uploadId,
        petName: petName ?? null,
      };
      updateFlow((st) => ({ ...st, generations: mergeGenerations(st.generations, [gen]), activeId: gen.generationId }));
      setJob({ kind: "idle" });
      setStyleView("result");
      track("PreviewReady", { style, seconds: Math.round((Date.now() - startedAt) / 1000) });
    } catch (err) {
      if (controller.signal.aborted) return;
      const e =
        err instanceof ApiError ? err : new ApiError("network", "We couldn't reach our studio. Please try again.", 0);
      if (e.code === "upload_not_found") {
        updateFlow((st) => ({ ...st, upload: null, activeId: null, step: "upload" }));
      }
      const pendingId = typeof e.data.generationId === "string" ? e.data.generationId : undefined;
      setJob({ kind: "error", style, code: e.code, message: e.message, generationId: pendingId });
    }
  }, []);

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort();
    setJob({ kind: "idle" });
    setStyleView("grid");
  }, []);

  const reachable: Record<Step, boolean> = {
    upload: true,
    style: Boolean(flow.upload),
    product: Boolean(active),
  };

  // Guard against impossible states (e.g. restored "product" step whose preview was removed).
  let step: Step = flow.step;
  if (step === "product" && !active) step = flow.upload ? "style" : "upload";
  if (step === "style" && !flow.upload) step = "upload";

  let content: React.ReactNode;
  if (step === "upload") {
    content = (
      <UploadStep
        flow={flow}
        preselected={preselected}
        onContinue={() => {
          if (preselected) void generate(preselected);
          else {
            setStyleView(currentGens.length ? "result" : "grid");
            goTo("style");
          }
        }}
      />
    );
  } else if (step === "style" && flow.upload) {
    if (job.kind === "generating") {
      content = (
        <GeneratingView
          style={job.style}
          photoUrl={flow.upload.url}
          petName={flow.petName}
          startedAt={job.startedAt}
          onCancel={cancelGeneration}
        />
      );
    } else if (styleView === "result" && active && job.kind !== "error") {
      content = (
        <ResultView
          active={active}
          generations={currentGens}
          petName={flow.petName}
          onSelect={(id) => updateFlow((s) => ({ ...s, activeId: id }))}
          onLoveIt={() => goTo("product")}
          onTryAnother={() => {
            setStyleView("grid");
            scrollTop();
          }}
          onRegenerate={() => void generate(active.style, { force: true })}
        />
      );
    } else {
      content = (
        <>
          {job.kind === "error" && (
            <JobError
              job={job}
              petName={flow.petName}
              hasPreviews={currentGens.length > 0}
              onRetry={() => void generate(job.style, { force: true })}
              onDismiss={() => setJob({ kind: "idle" })}
              onViewPreviews={() => {
                setJob({ kind: "idle" });
                setStyleView("result");
              }}
            />
          )}
          <StyleGrid
            upload={flow.upload}
            petName={flow.petName}
            generations={currentGens}
            highlighted={job.kind === "error" ? job.style : preselected}
            onPick={(style) => void generate(style)}
            onChangePhoto={() => goTo("upload")}
            onBackToResult={
              active
                ? () => {
                    setJob({ kind: "idle" });
                    setStyleView("result");
                    scrollTop();
                  }
                : undefined
            }
          />
        </>
      );
    }
  } else if (step === "product" && active) {
    content = (
      <ProductStep
        flow={flow}
        active={active}
        onBack={() => {
          setStyleView("result");
          goTo("style");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <StepProgress
        current={step}
        reachable={reachable}
        onSelect={(s) => {
          if (s === "style") setStyleView(active ? "result" : "grid");
          goTo(s);
        }}
      />
      {content}
      {flow.upload && step === "upload" && (
        <div className="mx-auto -mt-8 w-full max-w-6xl px-4 pb-12 sm:px-8">
          <button
            type="button"
            onClick={() => {
              abortRef.current?.abort();
              setJob({ kind: "idle" });
              resetFlow();
            }}
            className="inline-flex min-h-11 items-center text-[13px] text-ink-3 underline decoration-ink/20 underline-offset-4 hover:text-ink"
          >
            Start over with a new dog
          </button>
        </div>
      )}
    </div>
  );
}

function JobError({
  job,
  petName,
  hasPreviews,
  onRetry,
  onDismiss,
  onViewPreviews,
}: {
  job: Extract<Job, { kind: "error" }>;
  petName: string;
  hasPreviews: boolean;
  onRetry: () => void;
  onDismiss: () => void;
  onViewPreviews: () => void;
}) {
  const style = getStyle(job.style);
  const box = "mx-auto mt-6 w-[calc(100%-2rem)] max-w-6xl rounded-card p-5 sm:mt-8 sm:w-[calc(100%-4rem)] sm:p-6";

  if (job.code === "ai_unavailable") {
    return (
      <div role="alert" className={`${box} bg-butter-soft ring-1 ring-butter`}>
        <div className="flex gap-3">
          <Coffee className="mt-0.5 h-5 w-5 shrink-0 text-[#7a5a12]" aria-hidden />
          <div className="flex-1">
            <p className="font-display text-xl">Our studio is busy right now.</p>
            <p className="mt-1 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
              Leave your email and we&apos;ll send {petName.trim() ? `${petName.trim()}'s` : "your"} {style?.name ?? ""}{" "}
              portrait preview shortly. Your photo is saved, so there&apos;s nothing else to do.
            </p>
            <EmailCapture
              className="mt-4 max-w-lg"
              source="ai_unavailable"
              generationId={job.generationId}
              petName={petName.trim() || undefined}
              cta="Notify me"
              doneMessage="Thank you! We'll email your preview as soon as it's painted."
            />
          </div>
        </div>
      </div>
    );
  }

  if (job.code === "rate_limited") {
    return (
      <div role="alert" className={`${box} bg-white ring-1 ring-line`}>
        <div className="flex gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
          <div className="flex-1">
            <p className="font-display text-xl">That&apos;s a lot of masterpieces for one day!</p>
            <p className="mt-1 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{job.message}</p>
            {hasPreviews && (
              <button
                type="button"
                onClick={onViewPreviews}
                className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[14px] font-medium text-paper"
              >
                See the portraits you made
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="alert" className={`${box} bg-clay-soft/60 ring-1 ring-clay/20`}>
      <div className="flex gap-3">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-clay-dark" aria-hidden />
        <div className="flex-1">
          <p className="font-display text-xl">
            {job.code === "network" ? "We lost the connection." : "That one didn't come out right."}
          </p>
          <p className="mt-1 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{job.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              {style ? `Try ${style.name} again` : "Try again"}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex h-11 items-center rounded-full px-4 text-[14px] font-medium text-ink-2 hover:text-ink"
            >
              Pick another style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
