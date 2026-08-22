import { prisma } from "@/server/db";
import { requireOnboarded } from "@/server/auth/guards";
import { ACHIEVEMENTS } from "@/features/game/config";

export default async function AchievementsPage() {
  const session = await requireOnboarded();
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId: session.userId },
  });
  const keys = new Set(unlocked.map((u) => u.key));
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">Achievements</h1>
      <ul className="grid gap-3 md:grid-cols-2">
        {ACHIEVEMENTS.map((a) => (
          <li
            key={a.key}
            className={`rounded-2xl border p-4 ${keys.has(a.key) ? "border-gold bg-panel" : "border-stroke bg-background/40 opacity-60"}`}
          >
            <h2 className="font-display">{a.name}</h2>
            <p className="text-sm">{a.description}</p>
            <p className="text-xs text-gold">{keys.has(a.key) ? "Unlocked" : "Locked"}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
