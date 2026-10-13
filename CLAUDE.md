# Pup Prints — project guide for agents

Pup Prints (pupprints) is a DTC brand selling fine-art portraits of people's dogs. A customer uploads a photo, sees an AI-generated portrait **free and instantly**, then buys it as a print, framed print, canvas or digital file. We compete with Crown & Paw (crownandpaw.com). Research lives in `docs/research/`, strategy in `docs/strategy.md`.

## Positioning (use this in all copy)
- Wedge: **"See it now. Give it now. Hang it in days."**
- Free instant preview before paying (competitors make you pay, then wait 1–3 days for a proof).
- Instant **Gift Reveal**: buyers get a shareable digital reveal immediately; the print follows.
- Honest pricing: no fake "compare at" prices, no permanent fake sales, no pre-checked add-ons, no countdown timers, no surprise fees. The hi-res digital file is included free with every physical order.
- **Love-it guarantee**: free remake or full refund.
- Dog-only, curated styles (quality over Crown & Paw's 1,963 SKUs).
- Every print is checked by a person before it is printed.
- How the art is made: say it honestly when asked ("our AI artist, finished and checked by our team"). Don't lead with "AI" in headlines; lead with the outcome. Never claim art is hand-painted.

## Hard rules (legal + trust)
- **Never fabricate** reviews, testimonials, star ratings, customer counts, press logos, "as seen on", awards, or sales numbers. We are a new brand with zero reviews. Use real promises (guarantee, free preview, shipping) as trust signals instead. If a section needs social proof, design it so real reviews can be dropped in later (empty-state friendly) — e.g. "Be one of our first 100 customers" launch framing.
- Don't use competitor trademarks in UI copy except on factual comparison content in `docs/`. On-site comparisons say "typical portrait shops", not brand names.
- No trademarked characters/franchises in styles (no Star Wars, Disney, NFL team names, etc.).
- FTC: partner/influencer content must be disclosed (#ad / Paid partnership). Our partner materials must say so.
- Never commit secrets. `.env*` is gitignored. Secrets live in Vercel env vars.

## Repo layout
- `web/` — Next.js 16.4 app (App Router, React 19.3, TypeScript, Tailwind CSS v4). **Run all npm commands from `web/`.**
- `web/supabase/migrations/` — SQL schema (already applied to the live Supabase project `zygdrgljhfuhrmfgbnkj`).
- `docs/` — research and strategy. `marketing/` — influencer program, outreach, content calendar, ad briefs, email flows.

## Next.js 16 notes (this is NOT older Next.js — read `web/node_modules/next/dist/docs/` when unsure)
- `params` / `searchParams` / `cookies()` / `headers()` are **async** — always `await` them. Use the global `PageProps<'/route/[slug]'>`, `LayoutProps<'/route'>`, `RouteContext<'/api/x/[id]'>` type helpers (run `npx next typegen` after adding routes).
- `middleware.ts` is renamed **`proxy.ts`** (export `function proxy(req)`).
- Turbopack is the default bundler. `cacheComponents` is OFF in this project; use normal `export const dynamic`, `revalidate`, `generateStaticParams`.
- Route handlers: `export async function POST(req: Request)`; set `export const runtime = "nodejs"` when using sharp/stripe; `export const maxDuration = 60` for slow AI calls.

## Code conventions
- Import alias `@/` → `web/src/`.
- **Design system: MINIMAL** (redesign Oct 13). Near-white `bg-paper` (#fbfbf9), near-black `text-ink`, greys `text-ink-2`/`text-ink-3`, hairlines `border-line`. No accent colors: imagery carries all the color. Legacy color names (clay, butter, sage, blush, moss, gold) still compile but resolve to neutrals; don't use them in new code. Display font `font-display` = Instrument Serif (one weight, use large sizes, normal weight; italic sparingly); UI/body `font-sans` = Inter. Corners `rounded-[3px]` (no pills, no big radii), no heavy shadows, no gradients, no badges/pills/chips, no emoji, no decorative icons, no tilted/floating frames, no marquees. Frames: thin (`.frame-black/.frame-white/.frame-oak`, 8px). Layout: lots of whitespace, few sections, one idea per section, one CTA per screen, short copy (headline ≤ 8 words, body ≤ 2 sentences). Typical section: `py-24 sm:py-32`, container `max-w-6xl`. Eyebrows: 12px uppercase `text-ink-3`.
- UI primitives: `@/components/ui/button` (`Button`, `ButtonLink`, `buttonClasses` — use `primary` (black) or `secondary` (outline) only), `@/components/ui/container` (`Container`, `Section`, `Eyebrow`, `SectionHeading`), `@/components/ui/paw` (`Logo` = text wordmark). Avoid `Badge`. Icons: `lucide-react` only where functional (close, arrow, upload). Animation: subtle fades only.
- Catalog (styles, products, prices, promises): `@/lib/catalog` — **single source of truth**; never hardcode prices or style names elsewhere.
- Brand/contact config: `@/lib/config` (`site`). Helpers: `@/lib/utils` (`cn`, `formatPrice`, `absoluteUrl`).
- Server env + feature flags: `@/lib/env` (`env`, `features`) — server-only. Every integration must degrade gracefully when its key is missing (the site must always build and render).
- Database: `@/lib/supabase/server` (`db()`, `requireDb()`, `BUCKETS`, `previewUrl`, `signedUrl`). The browser never talks to Supabase directly; all DB access goes through server code/route handlers. Tables: uploads, generations, orders, leads, partners, referral_events, contact_messages (see migration). `updated_at` must be set by the app on updates.
- Analytics: client `track()` from `@/lib/analytics` for funnel events.
- Route groups: `web/src/app/(site)/` = marketing pages with header/footer; `web/src/app/create/` = focused creation flow; `web/src/app/admin/` = password-protected admin.
- Aesthetic: minimal gallery — think a museum shop or a quiet photography portfolio. Large portraits on white, thin type, almost no chrome. Mobile-first (most traffic is from Instagram/TikTok on phones). Fast: prefer server components, `next/image`, minimal client JS.
- Accessibility: semantic HTML, labels on inputs, alt text, visible focus, 4.5:1 contrast.

## Verifying work
- From `web/`: `npx tsc --noEmit` and `npx eslint <your files>`. Only run `npx next build` if you are the integration owner (parallel builds in the same folder collide).
- Don't run `git commit`/`git push` unless your task says so.
