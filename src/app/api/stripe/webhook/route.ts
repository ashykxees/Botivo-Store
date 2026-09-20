import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { describeLineItems, describePaymentMethod, orderNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { findGuildMember, sendChannelEmbed } from "@/lib/discord";

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
    try {
      await notifyDiscord(event.data.object.id);
    } catch (err) {
      console.error("[webhook] order notification failed", err);
    }
  }

  return NextResponse.json({ received: true });
}

async function notifyDiscord(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent.payment_method"],
  });

  const currency = (session.currency ?? "usd").toUpperCase();
  const email = session.customer_details?.email ?? session.customer_email ?? "—";
  const discordUsername =
    session.custom_fields?.find((f) => f.key === "discord_username")?.text?.value ?? "";

  const pi = typeof session.payment_intent === "string" ? null : session.payment_intent;
  const pm = pi && typeof pi.payment_method !== "string" ? pi.payment_method : null;

  const membership = discordUsername ? await findGuildMember(discordUsername) : { status: "not_found" as const };
  const inServer =
    membership.status === "member"
      ? `✅ Yes — <@${membership.id}> (\`${membership.username}\`)`
      : membership.status === "not_found"
        ? `❌ No — \`${discordUsername || "no username given"}\``
        : `❔ Unknown — \`${discordUsername}\` (bot lookup unavailable)`;

  const total = session.amount_total != null ? formatPrice(session.amount_total, currency) : "—";

  await sendChannelEmbed({
    title: "🛒 New order",
    color: 0x1e90ff,
    fields: [
      { name: "Order #", value: `\`${orderNumber(session)}\``, inline: true },
      { name: "Email", value: email, inline: true },
      { name: "Total", value: total, inline: true },
      { name: "In Discord server?", value: inServer, inline: false },
      { name: "Payment method", value: describePaymentMethod(pm), inline: false },
      { name: "Product(s) purchased", value: describeLineItems(session.line_items?.data ?? [], currency), inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: `Botivo Store • Stripe session ${session.id}` },
  });
}
