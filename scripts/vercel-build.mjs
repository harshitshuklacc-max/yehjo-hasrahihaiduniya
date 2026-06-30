import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

function run(label, cmd) {
  console.log(`\n=== ${label} ===\n> ${cmd}\n`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

function pause(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

function runWithRetry(label, cmd, attempts = 3) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      run(i === 1 ? label : `${label} (retry ${i}/${attempts})`, cmd);
      return;
    } catch (error) {
      lastError = error;
      if (i < attempts) {
        console.warn(`\n${label} failed. Waiting 8s before retry (Neon may be waking up)...\n`);
        pause(8000);
      }
    }
  }
  throw lastError;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`\nBuild failed: missing required environment variable "${name}".`);
    console.error(`Add it in Vercel → Project → Settings → Environment Variables → Production.\n`);
    process.exit(1);
  }
  return value;
}

function syncDatabase() {
  run("Pre-migration cleanup", "node scripts/prepare-db.mjs");

  try {
    runWithRetry(
      "Database schema sync",
      "npx prisma db push --accept-data-loss --skip-generate",
      2
    );
  } catch {
    console.warn(
      "\nSchema sync blocked by old database data.\n" +
        "Resetting database and applying fresh schema (admin user will be re-seeded)...\n"
    );
    run(
      "Database reset",
      "npx prisma db push --force-reset --skip-generate"
    );
  }
}

requireEnv("DATABASE_URL");
requireEnv("DIRECT_URL");
requireEnv("JWT_SECRET");

const directUrl = process.env.DIRECT_URL;
if (directUrl.includes("-pooler.") || directUrl.includes("pgbouncer=true")) {
  console.error(
    "\nBuild failed: DIRECT_URL must be the Neon direct connection (no pooler).\n" +
      "Use the pooled URL only for DATABASE_URL.\n"
  );
  process.exit(1);
}

try {
  run("Prisma generate", "npx prisma generate");
  syncDatabase();
  run("Seed admin user", "npx prisma db seed");
  run("Next.js build", "npx next build");
} catch {
  console.error(
    "\nVercel build failed during database setup.\n" +
      "Check Vercel env vars:\n" +
      "  DATABASE_URL = Neon pooled connection (host contains -pooler)\n" +
      "  DIRECT_URL   = Neon direct connection (no -pooler)\n" +
      "  JWT_SECRET   = long random string\n" +
      "Also confirm your Neon project is active (not suspended).\n"
  );
  process.exit(1);
}
