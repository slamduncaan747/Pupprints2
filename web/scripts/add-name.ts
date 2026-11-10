/**
 * Letter a name onto a portrait file with the same code the site uses.
 *   npx tsx scripts/add-name.ts <in> <out.png|.webp> "Biscuit"
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { addNameLettering } from "../src/lib/image/lettering";

async function main() {
  const [src, out, name, ground] = process.argv.slice(2);
  if (!src || !out || !name) throw new Error('usage: add-name.ts <in> <out> "Name"');
  const png = await addNameLettering(await readFile(src), name, ground);
  await writeFile(out, out.endsWith(".webp") ? await sharp(png).webp({ quality: 88 }).toBuffer() : png);
  console.log("wrote", out);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
