# Zero to Launch

A Claude Code skill that takes a raw product idea all the way to a live, production AI product — one step at a time, in the right order.

Most people fail to launch not because any single step is hard, but because there are forty small steps, the order matters, and nobody tells them all exist. This skill removes that confusion.

---

## What it does

You describe your idea. Zero to Launch guides you and Claude Code through every phase in sequence — running commands itself where possible, giving exact dashboard steps where it cannot — and verifies each step actually worked before moving on.

It tracks your progress in a `LAUNCH_CHECKLIST.md` in your project folder. Start a new session any time and it picks up exactly where you left off.

---

## The phases

| # | Phase | What you end up with |
|---|---|---|
| 0 | Setup and long-lead items | Tools installed, project folder, domain bought, slow approvals started |
| 1 | Idea definition and validation | Idea brief + validation report with a go / pivot / stop call |
| 2 | Product docs | Product framing and scoped MVP spec |
| 3 | Repo and local environment | GitHub repo, local clone, docs committed |
| 4 | AI-first repo blueprint | Scaffolded app with `CLAUDE.md`, CI, and AI-first folder structure |
| 5 | Accounts and API keys | Every service account created in dependency order, `.env.local` verified |
| 6 | First build | Landing page, auth, core AI feature working locally, preview deploy live |
| 7 | Domain, DNS, and email | Custom domain on the app, mailbox on the domain, transactional email verified |
| 8 | Legal and trust pages | Privacy, terms, refund, and contact pages live |
| 9 | Payments | Checkout and webhooks tested, live mode activated |
| 10 | Analytics and monitoring | Product analytics, error tracking, AI spend alerts, uptime checks |
| 11 | Security hardening | RLS, secrets hygiene, rate limits, AI input/output controls |
| 12 | Production go-live | Production deploy passes the full go-live checklist |

Phases that do not apply to your product (for example, payments for a free tool) are recorded as skipped with a reason.

---

## What is included

```
SKILL.md                          the skill instruction set Claude reads
assets/
  LAUNCH_CHECKLIST.template.md    progress tracker copied into your project at intake
  repo-blueprint.md               AI-first repo structure and conventions
  CLAUDE.md.template              project memory file filled in Phase 4
  env.example                     master .env.example, uncommented phase by phase
  check-env.mjs                   verifies env vars exist without printing them
  doc-templates/
    idea-brief.md
    validation-report.md
    product-framing.md
    mvp-scope.md
references/
  services.md                     per-category service guide: defaults, alternatives, pick-this-if rules
  phases/
    00-setup.md ... 12-go-live.md  detailed steps, verifications, and pitfalls for each phase
```

---

## Default stack

The skill recommends a default service for each category. You can override any of them.

| Category | Default | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Largest ecosystem, first-class Vercel support |
| Hosting | Vercel | Zero-config, preview URLs, automatic HTTPS |
| Database and auth | Supabase | Postgres + auth + storage in one, generous free tier |
| AI provider | Anthropic or OpenAI | Strong models, SDKs, prepaid billing |
| Transactional email | Resend | Simple API, works as SMTP for Supabase auth emails |
| Payments (global) | Stripe | Checkout, subscriptions, customer portal |
| Payments (India) | Razorpay | UPI, cards, subscriptions |
| Analytics | PostHog | Events, funnels, session replay, free tier |
| Error tracking | Sentry | Next.js wizard, free tier |
| Rate limiting | Upstash Redis | Serverless-friendly, free tier |

Alternatives for every category are documented in `references/services.md` with "pick this if" rules.

---

## Who it is for

- **Indie founders** shipping a first or second AI product
- **Developers** who know how to code but keep stalling on the non-code parts (domains, email, payments, legal, monitoring)
- **Product builders** who have started before and want a structured way to close the gaps

It works in two modes: **guided** (explains every term, every click, checks in after each step) and **fast** (one-line instructions, batched steps, no hand-holding). The mode is set at intake and switches automatically based on your responses.

---

## Install in Claude Code

**Option 1 — Claude Code skill sync (recommended)**

In Claude Code settings, add this repository as a skill source. The skill installs as `/zero-to-launch`.

**Option 2 — Manual install**

```bash
# Clone or download this repo
git clone https://github.com/VinitMetange/zero-to-launch.git

# Copy the skill into your Claude Code skills directory
cp -r zero-to-launch ~/.claude/skills/zero-to-launch
```

Then in any Claude Code session:

```
/zero-to-launch
```

Claude will ask a few intake questions and start Phase 0.

---

## Resuming a launch

If `LAUNCH_CHECKLIST.md` already exists in your project, running `/zero-to-launch` reads it and resumes from where you stopped — no need to re-explain your idea or redo completed steps.

---

## Notes

- **Secrets:** the skill never asks you to paste API keys into chat. It asks you to put them in `.env.local` yourself and then verifies they are present without printing them.
- **Pricing and free tiers change.** When a decision depends on current pricing, the skill checks the provider's docs before advising rather than relying on potentially stale knowledge.
- **Service dashboards change.** If a click path described in a phase no longer matches what you see, say so and the skill will search for the current path rather than guessing.

---

## License

MIT
