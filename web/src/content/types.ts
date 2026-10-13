import type { StyleSlug } from "@/lib/catalog";

/* ------------------------------------------------------------------ */
/* Breeds                                                              */
/* ------------------------------------------------------------------ */

export type BreedSize = "toy" | "small" | "medium" | "large" | "giant" | "varies";

export type Breed = {
  slug: string;
  /** Display name used in "Custom {name} Portraits". */
  name: string;
  /** Plural for running copy ("French Bulldogs"). */
  plural: string;
  /** Affectionate short name, if the breed has a common one ("Frenchie"). */
  nickname?: string;
  /** Position on the AKC's 2025 most-popular list (akc.org, published 2026). Omitted for mixes. */
  akcRank2025?: number;
  size: BreedSize;
  /** One short line about their personality, shown under the H1 and on cards. */
  personality: string;
  /** ~150 words, 2 paragraphs. Breed-specific and genuinely useful: no fluff, no invented facts. */
  intro: string[];
  /** Coat colors / textures and how they read in our styles. */
  coat: string;
  /** 2–3 portrait-specific photo tips for this breed. */
  tips: { title: string; body: string }[];
  /** Recommended styles, best first, each with a breed-specific reason. */
  styles: { slug: StyleSlug; why: string }[];
  /** 1–2 breed-specific questions (generic ones are added by the page). */
  faq: { q: string; a: string }[];
  /** Names used in @/lib/samples (BEFORE_AFTER / GALLERY `dog`) that depict this breed. */
  sampleNames?: string[];
  /** Hand-picked related breeds (slugs) for internal linking. */
  related?: string[];
};

/* ------------------------------------------------------------------ */
/* Journal                                                              */
/* ------------------------------------------------------------------ */

export type ArticleCategory = "gift-guides" | "photo-tips" | "memorial" | "art-and-style" | "home-and-framing";

/**
 * Article body blocks. Text fields support a tiny inline syntax:
 *   [link text](/path)   **bold**   *italic*
 */
export type Block =
  | { type: "heading"; level?: 2 | 3; text: string; id?: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "tip"; title?: string; text: string; tone?: "tip" | "note" | "gentle" }
  | { type: "cta"; title: string; body: string; href: string; label: string; style?: StyleSlug }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "styles"; slugs: StyleSlug[]; caption?: string };

export type ArticleInput = {
  slug: string;
  title: string;
  /** Optional shorter/longer <title> if it should differ from the H1. */
  metaTitle?: string;
  /** Meta description + card dek (~150–160 chars). */
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  updated?: string;
  category: ArticleCategory;
  /** Style sample used as the hero image and OG image. */
  heroStyle: StyleSlug;
  /** Target search phrases (for the keyword map and Article JSON-LD). */
  keywords: string[];
  /** Up to 3 slugs of related articles (falls back to same category). */
  related?: string[];
  body: Block[];
};

export type Article = ArticleInput & {
  readingMinutes: number;
  wordCount: number;
};
