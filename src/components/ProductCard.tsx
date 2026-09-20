"use client";

import { useState } from "react";
import { Check, Gem, Loader2, Minus, Plus, Rocket, ShoppingCart, Ticket, type LucideIcon } from "lucide-react";
import { formatPrice, type PlanId, type ResolvedProduct } from "@/lib/products";

const ICONS: Record<ResolvedProduct["id"], LucideIcon> = {
  "nitro-tokens": Ticket,
  "discord-nitro": Rocket,
  "server-boosts": Gem,
};

export default function ProductCard({ product }: { product: ResolvedProduct }) {
  const [planId, setPlanId] = useState<PlanId>(product.plans[0].id);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const total = plan.priceCents * qty;
  const Icon = ICONS[product.id];

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, planId, quantity: qty }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="card card-hover flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
          <Icon className="h-6 w-6" />
        </div>
        <span className="pill">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> In stock
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold">{product.name}</h3>
      <p className="mt-1 text-sm text-brand-3">{product.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.06] bg-black/20 p-1">
        {product.plans.map((p) => {
          const active = p.id === planId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanId(p.id)}
              className={`relative rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                active ? "bg-brand text-white shadow-[0_8px_20px_-8px_rgba(30,144,255,0.8)]" : "text-muted hover:text-white"
              }`}
            >
              {p.label}
              {p.badge && (
                <span
                  className={`absolute -top-2 right-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                    active ? "bg-white text-brand" : "bg-brand/20 text-brand-3"
                  }`}
                >
                  {p.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ul className="mt-5 space-y-2">
        {product.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted">
            <Check className="h-4 w-4 shrink-0 text-brand" /> {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between border-t border-white/[0.06] pt-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-2">Total</div>
          <div className="text-3xl font-black">{formatPrice(total, plan.currency.toUpperCase())}</div>
          <div className="text-xs text-muted">
            {formatPrice(plan.priceCents, plan.currency.toUpperCase())} / {product.unit}
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/20 p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(product.maxQuantity, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button type="button" onClick={buy} disabled={loading} className="btn-primary mt-4 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
        {loading ? "Redirecting to Stripe…" : "Buy now"}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
