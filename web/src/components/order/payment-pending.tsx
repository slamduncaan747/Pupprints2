"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
    <div className="mx-auto max-w-md text-center" role="status" aria-live="polite">
      {!done ? (
        <>
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-ink-3" strokeWidth={1.5} aria-hidden="true" />
          <h1 className="mt-8 font-display text-[2.6rem] leading-[1.04] sm:text-5xl">Confirming your payment…</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">This usually takes a few seconds. Please keep this page open.</p>
        </>
      ) : (
        <>
          <h1 className="font-display text-[2.6rem] leading-[1.04] sm:text-5xl">Still confirming</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            Some payment methods take a little longer. You&apos;ll get a confirmation email as soon as it clears. Questions?
            Write to{" "}
            <a className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink" href={`mailto:${site.supportEmail}`}>
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
            className="mt-8 inline-flex h-11 items-center rounded-[3px] px-6 text-[15px] font-medium ring-1 ring-inset ring-ink/25 transition-colors hover:ring-ink"
          >
            Check again
          </button>
        </>
      )}
    </div>
  );
}
