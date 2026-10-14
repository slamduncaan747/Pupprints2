# Pup Prints — go-live checklist

Live site: **https://pup-prints.vercel.app** · Admin: **/admin** (password = `ADMIN_PASSWORD` env var in Vercel) · Vercel project: `pup-prints`

Everything below is done in **Vercel → pup-prints → Settings → Environment Variables** (target: Production + Preview), then **Deployments → ⋯ → Redeploy** on the latest deployment.

## 1. Turn on revenue (≈10 minutes)

| Step | Where | Env var(s) |
|---|---|---|
| AI previews (primary) | OpenAI: platform.openai.com → sign up → Settings → Billing: add ~$10 credit (≈125 previews at ~$0.08) → API keys → Create new secret key. GPT Image models may also require **Organization Verification** (Settings → Organization → General → Verify Organization; government ID, access can take ~15 min to appear) | `OPENAI_API_KEY` |
| AI previews (fallback) | Google Gemini: aistudio.google.com → Get API key → Create API key → Set up billing on that project (prepay min $5; image models have no free tier) | `GEMINI_API_KEY` |
| Check the AI keys | From `web/`, with the keys in `web/.env.local`: `npx tsx scripts/ai-smoke.ts <dog-photo.jpg> royal` (add `--provider=gemini` to test the fallback). Writes the portrait next to the photo | — |
| Print upscaling (optional) | fal.ai → Billing: add credit → Keys → create key. Without it, print files use the built-in upscaler | `FAL_KEY` |
| Payments | Stripe → Developers → API keys → Secret key (live) | `STRIPE_SECRET_KEY` |
| Payment confirmations | Stripe → Developers → Webhooks → Add endpoint `https://pup-prints.vercel.app/api/webhooks/stripe`, events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded` → copy signing secret | `STRIPE_WEBHOOK_SECRET` |
| Order + gift emails | resend.com → API key (verify the sending domain once you own it) | `RESEND_API_KEY` |
| Marketing-email legal footer (CAN-SPAM) | Your business mailing address (a PO box is fine) | `BUSINESS_POSTAL_ADDRESS` |

Without `RESEND_API_KEY`, referral rewards (Give $15 / Get $15) stay owed in Admin → Partners instead of being emailed, and the Free Phone Portrait link is shown on screen instead of emailed. Without `BUSINESS_POSTAL_ADDRESS`, the 7-day referral reminder and nurture emails don't send.

Already configured: Supabase DB + storage, `SUPABASE_SERVER_KEY`, `ADMIN_PASSWORD`, `CRON_SECRET`, site URL, support email.

## 2. Domain

Vercel → **Domains → Buy** `pupprints.shop` (currently available, ~$2.99 first year). Then: add it to the `pup-prints` project, update `NEXT_PUBLIC_SITE_URL` to `https://pupprints.shop`, update the Stripe webhook URL, redeploy. Set up email forwarding for `hello@pupprints.shop` (e.g. ImprovMX free) so support mail reaches you.

## 3. Fulfillment (before your first physical order ships)

Printful → Settings → API → create token → `PRINTFUL_API_KEY`, set `FULFILLMENT_PROVIDER=printful`, add a billing card in Printful. Until then, paid orders wait in **/admin/orders** where you can download print files and approve. Order one sample canvas to verify print quality and the canvas wrap.

## 4. Optional tracking

`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_GA_ID` — the site already fires ViewContent → UploadPhoto → PreviewReady → InitiateCheckout → Purchase. Social links appear in the footer once you set `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_TIKTOK_URL` / `NEXT_PUBLIC_PINTEREST_URL`.

## 5. First sale

Follow **[marketing/FIRST-SALE-RUNBOOK.md](marketing/FIRST-SALE-RUNBOOK.md)** step by step (no personal network needed): turn on keys → prove the pipeline with a real $35 order + refund → open Etsy, Google Merchant Center and social storefronts → run the daily gift loop (10 creator gifts + 10 public "we paint your dogs" gifts per day) → spend the $100 only once pixels are live.

## Before scaling

- Lawyer review of `/privacy`, `/terms` and [marketing/creators/partner-agreement.md](marketing/creators/partner-agreement.md).
- Vercel's Hobby plan is for non-commercial use; upgrade the project to **Pro** before meaningful sales.
- Confirm policy wording flagged for sign-off: Canada Christmas cutoff (Dec 5), guarantee details, "AI providers don't train on your photos" (check OpenAI's and Google's API terms: API data isn't used for training by default; on Gemini that holds only on the paid tier).
