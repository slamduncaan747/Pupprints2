import Link from "next/link";
import type { ReactNode } from "react";

/** Shared link style for links inside editorial copy. */
export const proseLink =
  "font-medium text-ink underline decoration-clay/45 decoration-[1.5px] underline-offset-[3px] transition-colors hover:decoration-clay";

const TOKEN = /(\[[^\]]+\]\([^)\s]+\)|\*\*.+?\*\*|\*[^*\s][^*]*?\*)/g;

/**
 * Renders the tiny inline syntax used in content files:
 *   [text](/path)  -> next/link (external http(s) links open in a new tab)
 *   **bold**       -> <strong>
 *   *italic*       -> <em>
 */
export function Inline({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}

export function renderInline(text: string, keyPrefix = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(TOKEN)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${n++}`;
    if (token.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      const label = m?.[1] ?? token;
      const href = m?.[2] ?? "#";
      if (/^https?:\/\//.test(href)) {
        out.push(
          <a key={key} href={href} className={proseLink} target="_blank" rel="noopener noreferrer">
            {renderInline(label, key)}
          </a>,
        );
      } else {
        out.push(
          <Link key={key} href={href} className={proseLink}>
            {renderInline(label, key)}
          </Link>,
        );
      }
    } else if (token.startsWith("**")) {
      out.push(
        <strong key={key} className="font-semibold text-ink">
          {renderInline(token.slice(2, -2), key)}
        </strong>,
      );
    } else {
      out.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    }
    last = start + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Strips inline syntax to plain text (for meta tags, JSON-LD and aria labels). */
export function plainText(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}
