import { requireOnboarded } from "@/server/auth/guards";
import { getProgress } from "@/features/progress/queries";
import Link from "next/link";

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await requireOnboarded();
  const { range: raw } = await searchParams;
  const range = raw === "monthly" || raw === "daily" ? raw : "weekly";
  const data = await getProgress(session.userId, range);
  const maxCal = Math.max(...data.series.map((s) => s.calories), 1);

  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">Progress</h1>
      <div className="flex gap-2 text-sm">
        <Link href="/progress?range=daily">Daily</Link>
        <Link href="/progress?range=weekly">Weekly</Link>
        <Link href="/progress?range=monthly">Monthly</Link>
      </div>
      <section className="grid gap-2 rounded-2xl border border-stroke bg-panel p-4 text-sm">
        <p>Average calories: {data.avg.calories}</p>
        <p>Average protein: {data.avg.proteinG}g</p>
        <p>Average carbs: {data.avg.carbsG}g</p>
        <p>Average fat: {data.avg.fatG}g</p>
        <p>Days logged: {data.loggedDays}</p>
        <p>Calorie-balance days: {data.goalDays}</p>
        <p>Quests completed in range: {data.questCompletions}</p>
        <p>
          Streak {data.streak?.current ?? 0} (best {data.streak?.longest ?? 0})
        </p>
      </section>
      <section className="rounded-2xl border border-stroke bg-panel p-4">
        <h2 className="font-display text-gold">Calories</h2>
        <div className="mt-3 flex h-40 items-end gap-1">
          {data.series.map((s) => (
            <div key={s.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-mint"
                style={{ height: `${(s.calories / maxCal) * 100}%` }}
                title={`${s.date}: ${s.calories} kcal`}
              />
            </div>
          ))}
        </div>
      </section>
      {data.weights.length > 0 ? (
        <section className="rounded-2xl border border-stroke bg-panel p-4 text-sm">
          <h2 className="font-display text-gold">Weight log</h2>
          <ul>
            {data.weights.map((w: { id: string; loggedOn: string; kg: number }) => (
              <li key={w.id}>
                {w.loggedOn}: {w.kg} kg
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
