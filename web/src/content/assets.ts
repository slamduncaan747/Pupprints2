import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * True when a file exists in web/public (e.g. "/samples/royal.webp").
 * Used at build time so pages only advertise an og:image that actually exists; otherwise
 * the site-wide app/opengraph-image is used.
 */
export function publicAssetExists(src: string) {
  if (!src.startsWith("/")) return false;
  try {
    return fs.existsSync(path.join(/* turbopackIgnore: true */ process.cwd(), "public", src.slice(1)));
  } catch {
    return false;
  }
}
