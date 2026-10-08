# Launch Checklist: <Product Name>

This file tracks the journey from idea to production. Claude reads it at the start of every session to resume where you left off. Keep it in the repo.

## Profile

- Idea: <one or two sentences>
- Mode: <guided | fast>
- Country: <founder country> | Main market: <customers' country/region>
- Budget stance: <free tiers only | small monthly spend OK>
- Target launch: <date or "none">
- Started: <date>

## Decisions

| Category | Choice | Reason | Date |
|---|---|---|---|
| App framework | | | |
| Hosting | | | |
| Database and auth | | | |
| AI provider(s) | | | |
| Background jobs | | | |
| Domain and registrar | | | |
| DNS host | | | |
| Mailbox | | | |
| Transactional email | | | |
| Payments | | | |
| Analytics | | | |
| Error tracking | | | |
| Uptime monitoring | | | |
| Rate limiting | | | |

## Waiting on (external)

Long-running items outside your control. Check these at the start of each session.

| Item | Started | Status | Next check |
|---|---|---|---|

## Progress

Mark `[x]` done (verified), `[-]` skipped (with reason), `[ ]` pending.

### Phase 0: Setup and long-lead items
- [ ] Local tools installed (git, node, npm, gh)
- [ ] GitHub CLI authenticated, git identity set
- [ ] Project folder and this checklist created
- [ ] Domain bought (or deferred until validation)
- [ ] Slow approvals started (payments KYC, mailbox, OAuth) as applicable

### Phase 1: Idea definition and validation
- [ ] Validation depth chosen (light | rigorous)
- [ ] docs/product/idea-brief.md
- [ ] docs/product/validation-report.md
- [ ] Decision: go | pivot | stop

### Phase 2: Product docs
- [ ] docs/product/product-framing.md
- [ ] docs/product/mvp-scope.md
- [ ] Core stack decisions recorded above

### Phase 3: Repo and local environment
- [ ] Git repo initialised with .gitignore covering env files
- [ ] GitHub repo created and pushed
- [ ] Secret scanning push protection (if available)

### Phase 4: AI-first repo blueprint
- [ ] App scaffolded (template or generated)
- [ ] Blueprint folders and stubs created
- [ ] CLAUDE.md written
- [ ] scripts/check-env.mjs and .env.example in place
- [ ] CI workflow passing

### Phase 5: Accounts and API keys
- [ ] Password manager and 2FA confirmed
- [ ] Vercel account and project linked
- [ ] Supabase project created (region: ___), DB password stored
- [ ] AI provider account, spend limit set, dev key created
- [ ] Resend account and API key
- [ ] Railway (only if needed)
- [ ] `npm run check:env` passes

### Phase 6: First build
- [ ] Landing page
- [ ] First migration with RLS and ai_usage table
- [ ] Auth working locally (sign up, confirm, log in, log out)
- [ ] Core AI feature working, usage logged
- [ ] Preview deploy works end to end

### Phase 7: Domain, DNS, and email
- [ ] Domain points at Vercel, HTTPS valid
- [ ] Mailbox on domain receives and sends
- [ ] Resend sending subdomain verified
- [ ] DMARC record added
- [ ] Supabase auth email via Resend SMTP

### Phase 8: Legal and trust pages
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Refund / cancellation policy (if charging)
- [ ] Contact page
- [ ] Linked in footer and sign-up

### Phase 9: Payments
- [ ] Provider chosen and account active
- [ ] Products and prices (test mode)
- [ ] Checkout and webhook verified in test mode
- [ ] Customer self-service (cancel, invoices)
- [ ] Live mode activated, live webhook created

### Phase 10: Analytics and monitoring
- [ ] Product analytics events arriving
- [ ] Error tracking with alerts
- [ ] AI cost view and daily alert
- [ ] Uptime monitor

### Phase 11: Security hardening
- [ ] RLS on every table, cross-user test passed
- [ ] No secrets in git history; rotation runbook written
- [ ] AI routes: auth, rate limits, quotas, input limits
- [ ] Prompt injection and output handling reviewed
- [ ] Auth settings reviewed
- [ ] Headers, dependencies, webhook signatures
- [ ] Backup decision recorded

### Phase 12: Production go-live
- [ ] Plans fit commercial use; costs recorded
- [ ] Production keys and env vars set
- [ ] Supabase Site URL and redirects set to production
- [ ] SEO and sharing basics
- [ ] Go-live test passed as a new user
- [ ] Rollback runbook written
- [ ] LIVE: <url> on <date>

## Session log

Short notes, newest first. One line per session is enough.

- <date>: <what was done, what is next>
