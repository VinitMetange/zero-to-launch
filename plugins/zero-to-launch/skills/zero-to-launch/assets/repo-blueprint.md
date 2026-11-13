# AI-first repo blueprint

## Template repository

TEMPLATE_REPO_URL: (none configured)

To use a maintained template, replace "(none configured)" above with a public GitHub URL. The skill will offer it in Phase 4 and fall back to generating from the spec below if it is unreachable or the user declines.

## Why this structure

AI products have four things ordinary web apps do not, and each gets a fixed home:

1. **Prompts change often** and need history: they live in files, not inline strings.
2. **Every model call costs money**: all calls go through one wrapper that logs usage.
3. **Output quality must be checked**: an `evals/` folder holds examples and expected behaviour.
4. **Providers get swapped**: only the wrapper knows which provider is in use.

Plus `CLAUDE.md` and `docs/` so every Claude Code session starts with the same understanding of the product.

## Structure (Next.js default)

```
<project>/
├── CLAUDE.md                      # project map for Claude Code (from CLAUDE.md.template)
├── LAUNCH_CHECKLIST.md            # launch progress and decisions
├── README.md                      # what it is, how to run it
├── .env.example                   # every env var name, no values (committed)
├── .env.local                     # real local secrets (gitignored)
├── .github/
│   └── workflows/ci.yml           # lint, typecheck, build on push and PR
├── docs/
│   ├── product/                   # idea-brief, validation-report, product-framing, mvp-scope
│   ├── architecture/
│   │   ├── overview.md            # components, data flow, services used
│   │   └── decisions/             # short ADRs: 0001-use-supabase.md, ...
│   ├── ai/
│   │   └── model-choices.md       # which model for which task, and why, with cost notes
│   └── runbooks/                  # rotate-keys.md, rollback.md
├── evals/
│   ├── cases/                     # example inputs with expected qualities, one file per feature
│   └── run.ts                     # runs cases through the wrapper, prints pass/fail
├── scripts/
│   └── check-env.mjs              # env presence and exposure check
├── supabase/
│   ├── config.toml
│   ├── migrations/                # all schema changes, RLS included
│   └── seed.sql
└── src/
    ├── app/
    │   ├── (marketing)/           # landing, pricing, privacy, terms, refunds, contact
    │   ├── (auth)/                # login, signup, callback, reset
    │   ├── (app)/                 # logged-in product pages
    │   └── api/
    │       ├── ai/                # AI route handlers (server only)
    │       ├── webhooks/          # payments and other signed webhooks
    │       └── health/            # uptime check (no AI calls)
    ├── components/
    ├── lib/
    │   ├── ai/
    │   │   ├── client.ts          # THE wrapper: provider, model, timeout, retry, usage logging
    │   │   ├── prompts/           # one file per prompt, with version and change note
    │   │   ├── tools/             # tool definitions if the AI can act
    │   │   ├── guardrails.ts      # input limits, output checks, quota enforcement
    │   │   └── usage.ts           # writes ai_usage rows, cost estimate per model
    │   ├── supabase/
    │   │   ├── client.ts          # browser client (publishable key)
    │   │   ├── server.ts          # server client (cookies, user session)
    │   │   ├── admin.ts           # secret-key client, server only, used sparingly
    │   │   └── database.types.ts  # generated
    │   ├── email/                 # Resend client and templates
    │   ├── payments/              # provider client, checkout, webhook handlers
    │   ├── analytics/             # event names and helpers
    │   └── env.ts                 # typed, validated env access (fails fast if missing)
    └── middleware.ts              # session refresh, route protection (exclude webhooks)
```

Create only what the MVP uses. For services not chosen (payments for a free MVP, for example), skip their folders and note them as "later" in `docs/architecture/overview.md`.

## Conventions to put in CLAUDE.md

- All model calls go through `src/lib/ai/client.ts`. Never import a provider SDK elsewhere.
- Prompts live in `src/lib/ai/prompts/`. Changing a prompt means bumping its version note and running `evals/run.ts`.
- AI calls run on the server only, require an authenticated user, and respect quotas in `guardrails.ts`.
- Every schema change is a migration in `supabase/migrations/` with RLS policies in the same file.
- `src/lib/supabase/admin.ts` (secret key) is used only in webhooks, cron, and admin tasks.
- Env access goes through `src/lib/env.ts`; new variables are added to `.env.example` in the same commit.
- Significant technical choices get a short ADR in `docs/architecture/decisions/`.

## Adapting to other stacks

- **SvelteKit / Nuxt:** same `lib/` layout under their source folder; routes follow the framework's conventions.
- **Python AI service on Railway:** add `services/<name>/` with its own `pyproject.toml`, the same `ai/` split (client wrapper, prompts, usage), and a Dockerfile or Railway config. The Next.js app calls it over HTTPS with a shared secret.
