export const SITE = {
  name: "Botivo",
  tagline: "Online Store",
  description:
    "Buy Discord Nitro, Nitro tokens and server boosts at the best price. Instant delivery, secure Stripe checkout, replacement warranty.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  discordInvite: process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/hgVYqZHxCS",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@botivo.store",
  currency: (process.env.STORE_CURRENCY || "usd").toLowerCase(),
};
