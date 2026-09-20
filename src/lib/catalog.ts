import "server-only";

import type Stripe from "stripe";
import { PRODUCTS, type Plan, type Product, type ResolvedPlan, type ResolvedProduct } from "@/lib/products";
import { SITE } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

const priceCache = new Map<string, Promise<Stripe.Price>>();

function fallbackPlan(plan: Plan): ResolvedPlan {
  return {
    ...plan,
    priceCents: plan.fallbackCents,
    currency: SITE.currency,
    stripePriceId: null,
  };
}

function getCachedPrice(id: string): Promise<Stripe.Price> {
  const cached = priceCache.get(id);
  if (cached) return cached;

  const request = getStripe()
    .prices.retrieve(id)
    .then((price) => {
      if ("deleted" in price && price.deleted) {
        throw new Error("Stripe price was deleted");
      }
      if (price.unit_amount == null) {
        throw new Error("Stripe price has no unit amount");
      }
      return price;
    })
    .catch((error) => {
      priceCache.delete(id);
      throw error;
    });
  priceCache.set(id, request);
  return request;
}

async function resolvePlanPrice(plan: Plan): Promise<ResolvedPlan> {
  const stripePriceId = process.env[plan.priceEnv];
  if (!stripePriceId || !process.env.STRIPE_SECRET_KEY) {
    return fallbackPlan(plan);
  }

  try {
    const price = await getCachedPrice(stripePriceId);
    return {
      ...plan,
      priceCents: price.unit_amount as number,
      currency: price.currency,
      stripePriceId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[catalog] ${plan.priceEnv} ${message}`);
    return fallbackPlan(plan);
  }
}

function resolveProduct(product: Product, plans: ResolvedPlan[]): ResolvedProduct {
  return { ...product, plans };
}

export async function getCatalog(): Promise<ResolvedProduct[]> {
  return Promise.all(
    PRODUCTS.map(async (product) => {
      const plans = await Promise.all(product.plans.map(resolvePlanPrice));
      return resolveProduct(product, plans);
    }),
  );
}

export async function resolvePlan(
  productId: string,
  planId: string,
): Promise<{ product: Product; plan: ResolvedPlan } | undefined> {
  const product = PRODUCTS.find((item) => item.id === productId);
  const plan = product?.plans.find((item) => item.id === planId);
  if (!product || !plan) return undefined;
  return { product, plan: await resolvePlanPrice(plan) };
}
