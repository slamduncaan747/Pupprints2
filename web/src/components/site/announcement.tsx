import Link from "next/link";
import { PROMISES } from "@/lib/catalog";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-center text-[13px] tracking-wide">
        <span className="hidden sm:inline">{PROMISES.preview}</span>
        <span className="hidden sm:inline text-paper/40">·</span>
        <span>{PROMISES.shipping}</span>
        <span className="text-paper/40">·</span>
        <Link href="/create" className="underline underline-offset-4 decoration-paper/40 hover:decoration-paper">
          Start now
        </Link>
      </div>
    </div>
  );
}
