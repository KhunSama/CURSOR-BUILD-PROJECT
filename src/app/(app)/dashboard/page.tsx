import Link from "next/link";
import { requireOnboarded } from "@/server/auth/guards";
import { getDashboardData } from "@/features/meals/queries";
import { MacroBar } from "@/shared/ui/macro-bar";
import { Disclaimer } from "@/shared/ui/disclaimer";

export default async function DashboardPage() {
  const session = await requireOnboarded();
  const data = await getDashboardData(session.userId);
  const goal = data.goal;
  const xpPct = Math.round((data.xp.into / data.xp.next) * 100);

  return (
    <main className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gold">Today · {data.date}</p>
        <h1 className="font-display text-3xl">
          {data.totals.calories} / {goal?.calories ?? "—"} kcal
        </h1>
        <p className="text-foreground/70">
          {data.remaining.calories} remaining · {data.profile?.title}
        </p>
      </div>

      <section className="grid gap-3 rounded-2xl border border-stroke bg-panel p-4">
        <MacroBar label="Protein" value={data.totals.proteinG} max={goal?.proteinG ?? 1} unit="g" />
        <MacroBar label="Carbs" value={data.totals.carbsG} max={goal?.carbsG ?? 1} unit="g" />
        <MacroBar label="Fat" value={data.totals.fatG} max={goal?.fatG ?? 1} unit="g" />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link className="rounded-lg bg-gold px-4 py-2 font-display text-background" href="/meals/new">
          + Add meal
        </Link>
        <Link className="rounded-lg border border-stroke px-4 py-2" href="/meals/new?ai=1">
          Analyze with AI
        </Link>
        <Link className="rounded-lg border border-stroke px-4 py-2" href="/coach">
          Ask AI coach
        </Link>
        <Link className="rounded-lg border border-stroke px-4 py-2" href="/meals">
          Today&apos;s meals
        </Link>
        <Link className="rounded-lg border border-stroke px-4 py-2" href="/progress">
          Progress
        </Link>
      </div>
      <Disclaimer compact />

      <section className="rounded-2xl border border-stroke bg-panel p-4">
        <h2 className="font-display text-xl text-gold">Today&apos;s quests</h2>
        <ul className="mt-3 space-y-2">
          {data.quests.map((q) => (
            <li key={q.key} className="flex justify-between gap-3 text-sm">
              <span>
                {q.completed ? "☑" : "☐"} {q.name} — {q.description}
              </span>
              <span className="text-gold">+{q.xp} XP</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stroke bg-panel p-4">
        <div>
          <p className="font-display text-2xl">Level {data.xp.level}</p>
          <p className="text-sm">
            {data.xp.into} / {data.xp.next} XP
          </p>
          <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-stroke">
            <div className="h-full bg-gold" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
        <p className="text-lg">🔥 {data.streak?.current ?? 0} day streak</p>
      </section>
    </main>
  );
}
