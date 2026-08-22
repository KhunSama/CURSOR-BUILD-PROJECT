export type Sex = "FEMALE" | "MALE" | "OTHER";
export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "ACTIVE"
  | "VERY_ACTIVE";
export type PrimaryGoal =
  | "LOSE_WEIGHT"
  | "MAINTAIN"
  | "GAIN_WEIGHT"
  | "BUILD_MUSCLE"
  | "EAT_HEALTHIER";

const ACTIVITY: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

export const MIN_CALORIES = 1200;
export const MAX_CALORIES = 4500;

function mifflin(kg: number, cm: number, age: number, sex: Sex): number {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  if (sex === "MALE") return base + 5;
  if (sex === "FEMALE") return base - 161;
  return base - 78;
}

export function computeNutritionTargets(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  goal: PrimaryGoal;
}) {
  const tdee = Math.round(
    mifflin(input.weightKg, input.heightCm, input.age, input.sex) *
      ACTIVITY[input.activity],
  );

  let calories = tdee;
  if (input.goal === "LOSE_WEIGHT") calories = tdee - 400;
  if (input.goal === "GAIN_WEIGHT" || input.goal === "BUILD_MUSCLE") {
    calories = tdee + 300;
  }
  calories = Math.min(MAX_CALORIES, Math.max(MIN_CALORIES, calories));

  let proteinPerKg = 1.6;
  if (input.goal === "BUILD_MUSCLE") proteinPerKg = 2.0;
  if (input.goal === "LOSE_WEIGHT") proteinPerKg = 1.8;

  const proteinG = Math.round(input.weightKg * proteinPerKg);
  const fatG = Math.round((calories * 0.25) / 9);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));

  return { calories, proteinG, carbsG, fatG };
}

export function sumItems(
  items: { calories: number; proteinG: number; carbsG: number; fatG: number }[],
) {
  return items.reduce(
    (acc, i) => ({
      calories: acc.calories + i.calories,
      proteinG: acc.proteinG + i.proteinG,
      carbsG: acc.carbsG + i.carbsG,
      fatG: acc.fatG + i.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}
