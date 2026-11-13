# Phase 1: Idea definition and validation

**Goal:** a clear, written idea and an honest decision on whether to build it now.

**Why:** most failed launches built the wrong thing well. An hour here prevents weeks of building. It also produces the raw material every later doc, landing page, and pitch draws from.

## Choose the depth

Ask which fits:

- **Light (about 30 to 60 minutes):** the user already knows the problem well, or this is a quick experiment. Structured questions, a one-page idea brief, a short competitor check.
- **Rigorous (a few sessions):** the user plans to invest serious time or money. Full competitor scan, ideal customer profile, problem interview script, and explicit go / pivot / stop criteria.

Default to light for guided-mode experiments and rigorous when the user mentions quitting a job, raising money, or a long build.

## Step 1.1: Define the idea

Interview the user, one or two questions at a time, and fill `assets/doc-templates/idea-brief.md` into `docs/product/idea-brief.md`. Cover:

- The problem, stated without the solution. Who has it, how often, how painful.
- Who exactly the first users are (a narrow group beats "everyone").
- How they solve it today, and what that costs them.
- The proposed solution in one paragraph, and why AI makes it newly possible or better.
- Why this user (the founder) is suited to build it.
- How it makes money, even roughly.

Push back on vague answers. "Small businesses" becomes "independent physiotherapy clinics with 1 to 5 staff in India". This is the most valuable thing you do in this phase.

## Step 1.2: Validate

**Light:**
1. Web search for 5 to 10 existing products or approaches solving this problem. Summarize each in a line: who it serves, price, gap.
2. Name the riskiest assumption (usually: do people care enough to pay or switch).
3. Suggest the cheapest test of that assumption the user can run this week (5 conversations, a landing page with a waitlist, a post in a community where these users gather).

**Rigorous:** everything in light, plus:
1. Deeper competitor scan: positioning, pricing tiers, reviews complaining about them (complaints are opportunity).
2. Ideal customer profile: role, context, trigger moment that makes them look for a solution, where they gather online.
3. Problem interview script: 8 to 10 open questions about their past behaviour, not hypotheticals ("Tell me about the last time you..."). Explain why: people are unreliable predicting their own future behaviour but accurate about the past.
4. Go / pivot / stop criteria agreed before interviews (for example "at least 6 of 10 describe the problem unprompted and 3 have tried paying for a fix").
5. Help synthesize interview notes when the user returns with them.

Write the result into `docs/product/validation-report.md` from the template.

## Step 1.3: Decide

State a clear recommendation (go, pivot, or stop) with the evidence. The user decides. Record the decision in the checklist.

If **pivot**, loop back to Step 1.1 with the new angle. If **stop**, say so plainly; that is a good outcome of this phase, not a failure.

If the user wants to build regardless of weak evidence, that is their call. Note the open risk in the checklist and suggest the MVP be designed to test it fast.

## Pitfalls

- Treating friends' enthusiasm as validation.
- Solution-first descriptions ("an AI agent that...") with no clear user or pain.
- Skipping the competitor check because "nobody does this". Someone almost always does; the question is whether there is a gap.
