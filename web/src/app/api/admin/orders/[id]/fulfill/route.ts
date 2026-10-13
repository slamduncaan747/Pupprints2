import { adminApiGuard } from "@/components/admin/guard";
import { submitOrderToFulfillment } from "@/lib/fulfillment";
import { getOrder, isUuid } from "@/lib/orders";
import { preparePrintFiles, signPrintFiles } from "@/lib/print-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Admin: approve an order and send it to the print partner (behind proxy.ts + re-checked here).
 * With FULFILLMENT_PROVIDER=manual this returns `manual_fulfillment` and the print files below.
 */
export async function POST(_req: Request, ctx: RouteContext<"/api/admin/orders/[id]/fulfill">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ ok: false, error: "invalid_order_id" }, 400);

  const result = await submitOrderToFulfillment(id);
  if (result.ok) return json(result);
  if (result.error === "manual_fulfillment") {
    const files = await printFileLinks(id).catch(() => []);
    return json({ ...result, message: "Manual fulfillment: download the print files and order them by hand.", files });
  }
  const status = result.error === "order_not_found" ? 404 : result.error?.startsWith("order_is_") ? 409 : 502;
  return json(result, status);
}

/** Admin: signed (7-day) links to an order's print + digital files. `?rebuild=1` regenerates them. */
export async function GET(req: Request, ctx: RouteContext<"/api/admin/orders/[id]/fulfill">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ ok: false, error: "invalid_order_id" }, 400);
  const rebuild = new URL(req.url).searchParams.get("rebuild") === "1";
  try {
    if (rebuild) await preparePrintFiles(id, { force: true });
    return json({ ok: true, files: await printFileLinks(id) });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
}

async function printFileLinks(orderId: string) {
  let order = await getOrder(orderId);
  if (!order) throw new Error("order_not_found");
  if (!order.print_files) {
    await preparePrintFiles(orderId);
    order = await getOrder(orderId);
  }
  const files = order?.print_files;
  if (!order || !files) return [];
  const urls = await signPrintFiles(files);
  return [
    ...files.items.map((f) => ({
      kind: "print",
      item: f.index + 1,
      label: order.items[f.index]?.label ?? f.variantId,
      variantId: f.variantId,
      frameColor: f.frameColor,
      size: `${f.width}×${f.height}px @ ${f.dpi}dpi${f.wrapIn ? ` (incl. ${f.wrapIn}″ mirrored wrap)` : ""}`,
      url: urls.get(f.path) ?? null,
    })),
    ...files.digital.map((d) => ({
      kind: "digital",
      generationId: d.generationId,
      size: `${d.width}×${d.height}px`,
      url: urls.get(d.path) ?? null,
    })),
  ];
}
