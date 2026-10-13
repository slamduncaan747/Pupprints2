import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { labelize } from "@/components/admin/constants";

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export const ADMIN_TZ = "America/New_York";

export function fmtDate(iso: string | null | undefined, withTime = true): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ADMIN_TZ,
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : { year: "numeric" }),
  }).format(d);
}

export function fmtMoney(cents: number | null | undefined, currency = "USD"): string {
  if (cents == null) return "—";
  return formatPrice(Math.round(cents), currency.toUpperCase());
}

export function fmtNum(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return new Intl.NumberFormat("en-US").format(n);
}

export function fmtPct(ratio: number | null | undefined, digits = 1): string {
  if (ratio == null || !Number.isFinite(ratio)) return "—";
  return `${(ratio * 100).toFixed(digits).replace(/\.0$/, "")}%`;
}

/* ------------------------------------------------------------------ */
/* Status pills                                                        */
/* ------------------------------------------------------------------ */

const PILL_TONES: Record<string, string> = {
  // orders
  pending: "bg-paper-3 text-ink-2",
  paid: "bg-butter-soft text-[#6b4f10]",
  in_production: "bg-[#e4e9f2] text-[#2c3e63]",
  shipped: "bg-sage-soft text-moss",
  delivered: "bg-moss text-paper",
  canceled: "bg-paper-3 text-ink-3 line-through decoration-ink-3/60",
  refunded: "bg-clay-soft text-clay-dark",
  needs_attention: "bg-clay text-white",
  // generations
  processing: "bg-[#e4e9f2] text-[#2c3e63]",
  succeeded: "bg-sage-soft text-moss",
  failed: "bg-clay-soft text-clay-dark",
  // partners
  prospect: "bg-paper-3 text-ink-2",
  applied: "bg-butter-soft text-[#6b4f10]",
  contacted: "bg-[#e4e9f2] text-[#2c3e63]",
  replied: "bg-[#dfe7f0] text-[#22406a]",
  negotiating: "bg-blush text-clay-dark",
  gifted: "bg-sage-soft text-moss",
  active: "bg-moss text-paper",
  paused: "bg-paper-3 text-ink-3",
  declined: "bg-paper-3 text-ink-3",
  // messages
  open: "bg-butter-soft text-[#6b4f10]",
  handled: "bg-sage-soft text-moss",
};

export function StatusPill({ status, className }: { status: string | null | undefined; className?: string }) {
  const s = status ?? "unknown";
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        PILL_TONES[s] ?? "bg-paper-3 text-ink-2",
        className,
      )}
    >
      {labelize(s)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Layout bits                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
  back,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-block text-sm text-ink-3 hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="font-sans text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-3">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, title, actions, children, ...props }: ComponentProps<"section"> & { title?: ReactNode; actions?: ReactNode }) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-line bg-white", className)} {...props}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          {title && <h2 className="font-sans text-sm font-semibold tracking-normal text-ink">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="font-medium text-ink-2">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-ink-3">{children}</div>}
    </div>
  );
}

export function DbMissing() {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-ink-2">
      <p className="font-semibold text-ink">Database not configured</p>
      <p className="mt-1">
        Set <code className="rounded bg-paper-2 px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="rounded bg-paper-2 px-1">SUPABASE_PUBLISHABLE_KEY</code> and{" "}
        <code className="rounded bg-paper-2 px-1">SUPABASE_SERVER_KEY</code> to see live data here.
      </p>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div role="alert" className="mb-4 rounded-lg border border-clay/30 bg-clay-soft px-4 py-3 text-sm text-clay-dark">
      {message}
    </div>
  );
}

/** Dense table shell: horizontal scroll on small screens. */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-line bg-paper/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3 first:pl-4 last:pr-4",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("border-b border-line/70 px-3 py-2.5 align-top first:pl-4 last:pr-4", className)} {...props} />;
}

/** Tab-style filter links (server-rendered, no JS). */
export function FilterTabs({
  items,
  current,
}: {
  items: { href: string; label: string; value: string; count?: number }[];
  current: string;
}) {
  return (
    <nav className="-mx-4 mb-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Filter">
      {items.map((it) => (
        <Link
          key={it.value}
          href={it.href}
          aria-current={it.value === current ? "page" : undefined}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
            it.value === current ? "bg-ink text-paper" : "bg-white text-ink-2 ring-1 ring-line hover:text-ink",
          )}
        >
          {it.label}
          {it.count != null && (
            <span className={cn("text-xs tabular-nums", it.value === current ? "text-paper/70" : "text-ink-3")}>
              {it.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-ink focus:ring-1 focus:ring-ink";
export const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-3";
export const smallButton =
  "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50";
export const smallButtonTones = {
  primary: "bg-ink text-paper hover:bg-ink/90",
  secondary: "bg-white text-ink ring-1 ring-line hover:ring-ink/40",
  accent: "bg-clay text-white hover:bg-clay-dark",
  danger: "bg-white text-clay-dark ring-1 ring-clay/40 hover:bg-clay-soft",
} as const;

export function adminButton(tone: keyof typeof smallButtonTones = "secondary", className?: string) {
  return cn(smallButton, smallButtonTones[tone], className);
}
