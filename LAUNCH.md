# Pup Prints — go-live checklist

Live site: **https://pup-prints.vercel.app** · Admin: **/admin** (password = `ADMIN_PASSWORD` env var in Vercel) · Vercel project: `pup-prints`

Everything below is done in **Vercel → pup-prints → Settings → Environment Variables** (target: Production + Preview), then **Deployments → ⋯ → Redeploy** on the latest deployment.

## 1. Turn on revenue (≈10 minutes)

| Step | Where | Env var(s) |
|---|---|---|
| AI previews | fal.ai → sign up → Billing: add ~$10 credit (≈150 previews) → Keys → create key | `FAL_KEY` |
| Payments | Stripe → Developers → API keys → Secret key (live) | `STRIPE_SECRET_KEY` |
| Payment confirmations | Stripe → Developers → Webhooks → Add endpoint `https://pup-prints.vercel.app/api/webhooks/stripe`, events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded` → copy signing secret | `STRIPE_WEBHOOK_SECRET` |
| Order + gift emails | resend.com → API key (verify the sending domain once you own it) | `RESEND_API_KEY` |
| Marketing-email legal footer (CAN-SPAM) | Your business mailing address (a PO box is fine) | `BUSINESS_POSTAL_ADDRESS` |

Already configured: Supabase DB + storage, `SUPABASE_SERVER_KEY`, `ADMIN_PASSWORD`, `CRON_SECRET`, site URL, support email.

## 2. Domain

Vercel → **Domains → Buy** `pupprints.shop` (currently available, ~$2.99 first year). Then: add it to the `pup-prints` project, update `NEXT_PUBLIC_SITE_URL` to `https://pupprints.shop`, update the Stripe webhook URL, redeploy. Set up email forwarding for `hello@pupprints.shop` (e.g. ImprovMX free) so support mail reaches you.

## 3. Fulfillment (before your first physical order ships)

Printful → Settings → API → create token → `PRINTFUL_API_KEY`, set `FULFILLMENT_PROVIDER=printful`, add a billing card in Printful. Until then, paid orders wait in **/admin/orders** where you can download print files and approve. Order one sample canvas to verify print quality and the canvas wrap.

## 4. Optional tracking

`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_GA_ID` — the site already fires ViewContent → UploadPhoto → PreviewReady → InitiateCheckout → Purchase. Social links appear in the footer once you set `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_TIKTOK_URL` / `NEXT_PUBLIC_PINTEREST_URL`.

## 5. Week-1 sales plan

Start here: **[marketing/README.md](marketing/README.md)** → "first 60 minutes", then [marketing/00-week1-war-plan.md](marketing/00-week1-war-plan.md).

Fastest money, in order:
1. **Friends & family gift blitz** — in /admin/gifts → New gift, make free portraits of ~60 friends' dogs and text each one their private reveal link + `FOUNDING100` (15% off, first 100 orders, ends Oct 31).
2. **Gift-first creator outreach** — 167 creators are already in /admin/partners (P1 first). Gift portrait → DM the reveal link → offer the 15% affiliate code.
3. **3 videos/day** on TikTok/Reels/Shorts — scripts in [marketing/content/30-video-scripts.md](marketing/content/30-video-scripts.md).
4. **$100 budget**: $60 → two nano creators who loved their gift ($30 each, reveal post + code); $40 → Spark-boost the best organic video (rules in [marketing/ads/meta-tiktok-test.md](marketing/ads/meta-tiktok-test.md)).
5. Submit `https://pup-prints.vercel.app/feeds/google.xml` to Google Merchant Center (free Shopping listings) and list on Etsy ([marketing/channels/etsy-kit.md](marketing/channels/etsy-kit.md)).

## Before scaling

- Lawyer review of `/privacy`, `/terms` and [marketing/creators/partner-agreement.md](marketing/creators/partner-agreement.md).
- Vercel's Hobby plan is for non-commercial use; upgrade the project to **Pro** before meaningful sales.
- Confirm policy wording flagged for sign-off: Canada Christmas cutoff (Dec 5), guarantee details, "AI providers don't train on your photos" (check fal's terms).
