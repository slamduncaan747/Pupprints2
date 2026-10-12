import "server-only";

/**
 * Server-side environment + feature flags. Every integration is optional so the
 * site always builds and degrades gracefully when a key is missing.
 */
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pupprints.vercel.app",

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  /** Publishable (anon) key. Only ever used server-side together with the server key header. */
  supabaseKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  /** Secret sent as `x-pp-server-key`; RLS grants access only when it matches private.app_secrets. */
  supabaseServerKey: process.env.SUPABASE_SERVER_KEY ?? "",

  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // AI image providers (first configured one in AI_PROVIDER_ORDER wins, others are fallbacks)
  aiProviderOrder: (process.env.AI_PROVIDER_ORDER ?? "gemini,fal,openai,replicate")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  geminiApiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "",
  falKey: process.env.FAL_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  replicateToken: process.env.REPLICATE_API_TOKEN ?? "",

  // Fulfillment
  fulfillmentProvider: process.env.FULFILLMENT_PROVIDER ?? "manual",
  printfulApiKey: process.env.PRINTFUL_API_KEY ?? "",
  gelatoApiKey: process.env.GELATO_API_KEY ?? "",
  prodigiApiKey: process.env.PRODIGI_API_KEY ?? "",
  prodigiSandbox: process.env.PRODIGI_SANDBOX === "1",

  // Email
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "Pup Prints <hello@pupprints.com>",

  // Admin
  adminPassword: process.env.ADMIN_PASSWORD ?? "",

  // Abuse / cost control
  dailyGenerationLimitPerIp: Number(process.env.DAILY_GENERATION_LIMIT_PER_IP ?? 12),
};

export const features = {
  get supabase() {
    return Boolean(env.supabaseUrl && env.supabaseKey && env.supabaseServerKey);
  },
  get stripe() {
    return Boolean(env.stripeSecretKey);
  },
  get ai() {
    return Boolean(env.geminiApiKey || env.falKey || env.openaiApiKey || env.replicateToken);
  },
  get email() {
    return Boolean(env.resendApiKey);
  },
};
