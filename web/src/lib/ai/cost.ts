/**
 * Rough AI cost per portrait, in USD, by the model stored on the generation row. Used for the
 * per-person daily budget; it does not need to be exact, only on the safe side. It includes the
 * input photos and the identity notes (a fraction of a cent).
 */
const COST_BY_MODEL: [RegExp, number][] = [
  [/gpt-image-1-mini/, 0.03],
  [/gpt-image-1\.5/, 0.07],
  [/gpt-image-2\.5|gpt-image-2(?!\d)/, 0.09],
  [/gemini-3-pro-image/, 0.15],
  [/gemini-3\.1-flash-lite-image|gemini-2\.5-flash-image/, 0.05],
  [/gemini-3\.1-flash-image/, 0.08],
  [/mock/, 0],
];

/** Cost assumed for an attempt still running (no model recorded yet) or an unknown model. */
export const DEFAULT_PORTRAIT_COST = 0.1;

export function portraitCost(model: string | null | undefined): number {
  if (!model) return DEFAULT_PORTRAIT_COST;
  for (const [re, usd] of COST_BY_MODEL) if (re.test(model)) return usd;
  return DEFAULT_PORTRAIT_COST;
}

/** One visitor (browser session) may spend this much on portraits per rolling 24 hours. */
export const PER_PERSON_DAILY_USD = Math.max(0.1, Number(process.env.PER_PERSON_DAILY_AI_USD ?? 1) || 1);

/**
 * Backstop per network address: several people can share one (a household, an office), so it is
 * looser than the per-person budget, but it stops one person clearing cookies to start over.
 */
export const PER_IP_DAILY_USD = Math.max(PER_PERSON_DAILY_USD, Number(process.env.PER_IP_DAILY_AI_USD ?? 3) || 3);
