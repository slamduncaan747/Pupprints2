"use client";

import { useState } from "react";
import { socialHandle } from "@/lib/config";

/** "Invite a friend" share + Instagram follow nudge (no incentives promised). */
export function InviteCard({ siteUrl, instagramUrl }: { siteUrl: string; instagramUrl?: string }) {
  const [copied, setCopied] = useState(false);
  const handle = socialHandle(instagramUrl);
  const url = `${siteUrl.replace(/\/$/, "")}/?utm_source=customer&utm_medium=share&utm_campaign=invite`;

  async function invite() {
    const text = "I just had a portrait of my dog made at Pup Prints. You can see yours free before paying:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pup Prints", text, url });
        return;
      } catch {
        // dismissed
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <section className="grid gap-5 py-12 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-12 sm:py-14" aria-labelledby="invite-title">
      <h2 id="invite-title" className="font-display text-[30px] leading-[1.08] sm:text-[34px]">
        Know another dog?
      </h2>
      <div>
        <p className="max-w-md text-[14px] leading-relaxed text-ink-2">
          Their preview is complimentary, so it&apos;s an easy thing to share.
          {instagramUrl && handle ? (
            <>
              {" "}
              And tag <span className="text-ink">{handle}</span> once yours is on the wall.
            </>
          ) : null}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-1">
          <button type="button" onClick={invite} aria-live="polite" className="link-cta inline-flex min-h-11 items-center">
            {copied ? "Link copied" : "Invite a friend"}
          </button>
          {instagramUrl && handle ? (
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="link-cta inline-flex min-h-11 items-center text-ink-3">
              Follow {handle}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
