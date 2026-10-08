# Services decision guide

Read only the category you need. For each: what it is for in plain words, the default, alternatives with "pick this if" rules, and the env vars it adds.

How to use: recommend the default. Mention an alternative only when one of its "pick this if" rules matches the user. Record the final choice in the checklist's Decisions table. Pricing and free tiers change often; verify with web search before telling the user something is free or what it costs.

## Contents

1. App framework
2. Hosting (web app)
3. Database and auth
4. AI model providers
5. Background jobs and long-running services
6. Domain registrar
7. DNS host
8. Mailbox on the domain
9. Transactional email
10. Payments
11. Product analytics
12. Error tracking
13. Uptime monitoring
14. Rate limiting store
15. LLM observability (optional)

---

## 1. App framework

**For:** the code structure of the website and app.

- **Default: Next.js (App Router, TypeScript).** Largest ecosystem, first-class on Vercel, works well with Supabase and every AI SDK, and Claude Code is very fluent in it.
- **SvelteKit / Nuxt:** pick if the user already knows Svelte or Vue well.
- **Python backend (FastAPI) + separate frontend:** pick if the AI logic depends on Python-only libraries (heavy data science, local models). Usually: Next.js frontend on Vercel, FastAPI service on Railway.
- **No-code (Lovable, Bolt, etc.) export:** pick if the user started there; import the code into the repo in Phase 4 and continue from the blueprint.

## 2. Hosting (web app)

**For:** running the website and server code on the internet, with automatic deploys from GitHub.

- **Default: Vercel.** Zero-config for Next.js, preview URL per branch, automatic HTTPS. Hobby plan is non-commercial; plan on Pro for a paid product.
- **Netlify:** pick if the user already uses it or prefers its pricing.
- **Cloudflare Pages/Workers:** pick if cost at scale or edge performance matters and the user is comfortable with some Next.js compatibility work.
- **Railway / Render (full app):** pick if the app is a long-running server rather than serverless, or the backend is Python.

Env vars: none by default (Vercel injects its own).

## 3. Database and auth

**For:** storing users' data, and handling sign-up, login, sessions, and password resets.

- **Default: Supabase.** Postgres database, auth, file storage, and row-level security in one service; generous free tier; migrations via CLI.
- **Neon (database) + Clerk or Auth.js (auth):** pick if the user wants polished prebuilt auth UI (Clerk) or prefers separate best-of-breed pieces. More services to wire, more keys.
- **Firebase:** pick if the user already knows it or the product is mobile-first and wants its realtime features. Not Postgres.

Env vars (Supabase): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (legacy name: anon key), `SUPABASE_SECRET_KEY` (legacy name: service_role key).

## 4. AI model providers

**For:** the model that powers the AI feature.

- **Default: Anthropic (Claude)** or **OpenAI**, whichever the user prefers or has credits with. Both have strong models, SDKs, and prepaid billing.
- **Both, behind the wrapper:** pick if the user wants fallback or to compare quality. The blueprint's `src/lib/ai/client.ts` makes this a configuration change.
- **Google (Gemini):** pick if the product needs very long context at low cost or tight Google integration.
- **OpenRouter:** pick if the user wants one key for many models during experimentation.
- **Open models (via Together, Groq, Fireworks, or self-hosted):** pick for cost-sensitive, high-volume, or data-residency needs.

Pick the model tier by task: a smaller, cheaper model for classification, extraction, and short replies; a frontier model for reasoning and generation where quality is the product. Look up current model names and prices; they change frequently.

Env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc.

## 5. Background jobs and long-running services

**For:** work that takes longer than a web request should, runs on a schedule, or must keep running (queues, scheduled reports, agents that work for minutes, websockets).

Skip unless the MVP needs it. Many MVPs do not.

- **Default when needed: Railway.** Runs any long-lived process or container, simple GitHub deploys, cron schedules, Postgres/Redis add-ons.
- **Inngest or Trigger.dev:** pick if the jobs are TypeScript functions triggered by app events and the user wants retries and step workflows without running a server.
- **Supabase Edge Functions + pg_cron:** pick for small scheduled tasks close to the database.
- **Render / Fly.io:** pick if the user prefers them or needs specific regions.

Env vars: depend on service; Railway services need their own copy of required app env vars.

## 6. Domain registrar

**For:** owning the domain name.

- **Default: Cloudflare Registrar.** Sells at cost (no renewal markup), includes DNS. Not every TLD is supported; check.
- **Namecheap / Porkbun:** pick if the TLD is not on Cloudflare, or the user prefers them. Check renewal prices, not just first-year.
- **Local registrars (for country TLDs like .in):** pick when required for the TLD.

## 7. DNS host

**For:** where the domain's records live.

- **Default: wherever the domain was bought** (Cloudflare if bought there).
- **Cloudflare DNS (free):** pick if the registrar's DNS editor is clumsy or slow. Keep records for Vercel as DNS only, not proxied.

## 8. Mailbox on the domain

**For:** the founder's human email address on the domain (hello@, founder@).

- **Default for solo founders on a budget: forwarding** (Cloudflare Email Routing, or ImprovMX). Free; mail arrives in their existing inbox. Sending "as" the domain needs an extra SMTP alias setup.
- **Google Workspace:** pick if the user wants a real Gmail inbox, calendar, and Drive on the domain, and is fine paying per user.
- **Zoho Mail:** pick for a lower-cost full mailbox; check its current free plan availability in the user's region.

## 9. Transactional email

**For:** emails the app sends automatically (sign-up confirmation, password reset, receipts, notifications).

- **Default: Resend.** Simple API, good Next.js and React Email support, works as SMTP for Supabase auth emails.
- **Postmark:** pick if deliverability of transactional mail is critical and the user wants its strict transactional focus.
- **Amazon SES:** pick at high volume where cost matters and the user can handle more setup.
- **Loops / similar:** pick if marketing and lifecycle emails matter as much as transactional ones.

Env vars: `RESEND_API_KEY`, `EMAIL_FROM` (for example `Product <noreply@mail.yourdomain.com>`).

## 10. Payments

**For:** charging customers and knowing who has paid.

Decide by founder's country and customers' location. Verify current availability with web search.

- **Default (most countries): Stripe.** Checkout, subscriptions, customer portal, tax tools.
- **Default (India-based founder, Indian customers): Razorpay.** UPI, cards, netbanking, subscriptions. Stripe's India onboarding has been restricted; check before suggesting it.
- **Merchant of record (Lemon Squeezy, Paddle, Polar):** pick if selling software internationally and the founder does not want to handle global VAT/GST/sales tax registration. Higher fees, much less tax work.
- **Cashfree / PayU:** pick as Indian alternatives if Razorpay activation stalls.

Env vars (Stripe): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (only if using client-side Stripe elements). Razorpay: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (key id may be public, secret never).

## 11. Product analytics

**For:** knowing what users do: sign-ups, feature use, drop-off.

- **Default: PostHog.** Events, funnels, session replay, feature flags; generous free tier; EU hosting available.
- **Vercel Analytics / Plausible:** pick if only page views and traffic sources are needed and privacy simplicity matters (cookieless).
- **Google Analytics:** pick only if the user needs it for marketing integrations; it typically requires cookie consent in the EU/UK.

Env vars (PostHog): `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (public by design).

## 12. Error tracking

**For:** being told when something breaks, with the details needed to fix it.

- **Default: Sentry.** Next.js wizard, free tier, alerts.
- **Highlight / Better Stack / PostHog error tracking:** pick if the user wants fewer tools and their analytics tool already covers it adequately.

Env vars: `SENTRY_DSN` (public by design), `SENTRY_AUTH_TOKEN` (build-time secret for source maps).

## 13. Uptime monitoring

**For:** an alert when the site is down.

- **Default: UptimeRobot or Better Stack free tier.** Ping home page and `/api/health` every few minutes, email alerts.

## 14. Rate limiting store

**For:** limiting how often a user or IP can hit expensive endpoints, consistently across serverless instances.

- **Default: Upstash Redis with `@upstash/ratelimit`.** Serverless-friendly, free tier.
- **Database counter in Supabase:** pick to avoid another service when traffic is modest.

Env vars (Upstash): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## 15. LLM observability (optional)

**For:** tracing multi-step AI calls, comparing prompt versions, debugging bad outputs.

Skip for a single-call MVP; the `ai_usage` table is enough.

- **Langfuse:** open source, self-hostable or cloud.
- **Helicone:** proxy-based, quick to add.
- **Braintrust / LangSmith:** stronger eval workflows.
