import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-3xl flex-col gap-8 px-6 py-16">
      <p className="font-display text-gold">AI Calorie Quest</p>
      <h1 className="font-display text-4xl leading-tight md:text-6xl">
        Log a meal. Confirm the estimate. Level up.
      </h1>
      <p className="max-w-xl text-lg text-foreground/80">
        Nutrition tracking for people who find food databases tedious. Describe
        what you ate, review the AI guess, and earn XP for staying consistent —
        without pretending this is medical care.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-lg bg-gold px-5 py-2.5 font-display text-background"
        >
          Start quest
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-stroke px-5 py-2.5"
        >
          Log in
        </Link>
      </div>
      <ul className="grid gap-3 text-sm text-foreground/75 md:grid-cols-3">
        <li className="rounded-xl border border-stroke bg-panel p-4">
          Fast logging — type a sentence or enter foods yourself.
        </li>
        <li className="rounded-xl border border-stroke bg-panel p-4">
          You confirm every AI estimate before it hits your day.
        </li>
        <li className="rounded-xl border border-stroke bg-panel p-4">
          Quests, streaks, and levels for showing up — not starving.
        </li>
      </ul>
    </main>
  );
}
