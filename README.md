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
2. In Stripe Dashboard → Product catalog, create three Products (Nitro Tokens, Discord Nitro and Server Boosts), then create two **one-time** Prices for each product (1 month and 3 months; do not use recurring prices). Paste the six `price_...` IDs into the matching `STRIPE_PRICE_*` variables in `.env.local`. The site displays live Stripe amounts and refreshes them every 5 minutes. If a Price ID is not set, the matching `PRICE_*` fallback (in cents) is used.
3. Customers first complete a Botivo checkout page with their email, Discord username, quantity and optional coupon code. Promotion codes are validated against Stripe before checkout; codes created in the Dashboard or by the bot's `/generate-discount` command work in the coupon box. The form then redirects to Stripe Checkout and sends the buyer to `/success?session_id=…` or `/cancel` if they cancel.
4. Order notifications: add a webhook endpoint in Stripe pointing at `https://<your-domain>/api/stripe/webhook` for the `checkout.session.completed` event and put its signing secret in `STRIPE_WEBHOOK_SECRET`. Set `DISCORD_BOT_TOKEN` (the Botivo bot's token), `DISCORD_GUILD_ID` and `DISCORD_ORDER_CHANNEL_ID` (default `1551324617896099980`). For every paid order the bot posts an embed with the order #, email, whether the buyer's Discord username was found in the server, the Stripe payment method (e.g. `Visa •••• 4242`), and the line items purchased. The bot must be in the server with **View Channel** and **Send Messages** in the order channel.
5. If a customer cancels, the cancel page can create a single-use 10% win-back promotion code valid for 7 days. Set `STRIPE_WINBACK_COUPON_ID` to reuse an existing coupon; otherwise the app finds or creates a coupon named `Come back 10%`.

   Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## Environment variables

See [`.env.example`](.env.example). `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DISCORD_INVITE` and `NEXT_PUBLIC_SUPPORT_EMAIL` control links/branding shown on the site.

## Deploy

Any Next.js host works (Vercel is the simplest). On Railway/Render, use `npm run build` and `npm start` with the same env vars.
