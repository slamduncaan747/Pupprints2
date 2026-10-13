import { z } from "zod";
import {
  PARTNER_STATUSES,
  PARTNER_TIERS,
  PARTNER_CODE_RE,
  cleanHandle,
  tierForFollowers,
} from "@/components/partners/program";

const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v ? v : null));

/** Partner fields accepted by the admin create/update endpoints (DB column names). */
export const PartnerFields = z.object({
  name: optText(120),
  handle: z
    .string()
    .max(200)
    .nullish()
    .transform((v) => (v ? cleanHandle(v) || null : null)),
  platform: z
    .string()
    .trim()
    .toLowerCase()
    .max(30)
    .nullish()
    .transform((v) => (v ? v : null)),
  profile_url: z
    .string()
    .trim()
    .max(500)
    .nullish()
    .refine((v) => !v || /^https?:\/\//i.test(v), "Profile URL must start with http(s)://")
    .transform((v) => (v ? v : null)),
  followers: z.coerce.number().int().min(0).max(2_000_000_000).nullish(),
  tier: z.enum(PARTNER_TIERS).nullish(),
  niche: optText(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .nullish()
    .transform((v) => (v ? v : null))
    .refine((v) => !v || z.email().safeParse(v).success, "Invalid email"),
  notes: optText(5000),
  status: z.enum(PARTNER_STATUSES),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .max(32)
    .nullish()
    .transform((v) => (v ? v : null))
    .refine((v) => !v || PARTNER_CODE_RE.test(v), "Code: 2–32 letters, digits or hyphens"),
  commission_rate: z.coerce.number().min(0).max(0.9),
  discount_percent: z.coerce.number().int().min(0).max(90),
});

export const PartnerCreate = PartnerFields.partial().extend({
  status: z.enum(PARTNER_STATUSES).default("prospect"),
});
export const PartnerPatch = PartnerFields.partial();

/** Pick only keys present in the raw body; fill tier from followers when not given. */
export function partnerPatchFrom(raw: Record<string, unknown>, data: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) if (k in raw) patch[k] = v;
  if ("followers" in patch && !("tier" in raw)) patch.tier = tierForFollowers(patch.followers as number | null);
  return patch;
}
