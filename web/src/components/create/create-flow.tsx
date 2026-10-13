"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { buttonClasses } from "@/components/ui/button";
import { ApiError, fetchGenerations, fetchGiftPortrait, generatePortrait } from "./api";
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

/** Ordering a gift portrait from its reveal link (/create?gift=<reveal token>). */
type GiftState = { status: "loading" } | { status: "ready"; gen: Generation } | { status: "error"; message: string };

type Job =
  | { kind: "idle" }
  | { kind: "generating"; style: StyleSlug; startedAt: number }
  | { kind: "error"; style: StyleSlug; code: string; message: string; generationId?: string };

function scrollTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Steps live in the URL (?step=style|piece) so the phone's back button walks back through them. */
const STEP_PARAM: Record<Step, string | null> = { upload: null, style: "style", product: "piece" };

function stepFromUrl(): Step {
  const v = new URL(window.location.href).searchParams.get("step");
  return v === "piece" ? "product" : v === "style" ? "style" : "upload";
}

function urlForStep(step: Step) {
  const url = new URL(window.location.href);
  const v = STEP_PARAM[step];
  if (v) url.searchParams.set("step", v);
  else url.searchParams.delete("step");
  return url;
}

export function CreateFlow({ initialStyle, giftToken }: { initialStyle?: StyleSlug; giftToken?: string }) {
  const flow = useFlow();
  const [gift, setGift] = useState<GiftState | null>(giftToken ? { status: "loading" } : null);
  const [job, setJob] = useState<Job>({ kind: "idle" });
  const [styleView, setStyleView] = useState<"grid" | "result">("result");
  const [preselected, setPreselected] = useState<StyleSlug | undefined>(initialStyle);
  const abortRef = useRef<AbortController | null>(null);
  /** Steps we've pushed onto browser history in this visit (index 0 = the entry we landed on). */
  const historyRef = useRef<Step[]>([]);

  // Keep browser history in sync with the step.
  useEffect(() => {
    const current = readFlow().step;
    window.history.replaceState(null, "", urlForStep(current));
    historyRef.current = [current];
    const onPop = () => {
      const step = stepFromUrl();
      const stack = historyRef.current;
      const idx = stack.lastIndexOf(step);
      historyRef.current = idx >= 0 ? stack.slice(0, idx + 1) : [step];
      updateFlow((s) => ({ ...s, step }));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Gift link: load that portrait and go straight to choosing the piece.
  useEffect(() => {
    if (!giftToken) return;
    let cancelled = false;
    fetchGiftPortrait(giftToken)
      .then((res) => {
        if (cancelled) return;
        const style = getStyle(res.style);
        if (!style) throw new ApiError("gift_not_found", "We couldn't find that gift portrait.", 404);
        setGift({
          status: "ready",
          gen: {
            generationId: res.generationId,
            style: style.slug,
            previewUrl: res.previewUrl,
            createdAt: res.createdAt,
            uploadId: null,
            petName: res.petName,
          },
        });
        track("ViewContent", { content: "gift_portrait", style: style.slug });
      })
      .catch((err) => {
        if (cancelled) return;
        setGift({
          status: "error",
          message: err instanceof ApiError ? err.message : "We couldn't load that gift portrait. Please try again.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [giftToken]);

  /** Leave the gift portrait and make one of your own dog (keeps ?ref= and other params). */
  const leaveGift = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("gift");
    window.history.replaceState(null, "", url);
    setGift(null);
    scrollTop();
  }, []);

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
          const petName = s.petName || forUpload.find((g) => g.petName)?.petName || "";
          return { ...s, upload, generations, activeId, step, petName };
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

  /** Move to a step, using history.back() for backwards moves so the stack doesn't grow. */
  const goTo = useCallback((step: Step) => {
    const stack = historyRef.current;
    const idx = stack.lastIndexOf(step);
    if (idx >= 0 && idx < stack.length - 1) {
      window.history.go(idx - (stack.length - 1)); // popstate updates the step
    } else if (readFlow().step !== step || stack[stack.length - 1] !== step) {
      window.history.pushState(null, "", urlForStep(step));
      historyRef.current = [...stack, step];
      updateFlow((s) => ({ ...s, step }));
    }
    scrollTop();
  }, []);

  const generate = useCallback(async (style: StyleSlug, opts: { force?: boolean } = {}) => {
    const s = readFlow();
    if (!s.upload) {
      goTo("upload");
      return;
    }
    const upload = s.upload;
    if (!opts.force) {
      const existing = s.generations.find((g) => g.uploadId === upload.uploadId && g.style === style);
      if (existing) {
        updateFlow((st) => ({ ...st, activeId: existing.generationId }));
        setJob({ kind: "idle" });
        setStyleView("result");
        goTo("style");
        return;
      }
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = Date.now();
    setJob({ kind: "generating", style, startedAt });
    setPreselected(style);
    goTo("style");
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
        updateFlow((st) => ({ ...st, upload: null, activeId: null }));
        goTo("upload");
      }
      const pendingId = typeof e.data.generationId === "string" ? e.data.generationId : undefined;
      setJob({ kind: "error", style, code: e.code, message: e.message, generationId: pendingId });
    }
  }, [goTo]);

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

  if (gift && giftToken) {
    return (
      <GiftOrder
        gift={gift}
        flow={flow}
        giftToken={giftToken}
        onLeave={leaveGift}
      />
    );
  }

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
        <div className="mx-auto -mt-8 w-full max-w-[560px] px-5 pb-16 text-center sm:px-10">
          <button
            type="button"
            onClick={() => {
              abortRef.current?.abort();
              setJob({ kind: "idle" });
              resetFlow();
            }}
            className="link-cta inline-flex min-h-11 items-center text-ink-3"
          >
            Start over with another dog
          </button>
        </div>
      )}
    </div>
  );
}

function GiftOrder({
  gift,
  flow,
  giftToken,
  onLeave,
}: {
  gift: GiftState;
  flow: ReturnType<typeof useFlow>;
  giftToken: string;
  onLeave: () => void;
}) {
  const router = useRouter();
  if (gift.status === "loading") {
    return (
      <div
        className="mx-auto grid w-full max-w-[1440px] gap-10 pt-4 pb-20 sm:px-10 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20"
        aria-busy="true"
      >
        <p className="sr-only" role="status">
          Loading your gift portrait…
        </p>
        <div className="aspect-[4/5] w-full animate-pulse bg-paper-2 lg:aspect-[5/4]" />
        <div className="space-y-5 px-5 sm:px-0">
          <div className="h-3 w-1/2 bg-paper-2" />
          <div className="h-12 w-3/4 bg-paper-2" />
          <div className="h-40 w-full bg-paper-2" />
        </div>
      </div>
    );
  }

  if (gift.status === "error") {
    return (
      <div className="mx-auto w-full max-w-md px-5 py-20 text-center sm:py-32">
        <h1 className="font-display text-[40px] leading-[1.04] sm:text-[56px]">We couldn&apos;t open that gift portrait.</h1>
        <p className="mt-5 text-[14px] leading-relaxed text-ink-2">{gift.message}</p>
        <button type="button" onClick={onLeave} className={buttonClasses("primary", "lg", "mt-10")}>
          Commission your own
        </button>
      </div>
    );
  }

  const pet = gift.gen.petName?.trim();
  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-6 border-b border-line px-5 sm:px-10">
        <p className="label py-3 text-ink-2">Your gift portrait{pet ? ` of ${pet}` : ""}</p>
        <button type="button" onClick={onLeave} className="link-cta inline-flex min-h-11 items-center text-ink-3">
          Another dog
        </button>
      </div>
      <ProductStep
        flow={flow}
        active={gift.gen}
        giftToken={giftToken}
        backLabel="to your gift"
        onBack={() => router.push(`/reveal/${giftToken}`)}
      />
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
  const box = "mx-auto mt-10 w-[calc(100%-2.5rem)] max-w-xl border-y border-line py-10 text-center sm:mt-14 sm:w-[calc(100%-5rem)]";
  const title = "font-display text-[30px] leading-[1.08] sm:text-[38px]";
  const body = "mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink-2";
  const link = "link-cta inline-flex min-h-11 items-center";

  if (job.code === "ai_unavailable") {
    return (
      <div role="alert" className={box}>
        <p className={title}>The studio is busy right now.</p>
        <p className={body}>
          Leave your email and we&apos;ll send you {petName.trim() ? `${petName.trim()}'s` : "your"} portrait
          {style ? ` as ${style.name}` : ""} the moment it&apos;s ready. Your photograph is saved.
        </p>
        <EmailCapture
          className="mx-auto mt-7 max-w-md text-left"
          source="ai_unavailable"
          generationId={job.generationId}
          petName={petName.trim() || undefined}
          cta="Notify me"
          doneMessage="Thank you. We'll email your preview as soon as it's ready."
        />
      </div>
    );
  }

  if (job.code === "rate_limited") {
    return (
      <div role="alert" className={box}>
        <p className={title}>That&apos;s a full day of portraits.</p>
        <p className={body}>{job.message}</p>
        {hasPreviews && (
          <button type="button" onClick={onViewPreviews} className={buttonClasses("primary", "lg", "mt-7")}>
            View your portraits
          </button>
        )}
      </div>
    );
  }

  return (
    <div role="alert" className={box}>
      <p className={title}>{job.code === "network" ? "The connection was lost." : "That one didn't come out right."}</p>
      <p className={body}>{job.message}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <button type="button" onClick={onRetry} className={buttonClasses("primary", "lg")}>
          {style ? `Try ${style.name} again` : "Try again"}
        </button>
        <button type="button" onClick={onDismiss} className={link}>
          Another style
        </button>
      </div>
    </div>
  );
}
