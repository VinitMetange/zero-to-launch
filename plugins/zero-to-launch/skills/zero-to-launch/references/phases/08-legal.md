# Phase 8: Legal and trust pages

**Goal:** Privacy Policy, Terms of Service, Refund/Cancellation Policy (if charging), and Contact pages are live on the domain, accurate to how the product actually works.

**Why before payments:** payment providers review the website before activating live payments, and they commonly require these pages to be publicly reachable. Users also look for them before trusting a new product with their data, and privacy laws (GDPR in Europe, the DPDP Act in India, various US state laws) require disclosure of what data is collected and why.

**Say this to the user plainly:** you can draft these and they are far better than nothing, but they are not legal advice. If the product handles sensitive data (health, finance, children), serves regulated industries, or grows meaningfully, have a lawyer review them.

## Step 8.1: Gather the facts

The pages must describe reality, so collect:
- Legal entity name and country (or the founder as an individual, if not incorporated yet).
- What personal data is collected (email, name, usage data, payment data handled by the provider, content users submit to the AI feature).
- Every third party that receives data. From the Decisions table: hosting, database, AI provider, email, payments, analytics, monitoring. List them as subprocessors.
- Whether user content is sent to an AI provider, and whether that provider trains on API data (check the provider's current API data policy; most major providers state they do not train on API inputs by default, but verify and state it accurately).
- Data retention and deletion: how a user deletes their account and data.
- Contact email for privacy requests (hello@ or privacy@ on the domain from Phase 7).
- Target markets (drives which laws to mention).

## Step 8.2: Draft the pages

Create routes `/privacy`, `/terms`, `/refunds` (if charging), `/contact`. Draft in plain language with clear headings. Include a "Last updated" date.

Region notes:
- **EU/UK users:** lawful basis for processing, user rights (access, deletion, portability), and cookie consent if using non-essential cookies or tracking analytics.
- **India:** DPDP Act basics (purpose of processing, consent, grievance contact). Indian payment providers typically also want refund and cancellation terms, shipping/delivery terms for digital goods ("delivered instantly online"), and a physical contact address or at least a reachable contact.
- **US:** California-style disclosures if relevant.

Look up current requirements for the user's region with web search rather than relying on memory, and say what you checked.

## Step 8.3: Cookie consent (only if needed)

Needed if the product uses analytics or marketing cookies and serves EU/UK users. Not needed for strictly necessary cookies (auth session). Privacy-friendly analytics (Plausible, or PostHog in cookieless mode) can avoid the banner entirely. Decide together with Phase 10.

## Step 8.4: Link everywhere

Footer on every page, the sign-up form ("By signing up you agree to the Terms and Privacy Policy"), and later the checkout page.

**Verify:** each page loads on `https://yourdomain.com/<page>`, footer links work, and the facts match the Decisions table (no service listed that is not used, none used that is missing).

## Pitfalls

- Copying another company's policy that names their services and their country.
- Forgetting the AI provider as a data recipient.
- Promising things the product does not do ("we never store your data") when the database clearly does.
