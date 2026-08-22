import { describe, expect, it } from "vitest";
import { computeNutritionTargets, MIN_CALORIES } from "./tdee";

describe("computeNutritionTargets", () => {
  it("stays at or above the calorie floor for aggressive cut inputs", () => {
    const t = computeNutritionTargets({
      age: 22,
      sex: "FEMALE",
      heightCm: 155,
      weightKg: 45,
      activity: "SEDENTARY",
      goal: "LOSE_WEIGHT",
    });
    expect(t.calories).toBeGreaterThanOrEqual(MIN_CALORIES);
  });

  it("raises calories for muscle gain vs maintain", () => {
    const base = {
      age: 21,
      sex: "MALE" as const,
      heightCm: 175,
      weightKg: 70,
      activity: "MODERATE" as const,
    };
    const maintain = computeNutritionTargets({ ...base, goal: "MAINTAIN" });
    const gain = computeNutritionTargets({ ...base, goal: "BUILD_MUSCLE" });
    expect(gain.calories).toBeGreaterThan(maintain.calories);
    expect(gain.proteinG).toBeGreaterThan(maintain.proteinG);
  });
});
