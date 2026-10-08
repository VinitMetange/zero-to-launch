# Getting started: step zero

This page is for anyone who has never used a terminal or Claude Code. It takes about 15 minutes. Once you finish, Zero to Launch handles everything else, including installing the other tools you need.

## 1. Get a Claude plan that includes Claude Code

Claude Code needs a paid Claude plan (such as Pro or Max) or an Anthropic Console account with API credits. The free plan does not include it. Check current plans at [claude.com/pricing](https://claude.com/pricing).

## 2. Open a terminal

- **macOS:** press Cmd + Space, type `Terminal`, press Enter.
- **Windows:** press the Windows key, type `PowerShell`, press Enter.
- **Linux:** open your Terminal app (often Ctrl + Alt + T).

A terminal is a window where you type commands instead of clicking. You will mostly just paste commands and press Enter.

Prefer not to use a terminal at all? The [Claude desktop app](https://claude.com/download) includes Claude Code in its Code tab. The rest of this guide still applies; you open your project folder there instead.

## 3. Install Claude Code

Paste the command for your system and press Enter.

**macOS, Linux, or WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

The installer shows no progress while downloading; give it a minute. Then close the terminal, open a new one, and check it worked:

```bash
claude --version
```

You should see a version number. If you see "command not found", follow the [installation troubleshooting guide](https://code.claude.com/docs/en/troubleshoot-install).

On Windows, installing [Git for Windows](https://git-scm.com/downloads/win) is also recommended; Zero to Launch will need git anyway.

## 4. Sign in

```bash
claude
```

The first run opens your browser to sign in with your Claude account. Approve it, return to the terminal, and type `/exit` to close the session for now.

## 5. Install Zero to Launch

```bash
claude plugin marketplace add vinitmetange/zero-to-launch
claude plugin install zero-to-launch@vinitmetange
```

## 6. Create your project folder and begin

**macOS / Linux:**
```bash
mkdir my-product
cd my-product
claude
```

**Windows PowerShell:**
```powershell
mkdir my-product
cd my-product
claude
```

Then type something like:

> I have an idea for [your idea]. I've never launched a product before. Help me take it from zero to launch.

Zero to Launch takes it from there. When Claude asks permission to run a command, read what it is about to do and approve it; it will explain anything unfamiliar.

## Coming back later

Open a terminal, go to your project folder (`cd my-product`), run `claude`, and say "let's continue". Your progress is saved in `LAUNCH_CHECKLIST.md` inside the folder.

Official reference: [Claude Code setup](https://code.claude.com/docs/en/setup)
