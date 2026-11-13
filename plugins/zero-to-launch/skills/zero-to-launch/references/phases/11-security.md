# Phase 11: Security hardening

**Goal:** the common, costly mistakes are closed before real users arrive: open database tables, leaked keys, unlimited AI spend, and abusable endpoints.

**Why now:** these issues are invisible until someone finds them, and in AI products the cost of abuse is immediate (someone scripts your AI endpoint and spends your credits overnight). Each check below is quick; skipping them is how launches become incidents.

Work through each item, run its check, and record the result in the checklist.

## 11.1: Database access (Row Level Security)

Run this against the linked project (via `npx supabase db` tooling or the SQL editor) to list tables without RLS:

```sql
select schemaname, tablename
from pg_tables
where schemaname = 'public' and rowsecurity = false;
```

It should return nothing. For each table, review the policies: users read and write only their own rows; tables only the server writes (subscriptions, ai_usage) have no insert/update policies for normal users.

Also open Supabase's Security Advisor (Advisors in the dashboard) and resolve what it flags.

If Supabase Storage is used, check bucket policies the same way: private buckets unless files are meant to be public.

**Verify:** log in as test user A, try to read user B's rows through the publishable key (a quick script or the browser console with the Supabase client). It must return nothing.

## 11.2: Secrets hygiene

- `npm run check:env` passes.
- No secrets in git history. Install gitleaks (Homebrew, a release binary, or its GitHub Action) and run `gitleaks git .` from the repo root (older versions use `gitleaks detect`). If anything real is found, **rotate the key at the provider**; rewriting history alone is not enough because the key may already be copied.
- Secret scanning push protection on GitHub is enabled if the plan allows (Phase 3).
- Production keys exist only in Vercel Production env (and Railway, if used), never in local files.
- Write `docs/runbooks/rotate-keys.md`: for each service, where to create a new key, where to update it, and how to revoke the old one. Writing this calmly now beats figuring it out during a leak.

## 11.3: AI endpoint abuse and cost controls

- Every AI route requires an authenticated user.
- **Rate limit** per user and per IP (for example with Upstash Ratelimit, or a counter in the database). Start with limits generous for real use and impossible for scripts.
- **Per-user quotas** tied to plan (free tier gets N uses per day), enforced server-side by checking `ai_usage` or a counter before calling the model.
- **Input limits:** cap input length before sending to the model; reject oversized requests.
- **Provider spend limit** confirmed (Phase 5) and **daily cost alert** working (Phase 10).

**Verify:** call the AI route rapidly from a script as a logged-in test user; it gets rate limited. Call it logged out; it is rejected.

## 11.4: Prompt injection and output handling

Explain in plain words: users (or content the AI reads, like web pages or uploaded files) can contain instructions that try to hijack the model. Defences that matter for an MVP:

- Treat model output as untrusted user input: never render it as raw HTML, never execute it, never put it into SQL directly.
- If the AI can take actions (tools, sending email, writing to the database), keep those actions scoped to the current user's data and require confirmation for anything destructive or external.
- Keep secrets and other users' data out of prompts entirely; assume anything in the prompt can be revealed.

## 11.5: Auth settings

In Supabase Authentication settings:
- Email confirmation required for sign-up.
- Minimum password length reasonable (at least 8; longer is better), and leaked-password protection if the plan offers it.
- Auth rate limits set (Phase 7).
- Site URL and Redirect URLs list only real domains (remove stale preview URLs that are no longer needed, keep the wildcard pattern only if intended).

## 11.6: App and dependency basics

- Security headers: add sensible defaults in `next.config` (for example `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `X-Frame-Options` or a frame-ancestors CSP).
- `npm audit` reviewed; enable Dependabot alerts and security updates on the repo.
- Webhook and cron routes verify signatures or a shared secret.

## 11.7: Backups

Check what the Supabase plan includes for backups (free plans are limited; verify current terms). If data loss would hurt, either upgrade before launch or schedule a regular `supabase db dump` to private storage. Record the decision.

## Pitfalls

- Testing RLS with the secret key, which bypasses RLS, and concluding everything is fine.
- Rate limiting in memory on serverless functions (each instance has its own memory, so limits do not hold). Use a shared store.
- Leaving a test or debug route in production.
