import { PROMISES } from "@/lib/catalog";
import { FOUNDING } from "@/lib/launch";
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
};

export function orderConfirmationEmail(i: ConfirmationInput): RenderedEmail {
  const hi = firstName(i.customerName);
  const pet = i.petName?.trim() || "your dog";
  const subject = i.hasPhysical
    ? `Your Pup Prints order ${i.orderNumber} is confirmed`
    : `Your portrait of ${pet} is ready to download`;
  const preheader = i.hasPhysical
    ? `Thank you! We'll check ${pet}'s portrait by hand, then print and ship it${i.arrival ? ` (arrives ${i.arrival})` : ""}.`
    : `Your hi-res digital portrait is ready. Download it any time.`;

  const giftLine = i.giftRecipient
    ? i.giftRecipient.emailedNow
      ? `We've emailed the Gift Reveal to ${esc(i.giftRecipient.name || "your recipient")}.`
      : `When you're ready, send this link to ${esc(i.giftRecipient.name || "them")} — or forward it with a note.`
    : "Share it by text or email the moment you're ready. The print follows in days.";

  const body = [
    eyebrow(`Order ${i.orderNumber}`),
    heading(hi ? `Thank you, ${hi}.` : "Thank you for your order."),
    para(
      i.hasPhysical
        ? `We've got it from here. Every portrait is checked by a person on our team before it's printed, then it ships with tracking${i.arrival ? ` — expected to arrive <strong style="color:#1b1814;">${esc(i.arrival)}</strong>` : ""}.`
        : `Your full-resolution, watermark-free portrait of ${esc(pet)} is ready below.`,
    ),
    i.portraitUrl ? framedImage(i.portraitUrl, `Portrait of ${pet}`, 280) : "",
    subheading("Your Gift Reveal"),
    para(`A beautiful, shareable reveal of the finished portrait — no prices, just the art. ${giftLine}`),
    button(i.revealUrl, "Open the Gift Reveal"),
    i.downloads.length ? subheading(i.hasPhysical ? "Your free hi-res file" : "Download your portrait") : "",
    i.downloads.length
      ? para(
          i.downloads.length === 1
            ? `${i.hasPhysical ? "Included free with your print. " : ""}${link(i.downloads[0].url, "Download the full-resolution file")} — yours to print, share and post.`
            : `${i.hasPhysical ? "Included free with your order. " : ""}${i.downloads.map((d) => link(d.url, d.label)).join(" · ")}`,
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
          { title: "We check your portrait by hand", detail: "Within one business day. If anything looks off, we fix it before printing." },
          { title: "Printed and finished", detail: "Fade-resistant archival inks, finished and carefully packed." },
          {
            title: "Shipped with tracking",
            detail: i.arrival ? `Expected to arrive ${i.arrival}. We'll email your tracking link.` : "We'll email your tracking link.",
          },
        ])
      : "",
    i.hasPhysical ? button(i.trackUrl, "Track your order", { variant: "outline" }) : "",
    callout(
      `<strong style="color:#1b1814;">Our love-it guarantee.</strong> If it isn't right, we'll remake it or refund you in full. Just reply to this email.`,
      "sage",
    ),
  ].join("\n");

  const text = lines(
    `Order ${i.orderNumber}`,
    hi ? `Thank you, ${hi}.` : "Thank you for your order.",
    "",
    i.hasPhysical
      ? `Every portrait is checked by a person on our team before it's printed, then it ships with tracking.${i.arrival ? ` Expected arrival: ${i.arrival}.` : ""}`
      : `Your full-resolution, watermark-free portrait of ${pet} is ready.`,
    "",
    "YOUR GIFT REVEAL",
    i.revealUrl,
    i.giftRecipient?.emailedNow ? `We've emailed the Gift Reveal to ${i.giftRecipient.name || "your recipient"}.` : "Share it by text or email when you're ready.",
    "",
    i.downloads.length ? (i.hasPhysical ? "YOUR FREE HI-RES FILE" : "DOWNLOAD YOUR PORTRAIT") : null,
    ...i.downloads.map((d) => `${d.label}: ${d.url}`),
    "",
    "ORDER SUMMARY",
    ...i.items.map((it) => `${it.label}${it.quantity > 1 ? ` x ${it.quantity}` : ""} — ${it.amount}`),
    ...i.totals.map((t) => `${t.label}: ${t.value}`),
    "",
    i.hasPhysical ? "WHAT HAPPENS NEXT" : null,
    i.hasPhysical ? "1. We check your portrait by hand (within one business day)" : null,
    i.hasPhysical ? "2. Printed and finished" : null,
    i.hasPhysical ? `3. Shipped with tracking${i.arrival ? ` — expected ${i.arrival}` : ""}` : null,
    i.hasPhysical ? `Track your order: ${i.trackUrl}` : null,
    "",
    `Our love-it guarantee: ${PROMISES.guarantee}. Just reply to this email.`,
    "",
    textFooter(i.ctx),
  );

  return { subject, preheader, html: shell({ ...i.ctx, preheader, body }), text };
}

/* ------------------------------------------------------------------ */
/* (b) Gift Reveal (to the recipient — no prices)                      */
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
      `${i.petName ? `${esc(i.petName)}'s portrait` : "Your portrait"} passed our check, was printed and finished, and is now on its way${i.carrier ? ` with ${esc(i.carrier)}` : ""}.${i.arrival ? ` It should arrive <strong style="color:#1b1814;">${esc(i.arrival)}</strong>.` : ""}`,
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
    callout("Something not right? Don't leave it — reply and we'll remake it or refund you. That's our guarantee.", "sage"),
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
   * Step 3 only, and only when a real code with a real expiry exists: the public Founding 100
   * code while it can still be redeemed, otherwise a personal single-use WELCOME10 code.
   */
  offer?: { code: string; expiresAt: Date; percentOff: number; kind?: "personal" | "founding" } | null;
};

function expiryText(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(d);
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
    if (i.source === "ai_unavailable") {
      subject = pet ? `Our studio is ready for ${pet}` : "Our studio is ready for your dog";
      preheader = "Sorry we were busy earlier. Your free preview takes about a minute now.";
      body = [
        heading(subject),
        para("Sorry we couldn't finish your preview earlier — our studio was busier than expected. It's ready now, and the preview is still free."),
        button(i.createUrl, "Make my free preview"),
      ];
      text = [subject, "", "Sorry we couldn't finish your preview earlier. It's ready now, and the preview is still free.", `Make my free preview: ${i.createUrl}`];
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
        para("Not quite right? Try another style — previews are always free.", { muted: true, size: 14 }),
      ];
      text = [subject, "", `We saved ${theirPortrait} for you.`, `See it: ${i.createUrl}`, "Not quite right? Try another style — previews are always free."];
    }
  } else if (i.step === 2) {
    subject = "What's included with every Pup Prints portrait";
    preheader = "Free US shipping, a free hi-res file, and a love-it guarantee. No surprises at checkout.";
    body = [
      heading(pet ? `Everything that comes with ${pet}'s portrait` : "Everything that comes with your portrait"),
      i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
      steps([
        { title: "Free US shipping", detail: "On every order, built into the price. No surprise fees at checkout." },
        { title: "Your hi-res digital file, free", detail: "Included with every print, canvas or framed piece." },
        { title: "Checked by a person", detail: "Every portrait is checked by our team before it's printed." },
        { title: "The love-it guarantee", detail: "If it isn't right, we'll remake it or refund you in full." },
      ]),
      button(i.createUrl, "Choose a size"),
    ];
    text = [
      subject,
      "",
      "- Free US shipping on every order, built into the price",
      "- Your hi-res digital file, free with every print",
      "- Every portrait is checked by a person before printing",
      "- Love-it guarantee: remake or full refund",
      "",
      `Choose a size: ${i.createUrl}`,
    ];
  } else {
    const offer = i.offer;
    if (offer?.kind === "founding") {
      subject = `${offer.percentOff}% off ${theirPortrait}, through ${FOUNDING.deadlineLabel}`;
      preheader = `Code ${offer.code} takes ${offer.percentOff}% off for our first ${FOUNDING.maxRedemptions} orders, through ${FOUNDING.deadlineLong}.`;
      body = [
        heading(pet ? `A little nudge for ${pet}` : "A little nudge"),
        para(
          `If you've been thinking it over: we're a new studio, and our first ${FOUNDING.maxRedemptions} orders get ${offer.percentOff}% off with our Founding ${FOUNDING.maxRedemptions} code.`,
        ),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
        callout(
          `<div style="text-align:center;"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7a7368;">Founding ${FOUNDING.maxRedemptions} code</div><div style="font-family:Georgia,serif;font-size:28px;color:#1b1814;margin:6px 0;">${esc(offer.code)}</div><div style="font-size:13px;color:#7a7368;">${offer.percentOff}% off, for our first ${FOUNDING.maxRedemptions} orders. Ends ${esc(FOUNDING.deadlineLong)}.</div></div>`,
          "clay",
        ),
        button(i.createUrl, "Use the code"),
        para("Enter it at checkout. This is the last email we'll send about this preview.", { muted: true, size: 14 }),
      ];
      text = [
        subject,
        "",
        `Founding ${FOUNDING.maxRedemptions} code: ${offer.code} (${offer.percentOff}% off, for our first ${FOUNDING.maxRedemptions} orders)`,
        `Ends: ${FOUNDING.deadlineLong}`,
        `Use it: ${i.createUrl}`,
      ];
    } else if (offer) {
      const exp = expiryText(offer.expiresAt);
      subject = `${offer.percentOff}% off ${theirPortrait}, until ${new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(offer.expiresAt)}`;
      preheader = `Your personal code ${offer.code} takes ${offer.percentOff}% off your first order. It expires ${exp}.`;
      body = [
        heading(pet ? `A little nudge for ${pet}` : "A little nudge"),
        para(`If you've been thinking it over, here's a personal code for ${offer.percentOff}% off your first order.`),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
        callout(
          `<div style="text-align:center;"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7a7368;">Your code</div><div style="font-family:Georgia,serif;font-size:28px;color:#1b1814;margin:6px 0;">${esc(offer.code)}</div><div style="font-size:13px;color:#7a7368;">Single use. Expires ${esc(exp)}.</div></div>`,
          "clay",
        ),
        button(i.createUrl, "Use my code"),
        para("Enter it at checkout. This is the last email we'll send about this preview.", { muted: true, size: 14 }),
      ];
      text = [
        subject,
        "",
        `Your personal code: ${offer.code} (${offer.percentOff}% off your first order, single use)`,
        `Expires: ${exp}`,
        `Use it: ${i.createUrl}`,
      ];
    } else {
      subject = pet ? `Still thinking about ${pet}'s portrait?` : "Still thinking it over?";
      preheader = "Your preview is saved. This is our last reminder about it.";
      body = [
        heading(subject),
        para("Your preview is still saved, and you can try other styles for free. This is the last reminder we'll send about it."),
        i.previewUrl ? framedImage(i.previewUrl, pet ? `Preview of ${pet}` : "Your preview", 220) : "",
        button(i.createUrl, "See my portrait"),
      ];
      text = [subject, "", "Your preview is still saved. This is our last reminder about it.", `See it: ${i.createUrl}`];
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
  /** Founding 100 code while it can still be redeemed. */
  founding: { code: string; percentOff: number } | null;
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
    ? `Your code ${i.welcome.code} takes ${i.welcome.percentOff}% off your first order. Previews are always free.`
    : "See your dog as a fine-art portrait, free, in about a minute.";

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
      : para("Thanks for joining. We turn your favorite photo of your dog into a fine-art portrait, and you see it before you pay anything."),
    steps([
      { title: "Upload a photo", detail: "Any clear photo of your dog's face works." },
      { title: "See your portrait free, in about a minute", detail: "Try as many styles as you like. No card needed." },
      { title: "Order it as a print, canvas or framed piece", detail: "Checked by a person before printing. Your hi-res file is included free." },
    ]),
    i.welcome
      ? codeBox(i.welcome.code, "Your welcome code", `${i.welcome.percentOff}% off your first order. Enter it at checkout.`)
      : "",
    i.founding
      ? para(
          `Ordering soon? Through ${esc(FOUNDING.deadlineLong)}, our first ${FOUNDING.maxRedemptions} orders can use <strong style="color:#1b1814;">${esc(i.founding.code)}</strong> for ${i.founding.percentOff}% off instead (one code per order).`,
          { size: 14 },
        )
      : "",
    button(i.createUrl, "Make my free preview"),
  ].join("\n");

  const text = lines(
    giftCards ? "You're on the list" : "Welcome to Pup Prints",
    "",
    giftCards
      ? "Gift cards aren't on sale yet; we'll email you once, the moment they are."
      : "Thanks for joining. You see your dog's portrait free, before you pay anything.",
    "",
    "1. Upload a photo of your dog",
    "2. See your portrait free, in about a minute",
    "3. Order it as a print, canvas or framed piece (hi-res file included)",
    "",
    i.welcome ? `Your welcome code: ${i.welcome.code} (${i.welcome.percentOff}% off your first order)` : null,
    i.founding
      ? `Through ${FOUNDING.deadlineLong}, our first ${FOUNDING.maxRedemptions} orders can use ${i.founding.code} for ${i.founding.percentOff}% off instead (one code per order).`
      : null,
    `Make your free preview: ${i.createUrl}`,
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
