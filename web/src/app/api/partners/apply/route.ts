import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import {
  cleanHandle,
  escapeLike,
  normalizeCode,
  profileUrlFor,
  tierForFollowers,
} from "@/components/partners/program";

export const dynamic = "force-dynamic";

const APPLY_PLATFORMS = ["instagram", "tiktok", "youtube", "pinterest", "other"] as const;

const Channel = z.object({
  platform: z.enum(APPLY_PLATFORMS),
  handle: z.string().trim().max(200),
  followers: z.coerce.number().int().min(0).max(2_000_000_000).nullish(),
});

const Body = z.object({
  name: z.string().trim().min(1, "Please tell us your name.").max(120),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Please enter a valid email address.")),
  channels: z.array(Channel).min(1).max(5),
  dogName: z.string().trim().max(80).optional().default(""),
  dogBreed: z.string().trim().max(120).optional().default(""),
  contentLinks: z.array(z.string().trim().max(500)).max(5).optional().default([]),
  why: z.string().trim().max(2000).optional().default(""),
  shippingCountry: z.string().trim().min(2, "Please tell us where to ship your portrait.").max(80),
  consent: z.literal(true, { error: "Please confirm you'll disclose partnered posts." }),
  website: z.string().max(500).optional(), // honeypot
});

type ExistingPartner = {
  id: string;
  platform: string | null;
  status: string;
  source: string | null;
  followers: number | null;
  application: Record<string, unknown> | null;
};

function normalizeChannel(ch: z.infer<typeof Channel>) {
  if (ch.platform === "other") {
    const raw = ch.handle.trim();
    if (!raw) return null;
    try {
      const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      const host = url.hostname.replace(/^www\./, "");
      if (!host.includes(".")) return null;
      return {
        platform: "other",
        handle: `${host}${url.pathname.replace(/\/+$/, "")}`.slice(0, 80),
        profileUrl: url.toString(),
        followers: ch.followers ?? null,
      };
    } catch {
      return null;
    }
  }
  const handle = cleanHandle(ch.handle);
  if (!handle || !/^[A-Za-z0-9._-]{1,80}$/.test(handle)) return null;
  return { platform: ch.platform, handle, profileUrl: profileUrlFor(ch.platform, handle), followers: ch.followers ?? null };
}

function safeUrl(v: string) {
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return u.hostname.includes(".") ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Creator program application → `partners` (status applied, source application). */
export async function POST(req: Request) {
  let json: unknown;
  try {
    const text = await req.text();
    if (text.length > 16_384) return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    json = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message =
      issue?.path[0] === "channels"
        ? "Add at least one channel handle."
        : issue && ["name", "email", "shippingCountry", "consent"].includes(String(issue.path[0]))
          ? issue.message
          : "Please check the form and try again.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  const channels = data.channels.map(normalizeChannel).filter((c): c is NonNullable<typeof c> => c !== null);
  if (channels.length === 0) {
    return NextResponse.json({ ok: false, error: "Add at least one valid channel handle (e.g. @yourdog)." }, { status: 400 });
  }
  // Primary channel = biggest audience (first listed on a tie).
  const primary = channels.reduce((best, ch) => ((ch.followers ?? 0) > (best.followers ?? 0) ? ch : best), channels[0]);
  const maxFollowers = Math.max(...channels.map((c) => c.followers ?? 0));
  const tier = channels.some((c) => c.followers != null) ? tierForFollowers(maxFollowers) : null;

  const store = await cookies();
  const application = {
    submittedAt: new Date().toISOString(),
    channels,
    dog: { name: data.dogName || null, breed: data.dogBreed || null },
    contentLinks: data.contentLinks.map(safeUrl).filter(Boolean),
    why: data.why || null,
    shippingCountry: data.shippingCountry,
    consentDisclosure: true,
    referredBy: normalizeCode(store.get("pp_ref")?.value),
  };

  const c = db();
  if (!c) return NextResponse.json({ ok: true });

  try {
    // Match an existing CRM row (e.g. one we researched) on any submitted channel.
    let existing: (ExistingPartner & { matched: (typeof channels)[number] }) | null = null;
    for (const ch of channels) {
      const { data: rows } = await c
        .from("partners")
        .select("id, platform, status, source, followers, application")
        .eq("platform", ch.platform)
        .ilike("handle", escapeLike(ch.handle))
        .limit(1);
      if (rows && rows[0]) {
        existing = { ...(rows[0] as ExistingPartner), matched: ch };
        break;
      }
    }

    const now = new Date().toISOString();
    if (existing) {
      const { error } = await c
        .from("partners")
        .update({
          name: data.name,
          email: data.email,
          followers: existing.matched.followers ?? existing.followers,
          tier,
          status: existing.status === "prospect" ? "applied" : existing.status,
          source: existing.source ?? "application",
          application: { ...(existing.application ?? {}), ...application },
          updated_at: now,
        })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    }

    const { error } = await c.from("partners").insert({
      name: data.name,
      email: data.email,
      handle: primary.handle,
      platform: primary.platform,
      profile_url: primary.profileUrl,
      followers: primary.followers,
      tier,
      status: "applied",
      source: "application",
      application,
    });
    if (error?.code === "23505") {
      // Raced with another submission for the same (platform, handle): update that row.
      const { error: upErr } = await c
        .from("partners")
        .update({ name: data.name, email: data.email, application, updated_at: now })
        .eq("platform", primary.platform)
        .ilike("handle", escapeLike(primary.handle));
      if (upErr) throw new Error(upErr.message);
    } else if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[partners/apply] failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your application right now. Please try again or email us." },
      { status: 500 },
    );
  }
}
