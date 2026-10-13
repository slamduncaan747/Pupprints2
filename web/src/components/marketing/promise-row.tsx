import { Eye, FileImage, HeartHandshake, Truck, UserCheck, type LucideIcon } from "lucide-react";
import { PROMISES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type PromiseItem = { icon: LucideIcon; title: string; body: string };

export const PROMISE_ITEMS: PromiseItem[] = [
  { icon: Eye, title: "Free preview", body: PROMISES.preview },
  { icon: HeartHandshake, title: "Love-it guarantee", body: PROMISES.guarantee },
  { icon: UserCheck, title: "Checked by a person", body: "Every print is reviewed by our team before it's printed" },
  { icon: FileImage, title: "Digital file included", body: PROMISES.digital },
  { icon: Truck, title: "Free US shipping", body: "On every order, with tracking. No minimum" },
];

/** Row of real promises (our trust signals instead of reviews we don't have yet). */
export function PromiseRow({
  items = PROMISE_ITEMS,
  className,
  compact = false,
}: {
  items?: PromiseItem[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-8",
        items.length >= 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map(({ icon: Icon, title, body }) => (
        <li key={title} className={cn("flex flex-col gap-3", compact && "flex-row items-start gap-3")}>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-line">
            <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-medium text-ink">{title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-2">{body}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
