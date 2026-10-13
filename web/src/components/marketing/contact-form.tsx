"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_TOPICS } from "@/components/marketing/contact-topics";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "orderNumber" | "topic" | "message";
type Status = "idle" | "sending" | "sent" | "error";

const inputBase =
  "mt-2 block w-full rounded-xl bg-white px-4 text-[16px] text-ink outline-none ring-1 ring-line transition placeholder:text-ink-3 focus:ring-2 focus:ring-ink";

export function ContactForm({
  initialStatus = "idle",
  supportEmail,
  defaultTopic,
}: {
  initialStatus?: "idle" | "sent" | "error";
  supportEmail: string;
  defaultTopic?: string;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [error, setError] = useState<string | null>(
    initialStatus === "error" ? "Something went wrong sending your message. Please try again." : null,
  );
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());
    setStatus("sending");
    setError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Partial<Record<Field, string>>;
      };
      if (!res.ok || !json.ok) {
        setFieldErrors(json.fieldErrors ?? {});
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      formEl.reset();
      setStatus("sent");
    } catch {
      setError("We couldn't reach our server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-card bg-sage-soft p-8 sm:p-10" role="status">
        <CheckCircle2 className="h-8 w-8 text-moss" aria-hidden="true" />
        <h2 className="mt-4 font-display text-3xl">Thank you, we&apos;ve got it.</h2>
        <p className="mt-3 text-ink-2">
          A real person will reply by email within one business day. If it&apos;s urgent, you can also write to{" "}
          <a href={`mailto:${supportEmail}`} className="font-medium text-ink underline underline-offset-4">
            {supportEmail}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[15px] font-medium text-moss underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  const describe = (f: Field) => (fieldErrors[f] ? `${f}-error` : undefined);
  const errorText = (f: Field) =>
    fieldErrors[f] ? (
      <p id={`${f}-error`} className="mt-1.5 text-sm text-clay-dark">
        {fieldErrors[f]}
      </p>
    ) : null;

  return (
    <form action="/api/contact" method="post" onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-[15px] font-medium text-ink">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={120}
            className={cn(inputBase, "h-12")}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={describe("name")}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="text-[15px] font-medium text-ink">
            Email <span className="text-clay-dark">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            className={cn(inputBase, "h-12", fieldErrors.email && "ring-clay")}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describe("email")}
          />
          {errorText("email")}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-topic" className="text-[15px] font-medium text-ink">
            What&apos;s it about?
          </label>
          <select
            id="contact-topic"
            name="topic"
            defaultValue={defaultTopic && CONTACT_TOPICS.some((t) => t.value === defaultTopic) ? defaultTopic : "order"}
            className={cn(inputBase, "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a443c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            {CONTACT_TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-order" className="text-[15px] font-medium text-ink">
            Order number <span className="font-normal text-ink-3">(optional)</span>
          </label>
          <input
            id="contact-order"
            name="orderNumber"
            maxLength={40}
            placeholder="e.g. PP-10241"
            className={cn(inputBase, "h-12 uppercase placeholder:normal-case")}
            aria-invalid={Boolean(fieldErrors.orderNumber)}
            aria-describedby={describe("orderNumber")}
          />
          {errorText("orderNumber")}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-[15px] font-medium text-ink">
          Message <span className="text-clay-dark">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Tell us how we can help."
          className={cn(inputBase, "resize-y py-3 leading-relaxed", fieldErrors.message && "ring-clay")}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={describe("message")}
        />
        {errorText("message")}
      </div>

      {/* Honeypot for bots: hidden from sighted users and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-clay-soft px-4 py-3 text-[15px] text-clay-dark">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-3">We reply within one business day. We never share your email.</p>
        <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? "Sending…" : "Send message"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
