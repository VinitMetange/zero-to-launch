# Zero to Launch

A Claude Code plugin that takes you from a raw product idea to a live, production AI product, one step at a time, in the right order.

Most people do not get stuck on any single hard step. They get stuck because there are forty small ones (repo, env files, database, auth, API keys, domain, DNS, custom email, transactional email, legal pages, payments, monitoring, security), the order matters, and nobody tells you which ones exist. Zero to Launch removes that confusion. It explains why each step comes where it does, runs what it can for you, walks you click by click through the dashboard steps it cannot, and verifies each step before moving on.

## What it covers

| Phase | You end with |
|---|---|
| 0. Setup and long-lead items | Tools installed, domain bought, slow approvals (payments KYC, mailbox) already running |
| 1. Idea and validation | Idea brief, competitor scan, a clear go / pivot / stop call |
| 2. Product docs | Product framing and a tight MVP scope |
| 3. Repo | GitHub repo with your docs, secrets protected from the first commit |
| 4. AI-first blueprint | Scaffolded app with a structure built for prompts, model costs, and evals, plus CLAUDE.md and CI |
| 5. Accounts and keys | Hosting, database, AI provider, email, all keys in place and checked |
| 6. First build | Landing page, sign up and log in, your core AI feature, a working preview deploy |
| 7. Domain and email | App on your domain, hello@yourdomain mailbox, app emails that land in inboxes |
| 8. Legal and trust | Privacy, terms, refund, and contact pages |
| 9. Payments | Checkout and webhooks, tested, then live |
| 10. Analytics and monitoring | Usage analytics, error alerts, AI cost tracking, uptime checks |
| 11. Security | Database access rules, secret hygiene, rate limits, AI spend caps |
| 12. Go-live | Production deploy that passes a full new-user test |

The default stack is Next.js, Vercel, Supabase, Resend, and Anthropic or OpenAI, with Railway when background jobs are needed. Every category has documented alternatives, and the guide picks region-appropriate defaults (for example Razorpay and India's DPDP Act for founders in India, Stripe and GDPR elsewhere).

It adapts to you: **guided mode** explains every term and click for first-time builders, **fast mode** gives experienced developers one line per step.

## Requirements

- [Claude Code](https://code.claude.com/docs/en/setup), signed in with a paid Claude plan or an Anthropic Console account. New to the terminal? Start with [docs/getting-started.md](docs/getting-started.md).
- A computer running macOS, Windows, or Linux.
- Expect to spend some money along the way: a domain (yearly), AI API credits (prepaid, small to start), and possibly paid plans for hosting or email once you charge customers. The guide flags each cost before you commit to it.

## Install

In your terminal:

```bash
claude plugin marketplace add vinitmetange/zero-to-launch
claude plugin install zero-to-launch@vinitmetange
```

Or, inside a Claude Code session:

```
/plugin marketplace add vinitmetange/zero-to-launch
/plugin install zero-to-launch@vinitmetange
```

To update later: `claude plugin marketplace update vinitmetange`.

## Use

1. Create an empty folder for your project and open a terminal in it.
2. Run `claude`.
3. Start with either:
   - `/zero-to-launch:zero-to-launch`, or
   - plain words, for example: *"I have an idea for an AI tool that helps physiotherapy clinics write patient exercise plans. Help me take it from zero to launch."*
4. Answer five short questions (your idea, experience level, country, budget, timeline) and follow along.

The guide creates a `LAUNCH_CHECKLIST.md` in your project. That file holds your progress and every decision you made, so a launch can span many sessions. To pick up where you left off, open Claude Code in the same folder and say *"let's continue"*.

Already partway there? Start the same way and say what you have. The guide audits completed phases quickly instead of redoing them.

## How it handles your keys

- You paste API keys into `.env.local` in your editor, not into chat.
- `.env` files are excluded from git from the very first commit.
- A bundled `check-env` script confirms every key is present without ever printing values, and flags secrets accidentally exposed to the browser.
- Spend limits on AI providers are set before the first key is created.

## Not legal, tax, or financial advice

The guide helps you draft privacy policies and terms, and points out where tax registration may apply. Have a professional review them for your situation, especially before significant revenue or if you handle sensitive data.

## Repository layout

```
.claude-plugin/marketplace.json        marketplace listing
plugins/zero-to-launch/
  .claude-plugin/plugin.json           plugin manifest
  skills/zero-to-launch/
    SKILL.md                           the guide's orchestrator
    references/phases/                 one detailed guide per phase
    references/services.md             service defaults, alternatives, and when to pick each
    assets/                            checklist, doc templates, repo blueprint, env template, env checker
docs/getting-started.md                step zero for people new to the terminal
```

## Feedback and contributions

Service dashboards and pricing change often. If a step is out of date, please open an issue with the phase number and what you saw.

## License

MIT. See [LICENSE](LICENSE).
