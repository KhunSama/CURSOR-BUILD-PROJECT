import Link from "next/link";
import { requireOnboarded } from "@/server/auth/guards";
import { getMealsForDate } from "@/features/meals/queries";
import { deleteMealAction } from "@/features/meals/actions";
import { sumItems } from "@/features/nutrition/tdee";

export default async function MealsPage() {
  const session = await requireOnboarded();
  const meals = await getMealsForDate(session.userId);

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-gold">Today&apos;s meals</h1>
        <Link href="/meals/new" className="rounded-lg bg-gold px-3 py-2 text-background">
          Add
        </Link>
      </div>
      {meals.length === 0 ? (
        <p className="text-foreground/70">No meals confirmed yet today.</p>
      ) : (
        meals.map((meal) => {
          const t = sumItems(meal.items);
          return (
            <article key={meal.id} className="rounded-2xl border border-stroke bg-panel p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display">
                  {meal.mealType} · {meal.source}
                </h2>
                <form
                  action={async () => {
                    "use server";
                    await deleteMealAction(meal.id);
                  }}
                >
                  <button className="text-sm text-red-300" type="submit">
                    Remove
                  </button>
                </form>
              </div>
              <ul className="mt-2 text-sm">
                {meal.items.map((item) => (
                  <li key={item.id}>
                    {item.name} ({item.serving}) — {item.calories} kcal, {item.proteinG}p /{" "}
                    {item.carbsG}c / {item.fatG}f
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-gold">
                Total {t.calories} kcal · {Math.round(t.proteinG)}g protein
              </p>
            </article>
          );
        })
      )}
    </main>
  );
}
