"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <section className="grid gap-4 py-10 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-10" aria-labelledby="invite-title">
      <h2 id="invite-title" className="font-display text-[1.75rem] leading-tight">
        Know another dog?
      </h2>
      <div>
        <p className="text-[15px] leading-relaxed text-ink-2">
          Their preview is free, so it&apos;s an easy thing to share.
          {instagramUrl && handle ? (
            <>
              {" "}
              And tag <span className="text-ink">{handle}</span> when yours is on the wall.
            </>
          ) : null}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Button type="button" variant="secondary" onClick={invite} aria-live="polite">
            {copied ? "Link copied" : "Invite a friend"}
          </Button>
          {instagramUrl && handle ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-[14px] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              Follow {handle}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
