import Link from "next/link";
import { STYLE_MAP } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Article, Block } from "@/content/types";
import { headingIds } from "@/content/articles";
import { renderInline, proseLink } from "@/components/content/inline";
import { StyleCard } from "@/components/marketing/style-card";

/** Vertical rhythm: spacing depends on the block and the one before it. */
function spacing(block: Block, prev: Block | undefined) {
  if (!prev) return "mt-0";
  const level = block.type === "heading" ? (block.level ?? 2) : 0;
  if (level === 2) return "mt-14 sm:mt-16";
  if (level === 3) return prev.type === "heading" ? "mt-6" : "mt-10";
  if (prev.type === "heading") return (prev.level ?? 2) === 2 ? "mt-5" : "mt-3";
  if (["cta", "styles", "table", "tip"].includes(block.type) || ["cta", "styles", "table", "tip"].includes(prev.type))
    return "mt-10";
  return "mt-6";
}

const BODY = "text-[18px] leading-[1.75] text-ink-2";

function BlockView({ block, id, index }: { block: Block; id?: string; index: number }) {
  const k = `b${index}`;
  switch (block.type) {
    case "heading": {
      if ((block.level ?? 2) === 2) {
        return (
          <h2 id={id} className="scroll-mt-24 font-display text-[2rem] leading-[1.1] text-ink sm:text-[2.4rem]">
            {renderInline(block.text, k)}
          </h2>
        );
      }
      return (
        <h3 id={id} className="scroll-mt-24 font-display text-[1.6rem] leading-[1.15] text-ink">
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
        <aside className="border-l border-ink/25 pl-5 sm:pl-6">
          {block.title && <p className="font-medium text-ink">{renderInline(block.title, `${k}t`)}</p>}
          <p className={cn("text-[17px] leading-[1.7] text-ink-2", block.title && "mt-1.5")}>
            {renderInline(block.text, k)}
          </p>
        </aside>
      );
    case "cta":
      return (
        <aside className="border-y border-line py-7">
          <p className="font-display text-[1.6rem] leading-tight text-ink">{renderInline(block.title, `${k}t`)}</p>
          <p className="mt-2 text-[17px] leading-relaxed text-ink-2">{renderInline(block.body, k)}</p>
          <p className="mt-4 text-[16px]">
            <Link href={block.href} className={proseLink}>
              {block.label}
            </Link>{" "}
            <span aria-hidden="true" className="text-ink-3">
              &rarr;
            </span>
          </p>
        </aside>
      );
    case "table":
      return (
        <figure className="-mx-5 sm:mx-0">
          <div className="overflow-x-auto px-5 sm:px-0">
            <table className="w-full min-w-[520px] border-collapse text-left text-[16px] leading-snug">
              <thead>
                <tr className="border-b border-ink/25">
                  {block.head.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={cn("px-3 pb-3 align-bottom font-medium text-ink first:pl-0", i === 0 && "w-[22%]")}
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
                        <th key={c} scope="row" className="px-3 py-3 pl-0 align-top font-normal text-ink">
                          {renderInline(cell, `${k}r${r}c${c}`)}
                        </th>
                      ) : (
                        <td key={c} className="px-3 py-3 align-top text-ink-2">
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
            <figcaption className="mt-3 px-5 text-[14px] text-ink-3 sm:px-0">
              {renderInline(block.caption, `${k}c`)}
            </figcaption>
          )}
        </figure>
      );
    case "styles": {
      const styles = block.slugs.map((slug) => STYLE_MAP[slug]);
      return (
        <figure>
          <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-8", block.slugs.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4")}>
            {styles.map((s) => (
              <li key={s.slug}>
                <StyleCard style={s} compact sizes="(max-width: 640px) 45vw, 160px" />
              </li>
            ))}
          </ul>
          {block.caption && <figcaption className="mt-4 text-[14px] text-ink-3">{block.caption}</figcaption>}
        </figure>
      );
    }
  }
}

/** Renders an article's structured body as one readable column (680px, 18px type). */
export function ArticleBody({ article, className }: { article: Article; className?: string }) {
  const ids = headingIds(article);
  return (
    <div className={cn("max-w-[680px]", className)}>
      {article.body.map((block, i) => (
        <div key={i} className={spacing(block, article.body[i - 1])}>
          <BlockView block={block} id={ids.get(i)} index={i} />
        </div>
      ))}
    </div>
  );
}
