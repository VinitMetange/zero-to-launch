# Phase 12: Production go-live

**Goal:** the production deployment on the real domain uses production keys, and a stranger can complete the whole journey: arrive, sign up, get value, pay, and receive every email.

**Why a formal checklist:** the last mile is where small configuration differences between preview and production hide (a missing env var, a test key left in place, the auth Site URL still pointing at localhost). Walking a checklist once, slowly, catches them before users do.

## Step 12.1: Production configuration

1. **Plans:** confirm each service's plan fits commercial use and expected load (for example Vercel Hobby is non-commercial; Supabase free projects can pause after inactivity). Check current terms with web search and upgrade what is needed. Record costs in the checklist.
2. **Production keys:**
   - New AI provider key named for production, with its own spend limit.
   - Live payment keys and live webhook secret (Phase 9.6).
   - Same Supabase project is fine for an MVP; a separate production project is cleaner if the user has been testing heavily with fake data. Decide together.
3. **Vercel Production environment variables:** add every variable from `.env.example` for Production, with production values. `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`.
4. **Railway** (if used): production env vars set, service healthy.
5. **Supabase Auth URL Configuration:** Site URL to `https://yourdomain.com`; Redirect URLs include the production domain.
6. **OAuth providers** (if used): production domain added to authorized origins and redirect URIs in the provider console.
7. **Webhooks:** live endpoints point at the production domain.

## Step 12.2: Polish that affects trust and sharing

- Page title, meta description, favicon, and an Open Graph image (how the link looks when shared).
- `robots.txt` and `sitemap.xml` (Next.js can generate both).
- A friendly 404 page and an error page.
- Mobile check of the landing page, sign-up, and the core feature.

## Step 12.3: Deploy

Merge to `main` (or `vercel --prod`). Watch the build logs for missing-variable warnings. Compare the Production variable names in Vercel (`vercel env ls production`, names only) against `.env.example` so nothing is missing.

## Step 12.4: Go-live test (as a stranger)

In a private browser window, on mobile and desktop, walk the full journey on `https://yourdomain.com` and tick each:

- [ ] Landing page loads fast over HTTPS, no console errors.
- [ ] Footer links to Privacy, Terms, Refunds, Contact work.
- [ ] Sign up with a fresh email address; confirmation email arrives from the product's own domain, lands in inbox, link returns to the production domain.
- [ ] Log in, log out, password reset email works.
- [ ] Core AI feature works; a row appears in `ai_usage`.
- [ ] Rate limit and logged-out rejection still hold in production.
- [ ] Real payment with a real card or UPI for the smallest amount; webhook updates access; receipt email arrives. Then refund it from the dashboard and confirm the app handles the refund or cancellation.
- [ ] Analytics events arrive in the dashboard.
- [ ] A test error appears in Sentry (then remove the trigger).
- [ ] Uptime monitor points at production and shows up.
- [ ] Email to hello@yourdomain.com reaches the founder.

Anything failing goes back to its phase. Do not wave items through.

## Step 12.5: Rollback plan

Show the user how to roll back: Vercel dashboard, Deployments, pick the previous good deployment, "Instant Rollback" (or "Promote to Production"). Database migrations do not roll back automatically, so migrations after launch should be additive (add columns, do not drop them) until the user is comfortable.

Add this to `docs/runbooks/rollback.md`.

## Step 12.6: Launch summary

Mark the checklist complete and give the user:
- The live URL.
- Services in use, the plan for each, and current monthly cost (checked).
- The first-week watch list: error rate in Sentry, daily AI cost, sign-ups and the aha-moment event, payment failures.
- Where each dashboard is, and that `docs/runbooks/` holds key rotation and rollback.
- Optional next steps: a launch post plan, where the target users gather (from the validation report), and collecting first-user feedback.

## Pitfalls

- Production env vars added but the deployment not rebuilt.
- Test payment keys still in Production.
- Supabase Site URL still `localhost`, so confirmation links break for real users.
- Testing only while logged in as the founder's admin account; always test as a brand-new user.
