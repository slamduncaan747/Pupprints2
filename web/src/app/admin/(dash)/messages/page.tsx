import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { site } from "@/lib/config";
import { MessageToggle } from "@/components/admin/message-toggle";
import { Card, DbMissing, EmptyState, ErrorNote, FilterTabs, PageHeader, StatusPill, adminButton, fmtDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages", robots: { index: false, follow: false } };

type Msg = {
  id: string;
  created_at: string;
  name: string | null;
  email: string;
  order_number: string | null;
  topic: string | null;
  message: string;
  handled: boolean;
};

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  const sp = await searchParams;
  const view = sp.view === "handled" || sp.view === "all" ? sp.view : "open";
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Messages" />
        <DbMissing />
      </>
    );
  }

  let q = c
    .from("contact_messages")
    .select("id, created_at, name, email, order_number, topic, message, handled")
    .order("created_at", { ascending: false })
    .limit(200);
  if (view === "open") q = q.eq("handled", false);
  if (view === "handled") q = q.eq("handled", true);
  const [{ data, error }, openCount] = await Promise.all([
    q,
    c.from("contact_messages").select("id", { count: "exact", head: true }).eq("handled", false),
  ]);
  const msgs = (data ?? []) as Msg[];

  return (
    <>
      <PageHeader title="Messages" subtitle={`${openCount.count ?? 0} open · from the contact form`} />
      <FilterTabs
        current={view}
        items={[
          { value: "open", label: "Open", href: "/admin/messages", count: openCount.count ?? undefined },
          { value: "handled", label: "Handled", href: "/admin/messages?view=handled" },
          { value: "all", label: "All", href: "/admin/messages?view=all" },
        ]}
      />
      {error && <ErrorNote message={error.message} />}
      {msgs.length === 0 ? (
        <Card>
          <EmptyState title={view === "open" ? "Inbox zero" : "No messages"}>Contact form submissions show up here.</EmptyState>
        </Card>
      ) : (
        <ul className="space-y-3">
          {msgs.map((m) => {
            const subject = `Re: ${m.topic ? `${m.topic} ` : ""}${m.order_number ? `(${m.order_number})` : ""}`.trim();
            return (
              <li key={m.id}>
                <Card className={m.handled ? "opacity-70" : undefined}>
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-ink">{m.name || m.email}</span>
                        {m.name && <span className="break-all text-ink-3">{m.email}</span>}
                        <StatusPill status={m.handled ? "handled" : "open"} />
                      </p>
                      <p className="mt-0.5 text-xs text-ink-3">
                        {fmtDate(m.created_at)}
                        {m.topic && <> · {m.topic}</>}
                        {m.order_number && (
                          <>
                            {" "}
                            · order <span className="font-mono">{m.order_number}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(subject === "Re:" ? `Re: your message to ${site.name}` : subject)}`}
                        className={adminButton("secondary", "h-8 text-xs")}
                      >
                        <Mail className="h-3.5 w-3.5" /> Reply
                      </a>
                      <MessageToggle id={m.id} handled={m.handled} />
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-2">{m.message}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
