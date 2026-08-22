import { prisma } from "@/server/db";
import { localDateKey } from "@/shared/lib/dates";
import { sumItems } from "@/features/nutrition/tdee";
import { nvidiaChat, nvidiaConfigured } from "@/server/ai/nvidia";

const COACH_SYSTEM = `You are an AI nutrition coach for a game-like calorie tracker.
Give practical, encouraging food ideas. You are NOT a doctor or dietitian.
Never diagnose, never recommend extreme calorie restriction, never shame the user.
Keep answers under 180 words. Mention that calorie numbers are estimates.`;

export async function coachReply(userId: string, question: string) {
  const today = localDateKey();
  const [goal, profile, meals] = await Promise.all([
    prisma.nutritionGoal.findUnique({ where: { userId } }),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.meal.findMany({
      where: { userId, loggedOn: today, confirmed: true },
      include: { items: true },
    }),
  ]);
  const totals = sumItems(meals.flatMap((m) => m.items));
  const context = JSON.stringify({
    goal: profile?.goal,
    targets: goal,
    eatenToday: totals,
    remaining: goal
      ? {
          calories: Math.max(0, goal.calories - totals.calories),
          proteinG: Math.max(0, goal.proteinG - totals.proteinG),
        }
      : null,
    meals: meals.map((m) => ({
      type: m.mealType,
      items: m.items.map((i) => i.name),
    })),
  });

  await prisma.coachMessage.create({
    data: { userId, role: "user", content: question },
  });

  let answer: string;
  if (!nvidiaConfigured()) {
    answer = fallbackCoach(question, totals, goal);
  } else {
    try {
      const result = await nvidiaChat({
        temperature: 1,
        messages: [
          { role: "system", content: COACH_SYSTEM },
          {
            role: "user",
            content: `User context: ${context}\n\nQuestion: ${question}`,
          },
        ],
      });
      answer =
        result?.content.trim() || fallbackCoach(question, totals, goal);
    } catch {
      answer = fallbackCoach(question, totals, goal);
    }
  }

  await prisma.coachMessage.create({
    data: { userId, role: "assistant", content: answer },
  });
  return answer;
}

function fallbackCoach(
  question: string,
  totals: { calories: number; proteinG: number },
  goal: { calories: number; proteinG: number } | null,
) {
  const remainCal = goal ? Math.max(0, goal.calories - totals.calories) : 500;
  const remainP = goal ? Math.max(0, goal.proteinG - totals.proteinG) : 30;
  const q = question.toLowerCase();
  if (q.includes("protein")) {
    return `You still have about ${remainP}g protein to go today (estimate). Eggs, Greek yogurt, tofu, or grilled chicken are simple options. This is general guidance, not medical advice.`;
  }
  if (q.includes("dinner") || q.includes("500")) {
    return `With roughly ${remainCal} kcal left (estimate), a plate of grilled chicken, rice, and vegetables can land near 450–550 kcal. Adjust portions after you log. Not medical advice.`;
  }
  return `Today you've logged about ${totals.calories} kcal. A balanced next meal with protein + produce + a starch usually fits remaining targets. Estimates only — confirm in the meal editor. Not medical advice.`;
}
