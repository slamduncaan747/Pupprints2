import { PRODUCT_MAP } from "@/lib/catalog";
import { REFERRAL, REFERRAL_TERMS } from "@/lib/offer";
import { formatPrice } from "@/lib/utils";
import {
  button,
  callout,
  divider,
  esc,
  eyebrow,
  framedImage,
  heading,
  link,
  para,
  rows,
  shell,
  steps,
  subheading,
  textFooter,
} from "./layout";

/**
 * Email templates. Pure functions: callers pass everything in (no DB/env access here), so
 * they are easy to preview and test. Every template returns HTML + a plain-text version.
 */

export type EmailCtx = {
  siteUrl: string;
  supportEmail: string;
  /** Required for marketing emails (CAN-SPAM); shown in the footer when set. */
  postalAddress?: string;
};
export type RenderedEmail = { subject: string; preheader: string; html: string; text: string };

const lines = (...parts: (string | false | null | undefined)[]) => parts.filter((p) => p !== false && p != null).join("\n");

function firstName(name: string | null | undefined) {
  const n = (name ?? "").trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : "";
}

/* ------------------------------------------------------------------ */
/* (a) Order confirmation                                              */
/* ------------------------------------------------------------------ */

export type ConfirmationInput = {
  ctx: EmailCtx;
  orderNumber: string;
  customerName: string | null;
  petName: string | null;
  portraitUrl: string | null;
  items: { label: string; detail?: string; quantity: number; amount: string }[];
  totals: { label: string; value: string; strong?: boolean; muted?: boolean }[];
  hasPhysical: boolean;
  /** e.g. "Oct 21 – Oct 27" */
  arrival: string | null;
  revealUrl: string;
  downloads: { label: string; url: string }[];
  trackUrl: string;
  giftRecipient?: { name: string | null; emailedNow: boolean } | null;
  /** The buyer's own "Give $15, get $15" code, once it exists. */
  referral?: { code: string; shareUrl: string } | null;
};

const dollars = (cents: number) => `$${cents / 100}`;

/** The referral share line, always with the disclosure that the sharer gets $15 too. */
function shareLine(code: string, pet: string | null | undefined) {
  return `I had a portrait made of ${pet?.trim() || "my dog"} at Pup Prints. Take ${dollars(REFERRAL.friendCents)} off your first order with my code ${code} ${REFERRAL.disclosure}`;
}

/** Centered code box (the code in the display serif). */
function codeBox(code: string, label: string, detail: string) {
  return callout(
    `<div style="text-align:center;"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7a7368;">${esc(label)}</div><div style="font-family:Georgia,serif;font-size:28px;color:#1b1814;margin:6px 0;">${esc(code)}</div><div style="font-size:13px;color:#7a7368;">${esc(detail)}</div></div>`,
  );
}

export function orderConfirmationEmail(i: ConfirmationInput): RenderedEmail {
  const hi = firstName(i.customerName);
  const pet = i.petName?.trim() || "your dog";
  const subject = i.hasPhysical
    ? `Your Pup Prints order ${i.orderNumber} is confirmed`
    : `Your portrait of ${pet} is ready to download`;
  const preheader = i.hasPhysical
    ? `Thank you. We'll print and ship ${pet}'s portrait${i.arrival ? ` (arrives ${i.arrival})` : ""}.`
    : `Your hi-res digital portrait is ready. Download it any time.`;

  const giftLine = i.giftRecipient
    ? i.giftRecipient.emailedNow
      ? `We've emailed it to ${esc(i.giftRecipient.name || "your recipient")}.`
      : `When you're ready, send this link to ${esc(i.giftRecipient.name || "them")} — or forward it with a note.`
    : "Share it by text or email if it's a gift.";

  const body = [
    eyebrow(`Order ${i.orderNumber}`),
    heading(hi ? `Thank you, ${hi}.` : "Thank you for your order."),
    para(
      i.hasPhysical
        ? `Your portrait is being prepared for printing, then it ships with tracking${i.arrival ? ` — expected to arrive <strong style="color:#1b1814;">${esc(i.arrival)}</strong>` : ""}.`
        : `Your full-resolution, watermark-free portrait of ${esc(pet)} is ready below.`,
    ),
    i.portraitUrl ? framedImage(i.portraitUrl, `Portrait of ${pet}`, 280) : "",
    subheading("A link to share"),
    para(`A private page showing the finished portrait, without prices. ${giftLine}`),
    button(i.revealUrl, "Open the link"),
    i.downloads.length ? subheading(i.hasPhysical ? "Your hi-res file" : "Download your portrait") : "",
    i.downloads.length
      ? para(
          i.downloads.length === 1
            ? `${i.hasPhysical ? "Included with your print. " : ""}${link(i.downloads[0].url, "Download the full-resolution file")} — yours to print, share and post.`
            : `${i.hasPhysical ? "Included with your order. " : ""}${i.downloads.map((d) => link(d.url, d.label)).join(" · ")}`,
        )
      : "",
    divider(),
    subheading("Order summary"),
    rows(
      i.items.map((it) => ({
        label: `${esc(it.label)}${it.quantity > 1 ? ` &times; ${it.quantity}` : ""}${it.detail ? `<br /><span style="font-size:13px;color:#7a7368;">${esc(it.detail)}</span>` : ""}`,
        value: esc(it.amount),
      })),
    ),
    divider(),
    rows(i.totals.map((t) => ({ ...t, label: esc(t.label), value: esc(t.value) }))),
    i.hasPhysical ? subheading("What happens next") : "",
    i.hasPhysical
      ? steps([
          { title: "We prepare your order", detail: "Within one business day." },
          { title: "Printed and finished", detail: "Archival inks, finished and packed." },
          {
            title: "Shipped with tracking",
            detail: i.arrival ? `Expected to arrive ${i.arrival}. We'll email your tracking link.` : "We'll email your tracking link.",
          },
        ])
      : "",
    i.hasPhysical ? button(i.trackUrl, "Track your order", { variant: "outline" }) : "",
    para("Returns: if it isn't right, tell us within 30 days of delivery and we'll remake it or refund you in full. Just reply to this email.", {
      muted: true,
      size: 14,
    }),
    i.referral ? divider() : "",
    i.referral ? subheading(REFERRAL.headline) : "",
    i.referral
      ? para(
          `Your code <strong style="color:#1b1814;">${esc(i.referral.code)}</strong> takes ${dollars(REFERRAL.friendCents)} off their first order of ${dollars(REFERRAL.minimumCents)} or more, and you get ${dollars(REFERRAL.rewardCents)} too once their order is past its ${REFERRAL.holdDays}-day returns window. ${link(i.referral.shareUrl, "Your link")}`,
          { size: 14 },
        )
      : "",
  ].join("\n");

  const text = lines(
    `Order ${i.orderNumber}`,
    hi ? `Thank you, ${hi}.` : "Thank you for your order.",
    "",
    i.hasPhysical
      ? `Your portrait is being prepared for printing, then it ships with tracking.${i.arrival ? ` Expected arrival: ${i.arrival}.` : ""}`
      : `Your full-resolution, watermark-free portrait of ${pet} is ready.`,
    "",
    "A LINK TO SHARE",
    i.revealUrl,
    i.giftRecipient?.emailedNow ? `We've emailed it to ${i.giftRecipient.name || "your recipient"}.` : "Share it by text or email if it's a gift.",
    "",
    i.downloads.length ? (i.hasPhysical ? "YOUR HI-RES FILE" : "DOWNLOAD YOUR PORTRAIT") : null,
    ...i.downloads.map((d) => `${d.label}: ${d.url}`),
    "",
    "ORDER SUMMARY",
    ...i.items.map((it) => `${it.label}${it.quantity > 1 ? ` x ${it.quantity}` : ""} — ${it.amount}`),
    ...i.totals.map((t) => `${t.label}: ${t.value}`),
    "",
    i.hasPhysical ? "WHAT HAPPENS NEXT" : null,
    i.hasPhysical ? "1. We prepare your order (within one business day)" : null,
    i.hasPhysical ? "2. Printed and finished" : null,
    i.hasPhysical ? `3. Shipped with tracking${i.arrival ? ` — expected ${i.arrival}` : ""}` : null,
    i.hasPhysical ? `Track your order: ${i.trackUrl}` : null,
    "",
    "Returns: if it isn't right, tell us within 30 days of delivery and we'll remake it or refund you in full. Just reply to this email.",
    "",
    i.referral ? REFERRAL.headline.toUpperCase() : null,
    i.referral
      ? `Your code ${i.referral.code} takes ${dollars(REFERRAL.friendCents)} off a friend's first order of ${dollars(REFERRAL.minimumCents)}+, and you get ${dollars(REFERRAL.rewardCents)} too once their order is past its ${REFERRAL.holdDays}-day returns window.`
      : null,
    i.referral ? `Your link: ${i.referral.shareUrl}` : null,
    i.referral ? "" : null,
    textFooter(i.ctx),
  );

  return { subject, preheader, html: shell({ ...i.ctx, preheader, body }), text };
}

/* ------------------------------------------------------------------ */
/* (a2) "Give $15, get $15": reminder, ~7 days after delivery           */
/* ------------------------------------------------------------------ */

export type ReferralReminderInput = {
  ctx: EmailCtx;
  customerName: string | null;
  petName: string | null;
  code: string;
  shareUrl: string;
  portraitUrl: string | null;
  unsubscribeUrl: string;
};

export function referralReminderEmail(i: ReferralReminderInput): RenderedEmail {
  const hi = firstName(i.customerName);
  const pet = i.petName?.trim() || null;
  const subject = pet ? `${pet}'s portrait, and $15 for a friend` : "Give $15, get $15";
  const preheader = `Your code ${i.code} takes ${dollars(REFERRAL.friendCents)} off a friend's first portrait. You get ${dollars(REFERRAL.rewardCents)} too.`;
  const footerNote = "You're receiving this because you ordered from Pup Prints.";
  const share = shareLine(i.code, pet);
  const body = [
    heading(REFERRAL.headline),
    para(
      `${hi ? `${esc(hi)}, we` : "We"} hope ${pet ? `${esc(pet)}'s portrait` : "your portrait"} has found its wall. If a friend has a dog worth framing, your code takes ${dollars(REFERRAL.friendCents)} off their first order of ${dollars(REFERRAL.minimumCents)} or more, and we send you ${dollars(REFERRAL.rewardCents)} once their order is past its ${REFERRAL.holdDays}-day returns window.`,
    ),
    i.portraitUrl ? framedImage(i.portraitUrl, pet ? `Portrait of ${pet}` : "Your portrait", 220) : "",
    codeBox(i.code, "Your code", `${dollars(REFERRAL.friendCents)} off a friend's first order of ${dollars(REFERRAL.minimumCents)}+`),
    button(i.shareUrl, "Share your link"),
    para(`Or copy this: &ldquo;${esc(share)} ${esc(i.shareUrl)}&rdquo;`, { muted: true, size: 14 }),
    para(esc(REFERRAL_TERMS), { muted: true, size: 13 }),
  ].join("\n");
  const text = lines(
    REFERRAL.headline,
    "",
    `Your code ${i.code} takes ${dollars(REFERRAL.friendCents)} off a friend's first order of ${dollars(REFERRAL.minimumCents)}+. We send you ${dollars(REFERRAL.rewardCents)} once their order is past its ${REFERRAL.holdDays}-day returns window.`,
    `Your link: ${i.shareUrl}`,
    "",
    `Or copy this: "${share} ${i.shareUrl}"`,
    "",
    REFERRAL_TERMS,
    "",
    textFooter({ ...i.ctx, unsubscribeUrl: i.unsubscribeUrl, footerNote }),
  );
  return {
    subject,
    preheader,
    html: shell({ ...i.ctx, preheader, body, unsubscribeUrl: i.unsubscribeUrl, footerNote }),
    text,
  };
}

/* ------------------------------------------------------------------ */
/* (a3) Referral reward: the referrer's single-use $15 code            */
/* ------------------------------------------------------------------ */

export type ReferralRewardInput = {
  ctx: EmailCtx;
  customerName: string | null;
  /** The single-use reward code. */
  code: string;
  expiresAt: Date;
  createUrl: string;
  /** Their own referral link and code (still working). */
  shareUrl: string;
  referralCode: string;
};

export function referralRewardEmail(i: ReferralRewardInput): RenderedEmail {
  const hi = firstName(i.customerName);
  const until = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(i.expiresAt);
  const subject = `Thank you. Here's ${dollars(REFERRAL.rewardCents)}.`;
  const preheader = `A friend ordered with your code. Your ${dollars(REFERRAL.rewardCents)} code: ${i.code}`;
  const body = [
    heading(hi ? `Thank you, ${hi}.` : "Thank you."),
    para(
      `A friend ordered a portrait with your code, and their order is now past its ${REFERRAL.holdDays}-day returns window. Here is your ${dollars(REFERRAL.rewardCents)}.`,
    ),
    codeBox(i.code, `Your ${dollars(REFERRAL.rewardCents)} code`, `Single use, on any order. Valid until ${until}.`),
    button(i.createUrl, "Make another portrait"),
    para(
      `Your own code ${esc(i.referralCode)} keeps working: ${link(i.shareUrl, i.shareUrl.replace(/^https?:\/\//, ""))}. ${esc(REFERRAL_TERMS)}`,
      { muted: true, size: 13 },
    ),
  ].join("\n");
  const text = lines(
    hi ? `Thank you, ${hi}.` : "Thank you.",
    "",
    `A friend ordered with your code, and their order is past its ${REFERRAL.holdDays}-day returns window.`,
    `Your ${dollars(REFERRAL.rewardCents)} code: ${i.code} (single use, on any order, valid until ${until})`,
    `Make another portrait: ${i.createUrl}`,
    "",
    `Your own code ${i.referralCode} keeps working: ${i.shareUrl}`,
    REFERRAL_TERMS,
    "",
    textFooter(i.ctx),
  );
  return { subject, preheader, html: shell({ ...i.ctx, preheader, body }), text };
}

/* ------------------------------------------------------------------ */
/* (a4) Free Phone Portrait (lead magnet)                              */
/* ------------------------------------------------------------------ */

export type PhoneWallpaperInput = {
  ctx: EmailCtx;
  petName: string | null;
  styleName: string | null;
  downloadUrl: string;
  createUrl: string;
  unsubscribeUrl: string;
};

export function phoneWallpaperEmail(i: PhoneWallpaperInput): RenderedEmail {
  const pet = i.petName?.trim() || null;
  const subject = pet ? `${pet}, for your lock screen` : "Your phone portrait";
  const preheader = "1080 × 1920, no watermark. Tap to download.";
  const footerNote = "You asked for this phone portrait. We may send a note or two about your portrait; unsubscribe any time.";
  const body = [
    heading(pet ? `${pet}, for your lock screen.` : "Your portrait, for your lock screen."),
    para(`Your phone portrait${i.styleName ? ` (${esc(i.styleName)})` : ""}: 1080 × 1920, no watermark.`),
    button(i.downloadUrl, "Download the wallpaper"),
    para(
      "On iPhone: open it, tap Share, then Use as Wallpaper. On Android: open it, then Set as wallpaper.",
      { muted: true, size: 14 },
    ),
    divider(),
    subheading("Hang it"),
    para(
      "The same portrait as a gallery canvas or framed print. Free US shipping, and the print-quality file is included.",
    ),
    button(i.createUrl, "Choose your piece", { variant: "outline" }),
  ].join("\n");
  const text = lines(
    subject,
    "",
    "Your phone portrait: 1080 x 1920, no watermark.",
    `Download: ${i.downloadUrl}`,
    "On iPhone: open it, tap Share, then Use as Wallpaper. On Android: open it, then Set as wallpaper.",
    "",
    "HANG IT",
    "The same portrait as a gallery canvas or framed print. Free US shipping.",
    `Choose your piece: ${i.createUrl}`,
    "",
    textFooter({ ...i.ctx, unsubscribeUrl: i.unsubscribeUrl, footerNote }),
  );
  return {
    subject,
    preheader,
    html: shell({ ...i.ctx, preheader, body, unsubscribeUrl: i.unsubscribeUrl, footerNote }),
    text,
  };
}

/* ------------------------------------------------------------------ */
/* (b) Gift email (to the recipient — no prices)                       */
/* ------------------------------------------------------------------ */

export type GiftRevealInput = {
  ctx: EmailCtx;
  senderName: string | null;
  recipientName: string | null;
  petName: string | null;
  revealUrl: string;
  physicalComing: boolean;
};

export function giftRevealEmail(i: GiftRevealInput): RenderedEmail {
  const sender = i.senderName?.trim() || "Someone who loves you";
  const hi = firstName(i.recipientName);
  const subject = `${sender} made you something`;
  const preheader = i.petName ? `A portrait of ${i.petName}, made just for you. Tap to open.` : "A one-of-a-kind portrait, made just for you. Tap to open.";
  const body = [
    `<div style="text-align:center;">`,
    eyebrow("A gift for you"),
    heading(hi ? `${hi}, ${sender} made you something.` : `${sender} made you something.`, 30),
    para(
      i.petName
        ? `It's a one-of-a-kind portrait of ${esc(i.petName)}, and it's waiting for you behind this envelope.`
        : "It's a one-of-a-kind portrait, and it's waiting for you behind this envelope.",
      { center: true },
    ),
    `<div style="font-size:64px;line-height:1;margin:18px 0 8px;" aria-hidden="true">&#9993;</div>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>${button(i.revealUrl, "Open your gift")}</td></tr></table>`,
    i.physicalComing ? para("Something you can hold is on its way, too.", { muted: true, size: 14, center: true }) : "",
    `</div>`,
  ].join("\n");
  const text = lines(
    hi ? `${hi}, ${sender} made you something.` : `${sender} made you something.`,
    "",
    i.petName ? `It's a one-of-a-kind portrait of ${i.petName}.` : "It's a one-of-a-kind portrait.",
    `Open your gift: ${i.revealUrl}`,
    i.physicalComing ? "Something you can hold is on its way, too." : null,
    "",
    textFooter({ ...i.ctx, footerNote: `${sender} sent you this through Pup Prints.` }),
  );
  return {
    subject,
    preheader,
    html: shell({ ...i.ctx, preheader, body, footerNote: `${sender} sent you this gift through Pup Prints.` }),
    text,
  };
}

/* ------------------------------------------------------------------ */
/* (c) Shipped                                                         */
/* ------------------------------------------------------------------ */

export type ShippedInput = {
  ctx: EmailCtx;
  orderNumber: string;
  customerName: string | null;
  petName: string | null;
  trackingUrl: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  arrival: string | null;
  trackUrl: string;
  portraitUrl: string | null;
  /** Our Instagram handle (e.g. "@pupprints.shop"), only when NEXT_PUBLIC_INSTAGRAM_URL is set. */
  socialHandle?: string | null;
};

export function shippedEmail(i: ShippedInput): RenderedEmail {
  const pet = i.petName?.trim() || "your portrait";
  const subject = `${i.petName ? `${i.petName}'s portrait` : "Your portrait"} is on its way`;
  const preheader = `Order ${i.orderNumber} has shipped${i.carrier ? ` with ${i.carrier}` : ""}.${i.arrival ? ` Expected ${i.arrival}.` : ""}`;
  const hi = firstName(i.customerName);
  const body = [
    eyebrow(`Order ${i.orderNumber}`),
    heading(hi ? `Good news, ${hi}: it shipped.` : "Good news: it shipped."),
    para(
      `${i.petName ? `${esc(i.petName)}'s portrait` : "Your portrait"} was printed and finished, and is now on its way${i.carrier ? ` with ${esc(i.carrier)}` : ""}.${i.arrival ? ` It should arrive <strong style="color:#1b1814;">${esc(i.arrival)}</strong>.` : ""}`,
    ),
    i.portraitUrl ? framedImage(i.portraitUrl, `Portrait of ${pet}`, 240) : "",
    i.trackingUrl ? button(i.trackingUrl, "Track your package") : button(i.trackUrl, "See order status"),
    i.trackingNumber ? para(`Tracking number: <strong style="color:#1b1814;">${esc(i.trackingNumber)}</strong>`, { muted: true, size: 14 }) : "",
    callout(
      i.socialHandle
        ? `When it arrives, we'd love to see it on the wall. Tag <strong style="color:#1b1814;">${esc(i.socialHandle)}</strong> — and if anything isn't perfect, reply to this email and we'll make it right.`
        : "When it arrives, we'd love to see it on the wall (reply with a photo!) — and if anything isn't perfect, reply to this email and we'll make it right.",
    ),
  ].join("\n");
  const text = lines(
    `Order ${i.orderNumber} has shipped${i.carrier ? ` with ${i.carrier}` : ""}.`,
    i.arrival ? `Expected arrival: ${i.arrival}` : null,
    i.trackingUrl ? `Track your package: ${i.trackingUrl}` : `Order status: ${i.trackUrl}`,
    i.trackingNumber ? `Tracking number: ${i.trackingNumber}` : null,
    "",
    "If anything isn't perfect, reply to this email and we'll make it right.",
    "",
    textFooter(i.ctx),
  );
  return { subject, preheader, html: shell({ ...i.ctx, preheader, body }), text };
}

/* ------------------------------------------------------------------ */
/* (d) Review request (7 days after shipping)                          */
/* ------------------------------------------------------------------ */

export type ReviewInput = {
  ctx: EmailCtx;
  customerName: string | null;
  petName: string | null;
  reviewUrl: string;
  portraitUrl: string | null;
  unsubscribeUrl: string;
};

export function reviewRequestEmail(i: ReviewInput): RenderedEmail {
  const hi = firstName(i.customerName);
  const pet = i.petName?.trim();
  const subject = pet ? `How does ${pet} look on the wall?` : "How does it look on the wall?";
  const preheader = "An honest review (and a photo, if you're up for it) helps a small studio more than you'd think.";
  const body = [
    heading(hi ? `${hi}, how did we do?` : "How did we do?"),
    para(
      `${pet ? `${esc(pet)}'s portrait` : "Your portrait"} should have arrived by now. We're a new, small studio, and an honest review — good or not — helps other dog people decide and helps us get better.`,
    ),
    i.portraitUrl ? framedImage(i.portraitUrl, pet ? `Portrait of ${pet}` : "Your portrait", 220) : "",
    button(i.reviewUrl, "Leave an honest review"),
    para(
      "If you have a second, a photo of it on the wall (with the real dog nearby, ideally) would make our week. Just reply with it attached.",
    ),
    para("Something not right? Reply and we'll remake it or refund you.", { muted: true, size: 14 }),
  ].join("\n");
  const text = lines(
    hi ? `${hi}, how did we do?` : "How did we do?",
    "",
    "We're a new, small studio, and an honest review — good or not — helps other dog people decide.",
    `Leave a review: ${i.reviewUrl}`,
    "",
    "A photo of it on the wall would make our week. Just reply with it attached.",
    "Something not right? Reply and we'll remake it or refund you.",
    "",
    textFooter({ ...i.ctx, unsubscribeUrl: i.unsubscribeUrl }),
  );
  return { subject, preheader, html: shell({ ...i.ctx, preheader, body, unsubscribeUrl: i.unsubscribeUrl }), text };
}

/* ------------------------------------------------------------------ */
/* (e) Preview nurture series                                          */
/* ------------------------------------------------------------------ */

export type NurtureInput = {
  ctx: EmailCtx;
  step: 1 | 2 | 3;
  /** Where the lead came from: save_preview | ai_unavailable | checkout_unavailable */
  source: string;
  petName: string | null;
  previewUrl: string | null;
  createUrl: string;
  unsubscribeUrl: string;
  /**
   * "This portrait is in memory of my dog": step 3 is a gentle note (take your time; remakes are
   * free until it's them), never an offer, a deadline or a downsell. Everyone else's step 3 is the
   * feature downsell at catalog prices (no discount codes).
   */
  memorial?: boolean;
};

/** The two smaller ways to keep the same portrait, from the catalog (never hardcoded). */
export function downsellPrices() {
  return {
    printFrom: Math.min(...PRODUCT_MAP.poster.variants.map((v) => v.price)),
    file: PRODUCT_MAP.digital.variants[0].price,
  };
}

export function nurtureEmail(i: NurtureInput): RenderedEmail {
  const pet = i.petName?.trim() || null;
  const theirPortrait = pet ? `${pet}'s portrait` : "your portrait";
  const footerNote = "You're receiving this because you saved a preview or asked us to email you.";
  let subject: string;
  let preheader: string;
  let body: string[];
  let text: string[];

  if (i.step === 1) {
    if (i.source === "phone_wallpaper") {
      subject = pet ? `${pet}, from lock screen to wall` : "From lock screen to wall";
      preheader = "The same portrait on canvas or framed.";
      body = [
        heading(subject),
        para(
          `You have ${esc(theirPortrait)} on your phone. The same portrait, as a gallery canvas or a framed print, is a few taps away.`,
        ),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 260) : "",
        button(i.createUrl, "Hang it"),
        para("You can try another style any time.", { muted: true, size: 14 }),
      ];
      text = [subject, "", `You have ${theirPortrait} on your phone. The same portrait, on canvas or framed, is a few taps away.`, `Hang it: ${i.createUrl}`];
    } else if (i.source === "ai_unavailable") {
      subject = pet ? `Our studio is ready for ${pet}` : "Our studio is ready for your dog";
      preheader = "Sorry we were busy earlier. Your portrait takes about a minute now.";
      body = [
        heading(subject),
        para("Sorry we couldn't finish your preview earlier — our studio was busier than expected. It's ready now."),
        button(i.createUrl, "Upload a photo"),
      ];
      text = [subject, "", "Sorry we couldn't finish your preview earlier. It's ready now.", `Upload a photo: ${i.createUrl}`];
    } else {
      subject = pet ? `Your portrait of ${pet} is waiting` : "Your portrait is waiting";
      preheader = "We saved it for you. Pick a size whenever you're ready — no rush.";
      body = [
        heading(subject),
        para(
          i.source === "checkout_unavailable"
            ? `Sorry our checkout wasn't available when you tried. It's open again, and ${esc(theirPortrait)} is saved right where you left it.`
            : `We saved ${esc(theirPortrait)} for you. Pick a size and finish whenever you're ready.`,
        ),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 260) : "",
        button(i.createUrl, "See my portrait"),
        para("Not quite right? Try another style.", { muted: true, size: 14 }),
      ];
      text = [subject, "", `We saved ${theirPortrait} for you.`, `See it: ${i.createUrl}`, "Not quite right? Try another style."];
    }
  } else if (i.step === 2) {
    subject = "What's included with every Pup Prints portrait";
    preheader = "Free US shipping and the hi-res file, included.";
    body = [
      heading(pet ? `Everything that comes with ${pet}'s portrait` : "Everything that comes with your portrait"),
      i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
      steps([
        { title: "Free US shipping", detail: "On every order, built into the price." },
        { title: "Your hi-res digital file", detail: "Included with every print, canvas or framed piece." },
        { title: "Returns", detail: "Within 30 days of delivery, we remake it or refund you in full." },
      ]),
      button(i.createUrl, "Choose a size"),
    ];
    text = [
      subject,
      "",
      "- Free US shipping on every order, built into the price",
      "- Your hi-res digital file, included with every print",
      "- Returns: within 30 days of delivery, we remake it or refund you in full",
      "",
      `Choose a size: ${i.createUrl}`,
    ];
  } else {
    const { printFrom, file } = downsellPrices();
    if (i.memorial) {
      subject = "Take your time";
      preheader = pet ? `${pet}'s portrait is saved for whenever you're ready.` : "Your portrait is saved for whenever you're ready.";
      body = [
        heading("Take your time."),
        para(
          `${pet ? `${esc(pet)}'s portrait is` : "Your portrait is"} saved, and it will be here whenever you're ready. There's no deadline and nothing to decide today.`,
        ),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
        para(
          `If it isn't quite ${pet ? esc(pet) : "them"} yet, try another style or another photo, as often as you like. Remakes are free until it's them. And if you'd like a hand choosing, reply to this email and we'll help.`,
        ),
        button(i.createUrl, pet ? `See ${pet}'s portrait` : "See your portrait", { variant: "outline" }),
        para("This is the last email we'll send about this preview.", { muted: true, size: 14 }),
      ];
      text = [
        "Take your time.",
        "",
        `${pet ? `${pet}'s portrait is` : "Your portrait is"} saved, and it will be here whenever you're ready. There's no deadline.`,
        `If it isn't quite ${pet ?? "them"} yet, try another style or photo as often as you like. Remakes are free until it's them. Reply if you'd like a hand choosing.`,
        `See it: ${i.createUrl}`,
        "",
        "This is the last email we'll send about this preview.",
      ];
    } else {
      // The feature downsell: the same portrait, smaller scope. Real catalog prices, no code.
      subject = pet ? `${pet}'s portrait, from ${formatPrice(printFrom)}` : `Your portrait, from ${formatPrice(printFrom)}`;
      preheader = `The same portrait as a fine-art print from ${formatPrice(printFrom)}, or the hi-res file for ${formatPrice(file)}.`;
      body = [
        heading(pet ? `A smaller way to keep ${pet}` : "A smaller way to keep it"),
        para(
          `If a canvas or a frame is more than you had in mind, ${esc(theirPortrait)} also comes as a fine-art print from <strong style="color:#1b1814;">${formatPrice(printFrom)}</strong>, ready for a frame of your own, or as the hi-res file alone for <strong style="color:#1b1814;">${formatPrice(file)}</strong>, delivered the moment you order.`,
        ),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
        steps([
          { title: `Fine-art print, from ${formatPrice(printFrom)}`, detail: "Archival matte paper, pigment inks. Free US shipping, and the hi-res file is included." },
          { title: `The hi-res file, ${formatPrice(file)}`, detail: "Full resolution, no watermark. Print it, frame it, post it." },
        ]),
        button(i.createUrl, "Choose your piece"),
        para("This is the last email we'll send about this preview.", { muted: true, size: 14 }),
      ];
      text = [
        subject,
        "",
        `${theirPortrait.charAt(0).toUpperCase()}${theirPortrait.slice(1)} also comes as a fine-art print from ${formatPrice(printFrom)} (hi-res file included, free US shipping) or as the hi-res file alone for ${formatPrice(file)}.`,
        "",
        `Choose your piece: ${i.createUrl}`,
        "",
        "This is the last email we'll send about this preview.",
      ];
    }
  }

  return {
    subject,
    preheader,
    html: shell({ ...i.ctx, preheader, body: body.join("\n"), unsubscribeUrl: i.unsubscribeUrl, footerNote }),
    text: lines(...text, "", textFooter({ ...i.ctx, unsubscribeUrl: i.unsubscribeUrl, footerNote })),
  };
}

/* ------------------------------------------------------------------ */
/* (f) Newsletter welcome                                              */
/* ------------------------------------------------------------------ */

export type WelcomeInput = {
  ctx: EmailCtx;
  /** Lead source, e.g. footer | home | gift_cards. */
  source: string;
  /** Public first-order code (WELCOME10), or null when it can't be guaranteed to work. */
  welcome: { code: string; percentOff: number } | null;
  createUrl: string;
  unsubscribeUrl: string;
};

export function welcomeEmail(i: WelcomeInput): RenderedEmail {
  const giftCards = i.source === "gift_cards";
  const footerNote = giftCards
    ? "You're receiving this because you asked to hear when Pup Prints gift cards launch."
    : "You're receiving this because you joined the Pup Prints list.";
  const subject = giftCards
    ? "You're on the list for Pup Prints gift cards"
    : i.welcome
      ? `Welcome to Pup Prints: ${i.welcome.percentOff}% off your first portrait`
      : "Welcome to Pup Prints";
  const preheader = i.welcome
    ? `Your code ${i.welcome.code} takes ${i.welcome.percentOff}% off your first order.`
    : "Upload a photo of your dog to see the portrait.";

  const codeBox = (code: string, label: string, detail: string) =>
    callout(
      `<div style="text-align:center;"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7a7368;">${esc(label)}</div><div style="font-family:Georgia,serif;font-size:28px;color:#1b1814;margin:6px 0;">${esc(code)}</div><div style="font-size:13px;color:#7a7368;">${esc(detail)}</div></div>`,
      "clay",
    );

  const body = [
    heading(giftCards ? "You're on the list" : "Welcome to Pup Prints"),
    giftCards
      ? para(
          "Thanks for your interest in gift cards. They aren't on sale yet; we'll email you once, the moment they are. In the meantime, here's how the studio works.",
        )
      : para("Thanks for joining. We make a portrait of your dog from a photo, and you see it before you pay anything."),
    steps([
      { title: "Upload a photo", detail: "Any clear photo of your dog's face works." },
      { title: "See your portrait", detail: "In about a minute. Try as many styles as you like." },
      { title: "Order it as a print, canvas or framed piece", detail: "Your hi-res file is included." },
    ]),
    i.welcome
      ? codeBox(i.welcome.code, "Your welcome code", `${i.welcome.percentOff}% off your first order. Enter it at checkout.`)
      : "",
    button(i.createUrl, "Upload a photo"),
  ].join("\n");

  const text = lines(
    giftCards ? "You're on the list" : "Welcome to Pup Prints",
    "",
    giftCards
      ? "Gift cards aren't on sale yet; we'll email you once, the moment they are."
      : "Thanks for joining. You see your dog's portrait before you pay anything.",
    "",
    "1. Upload a photo of your dog",
    "2. See your portrait, in about a minute",
    "3. Order it as a print, canvas or framed piece (hi-res file included)",
    "",
    i.welcome ? `Your welcome code: ${i.welcome.code} (${i.welcome.percentOff}% off your first order)` : null,
    `Upload a photo: ${i.createUrl}`,
    "",
    textFooter({ ...i.ctx, unsubscribeUrl: i.unsubscribeUrl, footerNote }),
  );

  return {
    subject,
    preheader,
    html: shell({ ...i.ctx, preheader, body, unsubscribeUrl: i.unsubscribeUrl, footerNote }),
    text,
  };
}
