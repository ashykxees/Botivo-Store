import { notFound } from "next/navigation";
import { resolvePlan } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import CheckoutForm from "@/components/CheckoutForm";
import { minQuantityFor } from "@/lib/products";

export const metadata = { title: `Secure Checkout | ${SITE.name}` };

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps<"/checkout/[productId]/[planId]">) {
  const { productId, planId } = await params;
  const query = await searchParams;
  const resolved = await resolvePlan(productId, planId);
  if (!resolved) notFound();

  const quantityParam = Array.isArray(query.qty) ? query.qty[0] : query.qty;
  const minQuantity = minQuantityFor(resolved.plan.priceCents);
  const quantity = Math.min(
    resolved.product.maxQuantity,
    Math.max(minQuantity, Math.floor(Number(quantityParam) || 1)),
  );
  const coupon = Array.isArray(query.coupon) ? query.coupon[0] : query.coupon;

  return (
    <CheckoutForm
      product={resolved.product}
      plan={resolved.plan}
      initialQuantity={quantity}
      initialCoupon={coupon ?? ""}
    />
  );
}
