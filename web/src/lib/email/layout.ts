/**
 * Brand email building blocks: table-based, inline-styled HTML that renders in Gmail,
 * Apple Mail and Outlook, plus matching plain-text helpers. No external CSS or fonts.
 */

export const C = {
  paper: "#faf6ef",
  paper2: "#f3ece0",
  card: "#ffffff",
  ink: "#1b1814",
  ink2: "#4a443c",
  ink3: "#7a7368",
  line: "#e6ddcf",
  clay: "#c8553d",
  gold: "#b8913f",
  sage: "#e3eadf",
  moss: "#2f4a3a",
} as const;

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function esc(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function heading(text: string, size = 30) {
  return `<h1 style="margin:0 0 14px;font-family:${SERIF};font-weight:normal;font-size:${size}px;line-height:1.15;color:${C.ink};letter-spacing:-0.3px;">${esc(text)}</h1>`;
}

export function subheading(text: string) {
  return `<h2 style="margin:28px 0 10px;font-family:${SERIF};font-weight:normal;font-size:21px;line-height:1.25;color:${C.ink};">${esc(text)}</h2>`;
}

export function eyebrow(text: string) {
  return `<p style="margin:0 0 10px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.clay};">${esc(text)}</p>`;
}

/** Paragraph. `html` is trusted markup built by the caller (escape user input with esc()). */
export function para(html: string, opts: { muted?: boolean; size?: number; center?: boolean } = {}) {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:${opts.size ?? 16}px;line-height:1.6;color:${opts.muted ? C.ink3 : C.ink2};${opts.center ? "text-align:center;" : ""}">${html}</p>`;
}

export function button(href: string, label: string, opts: { variant?: "clay" | "ink" | "outline"; full?: boolean } = {}) {
  const v = opts.variant ?? "clay";
  const bg = v === "clay" ? C.clay : v === "ink" ? C.ink : "transparent";
  const color = v === "outline" ? C.ink : "#ffffff";
  const border = v === "outline" ? `1px solid ${C.ink}` : `1px solid ${bg}`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px;${opts.full ? "width:100%;" : ""}"><tr><td align="center" bgcolor="${bg}" style="border-radius:999px;background:${bg};border:${border};">
<a href="${esc(href)}" target="_blank" style="display:inline-block;${opts.full ? "width:100%;box-sizing:border-box;" : ""}padding:14px 28px;font-family:${SANS};font-size:16px;font-weight:600;line-height:1;color:${color};text-decoration:none;border-radius:999px;text-align:center;">${esc(label)}</a>
</td></tr></table>`;
}

export function link(href: string, label: string) {
  return `<a href="${esc(href)}" target="_blank" style="color:${C.clay};text-decoration:underline;">${esc(label)}</a>`;
}

export function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0;"><tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

/** A portrait shown in a dark-wood frame with a white mat. */
export function framedImage(src: string, alt: string, width = 300) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:6px auto 22px;"><tr><td style="background:#4a3424;padding:12px;border-radius:2px;box-shadow:0 12px 30px rgba(27,24,20,0.25);">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#fdfcf9;padding:16px;">
<img src="${esc(src)}" width="${width}" alt="${esc(alt)}" style="display:block;width:${width}px;max-width:100%;height:auto;border:0;" />
</td></tr></table>
</td></tr></table>`;
}

/** Two-column key/value rows (items, totals). */
export function rows(entries: { label: string; value: string; strong?: boolean; muted?: boolean }[]) {
  const tr = entries
    .map(
      (e) => `<tr>
<td style="padding:7px 0;font-family:${SANS};font-size:15px;line-height:1.4;color:${e.muted ? C.ink3 : C.ink2};${e.strong ? `font-weight:700;color:${C.ink};` : ""}">${e.label}</td>
<td align="right" style="padding:7px 0 7px 12px;font-family:${SANS};font-size:15px;line-height:1.4;white-space:nowrap;color:${e.muted ? C.ink3 : C.ink};${e.strong ? "font-weight:700;" : ""}">${e.value}</td>
</tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tr}</table>`;
}

/** A soft callout box. */
export function callout(html: string, tone: "sage" | "paper" | "clay" = "paper") {
  const bg = tone === "sage" ? C.sage : tone === "clay" ? "#f6dfd6" : C.paper2;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 18px;"><tr><td style="background:${bg};border-radius:14px;padding:18px 20px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink2};">${html}</td></tr></table>`;
}

/** Numbered steps ("what happens next"). */
export function steps(items: { title: string; detail: string }[]) {
  const tr = items
    .map(
      (s, i) => `<tr>
<td valign="top" style="padding:0 14px 16px 0;width:30px;"><div style="width:28px;height:28px;border-radius:999px;background:${i === 0 ? C.clay : C.paper2};color:${i === 0 ? "#fff" : C.ink2};font-family:${SANS};font-size:13px;font-weight:700;line-height:28px;text-align:center;">${i + 1}</div></td>
<td valign="top" style="padding:3px 0 16px;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink2};"><strong style="color:${C.ink};">${esc(s.title)}</strong><br />${esc(s.detail)}</td>
</tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tr}</table>`;
}

export type ShellOptions = {
  preheader: string;
  body: string;
  supportEmail: string;
  siteUrl: string;
  /** Marketing emails must include an unsubscribe link. */
  unsubscribeUrl?: string;
  /** Extra line in the footer (e.g. why you're receiving this). */
  footerNote?: string;
  /** Physical postal address (CAN-SPAM: required in marketing emails). */
  postalAddress?: string;
};

export function shell(o: ShellOptions): string {
  const host = o.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>Pup Prints</title>
<style>
  @media (max-width: 620px) {
    .pp-card { padding: 28px 22px !important; border-radius: 0 !important; }
    .pp-outer { padding: 0 !important; }
  }
  a { color: ${C.clay}; }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${esc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="background:${C.paper};">
<tr><td align="center" class="pp-outer" style="padding:28px 12px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">
<tr><td align="center" style="padding:6px 0 22px;">
<a href="${esc(o.siteUrl)}" target="_blank" style="text-decoration:none;font-family:${SERIF};font-size:24px;color:${C.ink};letter-spacing:-0.3px;"><span style="color:${C.clay};">&#9679;</span>&nbsp;Pup Prints</a>
</td></tr>
<tr><td class="pp-card" bgcolor="${C.card}" style="background:${C.card};border-radius:20px;padding:40px 40px 32px;box-shadow:0 1px 2px rgba(27,24,20,0.05),0 8px 24px -8px rgba(27,24,20,0.12);">
${o.body}
</td></tr>
<tr><td align="center" style="padding:26px 18px 0;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.ink3};">
Love it or we'll remake or refund it. Questions? Reply to this email or write to ${link(`mailto:${o.supportEmail}`, o.supportEmail)}.<br />
${o.footerNote ? `${esc(o.footerNote)}<br />` : ""}
${o.postalAddress ? `${esc(o.postalAddress)}<br />` : ""}
Pup Prints &middot; <a href="${esc(o.siteUrl)}" target="_blank" style="color:${C.ink3};">${esc(host)}</a>${
    o.unsubscribeUrl
      ? ` &middot; <a href="${esc(o.unsubscribeUrl)}" target="_blank" style="color:${C.ink3};">Unsubscribe</a>`
      : ""
  }
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Plain-text footer that mirrors the HTML one. */
export function textFooter(o: {
  supportEmail: string;
  siteUrl: string;
  unsubscribeUrl?: string;
  footerNote?: string;
  postalAddress?: string;
}) {
  return [
    "—",
    "Love it or we'll remake or refund it.",
    `Questions? Reply to this email or write to ${o.supportEmail}.`,
    o.footerNote,
    o.postalAddress,
    `Pup Prints · ${o.siteUrl}`,
    o.unsubscribeUrl ? `Unsubscribe: ${o.unsubscribeUrl}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}
