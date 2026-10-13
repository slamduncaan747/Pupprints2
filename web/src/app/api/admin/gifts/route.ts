import { randomUUID } from "node:crypto";
import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import http, { type IncomingMessage } from "node:http";
import https from "node:https";
import { BlockList, isIP } from "node:net";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { aiAvailable, AiUnavailableError, generatePortrait, GenerationFailedError } from "@/lib/ai";
import { ImageError, makeWatermarkedPreview, normalizeUpload, toPrintMaster } from "@/lib/image";
import { BUCKETS, db, signedUrl } from "@/lib/supabase/server";
import { uniquePartnerCode } from "@/lib/partners";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { GIFT_SESSION, giftDm } from "@/components/admin/constants";
import { giftImagePath, giftRevealUrl, type GiftRow } from "@/components/admin/gifts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Leave room after the AI call for the image variants + storage writes. */
const AI_BUDGET_MS = 105_000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const GIFT_WEB_EDGE = 1600;

const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const Fields = z.object({
  giftId: z.uuid().optional(),
  partnerId: z.uuid().optional(),
  imageUrl: optText(2000),
  style: z.string().refine((s) => Boolean(getStyle(s)), "Pick a style"),
  petName: optText(40),
  recipientName: optText(80),
  senderName: optText(80),
  message: optText(1000),
});

/** Non-public address space: loopback, private, link-local (cloud metadata), CGNAT, multicast… */
const BLOCKED_NETS = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 3],
] as const) {
  BLOCKED_NETS.addSubnet(net, prefix, "ipv4");
}
for (const [net, prefix] of [
  ["::", 96], // unspecified, loopback, IPv4-compatible
  ["::ffff:0:0", 96], // IPv4-mapped
  ["64:ff9b::", 96], // NAT64
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001::", 23],
  ["2001:db8::", 32],
  ["2002::", 16], // 6to4
  ["fc00::", 7], // unique local
  ["fe80::", 10], // link-local
  ["ff00::", 8], // multicast
] as const) {
  BLOCKED_NETS.addSubnet(net, prefix, "ipv6");
}

function isBlockedIp(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return true;
  return BLOCKED_NETS.check(address, family === 6 ? "ipv6" : "ipv4");
}

const BLOCKED_HOST = new ImageError("unreadable", "Only public http(s) image URLs are allowed.");

/**
 * DNS lookup that refuses non-public addresses. Used as the socket's `lookup`, so the address
 * we validate is the one we connect to (no DNS-rebinding window between check and connect).
 */
const publicOnlyLookup = ((hostname: string, options: { all?: boolean }, callback: (...args: unknown[]) => void) => {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses: LookupAddress[]) => {
    if (err) return callback(err);
    if (!addresses.length || addresses.some((a) => isBlockedIp(a.address))) return callback(BLOCKED_HOST);
    if (options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
}) as unknown as http.RequestOptions["lookup"];

function getOnce(url: URL, signal: AbortSignal): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const req = (url.protocol === "https:" ? https : http).get(url, {
      lookup: publicOnlyLookup,
      signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; PupPrintsGiftTool/1.0)",
        accept: "image/*",
        "accept-encoding": "identity",
      },
    });
    req.on("response", resolve);
    req.on("error", reject);
  });
}

const MAX_REDIRECTS = 3;

/**
 * Download a pasted image URL (admin-only). SSRF-hardened: http(s) on default ports only,
 * every hop (redirects are followed by hand) must resolve to a public address, the body is
 * streamed with a hard size cap, and the whole download has one 15s deadline.
 */
async function fetchRemoteImage(raw: string): Promise<Buffer> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ImageError("unreadable", "That doesn't look like a valid URL.");
  }
  const signal = AbortSignal.timeout(15_000);
  for (let hop = 0; ; hop++) {
    const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      (url.port && url.port !== "80" && url.port !== "443") ||
      host === "localhost" ||
      /\.(localhost|internal|local)$/.test(host) ||
      (isIP(host) !== 0 && isBlockedIp(host))
    ) {
      throw BLOCKED_HOST;
    }

    let res: IncomingMessage;
    try {
      res = await getOnce(url, signal);
    } catch (err) {
      if (err === BLOCKED_HOST) throw err;
      throw new ImageError("unreadable", "Couldn't download that image (timed out or blocked). Try uploading the file instead.");
    }
    const status = res.statusCode ?? 0;
    if (status >= 300 && status < 400 && res.headers.location) {
      res.destroy();
      if (hop >= MAX_REDIRECTS) throw new ImageError("unreadable", "That URL redirects too many times. Try uploading the file instead.");
      try {
        url = new URL(res.headers.location, url);
      } catch {
        throw new ImageError("unreadable", "That URL redirects somewhere invalid. Try uploading the file instead.");
      }
      continue;
    }
    if (status < 200 || status >= 300) {
      res.destroy();
      throw new ImageError("unreadable", `Couldn't download that image (HTTP ${status}). Try uploading the file instead.`);
    }
    const type = String(res.headers["content-type"] ?? "");
    if (!type.startsWith("image/")) {
      res.destroy();
      throw new ImageError(
        "unsupported_type",
        `That URL is a web page (${type.split(";")[0] || "unknown type"}), not an image. Right-click the photo → "Copy image address", or upload the file.`,
      );
    }
    if (Number(res.headers["content-length"] ?? 0) > MAX_IMAGE_BYTES) {
      res.destroy();
      throw new ImageError("unreadable", "That image is over 15 MB.");
    }
    const chunks: Buffer[] = [];
    let total = 0;
    try {
      for await (const chunk of res as AsyncIterable<Buffer>) {
        total += chunk.length;
        if (total > MAX_IMAGE_BYTES) {
          res.destroy();
          throw new ImageError("unreadable", "That image is over 15 MB.");
        }
        chunks.push(chunk);
      }
    } catch (err) {
      if (err instanceof ImageError) throw err;
      throw new ImageError("unreadable", "Couldn't download that image (timed out or blocked). Try uploading the file instead.");
    }
    return Buffer.concat(chunks);
  }
}

/**
 * Create (or regenerate) a free gift portrait for creator outreach.
 * multipart/form-data: style, + (file | imageUrl) for a new gift or giftId to regenerate
 * from the same source photo; optional partnerId, petName, recipientName, senderName, message.
 */
export async function POST(req: Request) {
  const started = Date.now();
  const denied = await adminApiGuard();
  if (denied) return denied;
  const c = db();
  if (!c) return jsonError("Database not configured", 503);
  if (!aiAvailable()) {
    return NextResponse.json(
      {
        ok: false,
        error: "ai_unavailable",
        message:
          "No AI image provider is configured yet. Add GEMINI_API_KEY, FAL_KEY, OPENAI_API_KEY or REPLICATE_API_TOKEN to the environment (or AI_MOCK=1 in development), then try again.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Send the gift as multipart/form-data");
  }
  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const parsed = Fields.safeParse({
    giftId: str("giftId") || undefined,
    partnerId: str("partnerId") || undefined,
    imageUrl: str("imageUrl"),
    style: str("style") ?? "",
    petName: str("petName"),
    recipientName: str("recipientName"),
    senderName: str("senderName"),
    message: str("message"),
  });
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");
  const input = parsed.data;
  const style = input.style as StyleSlug;
  const file = form.get("file");

  // 1) Source photo: reuse the gift's original upload, or ingest a new one.
  let existing: GiftRow | null = null;
  let upload: { id: string; storage_path: string };
  let sourceBytes: Buffer;
  try {
    if (input.giftId) {
      const { data: gift } = await c.from("gifts").select("*").eq("id", input.giftId).maybeSingle<GiftRow>();
      if (!gift) return jsonError("Gift not found", 404);
      existing = gift;
      const { data: gen } = gift.generation_id
        ? await c.from("generations").select("upload_id").eq("id", gift.generation_id).maybeSingle()
        : { data: null };
      const { data: up } = gen?.upload_id
        ? await c.from("uploads").select("id, storage_path").eq("id", gen.upload_id).maybeSingle()
        : { data: null };
      if (!up) return jsonError("The original photo for this gift is missing; start a new gift instead.", 409);
      const { data: blob, error } = await c.storage.from(BUCKETS.uploads).download(up.storage_path);
      if (error || !blob) return jsonError("Couldn't read the original photo; start a new gift instead.", 409);
      upload = up;
      sourceBytes = Buffer.from(await blob.arrayBuffer());
    } else {
      let raw: Buffer;
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_IMAGE_BYTES) return jsonError("That image is over 15 MB.", 413);
        raw = Buffer.from(await file.arrayBuffer());
      } else if (input.imageUrl) {
        raw = await fetchRemoteImage(input.imageUrl);
      } else {
        return jsonError("Paste an image URL or upload a photo of the dog.");
      }
      const normalized = await normalizeUpload(raw);
      const uploadId = randomUUID();
      const path = `${GIFT_SESSION}/${uploadId}.jpg`;
      const { error: upErr } = await c.storage
        .from(BUCKETS.uploads)
        .upload(path, normalized.bytes, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw new Error(`Storing the photo failed: ${upErr.message}`);
      const { error: rowErr } = await c.from("uploads").insert({
        id: uploadId,
        session_id: GIFT_SESSION,
        storage_path: path,
        width: normalized.width,
        height: normalized.height,
        bytes: normalized.bytes.length,
        mime: "image/jpeg",
      });
      if (rowErr) throw new Error(`Saving the upload failed: ${rowErr.message}`);
      upload = { id: uploadId, storage_path: path };
      sourceBytes = normalized.bytes;
    }
  } catch (err) {
    if (err instanceof ImageError) return jsonError(err.message, 422);
    console.error("[admin/gifts] source photo failed", err);
    return jsonError(err instanceof Error ? err.message : "Couldn't process that photo", 500);
  }

  const petName = input.petName ?? existing?.pet_name ?? undefined;

  // 2) Generation row (excluded from customer KPIs via its session id).
  const { data: genRow, error: genErr } = await c
    .from("generations")
    .insert({ upload_id: upload.id, session_id: GIFT_SESSION, pet_name: petName ?? null, style, status: "processing" })
    .select("id")
    .single();
  if (genErr || !genRow) return jsonError(`Couldn't start the generation: ${genErr?.message}`, 500);
  const generationId: string = genRow.id;
  const fail = (error: string) =>
    c
      .from("generations")
      .update({ status: "failed", error: error.slice(0, 1000), duration_ms: Date.now() - started })
      .eq("id", generationId);

  try {
    const result = await generatePortrait({
      imageBytes: sourceBytes,
      imageUrl: await signedUrl("uploads", upload.storage_path, 60 * 10),
      mime: "image/jpeg",
      style,
      petName,
      deadline: started + AI_BUDGET_MS,
    });

    const giftId = existing?.id ?? randomUUID();
    const [master, preview, web] = await Promise.all([
      toPrintMaster(result.bytes),
      makeWatermarkedPreview(result.bytes),
      sharp(result.bytes, { failOn: "none" })
        .autoOrient()
        .resize({ width: GIFT_WEB_EDGE, height: GIFT_WEB_EDGE, fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .toColourspace("srgb")
        .jpeg({ quality: 86, mozjpeg: true, progressive: true })
        .toBuffer(),
    ]);
    const fullPath = `${GIFT_SESSION}/${generationId}.png`;
    const previewPath = `${GIFT_SESSION}/${generationId}.jpg`;
    const writes = await Promise.all([
      c.storage.from(BUCKETS.portraits).upload(fullPath, master.bytes, { contentType: "image/png", upsert: true }),
      c.storage
        .from(BUCKETS.previews)
        .upload(previewPath, preview.bytes, { contentType: "image/jpeg", upsert: true, cacheControl: "31536000" }),
      c.storage
        .from(BUCKETS.portraits)
        .upload(giftImagePath(giftId), web, { contentType: "image/jpeg", upsert: true, cacheControl: "60" }),
    ]);
    const writeErr = writes.find((w) => w.error)?.error;
    if (writeErr) throw new Error(`Storage failed: ${writeErr.message}`);

    await c
      .from("generations")
      .update({
        status: "succeeded",
        provider: result.provider,
        model: result.model,
        full_path: fullPath,
        preview_path: previewPath,
        width: master.width,
        height: master.height,
        duration_ms: Date.now() - started,
        error: null,
      })
      .eq("id", generationId);

    // 3) Gift row: regenerate keeps the same reveal link.
    let gift: GiftRow;
    if (existing) {
      const patch: Record<string, unknown> = { generation_id: generationId };
      if (input.petName) patch.pet_name = input.petName;
      if (input.recipientName) patch.recipient_name = input.recipientName;
      if (input.message !== undefined) patch.message = input.message;
      if (input.senderName) patch.sender_name = input.senderName;
      const { data, error } = await c.from("gifts").update(patch).eq("id", existing.id).select("*").single<GiftRow>();
      if (error || !data) throw new Error(`Updating the gift failed: ${error?.message}`);
      gift = data;
    } else {
      const row: Record<string, unknown> = {
        id: giftId,
        generation_id: generationId,
        partner_id: input.partnerId ?? null,
        recipient_name: input.recipientName ?? null,
        pet_name: petName ?? null,
        message: input.message ?? null,
        source_photo_url: input.imageUrl && !(file instanceof File && file.size > 0) ? input.imageUrl : null,
      };
      if (input.senderName) row.sender_name = input.senderName;
      const { data, error } = await c.from("gifts").insert(row).select("*").single<GiftRow>();
      if (error || !data) throw new Error(`Saving the gift failed: ${error?.message}`);
      gift = data;
    }

    // 4) CRM: mark the creator as gifted + contacted (never downgrade an active partner), and give
    //    them a code so traffic from their shared reveal page is attributed to them.
    const partnerId = gift.partner_id;
    if (partnerId) {
      const now = new Date().toISOString();
      const { data: p } = await c
        .from("partners")
        .select("status, code, handle, name, discount_percent")
        .eq("id", partnerId)
        .maybeSingle();
      const patch: Record<string, unknown> = { last_contacted_at: now, updated_at: now };
      if (p && p.status !== "active") patch.status = "gifted";
      if (p && !p.code) {
        patch.code = await uniquePartnerCode(p.handle || p.name || "PUP", Number(p.discount_percent ?? 15), partnerId);
      }
      const { error: pErr } = await c.from("partners").update(patch).eq("id", partnerId);
      if (pErr) console.error("[admin/gifts] partner update failed", pErr.message);
    }

    const revealUrl = giftRevealUrl(gift.reveal_token);
    return NextResponse.json({
      ok: true,
      gift,
      style,
      provider: result.provider,
      model: result.model,
      imageUrl: await signedUrl("portraits", giftImagePath(gift.id), 60 * 60),
      revealUrl,
      dm: giftDm({ name: gift.recipient_name, pet: gift.pet_name, link: revealUrl }),
      durationMs: Date.now() - started,
    });
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      await fail("ai_unavailable");
      return NextResponse.json(
        { ok: false, error: "ai_unavailable", message: "No AI image provider is configured yet." },
        { status: 503 },
      );
    }
    const detail = err instanceof GenerationFailedError ? err.message : err instanceof Error ? err.message : String(err);
    console.error("[admin/gifts] generation failed", generationId, detail);
    await fail(detail);
    return NextResponse.json(
      { ok: false, error: "generation_failed", message: `Generation failed: ${detail}. Try again or pick another style.` },
      { status: 502 },
    );
  }
}
