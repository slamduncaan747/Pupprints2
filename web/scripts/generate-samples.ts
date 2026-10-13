/**
 * Regenerate the marketing sample portraits in web/public/samples/ with the production AI pipeline.
 *
 * Reads the real dog photos in web/scripts/sample-sources/ (Unsplash License, see CREDITS.md there),
 * runs each through `generatePortrait()` from @/lib/ai (the same provider chain customers get), and writes
 * 960×1200 (4:5) WebP files to the exact paths listed in @/lib/samples. "Before" images of the
 * before/after pairs are the source photo itself, cropped to 4:5.
 *
 * Usage (from web/, with a provider key in .env.local, e.g. FAL_KEY):
 *   npx tsx --conditions=react-server --env-file=.env.local scripts/generate-samples.ts [options]
 * or, once the npm script is added:
 *   npm run samples -- [options]
 *
 * Options:
 *   --only=royal,pair-1-after   Only these outputs (file names without extension).
 *   --force                     Overwrite files that already exist (default: skip existing).
 *   --dry-run                   Print the plan without calling any provider.
 *   --variants=N                Generate N candidates per portrait (saved as name.v1.webp …) so a person
 *                               can pick the best one and rename it. Default 1 (writes the final name).
 *
 * `--conditions=react-server` is required because @/lib/ai and @/lib/env import "server-only".
 * Every result must still be reviewed by a person before it ships: check anatomy, the dog's likeness,
 * and that there is no text or watermark.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { generatePortrait } from "@/lib/ai";
import type { StyleSlug } from "@/lib/catalog";
import { BEFORE_AFTER, GALLERY, STYLE_SAMPLES } from "@/lib/samples";

const WEB = path.resolve(__dirname, "..");
const SOURCES = path.join(WEB, "scripts", "sample-sources");
const PUBLIC = path.join(WEB, "public");
const OUT_W = 960;
const OUT_H = 1200;
const WEBP_QUALITY = 82;

/** Which source photo (in scripts/sample-sources/) feeds each sample image. */
const SOURCE_FOR: Record<string, string> = {
  // Style cards
  "/samples/royal.webp": "golden-retriever.jpg",
  "/samples/admiral.webp": "beagle.jpg",
  "/samples/oil-classic.webp": "labrador.jpg",
  "/samples/watercolor.webp": "french-bulldog.jpg",
  "/samples/fine-line.webp": "border-collie.jpg",
  "/samples/pop-art.webp": "dachshund.jpg",
  "/samples/storybook.webp": "doodle-puppy.jpg",
  "/samples/botanical.webp": "cavalier.jpg",
  "/samples/astronaut.webp": "husky.jpg",
  "/samples/charcoal.webp": "beagle-2.jpg",
  "/samples/mid-century.webp": "french-bulldog-sitting.jpg",
  "/samples/holiday.webp": "corgi.jpg",
  // Before/after pairs (the "before" is the source photo itself)
  "/samples/pair-1-before.webp": "golden-retriever.jpg",
  "/samples/pair-1-after.webp": "golden-retriever.jpg",
  "/samples/pair-2-before.webp": "french-bulldog.jpg",
  "/samples/pair-2-after.webp": "french-bulldog.jpg",
  "/samples/pair-3-before.webp": "beagle.jpg",
  "/samples/pair-3-after.webp": "beagle.jpg",
  // Gallery wall
  "/samples/gallery-1.webp": "labrador.jpg",
  "/samples/gallery-2.webp": "dachshund.jpg",
  "/samples/gallery-3.webp": "cavalier.jpg",
  "/samples/gallery-4.webp": "border-collie.jpg",
  "/samples/gallery-5.webp": "corgi.jpg",
  "/samples/gallery-6.webp": "husky.jpg",
};

type Job = { out: string; source: string; style: StyleSlug | null; dog?: string };

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  const add = (out: string, style: StyleSlug | null, dog?: string) => {
    const source = SOURCE_FOR[out];
    if (!source) {
      console.warn(`! No source photo mapped for ${out} — add it to SOURCE_FOR`);
      return;
    }
    jobs.push({ out, source, style, dog });
  };
  for (const [style, out] of Object.entries(STYLE_SAMPLES) as [StyleSlug, string][]) add(out, style);
  for (const pair of BEFORE_AFTER) {
    add(pair.before, null, pair.dog);
    add(pair.after, pair.style, pair.dog);
  }
  for (const g of GALLERY) add(g.src, g.style, g.dog);
  return jobs;
}

function parseArgs(argv: string[]) {
  const get = (name: string) => argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  return {
    only: get("only")?.split(",").map((s) => s.trim()).filter(Boolean),
    force: argv.includes("--force"),
    dryRun: argv.includes("--dry-run"),
    variants: Math.max(1, Number(get("variants") ?? 1) || 1),
  };
}

const mimeFor = (file: string) => (/\.png$/i.test(file) ? "image/png" : /\.webp$/i.test(file) ? "image/webp" : "image/jpeg");

/** Cover-crop to 4:5 at 960×1200, light sharpening after the resize, WebP q82. */
async function toSampleWebp(input: Buffer) {
  return sharp(input)
    .rotate()
    .resize(OUT_W, OUT_H, { fit: "cover", position: sharp.strategy.attention, kernel: "lanczos3" })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let jobs = buildJobs();
  if (opts.only) {
    const wanted = new Set(opts.only);
    jobs = jobs.filter((j) => wanted.has(path.basename(j.out, ".webp")));
  }
  await mkdir(path.join(PUBLIC, "samples"), { recursive: true });

  let ok = 0;
  let failed = 0;
  for (const job of jobs) {
    const target = path.join(PUBLIC, job.out);
    const sourcePath = path.join(SOURCES, job.source);
    if (!existsSync(sourcePath)) {
      console.error(`✗ ${job.out}: source photo missing (${job.source})`);
      failed++;
      continue;
    }
    if (existsSync(target) && !opts.force && opts.variants === 1) {
      console.log(`· ${job.out} exists (use --force to regenerate)`);
      continue;
    }
    const label = job.style ? `${job.style} from ${job.source}` : `before photo ${job.source}`;
    if (opts.dryRun) {
      console.log(`→ ${job.out}: ${label}`);
      continue;
    }

    const imageBytes = await readFile(sourcePath);
    if (!job.style) {
      await writeFile(target, await toSampleWebp(imageBytes));
      console.log(`✓ ${job.out} (${label})`);
      ok++;
      continue;
    }

    for (let v = 1; v <= opts.variants; v++) {
      const out = opts.variants === 1 ? target : target.replace(/\.webp$/, `.v${v}.webp`);
      try {
        const started = Date.now();
        const result = await generatePortrait({ imageBytes, mime: mimeFor(job.source), style: job.style });
        await writeFile(out, await toSampleWebp(result.bytes));
        const secs = ((Date.now() - started) / 1000).toFixed(1);
        console.log(`✓ ${path.relative(PUBLIC, out)} (${label}) via ${result.provider}/${result.model} in ${secs}s`);
        ok++;
      } catch (err) {
        console.error(`✗ ${job.out}: ${err instanceof Error ? err.message : String(err)}`);
        failed++;
      }
    }
  }
  console.log(`\nDone: ${ok} written, ${failed} failed. Review every image before committing.`);
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
