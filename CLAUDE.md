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
- Design tokens are in `web/src/app/globals.css` (`@theme`). Use them: `bg-paper`, `bg-paper-2`, `text-ink`, `text-ink-2`, `text-ink-3`, `border-line`, `bg-clay` (CTA accent), `bg-butter`, `bg-sage`, `bg-moss`, `bg-blush`, `font-display` (Fraunces serif for headings), `font-sans` (Inter), `shadow-frame`, `shadow-soft`, `rounded-card`. Frame helper classes: `.frame-black`, `.frame-white`, `.frame-wood`, `.frame-gold`, `.mat`, `.canvas-wrap`, `.grain`, `.skeleton`.
- UI primitives: `@/components/ui/button` (`Button`, `ButtonLink`, `buttonClasses`), `@/components/ui/container` (`Container`, `Section`, `Eyebrow`, `SectionHeading`), `@/components/ui/badge`, `@/components/ui/paw` (`Logo`, `PawMark`). Icons: `lucide-react`. Animation: `motion` (`motion/react`), used sparingly.
- Catalog (styles, products, prices, promises): `@/lib/catalog` — **single source of truth**; never hardcode prices or style names elsewhere.
- Brand/contact config: `@/lib/config` (`site`). Helpers: `@/lib/utils` (`cn`, `formatPrice`, `absoluteUrl`).
- Server env + feature flags: `@/lib/env` (`env`, `features`) — server-only. Every integration must degrade gracefully when its key is missing (the site must always build and render).
- Database: `@/lib/supabase/server` (`db()`, `requireDb()`, `BUCKETS`, `previewUrl`, `signedUrl`). The browser never talks to Supabase directly; all DB access goes through server code/route handlers. Tables: uploads, generations, orders, leads, partners, referral_events, contact_messages (see migration). `updated_at` must be set by the app on updates.
- Analytics: client `track()` from `@/lib/analytics` for funnel events.
- Route groups: `web/src/app/(site)/` = marketing pages with header/footer; `web/src/app/create/` = focused creation flow; `web/src/app/admin/` = password-protected admin.
- Aesthetic: calm, warm, editorial gallery feel — generous whitespace, big serif headlines, cream paper background, portraits shown in realistic frames. Mobile-first (most traffic is from Instagram/TikTok on phones). Fast: prefer server components, `next/image`, minimal client JS.
- Accessibility: semantic HTML, labels on inputs, alt text, visible focus, 4.5:1 contrast.

## Verifying work
- From `web/`: `npx tsc --noEmit` and `npx eslint <your files>`. Only run `npx next build` if you are the integration owner (parallel builds in the same folder collide).
- Don't run `git commit`/`git push` unless your task says so.
