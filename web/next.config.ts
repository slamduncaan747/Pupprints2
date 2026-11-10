import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "zygdrgljhfuhrmfgbnkj.supabase.co";

/**
 * Baseline security headers for every response. Deliberately no script/style CSP: inline
 * pixel snippets, Stripe redirects and Next's inline runtime would need nonces everywhere.
 * The CSP below only covers framing/base/object, which can't break any of that.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

/**
 * Campaign images in web/public/campaign at build time (see src/lib/campaign.ts). Baked into the
 * server bundle so a regenerating page, which can't read web/public on Vercel, still knows them.
 */
function campaignFiles(): string {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", "campaign"))
      .filter((name) => /\.(webp|avif|jpe?g|png)$/i.test(name))
      .join(",");
  } catch {
    return "";
  }
}

/** Styles we no longer sell (keep in step with RETIRED_STYLE_SLUGS in src/lib/catalog.ts). */
const RETIRED_STYLES = ["royal", "admiral", "astronaut", "pop-art", "storybook", "holiday", "ink-wash", "mid-century", "oil-classic", "botanical", "linocut"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { PP_CAMPAIGN_FILES: campaignFiles() },
  async redirects() {
    return [
      // Old style pages go to the collection, permanently, so old links and search results never 404.
      ...RETIRED_STYLES.map((slug) => ({ source: `/styles/${slug}`, destination: "/styles", permanent: true })),
      // The court-portrait history article was rewritten as a history of dog portraiture.
      { source: "/journal/history-of-royal-pet-portraits", destination: "/journal/history-of-dog-portraits", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  serverExternalPackages: ["sharp"],
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules keep Turbopack's native handling (hashed class names).
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
