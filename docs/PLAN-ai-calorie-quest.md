# PLAN-ai-calorie-quest

**Project type:** WEB  
**Product:** AI Calorie Quest — AI-assisted calorie/macro tracker with RPG gamification  
**Status:** Approved — implementation follows `/create`

## Overview

Users log meals (manual or natural language). AI estimates nutrition; the user reviews and confirms. Confirmed meals update calories/macros, XP, quests, streaks, and level. Not medical advice. AI values are estimates.

**Success (DoD):** A new user can register, set goals, log a meal manually, analyze a meal with AI, confirm it, see macros update, earn XP, complete quests, keep a streak, level up, and view history.

## Tech stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma + SQLite (portable to Postgres later)
- JWT httpOnly session + bcrypt password hashes
- Server-side LLM (optional `OPENAI_API_KEY`); heuristic fallback if unset
- Zod validation

## File structure

```
src/app/                 # routes (landing, auth, app pages)
src/features/            # auth, meals, nutrition, game, ai, progress
src/server/              # db, session, services
prisma/schema.prisma
```

## Task breakdown

| ID | Task | Agent | INPUT → OUTPUT → VERIFY |
|----|------|-------|-------------------------|
| T1 | Prisma schema + migrate | database-architect | PRD entities → schema + db → prisma generate |
| T2 | Auth + onboarding + goals | security-auditor, backend-specialist | register/login/reset → session cookie → own data only |
| T3 | Meals + dashboard | backend-specialist, frontend-specialist | CRUD meals → today totals → UI matches PRD IA |
| T4 | AI analysis + coach | backend-specialist | NL → draft items; coach uses context; confirm gate |
| T5 | XP, levels, quests, streaks, achievements | backend-specialist | confirm meal → awards → dashboard widgets |
| T6 | Progress, profile, landing | frontend-specialist | charts + profile + marketing page |
| T7 | Tests + scans | test-engineer, devops-engineer | unit tests + security_scan + lint |

## Phase X — verification

- [ ] `npm run build`
- [ ] security_scan.py / lint_runner.py
- [ ] Manual: register → onboard → log → AI → confirm → XP

## Out of scope (v1)

Medical plans, guaranteed accuracy, social, water tracking, barcode, image recognition, cosmetics shop.
