import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

/**
 * Crawl everything public. Private/transactional areas are blocked: the admin, API routes,
 * per-order pages, personal Gift Reveal links and partner dashboards.
 * The Merchant Center feed (/feeds/google.xml) stays crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/+$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/reveal", "/order", "/partners/stats"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
