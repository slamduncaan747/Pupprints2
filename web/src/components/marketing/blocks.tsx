import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the maison's secondary pages: hairline-ruled sections, `.label` rows,
 * definition lists and tables. No backgrounds, icons or cards; type, rules and space do the work.
 */

/**
 * One page section. A hairline rule, then the title in the left third (Bodoni, or a small `.label`
 * with `titleStyle="label"`) and the content in a ~680px column on the right ("split"). "stack" puts
 * wide content (image grids) under the title instead.
 */
export function Block({
  id,
  eyebrow,
  title,
  intro,
  children,
  layout = "split",
  titleStyle = "display",
  compact = false,
  className,
}: {
  id?: string;
  /** Small `.label` line above a display title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  layout?: "split" | "stack";
  titleStyle?: "display" | "label";
  /** Less vertical space, for runs of similar sections (FAQ groups, journal categories). */
  compact?: boolean;
  className?: string;
}) {
  const headingId = id && title ? `${id}-title` : undefined;
  const split = layout === "split";
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-24", className)}>
      <Container>
        <div
          className={cn(
            "border-t border-line",
            compact ? "pb-14 pt-8 sm:pb-20 sm:pt-10" : "pb-20 pt-8 sm:pb-28 sm:pt-10",
            split && "lg:grid lg:grid-cols-12 lg:gap-x-10",
          )}
        >
          {(eyebrow || title || intro) && (
            <header className={cn("mb-10 sm:mb-14", split && "lg:col-span-4 lg:mb-0 lg:pr-6")}>
              {eyebrow && <p className="label mb-5 text-ink-3">{eyebrow}</p>}
              {title &&
                (titleStyle === "label" ? (
                  <h2 id={headingId} className="label text-ink">
                    {title}
                  </h2>
                ) : (
                  <h2
                    id={headingId}
                    className="max-w-xl font-display text-[30px] leading-[1.06] sm:text-[40px]"
                  >
                    {title}
                  </h2>
                ))}
              {intro && <div className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-2">{intro}</div>}
            </header>
          )}
          <div className={cn("min-w-0", split && "lg:col-span-7 lg:col-start-6")}>{children}</div>
        </div>
      </Container>
    </section>
  );
}

export type RowItem = { title: ReactNode; body?: ReactNode; key?: string };

/** Hairline rows: a `.label` title and a line or two of text. `numbered` for steps (01, 02…). */
export function Rows({ items, numbered = false, className }: { items: RowItem[]; numbered?: boolean; className?: string }) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className={cn("border-t border-line", className)}>
      {items.map((item, i) => (
        <li
          key={item.key ?? (typeof item.title === "string" ? item.title : i)}
          className="grid gap-2.5 border-b border-line py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10 sm:py-7"
        >
          <h3 className="label flex gap-4 text-ink">
            {numbered && <span className="tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>}
            <span>{item.title}</span>
          </h3>
          {item.body && <div className="text-[15px] leading-relaxed text-ink-2">{item.body}</div>}
        </li>
      ))}
    </List>
  );
}

export type Fact = { label: ReactNode; value: ReactNode; note?: ReactNode; key?: string };

/** `.label` / value pairs on hairlines, values right-aligned (prices, dates, delivery times). */
export function Facts({ items, className }: { items: Fact[]; className?: string }) {
  return (
    <dl className={cn("border-t border-line", className)}>
      {items.map((f, i) => (
        <div
          key={f.key ?? (typeof f.label === "string" ? f.label : i)}
          className="flex items-baseline justify-between gap-6 border-b border-line py-4"
        >
          <dt className="label min-w-0 text-ink">
            {f.label}
            {f.note && (
              <span className="mt-1.5 block font-sans text-[13px] font-normal normal-case leading-snug tracking-normal text-ink-3">
                {f.note}
              </span>
            )}
          </dt>
          <dd className="label shrink-0 text-right tabular-nums text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A plain list on hairlines (materials, care, what's included). */
export function Bullets({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("border-t border-line text-[15px] leading-relaxed text-ink-2", className)}>
      {items.map((item, i) => (
        <li key={i} className="border-b border-line py-3.5">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Plain text table with hairlines and `.label` headers. The first column is the row header; the
 * other columns are right-aligned (prices, dates). Scrolls sideways inside itself if it ever
 * outgrows a phone.
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
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th key={i} scope="col" className={cn("label pb-4 pr-3 font-medium text-ink-3 last:pr-0", i > 0 && "text-right")}>
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
                  <th key={i} scope="row" className="label py-4 pr-3 align-top font-medium text-ink">
                    {c}
                  </th>
                ) : (
                  <td key={i} className="py-4 pl-3 text-right align-top text-[14px] tabular-nums text-ink last:pr-0">
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
        "space-y-5 text-[16px] leading-[1.8] text-ink-2 [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:decoration-1 [&_a]:underline-offset-4 hover:[&_a]:decoration-ink [&_strong]:font-medium [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** One grey line (promises, footnotes). */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[13px] leading-relaxed text-ink-3", className)}>{children}</p>;
}

/** A large Bodoni statement, centered, for the one line a page should be remembered by. */
export function Statement({
  eyebrow,
  children,
  body,
  className,
}: {
  eyebrow?: ReactNode;
  children: ReactNode;
  body?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-24 sm:py-36", className)}>
      <Container className="text-center">
        {eyebrow && <p className="label mb-8 text-ink-3">{eyebrow}</p>}
        <p className="mx-auto max-w-5xl font-display text-[34px] leading-[1.08] tracking-[-0.015em] text-balance sm:text-[56px] lg:text-[72px]">
          {children}
        </p>
        {body && <div className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-ink-2">{body}</div>}
      </Container>
    </section>
  );
}

/** Standard inline text link. */
export const textLink =
  "text-ink underline decoration-ink/30 decoration-1 underline-offset-4 transition-colors hover:decoration-ink";
