# Phase 9: Payments

**Goal:** users can pay, the app reliably knows who has paid, and this works first in test mode and then in live mode.

**Skip if** the MVP is free or uses a waitlist. Record the skip.

**Why it is the riskiest integration:** money moving and access being granted must agree, even when a browser closes mid-checkout or a webhook arrives twice. The pattern below (provider-hosted checkout, webhooks as the source of truth) is what makes that reliable.

## Step 9.1: Choose the provider

Read `references/services.md` (Payments). The choice depends mostly on the founder's country and where customers are:

- **Stripe:** default where the founder can open an account. Hosted Checkout, subscriptions, customer portal, excellent docs.
- **Razorpay:** default for founders in India charging Indian customers (UPI, cards, netbanking). Stripe's onboarding for India-based businesses has been restricted; verify current status before recommending it to an Indian founder.
- **Merchant of record (Lemon Squeezy, Paddle, Polar):** they sell on the founder's behalf and handle global sales tax/VAT. Higher fees, far less tax work. Good for a solo founder selling software internationally.

Check current availability in the user's country with web search before deciding. Record the choice, and the pricing model (one-time, subscription, credits/usage).

## Step 9.2: Model prices

Create products and prices in the provider dashboard **in test mode**. Keep tiers to one or two for launch. Add a `subscriptions` (or `purchases`) table via migration: user_id, provider customer id, provider subscription or payment id, plan, status, current period end. RLS: users can read their own row; only the server writes.

## Step 9.3: Checkout flow

1. Server route creates a checkout session (or order, for Razorpay) for the logged-in user, attaching the user id as metadata. Never take the price from the browser; look it up server-side.
2. Redirect the user to the provider's hosted checkout (or open its checkout widget).
3. On return, show a "processing" or success page, but **do not grant access based on the redirect**. The redirect can be faked or skipped.

## Step 9.4: Webhooks (source of truth)

1. Create `/api/webhooks/<provider>`.
2. Verify the webhook signature using the webhook signing secret (`STRIPE_WEBHOOK_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, etc.). Reject anything unsigned.
3. Handle the events that change access (for Stripe typically `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`; for Razorpay the payment captured and subscription events). Update the `subscriptions` table with the secret Supabase key server-side.
4. Make handling idempotent: the same event may arrive more than once. Upsert by provider id; store processed event ids if needed.
5. Return 2xx quickly.

Local testing:
- Stripe: `stripe login`, then `stripe listen --forward-to localhost:3000/api/webhooks/stripe`, which prints a local signing secret for `.env.local`. Trigger events with `stripe trigger checkout.session.completed` or by completing a test checkout.
- Providers without a CLI forwarder: test against the Vercel preview URL, or a temporary tunnel (`cloudflared tunnel --url http://localhost:3000`).

**Verify (test mode):** complete a checkout with the provider's test card or test UPI; the webhook fires, the `subscriptions` row updates, and the app unlocks the paid feature. Cancel or fail a payment and confirm access is removed or never granted.

## Step 9.5: Customer self-service

For subscriptions, link to the provider's customer portal (Stripe Billing Portal) or build a minimal page to cancel and view invoices. Users who cannot cancel easily file chargebacks.

## Step 9.6: Activate live mode

1. Complete account activation (KYC started in Phase 0): business details, bank account, website review. The legal pages from Phase 8 must be live.
2. Recreate products and prices in live mode (test and live are separate).
3. Create the live webhook endpoint pointing at `https://yourdomain.com/api/webhooks/<provider>` and get its live signing secret.
4. Live keys go into Vercel **Production** env only, in Phase 12. Never in `.env.local`.

**Verify (live):** done in Phase 12 with a real small payment, then refunded.

## Taxes

Mention, do not advise: depending on country and revenue, the founder may need to register for and charge GST/VAT/sales tax. Merchant-of-record providers handle this for them; Stripe Tax and similar tools help otherwise. Recommend a short consult with an accountant before meaningful revenue.

## Pitfalls

- Granting access on the success redirect instead of the webhook.
- Mixing test and live keys or webhook secrets.
- Webhook route protected by auth middleware, so the provider gets a redirect to /login. Exclude the webhook path from auth middleware.
- Body parsing that alters the raw request body before signature verification. Read the raw body for verification.
