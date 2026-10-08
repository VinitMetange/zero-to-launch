# Phase 2: Product docs

**Goal:** two short documents that tell anyone (including Claude Code in every future session) what is being built and, more importantly, what is not.

**Why:** in Phase 4 onward, Claude Code builds from these. Clear docs mean fewer rebuilds and a product that stays focused. Scope creep is the most common reason MVPs never launch.

## Step 2.1: Product framing

Fill `assets/doc-templates/product-framing.md` into `docs/product/product-framing.md` with the user. Draw on the idea brief; do not re-ask what is already answered. It covers:

- One-line positioning: for [user], who [need], [product] is a [category] that [key benefit], unlike [alternative].
- Core user journey in 4 to 7 steps, from first visit to the moment of value.
- The "aha moment": the first point where the user gets real value. The MVP exists to deliver this.
- Success metric for the first 90 days (one number).
- The role of AI: what the model does, what it must never do, what happens when it is wrong.
- Tone and brand basics: name, a one-line tagline, two or three adjectives for the voice.

## Step 2.2: MVP scope

Fill `assets/doc-templates/mvp-scope.md` into `docs/product/mvp-scope.md`:

- **Must have:** only what the core journey and aha moment require. Usually: landing page, sign up and log in, the one core AI feature, a way to see results, and (if charging) checkout.
- **Explicitly out:** everything else, written down. Teams, admin panels, mobile apps, integrations, settings pages, dark mode. Writing them down makes saying no easy later.
- **Data model sketch:** the 3 to 6 main entities and how they relate.
- **Pages and routes:** a simple list.
- **AI feature spec:** inputs, outputs, model choice rationale, expected cost per use (rough), and how a bad output is handled.
- **Launch definition:** what "live" means for this product (for example "a stranger can sign up, use the core feature, and pay, on the real domain").

Challenge any must-have that does not serve the core journey. Ask "would a first user leave if this were missing?"

## Step 2.3: Pick the stack

Now that scope is known, settle the stack using `references/services.md`. Walk the categories that apply: app framework, hosting, database and auth, AI provider, background jobs (only if needed), and note which later-phase categories apply (email, payments, analytics). Record every choice in the checklist's Decisions table.

For most AI web products the default (Next.js, Vercel, Supabase, Anthropic or OpenAI) fits. Only open a choice when the user's constraints point elsewhere.

**Verify:** both docs exist in `docs/product/`, the user has read and agreed to the scope, and the Decisions table is filled for the core stack.

## Pitfalls

- MVP scope that is really version 3. If the must-have list has more than about 7 items, push back.
- Docs written as marketing copy. They are working documents; plain and specific beats polished.
- Picking services before scope is known, which is how people end up configuring a queue system they never use.
