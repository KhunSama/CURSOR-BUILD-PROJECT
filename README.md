# AI Calorie Quest

AI-assisted calorie and macro tracking with RPG-style XP, quests, streaks, and achievements.

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env` if needed. `SESSION_SECRET` must be at least 32 characters.

Optional: set `NVIDIA_API_KEY` in `.env` for NVIDIA Integrate meal analysis and coaching (`openai/gpt-oss-20b`). Without it, the app uses a built-in estimator so you can still log meals. Never commit API keys.

## Scripts

- `npm run dev` — local server
- `npm run build` — production build
- `npm test` — unit tests
- `npx prisma db push` — create/update SQLite file at `prisma/dev.db`

## Safety

Nutrition numbers are estimates. The app is not medical advice. AI drafts do not change your day until you confirm them.
