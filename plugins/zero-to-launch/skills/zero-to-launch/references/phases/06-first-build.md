# Phase 6: First build

**Goal:** a working vertical slice running locally and on a Vercel preview URL: landing page, sign up and log in, the core AI feature for a logged-in user, with usage logged.

**Why a vertical slice first:** it proves every service talks to every other service (browser, hosting, auth, database, AI) before any feature work piles on top. Problems found now are configuration problems, cheap to fix. Found later, they hide inside feature bugs.

Build from `docs/product/mvp-scope.md` and follow `CLAUDE.md` conventions. Work in small commits on a branch (`git switch -c first-build`).

## Step 6.1: Landing page

A single page with: headline (from the positioning line), a short explanation of the problem and outcome, a primary call to action (Sign up, or Join waitlist if pre-launch), and a footer with placeholder links for Privacy, Terms, and Contact (filled in Phase 8). Keep it simple and fast; design polish can come later. Use the `frontend-design` skill if available for a distinctive look.

## Step 6.2: Database schema

Write the first migration from the data model sketch in the MVP scope:

```bash
npx supabase migration new init
```

Include:
- The core tables, each with `user_id uuid references auth.users` where rows belong to a user.
- **Row Level Security enabled on every table, with policies, in this same migration.** A table without RLS is readable by anyone holding the publishable key, which is every visitor. Doing it now is a habit; Phase 11 audits it.
- An `ai_usage` table (user, feature, model, input tokens, output tokens, estimated cost, created_at). This is how the user will know what the product costs to run.

Apply it: `npx supabase db push`. Generate types if using TypeScript: `npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts`.

**Verify:** tables visible in the Supabase dashboard Table Editor, each showing RLS enabled.

## Step 6.3: Authentication

For Next.js with Supabase, use the `@supabase/ssr` package (check the current Supabase Next.js guide for exact helper code, since it changes between versions):

- Browser and server Supabase clients in `src/lib/supabase/`.
- Middleware that refreshes the session on each request.
- Sign up, log in, log out, and an auth callback route.
- A protected area (for example `/app`) that redirects logged-out users to `/login`.

Start with email and password or magic link. Add "Sign in with Google" only if the MVP scope lists it (it needs a Google Cloud OAuth client, with redirect URI set to the Supabase callback URL shown in the Supabase Google provider settings).

In Supabase, Authentication, URL Configuration:
- **Site URL:** `http://localhost:3000` for now (production URL in Phase 12).
- **Redirect URLs:** add `http://localhost:3000/**` and the Vercel preview pattern (`https://*-<vercel-team-slug>.vercel.app/**`).

Explain why: Supabase refuses to redirect a user back to any URL not on this list, which is the most common reason login "works locally but not on the deployed site".

Note for the user: Supabase's built-in email sender is heavily rate limited and meant for testing only. Confirmation emails may be slow or stop after a few. Phase 7 replaces it with Resend via custom SMTP.

**Verify:** sign up a test user locally, confirm, log in, reach the protected page, log out. Check the user exists in Authentication, Users.

## Step 6.4: Core AI feature

Implement the one AI feature from the MVP scope:

- The model call goes through `src/lib/ai/client.ts` (the wrapper), never directly from a route or component. The wrapper picks the model, applies timeouts and retries, and writes a row to `ai_usage`.
- The prompt lives in `src/lib/ai/prompts/` as its own file, with a version note.
- The call runs on the server (a route handler or server action), never in the browser, because the API key must stay server-side.
- Check the user is authenticated before calling the model.
- Stream the response if the output is longer than a sentence or two; it feels far faster.
- Handle failures visibly: a friendly error and a retry, not a blank screen.

Add two or three example inputs to `evals/` with what a good output looks like. This becomes the regression check when the prompt changes.

**Verify:** a logged-in test user uses the feature end to end; a row appears in `ai_usage`.

## Step 6.5: First preview deploy

1. Add the environment variables to Vercel for **Preview** and **Development** environments (Production comes in Phase 12 with production keys). Use the dashboard (Settings, Environment Variables) or `vercel env add <NAME> preview`. Do not paste values into chat.
2. Push the branch: `git push -u origin first-build`.
3. Vercel builds a preview and comments the URL on the commit. Get it with `vercel ls` or `gh pr create` then view checks.
4. Repeat the end-to-end test on the preview URL.

**Verify:** sign up, log in, and the AI feature all work on the preview URL. Then open a PR and merge to `main` once CI passes.

## Pitfalls

- "Invalid redirect URL" or login looping on preview: the preview domain is missing from Supabase Redirect URLs.
- Env vars added to Vercel after the deploy: redeploy, because values are baked in at build time for `NEXT_PUBLIC_` variables.
- Calling the AI provider from a client component. The key leaks and anyone can spend the user's credits.
- Vercel function timeouts on long AI calls: stream the response, or move long work to a background job (Railway, or a queue) if it routinely exceeds the plan's limit.
- Tables created through the dashboard instead of migrations: they will not exist in a fresh environment. Keep schema in `supabase/migrations/`.
