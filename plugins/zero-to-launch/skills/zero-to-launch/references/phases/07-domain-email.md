# Phase 7: Domain, DNS, and email

**Goal:** the app is reachable on the custom domain over HTTPS, the founder has a mailbox on the domain (hello@ or their name@), and the app sends email (auth confirmations, welcome, receipts) from the domain without landing in spam.

**Why this order:** the domain must point at the app before email records are added, so the user can test each piece separately. The mailbox comes before transactional email because both write DNS records on the same domain and it is easier to reason about one at a time. Supabase auth email moves to Resend last, because it depends on the Resend domain being verified.

**Guided mode note:** explain DNS once, simply: DNS is the internet's address book. Each record says "for this name, go here". A records point to a server address, CNAME records point to another name, MX records say where email for the domain is delivered, TXT records hold text that services read to verify ownership or email rules. Changes can take minutes to a few hours to spread ("propagate").

## Step 7.1: Decide where DNS is managed

DNS lives wherever the domain's nameservers point, usually the registrar. Options:
- **Keep it at the registrar:** simplest; fine for most.
- **Cloudflare DNS:** free, fast propagation, good dashboard. If the domain was bought on Cloudflare, it is already there.

If using Cloudflare with Vercel, set the records for the app to **DNS only** (grey cloud), not proxied. Proxying in front of Vercel causes redirect loops and certificate problems and is not needed.

Record where DNS lives in the checklist; every later step adds records there.

## Step 7.2: Point the domain at the app

1. Vercel project, Settings, Domains: add `yourdomain.com` and `www.yourdomain.com`. Choose one as primary and let Vercel redirect the other to it.
2. Vercel shows the exact records to add (an A record for the apex, a CNAME for `www`). Copy them from the dashboard, since the values can be project-specific.
3. Add them at the DNS host.

**Verify:**
```bash
dig +short yourdomain.com
dig +short www.yourdomain.com
```
match the Vercel values, Vercel shows the domain as "Valid Configuration", and `https://yourdomain.com` loads the app with a valid certificate (Vercel issues it automatically).

Then update the Supabase Redirect URLs to include `https://yourdomain.com/**` (Site URL switches in Phase 12).

## Step 7.3: Mailbox on the domain

Pick from `references/services.md` (Mailbox):
- **Forwarding only, free:** Cloudflare Email Routing or ImprovMX forwards hello@yourdomain.com to the founder's existing inbox. Good start for a solo founder. Replying "as" the domain needs extra setup (an SMTP "send as" alias), so explain the trade-off.
- **Full mailbox:** Google Workspace or Zoho Mail. Paid (Zoho has a limited free tier in some regions; check current terms). Gives a real inbox and calendar on the domain.

Follow the provider's setup wizard; it asks for MX records and an SPF TXT record at the root domain, plus a DKIM record. Add them exactly.

**Critical rule:** a hostname may have only **one** SPF record (`v=spf1 ...`). If one already exists, merge includes into it (for example `v=spf1 include:_spf.google.com include:other.example ~all`) rather than adding a second record. Two SPF records break email silently.

**Verify:** send an email from an outside account to hello@yourdomain.com and receive it; if full mailbox, send one out and check it arrives in the recipient's inbox, not spam. The provider's admin console should show DKIM authenticated.

## Step 7.4: Transactional email domain (Resend)

Use a **subdomain** for app email, such as `mail.yourdomain.com` or `updates.yourdomain.com`. Why: app email (confirmations, notifications) and human email (founder's mailbox) then have separate sending reputations, and the subdomain's records never collide with the mailbox's MX and SPF at the root.

1. Resend dashboard, Domains, Add domain: enter the subdomain. Choose the region nearest the users if offered.
2. Resend lists DNS records (DKIM TXT, plus an MX and SPF TXT for bounce handling on the sending subdomain). Add each exactly as shown.
3. Click verify in Resend. It can take a few minutes to a few hours.

**Verify:** Resend shows the domain as Verified. Then send a test from the app (or a short script using the Resend SDK) from `noreply@mail.yourdomain.com` to the founder, and check it lands in the inbox. Optionally check the score at a deliverability tester such as mail-tester.com.

## Step 7.5: DMARC

Add a TXT record at `_dmarc.yourdomain.com`:

```
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

Explain: DMARC tells receiving mail servers what to do with mail that fails SPF and DKIM checks, and sends reports. `p=none` means "just report" while things settle; after a few weeks of clean reports, move to `p=quarantine`. Large inbox providers increasingly expect a DMARC record from anyone sending app email. Make sure the `rua` address actually receives mail (forwarding is fine), or use a free DMARC report service.

## Step 7.6: Supabase auth email through Resend

Supabase, Authentication, Emails (or Settings, SMTP), enable custom SMTP:

- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: a Resend API key (create a dedicated one, for example `supabase-smtp`)
- Sender email: `noreply@mail.yourdomain.com`
- Sender name: the product name

Then raise the auth email rate limit in Supabase (Authentication, Rate Limits) to something sensible for launch, and customize the email templates (confirm signup, magic link, reset password) with the product name and a plain, friendly tone.

**Verify:** sign up a new test user on the production domain and receive the confirmation from the product's own address within a minute.

## Step 7.7: App emails

If the MVP scope includes them (welcome email, notifications), implement through `src/lib/email/` using the Resend SDK with the verified sender. Keep templates simple; React Email is a good option for Next.js projects.

## Pitfalls

- Two SPF records on the same name. Merge them.
- Proxied (orange cloud) Cloudflare records in front of Vercel.
- Adding the Resend records to the root domain when the domain added in Resend was a subdomain (or the reverse). The record names must match what Resend shows.
- Registrar dashboards that auto-append the domain: entering `resend._domainkey.mail.yourdomain.com` where the field expects only `resend._domainkey.mail` creates `...yourdomain.com.yourdomain.com`. Check with `dig` after adding.
- Expecting instant propagation. If a record does not resolve, wait 15 minutes and check with `dig @1.1.1.1 <name> TXT` before changing anything.
