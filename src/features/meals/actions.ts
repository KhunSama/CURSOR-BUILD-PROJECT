"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db";
import { requireOnboarded } from "@/server/auth/guards";
import { localDateKey } from "@/shared/lib/dates";
import { afterMealConfirmed } from "@/features/game/engine";
import { mealItemSchema, saveMealSchema } from "@/features/meals/schemas";

export type MealState = { error?: string; ok?: boolean };

export async function saveMealAction(
  _prev: MealState,
  data: FormData,
): Promise<MealState> {
  const session = await requireOnboarded();
  const rawItems = data.get("itemsJson");
  let items: unknown = [];
  try {
    items = JSON.parse(String(rawItems ?? "[]"));
  } catch {
    return { error: "Could not read meal items." };
  }
  const parsed = saveMealSchema.safeParse({
    mealType: data.get("mealType"),
    source: data.get("source") || "MANUAL",
    items,
  });
  if (!parsed.success) return { error: "Add at least one valid food with calories." };

  await prisma.meal.create({
    data: {
      userId: session.userId,
      mealType: parsed.data.mealType,
      loggedOn: localDateKey(),
      source: parsed.data.source,
      confirmed: true,
      items: { create: parsed.data.items },
    },
  });
  await afterMealConfirmed(session.userId);
  revalidatePath("/dashboard");
  revalidatePath("/meals");
  revalidatePath("/quests");
  return { ok: true };
}

export async function deleteMealAction(mealId: string) {
  const session = await requireOnboarded();
  await prisma.meal.deleteMany({
    where: { id: mealId, userId: session.userId },
  });
  revalidatePath("/dashboard");
  revalidatePath("/meals");
}

export async function updateItemAction(
  _prev: MealState,
  data: FormData,
): Promise<MealState> {
  const session = await requireOnboarded();
  const id = String(data.get("itemId") ?? "");
  const parsed = mealItemSchema.safeParse({
    name: data.get("name"),
    serving: data.get("serving"),
    calories: data.get("calories"),
    proteinG: data.get("proteinG"),
    carbsG: data.get("carbsG"),
    fatG: data.get("fatG"),
  });
  if (!parsed.success) return { error: "Item values look invalid." };
  const item = await prisma.mealItem.findFirst({
    where: { id, meal: { userId: session.userId } },
  });
  if (!item) return { error: "Item not found." };
  await prisma.mealItem.update({ where: { id }, data: parsed.data });
  revalidatePath("/meals");
  revalidatePath("/dashboard");
  return { ok: true };
}
