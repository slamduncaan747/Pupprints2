import Link from "next/link";
import { STYLE_MAP } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Article, Block } from "@/content/types";
import { headingIds } from "@/content/articles";
import { plainText, renderInline } from "@/components/content/inline";
import { StyleCard } from "@/components/marketing/style-card";

/** Vertical rhythm: spacing depends on the block and the one before it. */
function spacing(block: Block, prev: Block | undefined) {
  if (!prev) return "mt-0";
  const level = block.type === "heading" ? (block.level ?? 2) : 0;
  if (level === 2) return "mt-16 sm:mt-20";
  if (level === 3) return prev.type === "heading" ? "mt-6" : "mt-12";
  if (prev.type === "heading") return (prev.level ?? 2) === 2 ? "mt-6" : "mt-4";
  if (["cta", "styles", "table", "tip"].includes(block.type) || ["cta", "styles", "table", "tip"].includes(prev.type))
    return "mt-12";
  return "mt-6";
}

const BODY = "text-[18px] leading-[1.75] text-ink-2";

function BlockView({ block, id, index }: { block: Block; id?: string; index: number }) {
  const k = `b${index}`;
  switch (block.type) {
    case "heading": {
      if ((block.level ?? 2) === 2) {
        return (
          <h2 id={id} className="scroll-mt-28 font-display text-[32px] leading-[1.06] tracking-[-0.015em] text-ink sm:text-[42px]">
            {renderInline(block.text, k)}
          </h2>
        );
      }
      return (
        <h3 id={id} className="scroll-mt-28 font-display text-[24px] leading-[1.15] text-ink sm:text-[26px]">
          {renderInline(block.text, k)}
        </h3>
      );
    }
    case "paragraph":
      return <p className={BODY}>{renderInline(block.text, k)}</p>;
    case "list": {
      if (block.ordered) {
        return (
          <ol className="space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className={cn("grid grid-cols-[1.75rem_minmax(0,1fr)]", BODY)}>
                <span aria-hidden="true" className="tabular-nums text-ink-3">
                  {i + 1}.
                </span>
                <span>{renderInline(item, `${k}-${i}`)}</span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className={cn("grid grid-cols-[1.25rem_minmax(0,1fr)]", BODY)}>
              <span aria-hidden="true" className="text-ink-3">
                –
              </span>
              <span>{renderInline(item, `${k}-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "tip":
      return (
        <aside className="border-y border-line py-7 [&_a]:text-ink">
          {block.title && <p className="label text-ink">{renderInline(block.title, `${k}t`)}</p>}
          <p className={cn("text-[16px] leading-[1.75] text-ink-2", block.title && "mt-3")}>
            {renderInline(block.text, k)}
          </p>
        </aside>
      );
    case "cta":
      return (
        <aside className="bg-paper-2 px-6 py-9 sm:px-10 sm:py-11">
          <p className="font-display text-[26px] leading-[1.1] text-ink sm:text-[30px]">{renderInline(block.title, `${k}t`)}</p>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{renderInline(block.body, k)}</p>
          <p className="mt-6">
            <Link href={block.href} className="link-cta text-ink">
              {block.label}
            </Link>
          </p>
        </aside>
      );
    case "table":
      return (
        <figure className="-mx-5 sm:mx-0">
          <div className="overflow-x-auto px-5 sm:px-0">
            <table className="w-full min-w-[520px] border-collapse text-left text-[15px] leading-snug">
              <thead>
                <tr className="border-b border-ink">
                  {block.head.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={cn("label px-3 pb-4 align-bottom font-medium text-ink first:pl-0", i === 0 && "w-[22%]")}
                    >
                      {renderInline(h, `${k}h${i}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-line">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="px-3 py-4 pl-0 align-top font-medium text-ink">
                          {renderInline(cell, `${k}r${r}c${c}`)}
                        </th>
                      ) : (
                        <td key={c} className="px-3 py-4 align-top text-ink-2">
                          {renderInline(cell, `${k}r${r}c${c}`)}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="mt-4 px-5 text-[13px] text-ink-3 sm:px-0">
              {renderInline(block.caption, `${k}c`)}
            </figcaption>
          )}
        </figure>
      );
    case "styles": {
      const styles = block.slugs.map((slug) => STYLE_MAP[slug]);
      return (
        <figure>
          <ul className={cn("grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4", block.slugs.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4")}>
            {styles.map((s) => (
              <li key={s.slug}>
                <StyleCard style={s} compact sizes="(max-width: 640px) 45vw, 160px" />
              </li>
            ))}
          </ul>
          {block.caption && <figcaption className="mt-5 text-[13px] text-ink-3">{block.caption}</figcaption>}
        </figure>
      );
    }
  }
}

/**
 * A pull quote for long articles: the first sentence of a paragraph about a third of the way in,
 * repeated in large Bodoni italic a couple of blocks later (`index` is where it's set). It only
 * repeats the article's own words, so it's hidden from screen readers.
 */
function pullQuote(article: Article): { index: number; text: string } | null {
  const body = article.body;
  if (body.length < 12) return null;
  for (let i = Math.floor(body.length * 0.3); i < Math.min(body.length - 3, body.length * 0.75); i++) {
    const block = body[i];
    if (block.type !== "paragraph") continue;
    // Skip item descriptions in listicles (paragraphs directly under an h3).
    const prev = body[i - 1];
    if (prev?.type === "heading" && (prev.level ?? 2) === 3) continue;
    const first = plainText(block.text).split(/(?<=[.!?])\s+/)[0] ?? "";
    if (first.length < 50 || first.length > 130 || !/[.!?]$/.test(first)) continue;
    // A line worth quoting: no prices, numbers or quotations, and it stands on its own.
    if (/[0-9$:;"“”]/.test(first) || /^(But|And|So|Or|It|This|That|They|These|Those)\b/.test(first)) continue;
    // Set it a few blocks later, but never between a heading and its first paragraph.
    for (let j = i + 2; j <= Math.min(i + 4, body.length - 1); j++) {
      if (body[j - 1].type !== "heading") return { index: j, text: first };
    }
  }
  return null;
}

/** Renders an article's structured body as one readable column (680px, 18px type). */
export function ArticleBody({ article, className }: { article: Article; className?: string }) {
  const ids = headingIds(article);
  const quote = pullQuote(article);
  return (
    <div className={cn("max-w-[680px]", className)}>
      {article.body.map((block, i) => (
        <div key={i} className={spacing(block, article.body[i - 1])}>
          {quote?.index === i && (
            <aside aria-hidden="true" className="mb-12 mt-14 border-y border-line py-12 text-center lg:-mx-28">
              <p className="mx-auto max-w-[760px] font-display text-[28px] italic leading-[1.22] text-ink sm:text-[38px]">
                &ldquo;{quote.text}&rdquo;
              </p>
            </aside>
          )}
          <BlockView block={block} id={ids.get(i)} index={i} />
        </div>
      ))}
    </div>
  );
}
