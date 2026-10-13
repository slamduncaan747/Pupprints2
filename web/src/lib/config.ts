/** Default public origin. NOTE: pupprints.vercel.app is a different business; ours is pup-prints. */
const DEFAULT_SITE_URL = "https://pup-prints.vercel.app";
const DEFAULT_SUPPORT_EMAIL = "hello@pupprints.shop";

/** Trimmed env value, or undefined when unset/blank (so `||` fallbacks also cover empty strings). */
function envValue(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export type SocialNetwork = "instagram" | "tiktok" | "pinterest" | "facebook";

/**
 * Social profiles we actually own. Each one comes from its NEXT_PUBLIC_* env var and is omitted
 * when unset, so we never link to a handle that belongs to someone else. (NEXT_PUBLIC_* vars must
 * be read with literal names so Next.js can inline them in client bundles.)
 */
const SOCIAL_ENV: Record<SocialNetwork, string | undefined> = {
  instagram: envValue(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  tiktok: envValue(process.env.NEXT_PUBLIC_TIKTOK_URL),
  pinterest: envValue(process.env.NEXT_PUBLIC_PINTEREST_URL),
  facebook: envValue(process.env.NEXT_PUBLIC_FACEBOOK_URL),
};

const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  facebook: "Facebook",
};

const social: Partial<Record<SocialNetwork, string>> = Object.fromEntries(
  Object.entries(SOCIAL_ENV).filter((entry): entry is [SocialNetwork, string] => Boolean(entry[1])),
);

/** Site-wide brand + contact configuration. Single source of truth for copy that repeats. */
export const site = {
  name: "Pup Prints",
  legalName: "Pup Prints",
  tagline: "Fine-art portraits of your dog.",
  description:
    "Turn your favorite photo into a museum-worthy portrait of your dog. See your custom portrait free in about a minute, then order it as a print, canvas, or framed piece.",
  url: envValue(process.env.NEXT_PUBLIC_SITE_URL) ?? DEFAULT_SITE_URL,
  supportEmail: envValue(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) ?? DEFAULT_SUPPORT_EMAIL,
  partnersEmail:
    envValue(process.env.NEXT_PUBLIC_PARTNERS_EMAIL) ??
    envValue(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) ??
    DEFAULT_SUPPORT_EMAIL,
  /** Only the networks whose env var is set. Use `socialLinks` to render them. */
  social,
} as const;

/** Configured social profiles in display order (empty when none are set). */
export const socialLinks: { network: SocialNetwork; label: string; url: string }[] = (
  Object.keys(SOCIAL_LABELS) as SocialNetwork[]
).flatMap((network) => {
  const url = social[network];
  return url ? [{ network, label: SOCIAL_LABELS[network], url }] : [];
});

/** "@handle" derived from a profile URL, e.g. https://www.instagram.com/pupprints.shop → @pupprints.shop. */
export function socialHandle(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    return last ? `@${last.replace(/^@/, "")}` : undefined;
  } catch {
    return undefined;
  }
}

export type Site = typeof site;
