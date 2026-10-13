/**
 * AI smoke test: make ONE real portrait with the production provider chain, to check an API key
 * end to end. Costs one image (about $0.08 with OpenAI at the default quality, $0.06 with Gemini).
 *
 * Usage, from web/ (keys come from .env.local / .env, or the shell):
 *   npx tsx scripts/ai-smoke.ts <dog-photo.jpg> <style> [--provider=openai|gemini|fal|replicate] [--quality=low|medium|high]
 *
 * Examples:
 *   npx tsx scripts/ai-smoke.ts ~/Desktop/rex.jpg royal                     # normal chain (OpenAI, then Gemini)
 *   npx tsx scripts/ai-smoke.ts ~/Desktop/rex.jpg watercolor --provider=gemini   # test only the Gemini key
 *   npx tsx scripts/ai-smoke.ts ~/Desktop/rex.jpg royal --quality=medium     # compare OpenAI quality tiers
 *
 * Writes <photo>.<style>.<provider>.png next to the photo and prints the provider, model, size and
 * latency of each attempt. The photo goes through the same normalisation as a customer upload.
 * Styles are the slugs in src/lib/catalog.ts (royal, admiral, oil-classic, watercolor, ...).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const WEB_DIR = path.resolve(__dirname, "..");

/**
 * @/lib/ai imports "server-only", which throws unless Node resolves the "react-server" export
 * condition. Re-run this script once with that condition so a plain `npx tsx scripts/ai-smoke.ts`
 * works (tsx's own loader flags are in process.execArgv and are kept).
 */
function ensureReactServerCondition() {
  const hasCondition = process.execArgv.some((a, i, all) =>
    /^(--conditions|-C)=react-server$/.test(a) || ((a === "--conditions" || a === "-C") && all[i + 1] === "react-server"),
  );
  if (hasCondition || process.env.PP_AI_SMOKE_CHILD === "1") return;
  const child = spawnSync(
    process.execPath,
    [...process.execArgv, "--conditions=react-server", process.argv[1], ...process.argv.slice(2)],
    { stdio: "inherit", env: { ...process.env, PP_AI_SMOKE_CHILD: "1" } },
  );
  process.exit(child.status ?? 1);
}

function usage(message?: string): never {
  if (message) console.error(`\n✗ ${message}`);
  console.error(
    "\nUsage: npx tsx scripts/ai-smoke.ts <dog-photo.jpg> <style> [--provider=openai|gemini|fal|replicate] [--quality=low|medium|high]\n",
  );
  process.exit(1);
}

async function main() {
  ensureReactServerCondition();

  // Load .env.local / .env exactly like `next dev` does, before any module reads process.env.
  const { loadEnvConfig } = await import("@next/env");
  loadEnvConfig(WEB_DIR, true, { info: () => {}, error: console.error });

  const args = process.argv.slice(2);
  const flags = new Map(
    args.filter((a) => a.startsWith("--")).map((a) => {
      const [k, ...v] = a.slice(2).split("=");
      return [k, v.join("=")] as const;
    }),
  );
  const [photoArg, styleArg] = args.filter((a) => !a.startsWith("--"));
  if (!photoArg || !styleArg) usage("Pass a dog photo and a style.");

  const photo = path.resolve(process.cwd(), photoArg.replace(/^~(?=\/)/, process.env.HOME ?? "~"));
  if (!existsSync(photo)) usage(`Photo not found: ${photo}`);

  const { STYLES } = await import("@/lib/catalog");
  const style = STYLES.find((s) => s.slug === styleArg);
  if (!style) usage(`Unknown style "${styleArg}". Styles: ${STYLES.map((s) => s.slug).join(", ")}`);

  // Real providers only: the dev mock would make this test meaningless.
  process.env.AI_MOCK = "0";
  const provider = flags.get("provider");
  if (provider) process.env.AI_PROVIDER_ORDER = provider;
  const quality = flags.get("quality");
  if (quality) process.env.OPENAI_IMAGE_QUALITY = quality;

  const ai = await import("@/lib/ai");
  const { normalizeUpload } = await import("@/lib/image");
  const { openaiImageSettings } = await import("@/lib/ai/providers/openai");
  const sharp = (await import("sharp")).default;

  const chain = ai.configuredProviders();
  if (chain.length === 0) {
    usage(
      provider
        ? `Provider "${provider}" has no API key. Set its key in web/.env.local (OPENAI_API_KEY, GEMINI_API_KEY, FAL_KEY or REPLICATE_API_TOKEN).`
        : "No AI provider key found. Put OPENAI_API_KEY=... (and/or GEMINI_API_KEY=...) in web/.env.local.",
    );
  }
  console.log(`Style:     ${style.slug} (${style.name})`);
  console.log(`Providers: ${chain.map((p) => `${p.id} (${p.model()})`).join(" → ")}`);
  const oa = chain.find((p) => p.id === "openai");
  if (oa) {
    const s = openaiImageSettings(oa.model());
    console.log(`OpenAI:    size ${s.size}, quality ${s.quality}${s.inputFidelity ? `, input_fidelity ${s.inputFidelity}` : ""}`);
  }

  const upload = await normalizeUpload(await readFile(photo));
  console.log(`Photo:     ${path.basename(photo)} → ${upload.width}×${upload.height} JPEG (as a customer upload)`);
  console.log("Generating… (usually 15–40 s)\n");

  const started = Date.now();
  try {
    const result = await ai.generatePortrait({
      imageBytes: upload.bytes,
      mime: upload.mime,
      style: style.slug,
      deadline: started + 105_000, // same AI budget as /api/generate
    });
    const out = path.join(
      path.dirname(photo),
      `${path.basename(photo, path.extname(photo))}.${style.slug}.${result.provider}.png`,
    );
    await writeFile(out, await sharp(result.bytes).png().toBuffer());
    for (const a of result.attempts) {
      console.log(`  ${a.ok ? "✓" : "✗"} ${a.provider} (${a.model}) ${(a.ms / 1000).toFixed(1)} s${a.error ? `: ${a.error}` : ""}`);
    }
    console.log(`\n✓ Portrait by ${result.provider} (${result.model}), ${result.width}×${result.height}, ${((Date.now() - started) / 1000).toFixed(1)} s total`);
    console.log(`  Saved: ${out}`);
    console.log("  Check: is it clearly the same dog (markings, eye colour, ears)? No text, frame or watermark?");
  } catch (err) {
    if (err instanceof ai.GenerationFailedError) {
      console.error("✗ Every provider failed:");
      for (const a of err.attempts) console.error(`  ✗ ${a.provider} (${a.model}) ${(a.ms / 1000).toFixed(1)} s: ${a.error}`);
    } else {
      console.error("✗", err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
