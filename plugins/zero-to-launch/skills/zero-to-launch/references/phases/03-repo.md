# Phase 3: Repo and local environment

**Goal:** the project lives in a GitHub repository, cloned locally, with the product docs committed and Claude Code working inside it.

**Why:** version control is the safety net for everything that follows. Every later step can be undone. Hosting platforms (Vercel, Railway) also deploy directly from GitHub, so the repo is the backbone of the whole pipeline.

## Step 3.1: Decide repo visibility

Private by default. Public only if the user wants open source or a portfolio piece, and even then only after Phase 11 confirms no secrets are in history.

## Step 3.2: Turn the project folder into a repo

The project folder from Phase 0 already holds `LAUNCH_CHECKLIST.md` and `docs/product/`. From inside it:

```bash
git init -b main
```

Create a starter `.gitignore` before the first commit (the scaffold in Phase 4 will extend it). At minimum:

```
.env
.env.*
!.env.example
node_modules/
.next/
.vercel/
.DS_Store
```

Then:

```bash
git add .
git commit -m "Initial commit: product docs and launch checklist"
gh repo create <project-name> --private --source=. --push
```

**Guided mode note:** explain that `.gitignore` lists files git must never upload, and that `.env` files will hold secret keys, which is why they are ignored from the very first commit.

**Verify:** `gh repo view --web` opens the repo (or `gh repo view` prints it), and the docs are visible on GitHub.

## Step 3.3: Protect the main branch (fast mode optional, guided mode recommended)

Turn on GitHub secret scanning push protection: repo Settings, Code security, enable "Secret Protection" / "Push protection" (names vary by plan; it is free on public repos and available on many private plans). This blocks a push that contains a recognizable API key. Check what the user's plan offers; if unavailable, Phase 11 covers alternatives.

Branch protection is optional for a solo founder. Suggest it only if they have collaborators.

## Step 3.4: Orient Claude Code

If the user is not already running Claude Code inside this folder, have them `cd` into it and start it there, so future sessions find `LAUNCH_CHECKLIST.md` automatically.

**Verify:** a new session in this folder can read the checklist.

## Pitfalls

- Running `git init` in the home directory or a parent folder by mistake. Check `pwd` first.
- Committing a `.env` before `.gitignore` exists. If it happens, the key must be rotated (see Phase 11), deleting the file is not enough because it stays in history.
- Repo name with spaces or capitals; keep it lowercase with hyphens.
