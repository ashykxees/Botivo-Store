export type PlanId = "1m" | "3m";
export type ProductId = "nitro-tokens" | "discord-nitro" | "server-boosts";

export type Plan = {
  id: PlanId;
  label: string;
  fallbackCents: number;
  priceEnv: string;
  badge?: string;
};

export type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  unit: string;
  features: string[];
  plans: Plan[];
  maxQuantity: number;
};

export type ResolvedPlan = Plan & {
  priceCents: number;
  currency: string;
  stripePriceId: string | null;
};

export type ResolvedProduct = Omit<Product, "plans"> & {
  plans: ResolvedPlan[];
};

function envPrice(key: string, fallbackCents: number): number {
  const raw = process.env[key];
  if (!raw) return fallbackCents;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : fallbackCents;
}

export const PRODUCTS: Product[] = [
  {
    id: "nitro-tokens",
    name: "Nitro Tokens",
    tagline: "Fresh accounts, Nitro pre-applied",
    description:
      "Full-access Discord accounts with Nitro already active. Delivered as email:password:token, ready to use.",
    unit: "token",
    features: ["Nitro active on delivery", "Full email access", "Instant delivery", "Replacement warranty"],
    plans: [
      {
        id: "1m",
        label: "1 Month",
        fallbackCents: envPrice("PRICE_NITRO_TOKENS_1M", 249),
        priceEnv: "STRIPE_PRICE_NITRO_TOKENS_1M",
      },
      {
        id: "3m",
        label: "3 Months",
        fallbackCents: envPrice("PRICE_NITRO_TOKENS_3M", 599),
        priceEnv: "STRIPE_PRICE_NITRO_TOKENS_3M",
        badge: "Best value",
      },
    ],
    maxQuantity: 50,
  },
  {
    id: "discord-nitro",
    name: "Discord Nitro",
    tagline: "Applied directly to your account",
    description:
      "Genuine Discord Nitro delivered as a gift link or applied straight to your account. All perks, HD streaming, custom emojis and 2 boosts included.",
    unit: "subscription",
    features: ["Gift link or direct apply", "2 free server boosts", "No login required", "Replacement warranty"],
    plans: [
      {
        id: "1m",
        label: "1 Month",
        fallbackCents: envPrice("PRICE_DISCORD_NITRO_1M", 599),
        priceEnv: "STRIPE_PRICE_DISCORD_NITRO_1M",
      },
      {
        id: "3m",
        label: "3 Months",
        fallbackCents: envPrice("PRICE_DISCORD_NITRO_3M", 1499),
        priceEnv: "STRIPE_PRICE_DISCORD_NITRO_3M",
        badge: "Popular",
      },
    ],
    maxQuantity: 10,
  },
  {
    id: "server-boosts",
    name: "Server Boosts",
    tagline: "Level up your server instantly",
    description:
      "Server boosts applied to any server you own or moderate. Hit Level 1, 2 or 3 in minutes and unlock banners, more emoji slots and better audio.",
    unit: "boost",
    features: ["Applied within minutes", "Works on any server", "14 boosts = Level 3", "Replacement warranty"],
    plans: [
      {
        id: "1m",
        label: "1 Month",
        fallbackCents: envPrice("PRICE_SERVER_BOOSTS_1M", 349),
        priceEnv: "STRIPE_PRICE_SERVER_BOOSTS_1M",
      },
      {
        id: "3m",
        label: "3 Months",
        fallbackCents: envPrice("PRICE_SERVER_BOOSTS_3M", 899),
        priceEnv: "STRIPE_PRICE_SERVER_BOOSTS_3M",
        badge: "Best value",
      },
    ],
    maxQuantity: 14,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getPlan(product: Product, planId: string): Plan | undefined {
  return product.plans.find((p) => p.id === planId);
}

export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
