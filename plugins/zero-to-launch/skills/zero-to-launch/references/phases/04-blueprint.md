# Phase 4: AI-first repo blueprint

**Goal:** a scaffolded app laid out in the AI-first structure, with a CLAUDE.md that keeps every future Claude Code session consistent, and basic CI.

**Why:** AI products have parts ordinary web apps do not: prompts that change often, model calls that cost money per use, outputs that need evaluating, and providers you may want to swap. Putting these in predictable places from day one keeps the codebase understandable as Claude Code adds features, and makes cost and quality visible. Read `assets/repo-blueprint.md` now; it is the source of truth for the structure.

## Step 4.1: Template or generate

`assets/repo-blueprint.md` names a template repository if one is configured.

- **Template configured and reachable:** offer it. If the user accepts, copy the template's files into the project (do not replace the repo's git history): clone to a temp folder, copy everything except `.git`, then review and remove parts the MVP scope excludes.
- **Otherwise (or if the user prefers):** generate from the spec, Step 4.2.

## Step 4.2: Scaffold the app (generate path)

For the default stack (Next.js on Vercel):

`create-next-app` refuses to run in a folder containing unrelated files such as `LAUNCH_CHECKLIST.md`, so scaffold in a temp subfolder and move it up:

```bash
npx create-next-app@latest _scaffold --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm
# move contents up, merging .gitignore rather than overwriting
```

Merge the scaffold's `.gitignore` with the existing one (keep the `.env*` rules), move everything else up, delete `_scaffold`, run `npm install`, and confirm `npm run dev` serves the default page.

If the user chose a different framework, use its official scaffolder with equivalent options and adapt the folder mapping in the blueprint.

Then create the blueprint folders and stub files listed in `assets/repo-blueprint.md`: the AI layer (`src/lib/ai/`), service clients, `supabase/`, `evals/`, `docs/architecture/`, `scripts/`. Stubs should be minimal but real (a provider wrapper with one function signature and a TODO is fine; empty files are not).

Copy `assets/check-env.mjs` to `scripts/check-env.mjs` and add `"check:env": "node scripts/check-env.mjs"` to `package.json` scripts.

Copy `assets/env.example` to `.env.example`, removing services the user did not choose. Leave later-phase variables commented out; each phase uncomments its own, so `check:env` only requires what should exist by then.

## Step 4.3: Write CLAUDE.md

Fill `assets/CLAUDE.md.template` into `CLAUDE.md` at the repo root using the product docs and decisions. This is the file Claude Code reads at the start of every session in this repo, so it should state: what the product is (two lines), the stack, the folder conventions, the AI rules (all model calls go through the wrapper, prompts live in `src/lib/ai/prompts/`, log usage), and the commands to run (dev, build, test, check:env).

Keep it under about 100 lines. It is a map, not a manual.

## Step 4.4: Minimal CI

Add `.github/workflows/ci.yml` that on every push and pull request installs dependencies, runs lint, runs type check, and runs build. Use placeholder env values in CI only where the build requires them (never real secrets).

Why: Vercel will also build on push, but CI catches broken code before it reaches a deploy and keeps a green check visible on every change.

## Step 4.5: Commit

```bash
git add .
git commit -m "Scaffold app with AI-first blueprint"
git push
```

**Verify:** `npm run build` succeeds locally, the CI run on GitHub passes (`gh run list --limit 1`), and the folder tree matches the blueprint.

## Pitfalls

- Overbuilding the blueprint. Create folders the MVP will use; note others in `docs/architecture/overview.md` as "later".
- Letting the scaffolder initialise a second git repo inside the project. Delete any nested `.git` from `_scaffold` before moving files.
- Choosing the Pages Router or mixing routers. Pick the App Router for new Next.js projects unless the user has a reason.
