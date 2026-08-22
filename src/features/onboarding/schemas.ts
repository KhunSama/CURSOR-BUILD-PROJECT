import { z } from "zod";
import {
  MAX_CALORIES,
  MIN_CALORIES,
  type ActivityLevel,
  type PrimaryGoal,
  type Sex,
} from "@/features/nutrition/tdee";

const sex = z.enum(["FEMALE", "MALE", "OTHER"]);
const activity = z.enum([
  "SEDENTARY",
  "LIGHT",
  "MODERATE",
  "ACTIVE",
  "VERY_ACTIVE",
]);
const goal = z.enum([
  "LOSE_WEIGHT",
  "MAINTAIN",
  "GAIN_WEIGHT",
  "BUILD_MUSCLE",
  "EAT_HEALTHIER",
]);

export const onboardingSchema = z.object({
  age: z.coerce.number().int().min(13).max(100),
  sex,
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(30).max(300),
  activity,
  goal,
});

export const goalOverrideSchema = z.object({
  calories: z.coerce.number().int().min(MIN_CALORIES).max(MAX_CALORIES),
  proteinG: z.coerce.number().int().min(20).max(400),
  carbsG: z.coerce.number().int().min(20).max(700),
  fatG: z.coerce.number().int().min(15).max(250),
});

export type OnboardingInput = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  goal: PrimaryGoal;
};
