"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { REFERRAL, REFERRAL_TERMS } from "@/lib/offer";

const OWN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const textLink = "link-cta inline-flex min-h-11 items-center";

/**
 * "Give $15, get $15" on the order page: the buyer's personal code, their link, native share and
 * copy. The share text always says the sharer gets $15 too (FTC material connection). Also marks
 * this browser as the code's owner, so clicking their own link never discounts their next order.
 */
export function ReferralCard({ code, shareUrl, shareText }: { code: string; shareUrl: string; shareText: string }) {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  useEffect(() => {
    try {
      document.cookie = `pp_own_ref=${encodeURIComponent(code)}; path=/; max-age=${OWN_COOKIE_MAX_AGE}; samesite=lax`;
    } catch {
      // cookies blocked: the server still refuses self-referral rewards by email
    }
  }, [code]);

  async function copy(what: "link" | "code") {
    const value = what === "link" ? shareUrl : code;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      window.prompt(what === "link" ? "Copy this link" : "Copy this code", value);
    }
    track("ReferralShare", { method: `copy_${what}` });
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pup Prints",
          text: shareText,
          url: shareUrl,
        });
        track("ReferralShare", { method: "native" });
        return;
      } catch {
        // dismissed: fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied("link");
      window.setTimeout(() => setCopied(null), 2200);
      track("ReferralShare", { method: "copy_text" });
    } catch {
      window.prompt("Copy this message", `${shareText} ${shareUrl}`);
    }
  }

  return (
    <section aria-labelledby="referral-title" className="grid gap-5 py-12 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-12 sm:py-14">
      <h2 id="referral-title" className="font-display text-[30px] leading-[1.08] sm:text-[34px]">
        {REFERRAL.headline}
      </h2>
      <div className="min-w-0">
        <p className="max-w-md text-[14px] leading-relaxed text-ink-2">
          Know someone with a dog worth framing? Your code takes ${REFERRAL.friendCents / 100} off their first portrait. When
          their order is past its {REFERRAL.holdDays}-day guarantee window, we send you ${REFERRAL.rewardCents / 100}.
        </p>

        <div className="max-w-lg">
          <p className="label mt-8 text-ink-3">Your code</p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
            <p className="font-display text-[34px] leading-none tracking-[0.02em] sm:text-[40px]">{code}</p>
            <button type="button" onClick={() => copy("code")} className={textLink} aria-live="polite">
              {copied === "code" ? "Copied" : "Copy code"}
            </button>
          </div>

          <div className="mt-6 flex items-end gap-6">
            <label htmlFor="referral-link" className="sr-only">
              Your referral link
            </label>
            <input
              id="referral-link"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="h-11 min-w-0 flex-1 truncate rounded-none border-0 border-b border-line bg-transparent px-0 text-[13px] text-ink-2 outline-none focus:border-ink focus-visible:outline-none"
            />
            <button type="button" onClick={() => copy("link")} className={`${textLink} shrink-0`} aria-live="polite">
              {copied === "link" ? "Copied" : "Copy link"}
            </button>
          </div>
          <div className="mt-4">
            <button type="button" onClick={share} className={textLink}>
              Share with a friend
            </button>
          </div>
        </div>

        <p className="mt-6 max-w-md text-[12px] leading-relaxed text-ink-3">
          {REFERRAL_TERMS}{" "}
          <Link
            href="/terms#referrals"
            className="underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
          >
            Terms
          </Link>
        </p>
      </div>
    </section>
  );
}
