/**
 * Letter a name onto a portrait file with the same code the site uses.
 *   npx tsx scripts/add-name.ts <in> <out.png|.webp> "Biscuit" [ground hex, e.g. "#F4F1EA"]
 * Without a ground (every style but the two Modern ones) the name is only added when the
 * background where it sits is calm; the script prints the measurement and what it did.
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { letterName, NAME_STRIP_MAX_OUTLIERS, NAME_STRIP_MAX_STDEV } from "../src/lib/image/lettering";

async function main() {
  const [src, out, name, ground] = process.argv.slice(2);
  if (!src || !out || !name) throw new Error('usage: add-name.ts <in> <out> "Name" [ground]');
  const { bytes, lettered, stats } = await letterName(await readFile(src), name, ground);
  if (stats) {
    console.log(
      `name strip: stdev ${stats.stdev.toFixed(1)} (max ${NAME_STRIP_MAX_STDEV}), outliers ${(stats.outliers * 100).toFixed(1)}% (max ${NAME_STRIP_MAX_OUTLIERS * 100}%), mean ${stats.mean.toFixed(0)}`,
    );
  }
  console.log(lettered ? "lettered" : ground ? "no usable name: not lettered" : "skipped: the background where the name sits is not calm (or no usable name)");
  await writeFile(out, out.endsWith(".webp") ? await sharp(bytes).webp({ quality: 88 }).toBuffer() : bytes);
  console.log("wrote", out);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
