import Link from "next/link";
import { ArrowLeft, CircleX, Gift } from "lucide-react";
import { SITE } from "@/lib/site";
import { createWinbackCode } from "@/lib/discounts";
import CopyButton from "@/components/CopyButton";
import DiscordIcon from "@/components/DiscordIcon";

export const dynamic = "force-dynamic";
export const metadata = { title: `Checkout cancelled | ${SITE.name}` };

export default async function CancelPage({ searchParams }: PageProps<"/cancel">) {
  const query = await searchParams;
  const product = Array.isArray(query.product) ? query.product[0] : query.product;
  const plan = Array.isArray(query.plan) ? query.plan[0] : query.plan;
  const qty = Array.isArray(query.qty) ? query.qty[0] : query.qty;
  const code = await createWinbackCode();
  const backHref =
    product && plan
      ? `/checkout/${encodeURIComponent(product)}/${encodeURIComponent(plan)}?qty=${encodeURIComponent(qty || "1")}${code ? `&coupon=${encodeURIComponent(code)}` : ""}`
      : "/#products";

  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full min-w-0 max-w-lg p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
          <CircleX className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight">Checkout cancelled</h1>
        <p className="mt-2 text-sm text-muted">No payment was taken. You can go back and try again whenever you&apos;re ready.</p>

        {code && (
          <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/10 p-4 text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-3">
              <Gift className="h-4 w-4" /> Here&apos;s 10% off if you come back
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <code className="rounded-lg border border-brand/25 bg-black/25 px-3 py-2 text-sm font-bold tracking-widest text-white">
                {code}
              </code>
              <CopyButton value={code} />
            </div>
            <p className="mt-2 text-[11px] text-muted-2">Single use · valid 7 days</p>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={backHref} className="btn-primary w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> {product && plan ? "Back to checkout" : "Back to products"}
          </Link>
          <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
            <DiscordIcon className="h-4 w-4" /> Need help?
          </a>
        </div>
      </div>
    </section>
  );
}
