# Phase 10: Analytics and monitoring

**Goal:** after launch, the founder can answer three questions without guessing: are people using it, is it broken, and what is it costing.

**Why before go-live:** the first days after launch carry the most signal and the most bugs. Without tracking, that signal is lost and errors are discovered from angry users.

## Step 10.1: Product analytics

Pick from `references/services.md` (Analytics). Default: PostHog (generous free tier, events, funnels, session replay, feature flags). Lighter options: Vercel Analytics or Plausible for page views only.

Track a small set of named events that map to the core journey in `product-framing.md`, for example:
- `signed_up`
- `core_feature_used` (the aha moment)
- `checkout_started`, `payment_succeeded`

Five to eight events is plenty for launch. Identify users by their Supabase user id after login, not by email, to keep personal data out of analytics.

Respect Phase 8: if analytics sets non-essential cookies and EU/UK users are in scope, wire it to cookie consent, or use a cookieless configuration.

**Verify:** trigger each event on the preview deploy and see it arrive in the analytics dashboard.

## Step 10.2: Error tracking

Default: Sentry (free tier). Use its Next.js setup wizard (`npx @sentry/wizard@latest -i nextjs`), which adds client, server, and edge configuration. Add `SENTRY_DSN` (and the auth token used for source map upload, as a build-time secret) to env.

Set an alert to email the founder on new issues.

**Verify:** throw a deliberate test error on a test route in the preview deploy; it appears in Sentry with a readable stack trace. Remove the test route.

## Step 10.3: AI cost and quality visibility

The `ai_usage` table from Phase 6 already records tokens and estimated cost. Add:
- A simple admin-only page or saved SQL query showing cost per day and per user.
- A daily cost threshold that sends the founder an email (a scheduled function or a Supabase cron job with `pg_cron` calling an edge function), in addition to the provider-side spend limit from Phase 5.
- Optional: an LLM observability tool (Langfuse, Helicone, or similar) if the product makes many chained calls and needs traces.

## Step 10.4: Uptime monitoring

A free external monitor (UptimeRobot, Better Stack, or similar) pinging the home page and a lightweight `/api/health` route every few minutes, alerting by email. The health route can check the database connection; it should not call the AI provider (that costs money on every ping).

**Verify:** the monitor shows the site up; pausing the health route (or pointing the monitor at a wrong path briefly) sends an alert.

## Pitfalls

- Tracking everything. Too many events and nobody reads the dashboard.
- Sending emails or prompt contents into analytics properties.
- Sentry source maps not uploaded, so production stack traces are unreadable minified code.
