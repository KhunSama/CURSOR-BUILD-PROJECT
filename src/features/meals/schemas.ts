import { z } from "zod";

export const mealTypeSchema = z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]);

export const mealItemSchema = z.object({
  name: z.string().trim().min(1).max(80),
  serving: z.string().trim().min(1).max(60),
  calories: z.coerce.number().int().min(1).max(5000),
  proteinG: z.coerce.number().min(0).max(400),
  carbsG: z.coerce.number().min(0).max(700),
  fatG: z.coerce.number().min(0).max(250),
});

export const saveMealSchema = z.object({
  mealType: mealTypeSchema,
  source: z.enum(["MANUAL", "AI"]).default("MANUAL"),
  items: z.array(mealItemSchema).min(1).max(20),
});
