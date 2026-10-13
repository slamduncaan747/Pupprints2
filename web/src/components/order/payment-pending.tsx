"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { site } from "@/lib/config";

const MAX_TRIES = 8;

/** Shown while Stripe's confirmation hasn't reached us yet: refreshes the page a few times. */
export function PaymentPending() {
  const router = useRouter();
  const [tries, setTries] = useState(0);
  const done = tries >= MAX_TRIES;

  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => {
      setTries((n) => n + 1);
      router.refresh();
    }, 2500 + tries * 500);
    return () => window.clearTimeout(t);
  }, [tries, done, router]);

  return (
    <div className="mx-auto max-w-lg text-center" role="status" aria-live="polite">
      {!done ? (
        <>
          <p className="label text-ink-3">One moment</p>
          <h1 className="mt-5 font-display text-[44px] leading-[1.02] sm:text-[64px]">Confirming your payment.</h1>
          <p className="mx-auto mt-6 max-w-sm text-[14px] leading-relaxed text-ink-2">
            This usually takes a few seconds. Please keep this page open.
          </p>
          <div className="mx-auto mt-10 h-px w-40 overflow-hidden bg-line" aria-hidden="true">
            <div className="h-full w-1/3 animate-pulse bg-ink" />
          </div>
        </>
      ) : (
        <>
          <p className="label text-ink-3">Client services</p>
          <h1 className="mt-5 font-display text-[44px] leading-[1.02] sm:text-[64px]">Still confirming.</h1>
          <p className="mx-auto mt-6 max-w-sm text-[14px] leading-relaxed text-ink-2">
            Some payment methods take a little longer. Your confirmation email arrives as soon as it clears. Questions?
            Write to{" "}
            <a className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setTries(0);
              router.refresh();
            }}
            className={buttonClasses("secondary", "lg", "mt-10")}
          >
            Check again
          </button>
        </>
      )}
    </div>
  );
}
