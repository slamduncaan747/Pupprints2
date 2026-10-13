"use client";

import { useState } from "react";
import { Camera, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/** "Invite a friend" share + Instagram follow nudge (no incentives promised). */
export function InviteCard({ siteUrl, instagramUrl }: { siteUrl: string; instagramUrl: string }) {
  const [copied, setCopied] = useState(false);
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
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded-card bg-paper-2 p-6" aria-labelledby="invite-title">
        <h2 id="invite-title" className="font-display text-xl">
          Know another dog who deserves a portrait?
        </h2>
        <p className="mt-2 text-[15px] text-ink-2">Their preview is free, so it&apos;s an easy thing to share.</p>
        <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={invite}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Link copied" : "Invite a friend"}
        </Button>
      </section>
      <section className="rounded-card bg-blush/60 p-6" aria-labelledby="ig-title">
        <h2 id="ig-title" className="font-display text-xl">
          Show us on the wall
        </h2>
        <p className="mt-2 text-[15px] text-ink-2">
          Follow along and tag <span className="font-medium text-ink">@pupprints</span> when it arrives. We love seeing the real dog next to the art.
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper hover:bg-ink/90"
        >
          <Camera className="h-4 w-4" aria-hidden="true" /> Follow @pupprints
        </a>
      </section>
    </div>
  );
}
