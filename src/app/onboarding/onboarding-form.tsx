"use client";

import { useActionState } from "react";
import {
  completeOnboarding,
  type OnboardState,
} from "@/features/onboarding/actions";

export function OnboardingForm() {
  const [state, action, pending] = useActionState(
    completeOnboarding,
    {} as OnboardState,
  );
  return (
    <form action={action} className="grid gap-3">
      <label className="text-sm">
        Age
        <input className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="age" type="number" min={13} max={100} required />
      </label>
      <label className="text-sm">
        Sex
        <select className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="sex" required>
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
          <option value="OTHER">Other / prefer not to say</option>
        </select>
      </label>
      <label className="text-sm">
        Height (cm)
        <input className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="heightCm" type="number" step="0.1" required />
      </label>
      <label className="text-sm">
        Weight (kg)
        <input className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="weightKg" type="number" step="0.1" required />
      </label>
      <label className="text-sm">
        Activity
        <select className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="activity" required>
          <option value="SEDENTARY">Sedentary</option>
          <option value="LIGHT">Light</option>
          <option value="MODERATE">Moderate</option>
          <option value="ACTIVE">Active</option>
          <option value="VERY_ACTIVE">Very active</option>
        </select>
      </label>
      <label className="text-sm">
        Primary goal
        <select className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="goal" required>
          <option value="LOSE_WEIGHT">Lose weight</option>
          <option value="MAINTAIN">Maintain</option>
          <option value="GAIN_WEIGHT">Gain weight</option>
          <option value="BUILD_MUSCLE">Build muscle</option>
          <option value="EAT_HEALTHIER">Eat healthier</option>
        </select>
      </label>
      {state.error ? <p className="text-red-300">{state.error}</p> : null}
      <button disabled={pending} className="rounded-lg bg-gold px-4 py-2 font-display text-background" type="submit">
        {pending ? "Calculating…" : "Set my targets"}
      </button>
    </form>
  );
}
