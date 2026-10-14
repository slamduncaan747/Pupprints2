import type { MetadataRoute } from "next";
import { availableStyles, PRODUCTS } from "@/lib/catalog";
import { siteUrl } from "@/lib/seo";
import { BREEDS_SORTED, BREEDS_UPDATED } from "@/content/breeds";
import { ARTICLES } from "@/content/articles";

/**
 * Every public, indexable URL. Transactional/private routes (/order, /reveal, /admin, /api,
 * /partners/stats) are deliberately excluded and blocked in robots.ts.
 * Static marketing pages omit lastModified rather than reporting a fake "today" on every build.
 */

/** Re-generated hourly, so a retired dated edition (Holiday Cozy 2026) leaves without a redeploy. */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];
type Freq = Entry["changeFrequency"];

/** Gift landing pages (/gifts/[occasion]). Keep in sync with the gift guide's occasions. */
const GIFT_OCCASIONS = ["christmas", "memorial", "mothers-day", "birthday", "new-puppy", "fathers-day"] as const;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Freq }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/create", priority: 0.9, changeFrequency: "monthly" },
  { path: "/styles", priority: 0.9, changeFrequency: "monthly" },
  { path: "/shop", priority: 0.9, changeFrequency: "monthly" },
  { path: "/gifts", priority: 0.9, changeFrequency: "weekly" },
  { path: "/breeds", priority: 0.8, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.7, changeFrequency: "weekly" },
  { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/guarantee", priority: 0.6, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gift-cards", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/partners", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/track", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: siteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const style of availableStyles()) {
    entries.push({ url: siteUrl(`/styles/${style.slug}`), changeFrequency: "monthly", priority: 0.8 });
  }

  for (const product of PRODUCTS) {
    entries.push({ url: siteUrl(`/shop/${product.type}`), changeFrequency: "monthly", priority: 0.8 });
  }

  for (const occasion of GIFT_OCCASIONS) {
    entries.push({ url: siteUrl(`/gifts/${occasion}`), changeFrequency: "monthly", priority: 0.8 });
  }

  for (const breed of BREEDS_SORTED) {
    entries.push({
      url: siteUrl(`/breeds/${breed.slug}`),
      lastModified: BREEDS_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const article of ARTICLES) {
    entries.push({
      url: siteUrl(`/journal/${article.slug}`),
      lastModified: article.updated ?? article.date,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
