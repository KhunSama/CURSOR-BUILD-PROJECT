"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { requireUser, requireOnboarded } from "@/server/auth/guards";
import { setSessionCookie } from "@/server/auth/session";
import { computeNutritionTargets } from "@/features/nutrition/tdee";
import { localDateKey } from "@/shared/lib/dates";
import {
  goalOverrideSchema,
  onboardingSchema,
} from "@/features/onboarding/schemas";

export type OnboardState = { error?: string };

export async function completeOnboarding(
  _prev: OnboardState,
  data: FormData,
): Promise<OnboardState> {
  const session = await requireUser();
  const parsed = onboardingSchema.safeParse(Object.fromEntries(data.entries()));
  if (!parsed.success) {
    return { error: "Please fill every field with realistic values." };
  }
  const targets = computeNutritionTargets(parsed.data);
  const today = localDateKey();
  await prisma.$transaction([
    prisma.profile.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, ...parsed.data },
      update: parsed.data,
    }),
    prisma.nutritionGoal.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, ...targets },
      update: targets,
    }),
    prisma.weightLog.create({
      data: { userId: session.userId, kg: parsed.data.weightKg, loggedOn: today },
    }),
  ]);
  await setSessionCookie({ ...session, onboarded: true });
  redirect("/dashboard");
}

export async function updateGoalsAction(
  _prev: OnboardState,
  data: FormData,
): Promise<OnboardState> {
  const session = await requireOnboarded();
  const parsed = goalOverrideSchema.safeParse(Object.fromEntries(data.entries()));
  if (!parsed.success) return { error: "Goals must stay in a safe range." };
  await prisma.nutritionGoal.update({
    where: { userId: session.userId },
    data: parsed.data,
  });
  return {};
}

export async function updateProfileAction(
  _prev: OnboardState,
  data: FormData,
): Promise<OnboardState> {
  const session = await requireOnboarded();
  const name = String(data.get("name") ?? "").trim();
  const weightKg = Number(data.get("weightKg"));
  if (name.length < 2 || name.length > 60) return { error: "Name looks invalid." };
  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) {
    return { error: "Weight looks invalid." };
  }
  await prisma.user.update({ where: { id: session.userId }, data: { name } });
  await prisma.profile.update({
    where: { userId: session.userId },
    data: { weightKg },
  });
  await prisma.weightLog.create({
    data: { userId: session.userId, kg: weightKg, loggedOn: localDateKey() },
  });
  await setSessionCookie({ ...session, name });
  return {};
}
