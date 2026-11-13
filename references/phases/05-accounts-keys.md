# Phase 5: Accounts and API keys

**Goal:** every core service account exists, each key is in `.env.local`, and `npm run check:env` passes.

**Why this order:** each service below either depends on the one before it (Vercel signs in with GitHub; the app needs the database before auth works) or is needed by the first build in Phase 6. Services that need the custom domain (transactional email sending, mailbox) or live legal pages (payments) come later, on purpose. Creating accounts in this order means no step ever waits on a missing prerequisite.

Only set up services recorded in the checklist's Decisions table. The steps below use the defaults; for an alternative, follow the same pattern (account, project, key, env var, verify) using `references/services.md` and the provider's current docs.

## Step 5.0: Password manager and 2FA

Before creating accounts: make sure the user has a password manager (Bitwarden, 1Password, or their browser's built-in manager) and turns on two-factor authentication for every account below. Explain why plainly: these accounts hold the keys to the product and its billing; one leaked password can mean a deleted database or a huge AI bill.

Recommend signing up to developer services with "Continue with GitHub" where offered: one less password, and the accounts link naturally.

## Step 5.1: Create `.env.local`

```bash
cp .env.example .env.local
```

Explain: `.env.local` holds real secrets for local development and is gitignored. `.env.example` holds only the names, is committed, and documents what the app needs.

Tell the user the rule for the rest of the launch: paste keys into `.env.local` in their editor, not into chat.

## Step 5.2: Vercel (hosting)

1. Sign up at vercel.com with GitHub (Hobby plan is free; note that the Hobby plan is for non-commercial use, so a product that charges money should move to Pro before or at launch. Check current terms).
2. Install and link from the repo:
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   ```
   Accept creating a new project linked to the GitHub repo.
3. In the Vercel dashboard, confirm the project is connected to the GitHub repo (Settings, Git). From now on every push to `main` deploys to production and every other branch gets a preview URL.

**Verify:** `vercel ls` (or the dashboard) shows the project.

## Step 5.3: Supabase (database, auth, storage)

1. Sign up at supabase.com, create an organization, then a project.
2. **Region:** closest to most users (Mumbai for India-first, Frankfurt or London for Europe, a US region for North America). It cannot easily be changed later, so ask.
3. **Database password:** generate a strong one and store it in the password manager immediately. It is needed for direct database connections and is easy to lose.
4. Once the project is ready, open Project Settings, API keys (labels shift between dashboard versions; look for "API Keys" and "Data API"):
   - Project URL goes to `NEXT_PUBLIC_SUPABASE_URL`.
   - Publishable key (older projects call it the `anon` public key) goes to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Safe in the browser *only because* Row Level Security protects the data (Phase 11).
   - Secret key (older: `service_role`) goes to `SUPABASE_SECRET_KEY`. Bypasses all security. Server only, never prefixed `NEXT_PUBLIC_`.
5. Link the CLI for migrations:
   ```bash
   npx supabase login
   npx supabase init        # creates supabase/ if the blueprint did not
   npx supabase link --project-ref <project-ref>
   ```

**Guided mode note:** explain the difference between the two keys with an analogy: the publishable key is a visitor badge (rules decide where it can go), the secret key is the master key (opens every door, never leaves the building).

**Verify:** `npx supabase projects list` shows the project, and the env vars are filled.

## Step 5.4: AI provider (Anthropic and/or OpenAI)

For each provider chosen:

1. Sign up at the provider's developer console (console.anthropic.com for Claude, platform.openai.com for OpenAI). This is separate from a consumer chat subscription; explain that to first-timers, who often assume their chat plan includes API access.
2. Add billing (most providers are prepaid credits). Start small.
3. **Set a spend limit or budget alert now**, before the key exists. A bug in a loop can burn through credits in minutes.
4. Create an API key named for this project and environment (for example `myapp-dev`). Create a separate key for production later in Phase 12, so a leaked dev key never touches production.
5. Paste into `.env.local` as `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.

**Verify:** run a one-off minimal call through the project's AI wrapper (or a tiny script) that prints only success and token counts, not the key.

## Step 5.5: Resend (transactional email), account only

1. Sign up at resend.com.
2. Create an API key with "sending access" and paste it as `RESEND_API_KEY`.
3. Do not add the domain yet; that is Phase 7. Until then Resend can send only to the account owner's own address from its test sender, which is enough for local testing.

## Step 5.6: Railway (only if the Decisions table includes background jobs or a separate service)

Railway runs long-running processes Vercel functions cannot: queue workers, scheduled jobs, Python AI services, websockets. If the MVP does not need one, skip and record why.

1. Sign up with GitHub at railway.com.
2. `npm i -g @railway/cli`, `railway login`, then `railway init` in the service folder (or link an existing project).
3. Note that Railway services need their own copy of the env vars they use.

## Step 5.7: Site URL

Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` for now. It changes per environment and is used for auth redirects and email links.

## Step 5.8: Verify everything

```bash
npm run check:env
```

The script checks that every required variable is present, that nothing secret-looking is exposed through a `NEXT_PUBLIC_` prefix, and that `.gitignore` covers env files. It never prints values. Fix anything it flags, then commit (the commit will not include `.env.local`; confirm with `git status`).

Update the checklist: each account created, which keys exist, where spend limits are set.

## Pitfalls

- Putting the Supabase secret key in a `NEXT_PUBLIC_` variable. It ships to every visitor's browser. `check:env` catches this.
- Using one AI key for dev and prod. Separate them.
- Skipping the AI spend limit "for now".
- Forgetting that environment variables changed in `.env.local` need a dev server restart.
- Losing the Supabase database password. It can be reset, but connection strings elsewhere then break.
