import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the quiet secondary pages: hairline-separated sections, plain text rows,
 * definition lists and tables. No backgrounds, icons or cards; whitespace does the work.
 */

/**
 * One page section: a hairline, a serif title and its content. On desktop the title sits in the
 * left margin and the content in a ~680px column ("split"); "stack" puts wide content (image grids)
 * under the title instead.
 */
export function Block({
  id,
  title,
  intro,
  children,
  layout = "split",
  compact = false,
  className,
}: {
  id?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  layout?: "split" | "stack";
  /** Less vertical space, for runs of similar sections (FAQ groups, journal categories). */
  compact?: boolean;
  className?: string;
}) {
  const headingId = id && title ? `${id}-title` : undefined;
  const split = layout === "split";
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-20", className)}>
      <Container>
        <div
          className={cn(
            "border-t border-line",
            compact ? "py-12 sm:py-16" : "py-16 sm:py-24",
            split && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)] lg:gap-16",
          )}
        >
          {(title || intro) && (
            <div className={cn("mb-10 sm:mb-12", split && "lg:mb-0 lg:pr-4")}>
              {title && (
                <h2 id={headingId} className="max-w-xl font-display text-[2rem] leading-[1.08] sm:text-[2.5rem]">
                  {title}
                </h2>
              )}
              {intro && <div className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">{intro}</div>}
            </div>
          )}
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}

export type RowItem = { title: ReactNode; body?: ReactNode; key?: string };

/** Hairline-separated rows: a short title and a line or two of text. `numbered` for steps. */
export function Rows({ items, numbered = false, className }: { items: RowItem[]; numbered?: boolean; className?: string }) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className={cn("border-t border-line", className)}>
      {items.map((item, i) => (
        <li
          key={item.key ?? (typeof item.title === "string" ? item.title : i)}
          className="grid gap-1.5 border-b border-line py-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8 sm:py-6"
        >
          <h3 className="font-sans text-[16px] font-medium leading-snug tracking-normal text-ink">
            {numbered && <span className="mr-3 tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>}
            {item.title}
          </h3>
          {item.body && <div className="text-[16px] leading-relaxed text-ink-2">{item.body}</div>}
        </li>
      ))}
    </List>
  );
}

export type Fact = { label: ReactNode; value: ReactNode; note?: ReactNode; key?: string };

/** Label / value pairs on hairlines, values right-aligned (prices, dates, delivery times). */
export function Facts({ items, className }: { items: Fact[]; className?: string }) {
  return (
    <dl className={cn("border-t border-line", className)}>
      {items.map((f, i) => (
        <div
          key={f.key ?? (typeof f.label === "string" ? f.label : i)}
          className="flex items-baseline justify-between gap-6 border-b border-line py-4"
        >
          <dt className="min-w-0 text-[16px] text-ink">
            {f.label}
            {f.note && <span className="mt-0.5 block text-[14px] text-ink-3">{f.note}</span>}
          </dt>
          <dd className="shrink-0 text-right text-[16px] tabular-nums text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A plain list with quiet dashes. */
export function Bullets({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5 text-[16px] leading-relaxed text-ink-2", className)}>
      {items.map((item, i) => (
        <li key={i} className="relative pl-5">
          <span aria-hidden="true" className="absolute left-0 text-ink-3">
            –
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Plain text table with hairlines. The first column is the row header; the other columns are
 * right-aligned (prices, dates). Scrolls sideways inside itself if it ever outgrows a phone.
 */
export function DataTable({
  caption,
  head,
  rows,
  className,
}: {
  caption: string;
  head: ReactNode[];
  rows: { key: string; cells: ReactNode[] }[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-[16px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  "pb-3 pr-4 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3 last:pr-0",
                  i > 0 && "text-right",
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-line">
              {r.cells.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-4 pr-4 align-top font-normal text-ink">
                    {c}
                  </th>
                ) : (
                  <td key={i} className="py-4 pl-4 text-right align-top tabular-nums text-ink last:pr-0">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Running text in the content column. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "space-y-5 text-[17px] leading-[1.75] text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-[3px] hover:[&_a]:decoration-ink [&_strong]:font-medium [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** One grey line (promises, footnotes). */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[14px] leading-relaxed text-ink-3", className)}>{children}</p>;
}

/** Standard inline text link. */
export const textLink =
  "text-ink underline decoration-ink/30 underline-offset-[3px] transition-colors hover:decoration-ink";
