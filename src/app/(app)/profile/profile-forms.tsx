"use client";

import { useActionState } from "react";
import {
  updateGoalsAction,
  updateProfileAction,
  type OnboardState,
} from "@/features/onboarding/actions";

export function ProfileForms({
  name,
  weightKg,
  calories,
  proteinG,
  carbsG,
  fatG,
  title,
  level,
  xp,
  streak,
  badges,
}: {
  name: string;
  weightKg: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  title: string;
  level: number;
  xp: number;
  streak: number;
  badges: number;
}) {
  const [pState, pAction, pPending] = useActionState(updateProfileAction, {} as OnboardState);
  const [gState, gAction, gPending] = useActionState(updateGoalsAction, {} as OnboardState);

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-stroke bg-panel p-4 text-center">
        <p className="text-5xl">🧑‍🚀</p>
        <p className="font-display text-2xl">Level {level}</p>
        <p>{xp.toLocaleString()} XP</p>
        <p>🏆 {badges} achievements</p>
        <p>🔥 {streak} day streak</p>
        <p className="text-gold">Title: {title}</p>
      </section>
      <form action={pAction} className="grid gap-2 rounded-2xl border border-stroke bg-panel p-4">
        <h2 className="font-display text-gold">Profile</h2>
        <label className="text-sm">
          Name
          <input className="mt-1 w-full rounded border border-stroke bg-background px-3 py-2" name="name" defaultValue={name} />
        </label>
        <label className="text-sm">
          Weight (kg)
          <input className="mt-1 w-full rounded border border-stroke bg-background px-3 py-2" name="weightKg" type="number" step="0.1" defaultValue={weightKg} />
        </label>
        {pState.error ? <p className="text-red-300">{pState.error}</p> : null}
        <button className="w-fit rounded bg-gold px-3 py-2 text-background" disabled={pPending} type="submit">
          Save profile
        </button>
      </form>
      <form action={gAction} className="grid gap-2 rounded-2xl border border-stroke bg-panel p-4">
        <h2 className="font-display text-gold">Nutrition targets</h2>
        <label className="text-sm">Calories <input className="mt-1 w-full rounded border border-stroke bg-background px-3 py-2" name="calories" type="number" defaultValue={calories} /></label>
        <label className="text-sm">Protein (g) <input className="mt-1 w-full rounded border border-stroke bg-background px-3 py-2" name="proteinG" type="number" defaultValue={proteinG} /></label>
        <label className="text-sm">Carbs (g) <input className="mt-1 w-full rounded border border-stroke bg-background px-3 py-2" name="carbsG" type="number" defaultValue={carbsG} /></label>
        <label className="text-sm">Fat (g) <input className="mt-1 w-full rounded border border-stroke bg-background px-3 py-2" name="fatG" type="number" defaultValue={fatG} /></label>
        {gState.error ? <p className="text-red-300">{gState.error}</p> : null}
        <button className="w-fit rounded bg-gold px-3 py-2 text-background" disabled={gPending} type="submit">
          Save goals
        </button>
      </form>
    </div>
  );
}
