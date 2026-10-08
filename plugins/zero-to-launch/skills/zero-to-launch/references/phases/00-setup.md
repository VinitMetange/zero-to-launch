# Phase 0: Setup and long-lead items

**Goal:** the user's machine is ready, a project folder exists with the launch checklist, and every slow external process is already running in the background.

**Why first:** some steps take hours or days through no fault of the user (DNS propagation, payment KYC, business verification). If these start at the end, the launch stalls for a week. Starting them now costs ten minutes.

## Step 0.1: Check local tools

Run these and report what is missing:

```bash
git --version
node --version      # want an active LTS release
npm --version
gh --version        # GitHub CLI
```

Install anything missing. Prefer the official installer for the user's OS (Homebrew on macOS, winget on Windows, the distro package manager or nvm on Linux). Node via `nvm` (or `fnm`) avoids permission problems later.

Optional CLIs, installed only when their phase arrives: `supabase`, `vercel`, `railway`, `stripe`.

**Verify:** every command above prints a version.

**Guided mode note:** explain that git tracks changes to code, GitHub stores it online, Node runs JavaScript tools, and the `gh` CLI lets you (Claude) create repos and PRs without the user clicking through GitHub.

## Step 0.2: GitHub authentication

```bash
gh auth status
```

If not logged in: `gh auth login`, choose GitHub.com, HTTPS, and authenticate with the browser. Also set git identity if unset:

```bash
git config --global user.name "Their Name"
git config --global user.email "their@email"
```

**Verify:** `gh auth status` shows the account as logged in.

## Step 0.3: Create the project folder and checklist

Ask for a short project name (lowercase, hyphens, it will become the repo name). Create the folder, then copy `assets/LAUNCH_CHECKLIST.template.md` to `<project>/LAUNCH_CHECKLIST.md` and fill in the intake answers (idea, mode, country, budget, timeline).

Create `docs/product/` inside it now, so Phase 1 and 2 documents land where the repo will later expect them.

**Verify:** the checklist exists and reflects the intake.

## Step 0.4: Decide and buy the domain (long lead)

Ask whether they already own a domain. If not:

1. Brainstorm 5 to 10 names with them if they have none. Short, spellable, says what it does or is memorable.
2. Check availability (they can search at the registrar; you can help shortlist).
3. Recommend a registrar from `references/services.md` (Domains). Default: Cloudflare Registrar (at-cost pricing, DNS included) if their TLD is supported, otherwise Namecheap or Porkbun.
4. They buy it. Remind them to turn on auto-renew and WHOIS privacy (usually free).

Why now: DNS changes later in Phase 7 propagate faster on a domain whose nameservers have already settled, and the domain is needed for custom email, transactional email, and payment provider activation.

If they are still validating the idea and do not want to spend money yet, it is fine to postpone this until Phase 1 says "go". Record the deferral.

**Verify:** `dig +short NS <domain>` returns the registrar's nameservers.

## Step 0.5: Start slow approvals (only those that apply)

Only kick off what this product will clearly need. Record each with its date in the checklist.

- **Payments KYC.** If the product will charge money and the user is in a country where the chosen provider requires business verification before live payments (Razorpay in India, Stripe in most countries), create the account now and start the identity and business steps. Note that live activation usually also requires a public website with privacy, terms, refund, and contact pages, so full approval will complete after Phase 8. Starting now gets document review moving.
- **Business mailbox.** If they want Google Workspace or Zoho Mail, they can sign up once the domain is bought; actual DNS records come in Phase 7.
- **Google OAuth branding.** If the product will offer "Sign in with Google", the consent screen with an app name and logo may need Google's review. Basic email and profile scopes are low friction, but creating the Google Cloud project early avoids surprises.

Do not start anything the user has not decided they need. Over-setup is its own form of confusion.

## Pitfalls

- Installing Node with `sudo npm` or a system package that is years old. Use nvm or fnm.
- Using a personal email for `git config` that they do not want public in commit history. GitHub offers a private noreply address under Settings, Emails.
- Buying a domain at a registrar that charges a low first year and a high renewal. Mention renewal price explicitly.
