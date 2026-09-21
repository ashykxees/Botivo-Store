import { NextResponse } from "next/server";
import { resolvePlan } from "@/lib/catalog";
import { formatPrice } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

type Body = {
  code?: string;
  productId?: string;
  planId?: string;
  quantity?: number;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const code = body.code?.trim();
  if (!code) return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });

  const resolved = await resolvePlan(body.productId ?? "", body.planId ?? "");
  if (!resolved) return NextResponse.json({ error: "Unknown product or plan" }, { status: 400 });

  const quantity = Math.min(resolved.product.maxQuantity, Math.max(1, Math.floor(Number(body.quantity) || 1)));
  const subtotalCents = resolved.plan.priceCents * quantity;

  try {
    const result = await getStripe().promotionCodes.list({
      code,
      active: true,
      limit: 1,
      expand: ["data.promotion.coupon"],
    });
    const promotionCode = result.data[0];
    if (!promotionCode) return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });

    const coupon = promotionCode.promotion.coupon;
    if (typeof coupon === "string" || !coupon || ("deleted" in coupon && coupon.deleted) || !coupon.valid) {
      return NextResponse.json({ error: "This coupon is no longer valid" }, { status: 400 });
    }

    const minimumAmountCents = promotionCode.restrictions?.minimum_amount ?? null;
    if (minimumAmountCents != null && minimumAmountCents > subtotalCents) {
      return NextResponse.json(
        {
          error: `Minimum order is ${formatPrice(minimumAmountCents, (coupon.currency ?? resolved.plan.currency).toUpperCase())}`,
        },
        { status: 400 },
      );
    }

    if (
      promotionCode.max_redemptions != null &&
      promotionCode.times_redeemed >= promotionCode.max_redemptions
    ) {
      return NextResponse.json({ error: "This coupon has reached its redemption limit" }, { status: 400 });
    }

    if (coupon.percent_off == null && coupon.amount_off == null) {
      return NextResponse.json({ error: "This coupon has no discount" }, { status: 400 });
    }

    return NextResponse.json({
      code: promotionCode.code,
      promotionCodeId: promotionCode.id,
      percentOff: coupon.percent_off,
      amountOffCents: coupon.amount_off,
      currency: (coupon.currency ?? resolved.plan.currency).toLowerCase(),
      minimumAmountCents,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe error";
    console.error("[coupon]", message);
    return NextResponse.json({ error: `Unable to validate coupon: ${message}` }, { status: 500 });
  }
}
