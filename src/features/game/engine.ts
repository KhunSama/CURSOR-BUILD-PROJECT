import { prisma } from "@/server/db";
import { localDateKey } from "@/shared/lib/dates";
import { QUESTS, XP, levelFromXp, titleForLevel } from "@/features/game/config";
import { nextStreak } from "@/features/game/streak";
import { sumItems } from "@/features/nutrition/tdee";

type Totals = { calories: number; proteinG: number; carbsG: number; fatG: number };

async function grantXp(userId: string, amount: number, reason: string) {
  await prisma.xpTransaction.create({ data: { userId, amount, reason } });
}

async function totalXp(userId: string) {
  const agg = await prisma.xpTransaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return agg._sum.amount ?? 0;
}

async function unlock(userId: string, key: string) {
  await prisma.userAchievement.upsert({
    where: { userId_key: { userId, key } },
    update: {},
    create: { userId, key },
  });
}

export async function afterMealConfirmed(userId: string, date = localDateKey()) {
  await grantXp(userId, XP.LOG_MEAL, `log_meal:${date}`);

  const streakRow = await prisma.streak.findUnique({ where: { userId } });
  const streakState = nextStreak(
    streakRow?.lastActiveDate ?? null,
    date,
    streakRow?.current ?? 0,
  );
  const longest = Math.max(streakRow?.longest ?? 0, streakState.longestCandidate);
  await prisma.streak.upsert({
    where: { userId },
    create: {
      userId,
      current: streakState.current,
      longest,
      lastActiveDate: date,
    },
    update: {
      current: streakState.current,
      longest,
      lastActiveDate: date,
    },
  });
  if (streakState.isNewDay) {
    await grantXp(userId, XP.STREAK_DAY, `streak:${date}`);
  }

  const goal = await prisma.nutritionGoal.findUnique({ where: { userId } });
  const meals = await prisma.meal.findMany({
    where: { userId, loggedOn: date, confirmed: true },
    include: { items: true },
  });
  const totals = sumItems(meals.flatMap((m) => m.items));

  if (goal) {
    await maybeCompleteQuests(userId, date, totals, goal, meals);
  }

  await refreshAchievements(userId, streakState.current);
  const xp = await totalXp(userId);
  const { level } = levelFromXp(xp);
  await prisma.profile.updateMany({
    where: { userId },
    data: { title: titleForLevel(level) },
  });
}

async function maybeCompleteQuests(
  userId: string,
  date: string,
  totals: Totals,
  goal: { calories: number; proteinG: number },
  meals: { mealType: string }[],
) {
  const types = new Set(meals.map((m) => m.mealType));
  const proteinHit = totals.proteinG >= goal.proteinG;
  const calRatio = goal.calories === 0 ? 0 : totals.calories / goal.calories;
  const calorieHit = calRatio >= 0.9 && calRatio <= 1.1;
  const trackerHit =
    types.has("BREAKFAST") && types.has("LUNCH") && types.has("DINNER");

  const checks: { key: string; hit: boolean; xp: number; bonusReason?: string; bonusXp?: number }[] =
    [
      {
        key: "protein_hunter",
        hit: proteinHit,
        xp: XP.QUEST_PROTEIN_HUNTER,
        bonusReason: `protein_goal:${date}`,
        bonusXp: XP.PROTEIN_GOAL,
      },
      {
        key: "consistent_tracker",
        hit: trackerHit,
        xp: XP.QUEST_CONSISTENT_TRACKER,
      },
      {
        key: "calorie_balance",
        hit: calorieHit,
        xp: XP.QUEST_CALORIE_BALANCE,
        bonusReason: `calorie_goal:${date}`,
        bonusXp: XP.CALORIE_GOAL,
      },
    ];

  for (const q of checks) {
    if (!q.hit) continue;
    const existing = await prisma.userQuest.findUnique({
      where: { userId_questKey_date: { userId, questKey: q.key, date } },
    });
    if (existing?.completed) continue;
    await prisma.userQuest.upsert({
      where: { userId_questKey_date: { userId, questKey: q.key, date } },
      create: {
        userId,
        questKey: q.key,
        date,
        completed: true,
        xpAwarded: q.xp,
      },
      update: { completed: true, xpAwarded: q.xp },
    });
    await grantXp(userId, q.xp, `quest:${q.key}:${date}`);
    if (q.bonusReason && q.bonusXp) {
      await grantXp(userId, q.bonusXp, q.bonusReason);
    }
  }

  for (const def of QUESTS) {
    await prisma.userQuest.upsert({
      where: { userId_questKey_date: { userId, questKey: def.key, date } },
      create: { userId, questKey: def.key, date },
      update: {},
    });
  }
}

async function refreshAchievements(userId: string, currentStreak: number) {
  const mealCount = await prisma.meal.count({
    where: { userId, confirmed: true },
  });
  const proteinDays = await prisma.userQuest.count({
    where: { userId, questKey: "protein_hunter", completed: true },
  });
  const xp = await totalXp(userId);
  const { level } = levelFromXp(xp);

  if (mealCount >= 1) await unlock(userId, "first_meal");
  if (currentStreak >= 7) await unlock(userId, "streak_7");
  if (proteinDays >= 5) await unlock(userId, "protein_master");
  if (mealCount >= 50) await unlock(userId, "data_collector");
  if (level >= 10) await unlock(userId, "level_10");
  if (currentStreak >= 30) await unlock(userId, "consistency_king");
}

export async function getXpSummary(userId: string) {
  const xp = await totalXp(userId);
  return levelFromXp(xp);
}
