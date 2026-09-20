import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/products";
import { getStripe } from "@/lib/stripe";
import { orderNumber } from "@/lib/orders";
import DiscordIcon from "@/components/DiscordIcon";

export const metadata = { title: `Order confirmed | ${SITE.name}` };

type Order = { id: string; product: string; total: string; email: string | null; discord: string | null } | null;

async function loadOrder(sessionId: string | undefined): Promise<Order> {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const s = await getStripe().checkout.sessions.retrieve(sessionId);
    const meta = s.metadata ?? {};
    return {
      id: orderNumber(s),
      product: `${meta.productName ?? "Order"} — ${meta.planLabel ?? ""}`.trim(),
      total: s.amount_total != null ? formatPrice(s.amount_total, (s.currency ?? "usd").toUpperCase()) : "—",
      email: s.customer_details?.email ?? null,
      discord: s.custom_fields?.find((f) => f.key === "discord_username")?.text?.value ?? null,
    };
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: PageProps<"/success">) {
  const { session_id } = await searchParams;
  const order = await loadOrder(typeof session_id === "string" ? session_id : undefined);

  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-lg p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <CircleCheck className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight">Payment successful</h1>
        <p className="mt-2 text-sm text-muted">
          Thanks for shopping with {SITE.name}. Your order is being processed — join our Discord and open a{" "}
          <strong className="text-white">Claim Order</strong> ticket with your order ID if you need anything.
        </p>

        {order && (
          <dl className="mt-6 space-y-2 rounded-xl border border-white/[0.06] bg-black/20 p-4 text-left text-sm">
            <Row k="Order #" v={<code className="break-all text-xs">{order.id}</code>} />
            <Row k="Product" v={order.product} />
            <Row k="Total" v={order.total} />
            {order.discord && <Row k="Discord" v={order.discord} />}
            {order.email && <Row k="Receipt sent to" v={order.email} />}
          </dl>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={SITE.discordInvite} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <DiscordIcon className="h-4 w-4" /> Open Discord
          </a>
          <Link href="/" className="btn-secondary">
            Back to store <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
