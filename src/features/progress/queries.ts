import { prisma } from "@/server/db";
import { addDays, localDateKey } from "@/shared/lib/dates";
import { sumItems } from "@/features/nutrition/tdee";

export async function getProgress(
  userId: string,
  range: "daily" | "weekly" | "monthly",
) {
  const end = localDateKey();
  const days = range === "daily" ? 1 : range === "weekly" ? 7 : 30;
  const start = addDays(end, -(days - 1));
  const [meals, goal, quests, weights, streak] = await Promise.all([
    prisma.meal.findMany({
      where: { userId, confirmed: true, loggedOn: { gte: start, lte: end } },
      include: { items: true },
    }),
    prisma.nutritionGoal.findUnique({ where: { userId } }),
    prisma.userQuest.findMany({
      where: { userId, date: { gte: start, lte: end }, completed: true },
    }),
    prisma.weightLog.findMany({
      where: { userId, loggedOn: { gte: start, lte: end } },
      orderBy: { loggedOn: "asc" },
    }),
    prisma.streak.findUnique({ where: { userId } }),
  ]);

  const totalsByDay = new Map<
    string,
    { calories: number; proteinG: number; carbsG: number; fatG: number }
  >();
  for (const meal of meals) {
    const cur = totalsByDay.get(meal.loggedOn) ?? {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    };
    const add = sumItems(meal.items);
    totalsByDay.set(meal.loggedOn, {
      calories: cur.calories + add.calories,
      proteinG: cur.proteinG + add.proteinG,
      carbsG: cur.carbsG + add.carbsG,
      fatG: cur.fatG + add.fatG,
    });
  }

  const series = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    series.push({
      date: d,
      ...(totalsByDay.get(d) ?? {
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
      }),
    });
  }

  const logged = series.filter((s) => s.calories > 0);
  const n = logged.length || 1;
  const avg = {
    calories: Math.round(logged.reduce((a, s) => a + s.calories, 0) / n),
    proteinG: Math.round(logged.reduce((a, s) => a + s.proteinG, 0) / n),
    carbsG: Math.round(logged.reduce((a, s) => a + s.carbsG, 0) / n),
    fatG: Math.round(logged.reduce((a, s) => a + s.fatG, 0) / n),
  };
  const goalDays = logged.filter((s) => {
    if (!goal) return false;
    const r = s.calories / goal.calories;
    return r >= 0.9 && r <= 1.1;
  }).length;

  return {
    series,
    avg,
    goal,
    questCompletions: quests.length,
    weights,
    streak,
    goalDays,
    loggedDays: logged.length,
  };
}
