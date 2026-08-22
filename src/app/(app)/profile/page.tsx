import { prisma } from "@/server/db";
import { requireOnboarded } from "@/server/auth/guards";
import { getXpSummary } from "@/features/game/engine";
import { ProfileForms } from "./profile-forms";

export default async function ProfilePage() {
  const session = await requireOnboarded();
  const [user, xp, badges] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
      include: { profile: true, nutritionGoal: true, streak: true },
    }),
    getXpSummary(session.userId),
    prisma.userAchievement.count({ where: { userId: session.userId } }),
  ]);

  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">Profile / settings</h1>
      <ProfileForms
        name={user.name}
        weightKg={user.profile?.weightKg ?? 70}
        calories={user.nutritionGoal?.calories ?? 2000}
        proteinG={user.nutritionGoal?.proteinG ?? 120}
        carbsG={user.nutritionGoal?.carbsG ?? 220}
        fatG={user.nutritionGoal?.fatG ?? 65}
        title={user.profile?.title ?? "Novice Tracker"}
        level={xp.level}
        xp={xp.totalXp}
        streak={user.streak?.current ?? 0}
        badges={badges}
      />
    </main>
  );
}
