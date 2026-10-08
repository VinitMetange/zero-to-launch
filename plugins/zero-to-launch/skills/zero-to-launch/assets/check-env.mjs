#!/usr/bin/env node
// Checks environment configuration without ever printing values.
//
// 1. Every variable named (uncommented) in .env.example is present and non-empty
//    in the env file (default .env.local) or in process.env.
// 2. No secret-looking variable is exposed through a public prefix (NEXT_PUBLIC_, VITE_, PUBLIC_).
// 3. No public variable holds a value that looks like a secret key.
// 4. .gitignore ignores env files and no env file with secrets is tracked by git.
//
// Usage: node scripts/check-env.mjs [--env-file .env.local] [--example .env.example]
// Exit code 0 when clean, 1 when anything needs fixing.

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const argValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const envFile = argValue("--env-file", ".env.local");
const exampleFile = argValue("--example", ".env.example");

const problems = [];
const warnings = [];

function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[m[1]] = value;
  }
  return out;
}

if (!existsSync(exampleFile)) {
  console.error(`Missing ${exampleFile}. It should list every env var name the app needs.`);
  process.exit(1);
}
const required = Object.keys(parseEnv(readFileSync(exampleFile, "utf8")));

let local = {};
if (existsSync(envFile)) {
  local = parseEnv(readFileSync(envFile, "utf8"));
} else {
  warnings.push(`${envFile} not found; checking process.env only.`);
}
const valueOf = (name) => (local[name] ?? process.env[name] ?? "").trim();

// 1. Presence
const missing = required.filter((name) => !valueOf(name));
for (const name of missing) problems.push(`Missing or empty: ${name}`);

// 2. Secret-looking names behind a public prefix
const PUBLIC_PREFIX = /^(NEXT_PUBLIC_|VITE_|PUBLIC_|EXPO_PUBLIC_)/;
const SECRET_NAME = /(SECRET|SERVICE_ROLE|PRIVATE|PASSWORD|_TOKEN$|API_KEY$)/;
const allNames = new Set([...required, ...Object.keys(local)]);
for (const name of allNames) {
  if (PUBLIC_PREFIX.test(name) && SECRET_NAME.test(name.replace(PUBLIC_PREFIX, ""))) {
    problems.push(`Public variable looks like a secret: ${name} (public prefixes ship to the browser)`);
  }
}

// 3. Secret-looking values in public variables (value never printed)
const SECRET_VALUE = [
  /^sk_(live|test)_/,     // Stripe secret
  /^rk_(live|test)_/,     // Stripe restricted
  /^whsec_/,              // webhook signing secret
  /^sk-ant-/,             // Anthropic
  /^sk-(proj-)?[A-Za-z0-9]/, // OpenAI style
  /^sb_secret_/,          // Supabase secret key
  /^re_[A-Za-z0-9]/,      // Resend
];
for (const name of allNames) {
  if (!PUBLIC_PREFIX.test(name)) continue;
  const v = valueOf(name);
  if (v && SECRET_VALUE.some((re) => re.test(v))) {
    problems.push(`Public variable ${name} holds a value shaped like a secret key. Move it to a server-only variable and rotate it.`);
  }
  if (v && /service_role/.test(decodeJwtRole(v))) {
    problems.push(`Public variable ${name} holds a Supabase service_role key. Move it server-side and rotate it.`);
  }
}

function decodeJwtRole(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return "";
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return String(payload.role ?? "");
  } catch {
    return "";
  }
}

// 4. Git hygiene
if (existsSync(".gitignore")) {
  const gi = readFileSync(".gitignore", "utf8");
  const ignoresEnv = gi.split(/\r?\n/).some((l) => /^\/?\.env(\*|\.\*|\.local\*?)?\s*$/.test(l.trim()));
  if (!ignoresEnv) {
    problems.push(".gitignore does not appear to ignore .env files. Add `.env`, `.env.*` and `!.env.example`.");
  }
} else {
  problems.push("No .gitignore found.");
}
try {
  const tracked = execSync("git ls-files", { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .split("\n")
    .filter((f) => /(^|\/)\.env(\..+)?$/.test(f) && !/\.env\.example$/.test(f));
  for (const f of tracked) problems.push(`Env file is tracked by git: ${f}. Remove it from git and rotate every key it contained.`);
} catch {
  warnings.push("Not a git repository (or git unavailable); skipped tracked-file check.");
}

// Report
const present = required.length - missing.length;
console.log(`Env check: ${present}/${required.length} required variables present (values not shown).`);
for (const w of warnings) console.log(`  note: ${w}`);
if (problems.length) {
  console.log("Problems:");
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("All checks passed.");
