# AI Calorie Quest

AI-assisted calorie and macro tracking with RPG-style XP, quests, streaks, and achievements.

## Setup

1. Create a free [Neon](https://neon.tech) or Vercel Postgres database.
2. Copy `.env.example` to `.env` and set:

```bash
DATABASE_URL="postgresql://..."
SESSION_SECRET="at-least-32-characters-long-secret"
```

3. Install and push the schema:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: set `NVIDIA_API_KEY` locally in `.env` (gitignored) for NVIDIA Integrate meal analysis and coaching (`openai/gpt-oss-20b`). Without it, the app uses a built-in estimator. Never commit API keys.

## Deploy on Vercel

1. Import [this GitHub repo](https://github.com/KhunSama/CURSOR-BUILD-PROJECT) in [Vercel](https://vercel.com/new).
2. Add a **Postgres** store (Storage → Create Database → Postgres / Neon) or paste a Neon `DATABASE_URL`.
3. Set environment variables (Production + Preview):

| Name | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres URL (`sslmode=require`). Vercel Postgres also sets `POSTGRES_URL`. |
| `SESSION_SECRET` | yes | Random string, 32+ characters |
| `NVIDIA_API_KEY` | yes for live AI | Paste the NVIDIA Integrate key in the Vercel dashboard. `.env` is gitignored so this key is **not** in GitHub. |
| `NVIDIA_BASE_URL` | no | Defaults to `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_MODEL` | no | Defaults to `openai/gpt-oss-20b` |

Vercel → Project → Settings → Environment Variables. Add `NVIDIA_API_KEY` there, then redeploy. The coach and meal analyzer call `/api/ai/coach` and `/api/ai/analyze` (60s timeout).

If the key is missing, the UI shows a warning and uses the built-in fallback instead of pretending NVIDIA answered.

4. Deploy. The build runs `prisma generate && prisma db push && next build` so tables are created on first deploy.

SQLite is not used in production. Vercel serverless filesystems are ephemeral, so the database must be hosted Postgres.

## Scripts

- `npm run dev` — local server
- `npm run build` — production build
- `npm test` — unit tests
- `npx prisma db push` — create/update Postgres tables

## Safety

Nutrition numbers are estimates. The app is not medical advice. AI drafts do not change your day until you confirm them.
