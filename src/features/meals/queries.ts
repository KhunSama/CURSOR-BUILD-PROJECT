import { prisma } from "@/server/db";
import { localDateKey } from "@/shared/lib/dates";
import { sumItems } from "@/features/nutrition/tdee";
import { QUESTS } from "@/features/game/config";
import { getXpSummary } from "@/features/game/engine";
import type { MealView, QuestRow } from "@/types/db";

export async function getDashboardData(userId: string, date = localDateKey()) {
  const [goal, profile, meals, streak, achievements, quests, xp] =
    await Promise.all([
      prisma.nutritionGoal.findUnique({ where: { userId } }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.meal.findMany({
        where: { userId, loggedOn: date, confirmed: true },
        include: { items: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.userAchievement.findMany({ where: { userId } }),
      prisma.userQuest.findMany({ where: { userId, date } }),
      getXpSummary(userId),
    ]);

  const totals = sumItems(meals.flatMap((m: MealView) => m.items));
  const questView = QUESTS.map((q) => {
    const row = quests.find((u: QuestRow) => u.questKey === q.key);
    return { ...q, completed: Boolean(row?.completed) };
  });

  return {
    goal,
    profile,
    meals,
    totals,
    remaining: {
      calories: Math.max(0, (goal?.calories ?? 0) - totals.calories),
      proteinG: Math.max(0, (goal?.proteinG ?? 0) - totals.proteinG),
      carbsG: Math.max(0, (goal?.carbsG ?? 0) - totals.carbsG),
      fatG: Math.max(0, (goal?.fatG ?? 0) - totals.fatG),
    },
    streak,
    achievements,
    quests: questView,
    xp,
    date,
  };
}

export async function getMealsForDate(userId: string, date = localDateKey()) {
  return prisma.meal.findMany({
    where: { userId, loggedOn: date, confirmed: true },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<MealView[]>;
}
