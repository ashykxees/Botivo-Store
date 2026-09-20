import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/products";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await notifyDiscord(session);
  }

  return NextResponse.json({ received: true });
}

async function notifyDiscord(session: Stripe.Checkout.Session) {
  const url = process.env.DISCORD_ORDER_WEBHOOK_URL;
  if (!url) return;

  const discordUser = session.custom_fields?.find((f) => f.key === "discord_username")?.text?.value ?? "—";
  const meta = session.metadata ?? {};
  const amount = session.amount_total != null ? formatPrice(session.amount_total, (session.currency ?? "usd").toUpperCase()) : "—";

  const embed = {
    title: "🛒 New order",
    color: 0x1e90ff,
    fields: [
      { name: "Product", value: `${meta.productName ?? meta.productId ?? "—"} — ${meta.planLabel ?? meta.planId ?? "—"}`, inline: true },
      { name: "Total", value: amount, inline: true },
      { name: "Discord", value: discordUser, inline: true },
      { name: "Email", value: session.customer_details?.email ?? "—", inline: true },
      { name: "Session", value: `\`${session.id}\``, inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "Botivo Store • Stripe" },
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (err) {
    console.error("[webhook] discord notify failed", err);
  }
}
