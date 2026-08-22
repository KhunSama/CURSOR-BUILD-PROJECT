"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db";
import { requireOnboarded } from "@/server/auth/guards";
import { analyzeMealDescription } from "@/features/ai/analyze";
import { coachReply } from "@/features/ai/coach";
import type { FoodEstimate } from "@/features/ai/foods";

export type AnalyzeState = {
  error?: string;
  items?: FoodEstimate[];
  provider?: "nvidia" | "fallback";
};

export async function analyzeMealAction(
  _prev: AnalyzeState,
  data: FormData,
): Promise<AnalyzeState> {
  await requireOnboarded();
  const text = String(data.get("description") ?? "").trim();
  if (text.length < 3) return { error: "Describe what you ate in a bit more detail." };
  const result = await analyzeMealDescription(text);
  return result;
}

export async function askCoachAction(question: string) {
  const session = await requireOnboarded();
  const q = question.trim();
  if (q.length < 3) return { error: "Ask a short nutrition question." };
  const answer = await coachReply(session.userId, q.slice(0, 500));
  revalidatePath("/coach");
  return { answer };
}

export async function loadCoachHistory() {
  const session = await requireOnboarded();
  return prisma.coachMessage.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
    take: 40,
  });
}
