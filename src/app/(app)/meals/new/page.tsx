import { MealComposer } from "./meal-composer";

export default async function NewMealPage({
  searchParams,
}: {
  searchParams: Promise<{ ai?: string }>;
}) {
  const { ai } = await searchParams;
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">Log meal</h1>
      <p className="text-sm text-foreground/70">
        Confirm the list below. Nothing counts toward today until you save.
      </p>
      <MealComposer startAi={ai === "1"} />
    </main>
  );
}
