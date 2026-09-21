import "server-only";

import { getStripe } from "@/lib/stripe";

let winbackCouponId: string | null = null;

export async function createWinbackCode(): Promise<string | null> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[discounts] STRIPE_SECRET_KEY is not set");
    return null;
  }

  try {
    const stripe = getStripe();
    let couponId = process.env.STRIPE_WINBACK_COUPON_ID?.trim() || winbackCouponId || undefined;
    if (!couponId) {
      const coupons = await stripe.coupons.list({ limit: 100 });
      const existing = coupons.data.find((coupon) => coupon.metadata?.botivo === "winback");
      couponId = existing?.id;
      if (!couponId) {
        const coupon = await stripe.coupons.create({
          percent_off: 10,
          duration: "once",
          name: "Come back 10%",
          metadata: { botivo: "winback" },
        });
        couponId = coupon.id;
      }
      winbackCouponId = couponId;
    }
    if (!couponId) throw new Error("Unable to resolve win-back coupon");

    const suffix = Array.from({ length: 6 }, () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    const promotionCode = await stripe.promotionCodes.create({
      promotion: { type: "coupon", coupon: couponId },
      code: `BACK-${suffix}`,
      max_redemptions: 1,
      expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      metadata: { source: "cancel" },
    });
    return promotionCode.code;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[discounts] ${message}`);
    return null;
  }
}
