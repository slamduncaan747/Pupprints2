/**
 * Journal articles (/journal, /journal/[slug]). Each article lives in ./journal/<name>.ts as
 * structured blocks; this module adds computed fields (word count, reading time), ordering,
 * related-article logic and a build-time check that every internal link points somewhere real.
 */
import { STYLE_MAP } from "@/lib/catalog";
import { BREED_MAP } from "@/content/breeds";
import { countWords, slugify } from "@/content/helpers";
import type { Article, ArticleCategory, ArticleInput, Block } from "@/content/types";
import { photoGuide } from "@/content/journal/photo-guide";
import { giftIdeas } from "@/content/journal/gift-ideas";
import { memorialIdeas } from "@/content/journal/memorial-ideas";
import { royalHistory } from "@/content/journal/royal-history";
import { canvasVsFramed } from "@/content/journal/canvas-vs-framed";
import { christmasGifts } from "@/content/journal/christmas-gifts";
import { dogMomGifts } from "@/content/journal/dog-mom-gifts";
import { sympathyCard } from "@/content/journal/sympathy-card";
import { sizeGuide } from "@/content/journal/size-guide";
import { styleGuide } from "@/content/journal/style-guide";
import { newPuppyGifts } from "@/content/journal/new-puppy-gifts";
import { hangingGuide } from "@/content/journal/hanging-guide";

export const CATEGORIES: Record<ArticleCategory, { label: string; blurb: string }> = {
  "gift-guides": { label: "Gift guides", blurb: "Thoughtful gifts for every dog person, and the dates to order by." },
  "photo-tips": { label: "Photo tips", blurb: "How to get a photo that makes a great portrait." },
  memorial: { label: "Memorial", blurb: "Gentle ideas for remembering a dog you love." },
  "art-and-style": { label: "Art & style", blurb: "Portrait styles, and the art history behind them." },
  "home-and-framing": { label: "Home & framing", blurb: "Sizes, finishes and hanging, without the guesswork." },
};

export const CATEGORY_ORDER: ArticleCategory[] = ["gift-guides", "photo-tips", "memorial", "art-and-style", "home-and-framing"];

const INPUTS: ArticleInput[] = [
  photoGuide,
  giftIdeas,
  memorialIdeas,
  royalHistory,
  canvasVsFramed,
  christmasGifts,
  dogMomGifts,
  sympathyCard,
  sizeGuide,
  styleGuide,
  newPuppyGifts,
  hangingGuide,
];

function blockText(block: Block): string[] {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return [block.text];
    case "list":
      return block.items;
    case "tip":
      return [block.title ?? "", block.text];
    case "cta":
      return [block.title, block.body];
    case "table":
      return [...block.head, ...block.rows.flat(), block.caption ?? ""];
    case "styles":
      return [block.caption ?? ""];
  }
}

function withComputed(input: ArticleInput): Article {
  const wordCount = input.body.flatMap(blockText).reduce((sum, t) => sum + countWords(t), 0);
  return { ...input, wordCount, readingMinutes: Math.max(1, Math.round(wordCount / 230)) };
}

/** Newest first. */
export const ARTICLES: Article[] = INPUTS.map(withComputed).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const ARTICLE_MAP: Record<string, Article> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_MAP[slug];
}

/** Explicitly related articles first, then same category, then newest. */
export function relatedArticles(article: Article, count = 3): Article[] {
  const out: Article[] = [];
  const push = (a?: Article) => {
    if (a && a.slug !== article.slug && !out.some((o) => o.slug === a.slug) && out.length < count) out.push(a);
  };
  (article.related ?? []).forEach((s) => push(ARTICLE_MAP[s]));
  ARTICLES.filter((a) => a.category === article.category).forEach(push);
  ARTICLES.forEach(push);
  return out;
}

export type TocEntry = { id: string; text: string };

/** h2 headings with stable, unique ids (used by the renderer and the table of contents). */
export function headingIds(article: Article): Map<number, string> {
  const ids = new Map<number, string>();
  const seen = new Set<string>();
  article.body.forEach((b, i) => {
    if (b.type !== "heading") return;
    let id = b.id ?? (slugify(b.text) || `section-${i}`);
    while (seen.has(id)) id = `${id}-${i}`;
    seen.add(id);
    ids.set(i, id);
  });
  return ids;
}

export function tableOfContents(article: Article): TocEntry[] {
  const ids = headingIds(article);
  return article.body.flatMap((b, i) =>
    b.type === "heading" && (b.level ?? 2) === 2 ? [{ id: ids.get(i) ?? "", text: b.text.replace(/\*/g, "") }] : [],
  );
}

/** Articles that mention a breed page (for "further reading" on breed pages). */
export function articlesLinkingTo(path: string): Article[] {
  return ARTICLES.filter((a) => a.body.flatMap(blockText).some((t) => t.includes(`](${path})`)));
}

/* ------------------------------------------------------------------ */
/* Build-time link check                                               */
/* ------------------------------------------------------------------ */

const KNOWN_STATIC = new Set([
  "/",
  "/create",
  "/styles",
  "/shop",
  "/gifts",
  "/faq",
  "/how-it-works",
  "/about",
  "/guarantee",
  "/shipping",
  "/contact",
  "/privacy",
  "/terms",
  "/gift-cards",
  "/breeds",
  "/journal",
  "/track",
]);
const KNOWN_GIFTS = new Set(["christmas", "memorial", "mothers-day", "birthday", "new-puppy", "fathers-day"]);

function isKnownPath(href: string) {
  const [path] = href.split(/[?#]/);
  if (KNOWN_STATIC.has(path)) return true;
  const [, section, slug, extra] = path.split("/");
  if (extra !== undefined) return false;
  if (section === "breeds") return Boolean(BREED_MAP[slug]);
  if (section === "journal") return INPUTS.some((a) => a.slug === slug);
  if (section === "styles") return slug in STYLE_MAP;
  if (section === "gifts") return KNOWN_GIFTS.has(slug);
  if (section === "shop") return ["digital", "poster", "framed", "canvas"].includes(slug);
  return false;
}

(function validateLinks() {
  const problems: string[] = [];
  for (const a of INPUTS) {
    const texts = a.body.flatMap(blockText);
    a.body.forEach((b) => b.type === "cta" && texts.push(`[cta](${b.href})`));
    for (const t of texts) {
      for (const m of t.matchAll(/\]\(([^)]+)\)/g)) {
        const href = m[1];
        if (href.startsWith("/") && !isKnownPath(href)) problems.push(`${a.slug}: ${href}`);
      }
    }
    (a.related ?? []).forEach((r) => !INPUTS.some((x) => x.slug === r) && problems.push(`${a.slug}: related ${r}`));
  }
  if (problems.length) throw new Error(`Broken internal links in journal content:\n${problems.join("\n")}`);
})();
