import { requireOnboarded } from "@/server/auth/guards";
import { getDashboardData } from "@/features/meals/queries";

export default async function QuestsPage() {
  const session = await requireOnboarded();
  const data = await getDashboardData(session.userId);
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">Daily quests</h1>
      <p className="text-sm text-foreground/70">
        Quests reward logging and balanced intake — not eating as little as possible.
      </p>
      <ul className="grid gap-3">
        {data.quests.map((q) => (
          <li key={q.key} className="rounded-2xl border border-stroke bg-panel p-4">
            <h2 className="font-display">
              {q.completed ? "Complete" : "In progress"} · {q.name}
            </h2>
            <p className="text-sm">{q.description}</p>
            <p className="text-gold">+{q.xp} XP</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
