import { jsonLdProps } from "@/lib/seo";

/** Renders one or more schema.org objects built with the helpers in @/lib/seo. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script {...jsonLdProps(data)} />;
}
