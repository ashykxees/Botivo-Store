# Botivo Store

Next.js storefront for Botivo — Nitro Tokens, Discord Nitro and Server Boosts, each with a 1-month or 3-month plan. Payments go through Stripe Checkout.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in STRIPE_SECRET_KEY at minimum
npm run dev
```

Open <http://localhost:3000>.

## Stripe setup

1. Grab your secret key from <https://dashboard.stripe.com/apikeys> → `STRIPE_SECRET_KEY`.
2. Checkout sessions are created on the fly (`/api/checkout`) with `price_data`, so you don't need to create Products/Prices in the Dashboard. Prices live in `src/lib/products.ts` and can be overridden with the `PRICE_*` env vars (in cents).
3. Checkout asks the buyer for their **Discord username** (required custom field) and their email, then redirects to `/success?session_id=…` or `/cancel`.
4. Order notifications: add a webhook endpoint in Stripe pointing at `https://<your-domain>/api/stripe/webhook` for the `checkout.session.completed` event and put its signing secret in `STRIPE_WEBHOOK_SECRET`. Set `DISCORD_BOT_TOKEN` (the Botivo bot's token), `DISCORD_GUILD_ID` and `DISCORD_ORDER_CHANNEL_ID` (default `1551324617896099980`). For every paid order the bot posts an embed with the order #, email, whether the buyer's Discord username was found in the server, the Stripe payment method (e.g. `Visa •••• 4242`), and the line items purchased. The bot must be in the server with **View Channel** and **Send Messages** in the order channel.

   Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## Environment variables

See [`.env.example`](.env.example). `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DISCORD_INVITE` and `NEXT_PUBLIC_SUPPORT_EMAIL` control links/branding shown on the site.

## Deploy

Any Next.js host works (Vercel is the simplest). On Railway/Render, use `npm run build` and `npm start` with the same env vars.
