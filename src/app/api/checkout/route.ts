import { NextResponse } from "next/server";
import { getPlan, getProduct } from "@/lib/products";
import { SITE } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

type Body = { productId?: string; planId?: string; quantity?: number };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = getProduct(body.productId ?? "");
  const plan = product ? getPlan(product, body.planId ?? "") : undefined;
  if (!product || !plan) {
    return NextResponse.json({ error: "Unknown product or plan" }, { status: 400 });
  }

  const quantity = Math.min(product.maxQuantity, Math.max(1, Math.floor(Number(body.quantity) || 1)));
  const origin = req.headers.get("origin") || SITE.url;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          adjustable_quantity: { enabled: true, minimum: 1, maximum: product.maxQuantity },
          price_data: {
            currency: SITE.currency,
            unit_amount: plan.priceCents,
            product_data: {
              name: `${product.name} — ${plan.label}`,
              description: product.tagline,
              images: [`${SITE.url}/logo.png`],
              metadata: { productId: product.id, planId: plan.id },
            },
          },
        },
      ],
      metadata: { productId: product.id, planId: plan.id, productName: product.name, planLabel: plan.label },
      custom_fields: [
        {
          key: "discord_username",
          label: { type: "custom", custom: "Discord username (for delivery)" },
          type: "text",
          optional: false,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[checkout]", message);
    const status = message.includes("STRIPE_SECRET_KEY") ? 503 : 500;
    return NextResponse.json({ error: status === 503 ? "Checkout is not configured yet" : "Unable to start checkout" }, { status });
  }
}
