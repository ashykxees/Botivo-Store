import type Stripe from "stripe";
import { formatPrice } from "@/lib/products";

export function orderNumber(session: Stripe.Checkout.Session): string {
  const pi = session.payment_intent;
  const id = typeof pi === "string" ? pi : pi?.id;
  const source = (id ?? session.id).replace(/^(pi|cs_live|cs_test)_/, "");
  return source.slice(-10).toUpperCase();
}

export function describePaymentMethod(pm: Stripe.PaymentMethod | null | undefined): string {
  if (!pm) return "—";
  switch (pm.type) {
    case "card": {
      const brand = pm.card?.brand ? pm.card.brand.replace(/^\w/, (c) => c.toUpperCase()) : "Card";
      const wallet = pm.card?.wallet?.type ? ` (${pm.card.wallet.type.replace(/_/g, " ")})` : "";
      return `${brand} •••• ${pm.card?.last4 ?? "????"}${wallet}`;
    }
    case "link":
      return `Link (${pm.link?.email ?? "—"})`;
    case "paypal":
      return `PayPal (${pm.paypal?.payer_email ?? "—"})`;
    case "cashapp":
      return `Cash App (${pm.cashapp?.cashtag ?? "—"})`;
    default:
      return pm.type.replace(/_/g, " ");
  }
}

export function describeLineItems(items: Stripe.LineItem[], currency: string): string {
  if (!items.length) return "—";
  return items
    .map((li) => {
      const total = li.amount_total != null ? ` — ${formatPrice(li.amount_total, currency)}` : "";
      return `• ${li.quantity ?? 1}× ${li.description ?? "Item"}${total}`;
    })
    .join("\n");
}
