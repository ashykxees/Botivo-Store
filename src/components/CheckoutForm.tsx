"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, CreditCard, Loader2, Lock, Minus, Plus, Tag } from "lucide-react";
import { formatPrice, type Product, type ResolvedPlan } from "@/lib/products";

type Coupon = {
  code: string;
  promotionCodeId: string;
  percentOff: number | null;
  amountOffCents: number | null;
  currency: string;
  minimumAmountCents: number | null;
};

type CheckoutFormProps = {
  product: Product;
  plan: ResolvedPlan;
  initialQuantity: number;
  initialCoupon: string;
};

type PaymentMethod = {
  id: string;
  title: string;
  description: string;
  icon: typeof CreditCard;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "stripe",
    title: "Card / Apple Pay / Google Pay",
    description: "Powered by Stripe",
    icon: CreditCard,
  },
];

export default function CheckoutForm({
  product,
  plan,
  initialQuantity,
  initialCoupon,
}: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [quantity, setQuantity] = useState(initialQuantity);
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = plan.currency.toUpperCase();
  const subtotalCents = plan.priceCents * quantity;
  const discountCents = coupon
    ? coupon.percentOff != null
      ? Math.round((subtotalCents * coupon.percentOff) / 100)
      : Math.min(coupon.amountOffCents ?? 0, subtotalCents)
    : 0;
  const totalCents = Math.max(0, subtotalCents - discountCents);

  function updateQuantity(next: number) {
    const nextQuantity = Math.min(product.maxQuantity, Math.max(1, next));
    setQuantity(nextQuantity);
    setCoupon(null);
    setCouponMessage(null);
  }

  async function applyCoupon() {
    const code = couponCode.trim();
    if (!code) {
      setCouponMessage({ text: "Enter a coupon code first", error: true });
      return;
    }

    setApplyingCoupon(true);
    setCouponMessage(null);
    try {
      const response = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          productId: product.id,
          planId: plan.id,
          quantity,
        }),
      });
      const data = (await response.json()) as Coupon & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to apply coupon");
      setCoupon(data);
      setCouponCode(data.code);
      setCouponMessage({
        text: `✓ ${data.code} — ${data.percentOff != null ? `${data.percentOff}% off` : `${formatPrice(data.amountOffCents ?? 0, data.currency.toUpperCase())} off`}`,
        error: false,
      });
    } catch (err) {
      setCoupon(null);
      setCouponMessage({ text: err instanceof Error ? err.message : "Unable to apply coupon", error: true });
    } finally {
      setApplyingCoupon(false);
    }
  }

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          planId: plan.id,
          quantity,
          email,
          discordUsername,
          ...(coupon ? { promotionCodeId: coupon.promotionCodeId } : {}),
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to start checkout");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout");
      setLoading(false);
    }
  }

  return (
    <section className="container-x pb-20 pt-10 sm:pt-14">
      <div className="mx-auto min-w-0 max-w-4xl">
        <div className="text-center">
          <div className="pill">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Complete your <span className="gradient-text">purchase</span>
          </h1>
          <p className="mt-3 text-sm text-muted">Instant automated delivery · Encrypted &amp; secure</p>
        </div>

        <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[1fr_1.08fr]">
          <div className="min-w-0 space-y-4">
            <div className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-4">
                <Image src="/logo.png" alt="" width={58} height={58} className="rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted">{plan.label}</p>
                </div>
                <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
                  <span className="pill !px-2.5 !py-1 text-[11px]">
                    {formatPrice(plan.priceCents, currency)} each
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> In stock
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="text-base font-bold">Order Summary</h2>
              <button
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-3 text-left text-sm font-medium transition-colors hover:border-brand/30"
              >
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand-3" /> Product Details
                </span>
                <ChevronDown className={`h-4 w-4 text-muted transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
              </button>
              {detailsOpen && (
                <ul className="mt-3 space-y-2 rounded-xl border border-white/[0.05] bg-black/10 px-3.5 py-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> {feature}
                    </li>
                  ))}
                </ul>
              )}
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotalCents, currency)}</dd>
                </div>
                {coupon && (
                  <div className="flex items-center justify-between text-emerald-300">
                    <dt>Discount</dt>
                    <dd>− {formatPrice(discountCents, currency)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="text-brand-3">{formatPrice(totalCents, currency)}</dd>
                </div>
              </dl>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-2">
              <Lock className="h-3 w-3" /> Secure checkout · All transactions encrypted
            </p>
          </div>

          <form onSubmit={submitCheckout} className="card min-w-0 p-5 sm:p-6">
            <h2 className="text-base font-bold">Complete your order</h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-muted">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-black/25 px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-brand"
                />
                <span className="mt-1.5 block text-[11px] text-muted-2">Order confirmation will be sent here</span>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-muted">Discord username</span>
                <input
                  type="text"
                  required
                  value={discordUsername}
                  onChange={(event) => setDiscordUsername(event.target.value)}
                  placeholder="username"
                  className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-black/25 px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-brand"
                />
                <span className="mt-1.5 block text-[11px] text-muted-2">Used for delivery</span>
              </label>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">Quantity</span>
                  <span className="text-[11px] text-muted-2">(Min: 1, Max: {product.maxQuantity})</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between rounded-xl border border-white/[0.1] bg-black/25 p-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQuantity(quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-muted">Coupon code <span className="text-muted-2">(optional)</span></span>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="DISCOUNT10"
                    className="min-w-0 flex-1 rounded-xl border border-white/[0.1] bg-black/25 px-3.5 py-3 text-sm uppercase outline-none transition-colors placeholder:normal-case placeholder:text-muted-2 focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={applyingCoupon}
                    className="btn-secondary !px-4"
                  >
                    {applyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </button>
                </div>
                {couponMessage && (
                  <p className={`mt-1.5 text-xs ${couponMessage.error ? "text-red-400" : "text-emerald-300"}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <span className="text-xs font-medium text-muted">Payment method</span>
              <div className="mt-2 space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const selected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                        selected ? "border-brand/60 bg-brand/10" : "border-white/[0.08] bg-black/20 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={selected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand-3">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{method.title}</span>
                        <span className="mt-0.5 block text-[11px] text-muted-2">{method.description}</span>
                      </span>
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected ? "border-brand bg-brand" : "border-white/20"}`}>
                        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Redirecting to Stripe…" : `Pay ${formatPrice(totalCents, currency)} →`}
            </button>
            {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
            <p className="mt-3 text-center text-[10px] text-muted-2">
              By confirming, you agree to the{" "}
              <Link href="/tos" className="text-brand-3 hover:underline">store terms</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
