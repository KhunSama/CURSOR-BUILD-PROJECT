import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function postgresUrl() {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    ""
  );
}

run("npx", ["prisma", "generate"]);

const url = postgresUrl();
const canPush =
  url.length > 0 &&
  !url.startsWith("file:") &&
  !url.includes("127.0.0.1") &&
  !url.includes("localhost");

if (canPush) {
  run("npx", ["prisma", "db", "push", "--accept-data-loss"]);
} else {
  console.warn(
    "[vercel-build] Skipping prisma db push. Set DATABASE_URL or POSTGRES_URL (Neon / Vercel Postgres) on the project.",
  );
}

run("npx", ["next", "build"]);
