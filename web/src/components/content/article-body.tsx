import Link from "next/link";
import { ArrowRight, Flower2, Info, Lightbulb } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { STYLE_MAP } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Article, Block } from "@/content/types";
import { headingIds } from "@/content/articles";
import { renderInline } from "@/components/content/inline";
import { FramedSample } from "@/components/content/framed-sample";

/** Vertical rhythm: spacing depends on the block and the one before it. */
function spacing(block: Block, prev: Block | undefined) {
  if (!prev) return "mt-0";
  const level = block.type === "heading" ? (block.level ?? 2) : 0;
  if (level === 2) return "mt-14 sm:mt-16";
  if (level === 3) return prev.type === "heading" ? "mt-7" : "mt-10";
  if (block.type === "cta" || block.type === "styles" || block.type === "table") return "mt-10";
  if (prev.type === "heading") return (prev.level ?? 2) === 2 ? "mt-5" : "mt-3";
  if (prev.type === "cta" || prev.type === "styles" || prev.type === "table" || block.type === "tip" || prev.type === "tip")
    return "mt-8";
  return "mt-6";
}

const TIP_TONES = {
  tip: { box: "bg-butter-soft/80 ring-butter/60", icon: Lightbulb, iconClass: "text-[#8a6412]" },
  note: { box: "bg-paper-2 ring-line", icon: Info, iconClass: "text-ink-2" },
  gentle: { box: "bg-sage-soft/80 ring-sage/40", icon: Flower2, iconClass: "text-moss" },
} as const;

function BlockView({ block, id, index, first }: { block: Block; id?: string; index: number; first: boolean }) {
  const k = `b${index}`;
  switch (block.type) {
    case "heading": {
      if ((block.level ?? 2) === 2) {
        return (
          <h2 id={id} className="scroll-mt-28 font-display text-[1.75rem] leading-[1.15] text-ink sm:text-[2.15rem]">
            {renderInline(block.text, k)}
          </h2>
        );
      }
      return (
        <h3 id={id} className="scroll-mt-28 font-display text-[1.3rem] leading-snug text-ink sm:text-[1.5rem]">
          {renderInline(block.text, k)}
        </h3>
      );
    }
    case "paragraph":
      return (
        <p
          className={cn(
            "text-[1.0625rem] leading-[1.8] text-ink-2 sm:text-[1.125rem]",
            first &&
              "text-[1.15rem] text-ink sm:text-[1.25rem] sm:leading-[1.75] first-letter:float-left first-letter:mr-3 first-letter:mt-[0.12em] first-letter:font-display first-letter:text-[3.6em] first-letter:leading-[0.78] first-letter:text-clay",
          )}
        >
          {renderInline(block.text, k)}
        </p>
      );
    case "list": {
      if (block.ordered) {
        return (
          <ol className="space-y-3.5">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-4 text-[1.0625rem] leading-[1.75] text-ink-2 sm:text-[1.125rem]">
                <span
                  aria-hidden="true"
                  className="mt-[0.2em] inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay-soft font-display text-[0.95rem] font-semibold text-clay-dark"
                >
                  {i + 1}
                </span>
                <span className="min-w-0">{renderInline(item, `${k}-${i}`)}</span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3.5 text-[1.0625rem] leading-[1.75] text-ink-2 sm:text-[1.125rem]">
              <span aria-hidden="true" className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              <span className="min-w-0">{renderInline(item, `${k}-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "tip": {
      const tone = TIP_TONES[block.tone ?? "tip"];
      const Icon = tone.icon;
      return (
        <aside className={cn("rounded-2xl px-5 py-5 ring-1 sm:px-7 sm:py-6", tone.box)}>
          <div className="flex gap-3.5">
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone.iconClass)} aria-hidden="true" />
            <div className="min-w-0">
              {block.title && <p className="font-semibold text-ink">{renderInline(block.title, `${k}t`)}</p>}
              <p className={cn("text-[1rem] leading-[1.7] text-ink-2 sm:text-[1.0625rem]", block.title && "mt-1.5")}>
                {renderInline(block.text, k)}
              </p>
            </div>
          </div>
        </aside>
      );
    }
    case "cta":
      return (
        <aside className="overflow-hidden rounded-card bg-paper-2 ring-1 ring-line">
          <div className={cn("grid items-center gap-6 p-6 sm:p-8", block.style && "sm:grid-cols-[132px_1fr] sm:gap-8")}>
            {block.style && (
              <div className="hidden sm:block">
                <FramedSample style={block.style} sizes="132px" className="-rotate-2" />
              </div>
            )}
            <div>
              <p className="font-display text-2xl leading-tight text-ink sm:text-[1.7rem]">{renderInline(block.title, `${k}t`)}</p>
              <p className="mt-2 text-[1rem] leading-relaxed text-ink-2">{renderInline(block.body, k)}</p>
              <ButtonLink href={block.href} variant="accent" className="mt-5">
                {block.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </aside>
      );
    case "table":
      return (
        <figure className="-mx-5 sm:mx-0">
          <div className="overflow-x-auto px-5 sm:px-0">
            <table className="w-full min-w-[520px] border-collapse text-left text-[0.95rem] leading-snug">
              <thead>
                <tr>
                  {block.head.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={cn(
                        "border-b-2 border-ink/80 px-3 py-3 align-bottom font-semibold text-ink first:pl-0",
                        i === 0 && "w-[22%]",
                      )}
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
                        <th key={c} scope="row" className="px-3 py-3 pl-0 align-top font-medium text-ink">
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
            <figcaption className="mt-3 px-5 text-sm text-ink-3 sm:px-0">{renderInline(block.caption, `${k}c`)}</figcaption>
          )}
        </figure>
      );
    case "styles":
      return (
        <figure>
          <ul className={cn("grid grid-cols-2 gap-x-5 gap-y-8", block.slugs.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4")}>
            {block.slugs.map((slug) => {
              const s = STYLE_MAP[slug];
              return (
                <li key={slug} className="group">
                  <Link href={`/styles/${slug}`} className="block rounded-2xl bg-paper-2 px-[16%] py-[14%] transition-colors hover:bg-paper-3">
                    <FramedSample style={slug} sizes="(max-width: 640px) 35vw, 160px" />
                    <span className="sr-only">About the {s.name} style</span>
                  </Link>
                  <p className="mt-3 font-display text-lg leading-tight text-ink">{s.name}</p>
                  <p className="mt-1 text-sm leading-snug text-ink-2">{s.blurb}</p>
                  <Link
                    href={`/create?style=${slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-clay-dark underline-offset-4 hover:underline"
                  >
                    Try it free <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
          {block.caption && <figcaption className="mt-4 text-sm text-ink-3">{block.caption}</figcaption>}
        </figure>
      );
  }
}

/** Renders an article's structured body with editorial typography (~68ch measure). */
export function ArticleBody({ article, className }: { article: Article; className?: string }) {
  const ids = headingIds(article);
  return (
    <div className={cn("max-w-[68ch]", className)}>
      {article.body.map((block, i) => (
        <div key={i} className={spacing(block, article.body[i - 1])}>
          <BlockView block={block} id={ids.get(i)} index={i} first={i === 0 && block.type === "paragraph"} />
        </div>
      ))}
    </div>
  );
}
