# Pup Prints — project guide for agents

Pup Prints (pupprints) is a DTC brand selling fine-art portraits of people's dogs. A customer uploads a photo, sees an AI-generated portrait **free and instantly**, then buys it as a print, framed print, canvas or digital file. We compete with Crown & Paw (crownandpaw.com). Research lives in `docs/research/` and `docs/plan-research/`, strategy in `docs/strategy.md`, and the operating plan (first customers → $1,000/month, Rule of 100, gates) in `docs/business-plan.md`.

## Positioning (use this in all copy)
- **One action: upload a photo of your dog.** Every screen of the marketing site leads to `/create`. The button says "Upload a photo" (`site.cta` in `@/lib/config`); don't invent other wordings.
- **Calm, plain, modern, very few words.** The portraits do the talking. Home page: headline "Your dog, as art.", one sentence, one button; then one photo beside its portrait, the styles, the four formats with prices, one picture, a last call to upload.
- The portrait is made and shown before anyone pays. We don't hype this: no "free!" headlines, no "no account, no card, about a minute" lines, no reassurance chips under buttons. Say it plainly only where someone asks (FAQ, how it works).
- **Don't write** (owner's feedback): grand or precious phrasing ("immortalized", "masterpiece", "work of art", "heirloom"), couture words ("Maison", "commission", "atelier", "Client services", "The Piece"), guarantee slogans ("Love-It Guarantee", "love it or it's free"), named offer constructs (Gift Reveal, Heirloom Set, value stacks, "everything included" lists), competitor or price comparisons ("hand-painted commissions cost $150–$500"), or process boasts ("checked by a person before it's printed").
- Honest pricing: no fake "compare at" prices, no permanent sales, no pre-checked add-ons, no countdown timers, no surprise fees. The hi-res digital file is included with every physical order; US shipping is free. State these as facts where relevant, not as selling points.
- **Returns** (plain policy at `/guarantee`, linked as "Returns"): within 30 days of delivery we remake the piece or refund it in full; damaged pieces are replaced. State it factually where legally useful (returns page, terms, FAQ, order emails); never as a slogan or a band on a marketing page.
- Sharing a finished portrait (`/reveal/[token]`, the "Share it" block on the order page) still works, but it is not marketed and has no brand name.
- **Dog-centered**: a small collection of 7 styles with plain names: Modern, Modern Sage, Watercolor, Line Drawing (`fine-line`), Pastel, Oil (`modern-oil`), Charcoal. The dog is the whole subject: **no costumes, no props, no scenes, no novelty or humour styles**. Retired, don't bring back in copy, prompts or imagery: royal/admiral/astronaut/pop-art/storybook/holiday, ink-wash, mid-century, oil-classic ("Old Master"), botanical, linocut. Never hardcode a style count or list; derive it from the catalog.
- How the art is made: say it honestly when asked ("made by our AI artist, finished by our team"). Don't lead with "AI" in headlines. Never claim art is hand-painted.
- The top line above the header shows at most one factual line: a dated offer driven by `@/lib/offer` (e.g. the Nov 1–Dec 10 ornament offer), the Christmas order-by date, or "Free US shipping". Never invent offers.

## Hard rules (legal + trust)
- **Never fabricate** reviews, testimonials, star ratings, customer counts, press logos, "as seen on", awards, or sales numbers. We are a new brand with zero reviews. Use plain facts (the returns policy, shipping) instead. If a section needs social proof, design it so real reviews can be dropped in later (empty-state friendly) — e.g. "Be one of our first 100 customers" launch framing.
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
- **Design system: calm, plain, modern.** White `bg-paper`, near-black `text-ink`, greys `text-ink-2`/`text-ink-3` (both pass 4.5:1 on white and ivory), warm ivory `bg-paper-2` for the occasional quiet section, hairlines `border-line`. No accent colors; the portraits carry all color. Legacy color names (clay, butter, sage, blush, moss, gold) resolve to neutrals; don't use them.
  - Type: `font-display` = **Newsreader** (a legible serif, weight 400–500, optical size held at a mid setting in `globals.css`; no hairline display faces), line-height about 1.08, headings 34–46px on phones and at most ~72px on desktop. `font-sans` = Hanken Grotesk. Labels/nav/captions/prices-in-grids use the `.label` class (12px, uppercase, 0.12em tracking). Text links that act as CTAs use `.link-cta` (12px, uppercase, underlined).
  - Shapes: **zero radius everywhere** (`rounded-none`), no shadows except a soft shadow on framed art, no gradients, no badges/chips/pills, no emoji, no decorative icons (functional icons only), no tilted frames.
  - Layout: large imagery, full-bleed or edge-to-edge image grids, generous negative space, small text blocks. Container `max-w-[1440px] px-5 sm:px-10`; sections `py-24 sm:py-36`. One CTA per screen, and it is "Upload a photo". Eyebrow labels above headings are rarely needed; leave them out by default.
  - Product grids: image, then `.label` name and price beneath; no cards, borders or hover chrome beyond a slow image fade/zoom.
  - Voice: plain, short, factual. Name things for what they are: "About", "Help", "How it works", "Styles", "Shop", "Returns", "FAQ", "Upload a photo". A sentence or two per section at most. Still honest: never "hand-painted", no invented heritage, no fake scarcity.
- UI primitives: `@/components/ui/button` (`Button`, `ButtonLink`, `buttonClasses` — use `primary` (black) or `secondary` (outline) only), `@/components/ui/container` (`Container`, `Section`, `Eyebrow`, `SectionHeading`), `@/components/ui/paw` (`Logo` = uppercase Newsreader wordmark). Avoid `Badge`. Icons: `lucide-react` only where functional (close, arrow, upload). Animation: subtle fades only.
- Catalog (styles, products, prices, promises): `@/lib/catalog` — **single source of truth**; never hardcode prices or style names elsewhere. `DEFAULT_STYLE` is `modern`. Stored rows can carry retired slugs (`RETIRED_STYLE_SLUGS`): show a style name with `styleLabel(slug)`, never `STYLE_MAP[slug].name` on data from the database.
- Brand/contact config: `@/lib/config` (`site`, including `site.cta`, the one button label). Helpers: `@/lib/utils` (`cn`, `formatPrice`, `absoluteUrl`).
- Server env + feature flags: `@/lib/env` (`env`, `features`) — server-only. Every integration must degrade gracefully when its key is missing (the site must always build and render).
- Database: `@/lib/supabase/server` (`db()`, `requireDb()`, `BUCKETS`, `previewUrl`, `signedUrl`). The browser never talks to Supabase directly; all DB access goes through server code/route handlers. Tables: uploads, generations, orders, leads, partners, referral_events, contact_messages (see migration). `updated_at` must be set by the app on updates.
- Analytics: client `track()` from `@/lib/analytics` for funnel events.
- Route groups: `web/src/app/(site)/` = marketing pages with header/footer; `web/src/app/create/` = focused creation flow; `web/src/app/admin/` = password-protected admin.
- Aesthetic: calm and plain, with space around large pictures. The portraits are the product photography. Mobile-first (most traffic is from Instagram/TikTok on phones). Fast: prefer server components, `next/image`, minimal client JS.
- Accessibility: semantic HTML, labels on inputs, alt text, visible focus, 4.5:1 contrast.

## Verifying work
- From `web/`: `npx tsc --noEmit` and `npx eslint <your files>`. Only run `npx next build` if you are the integration owner (parallel builds in the same folder collide).
- Don't run `git commit`/`git push` unless your task says so.
