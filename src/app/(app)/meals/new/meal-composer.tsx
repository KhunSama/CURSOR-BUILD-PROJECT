"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeMealAction, type AnalyzeState } from "@/features/ai/actions";
import { saveMealAction, type MealState } from "@/features/meals/actions";
import type { FoodEstimate } from "@/features/ai/foods";
import { Disclaimer } from "@/shared/ui/disclaimer";

const emptyItem = (): FoodEstimate => ({
  name: "",
  serving: "1 serving",
  calories: 100,
  proteinG: 5,
  carbsG: 10,
  fatG: 3,
});

export function MealComposer({ startAi }: { startAi: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<"manual" | "ai">(startAi ? "ai" : "manual");
  const [items, setItems] = useState<FoodEstimate[]>([emptyItem()]);
  const [analyzeState, analyze, analyzing] = useActionState(
    analyzeMealAction,
    {} as AnalyzeState,
  );
  const [saveState, setSaveState] = useState<MealState>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (analyzeState.items?.length) setItems(analyzeState.items);
  }, [analyzeState]);

  const totals = useMemo(
    () =>
      items.reduce(
        (a, i) => ({
          calories: a.calories + Number(i.calories || 0),
          proteinG: a.proteinG + Number(i.proteinG || 0),
        }),
        { calories: 0, proteinG: 0 },
      ),
    [items],
  );

  function patch(idx: number, next: FoodEstimate) {
    setItems((prev) => prev.map((item, i) => (i === idx ? next : item)));
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        <button
          className={`rounded-lg px-3 py-1 ${tab === "manual" ? "bg-gold text-background" : "border border-stroke"}`}
          type="button"
          onClick={() => setTab("manual")}
        >
          Manual
        </button>
        <button
          className={`rounded-lg px-3 py-1 ${tab === "ai" ? "bg-gold text-background" : "border border-stroke"}`}
          type="button"
          onClick={() => setTab("ai")}
        >
          AI estimate
        </button>
      </div>

      {tab === "ai" ? (
        <form action={analyze} className="grid gap-2 rounded-2xl border border-stroke bg-panel p-4">
          <label className="text-sm">
            What did you eat?
            <textarea
              className="mt-1 w-full rounded-md border border-stroke bg-background px-3 py-2"
              name="description"
              rows={3}
              placeholder="I ate two eggs, one bowl of rice and grilled chicken."
              required
            />
          </label>
          <Disclaimer compact />
          {analyzeState.error ? <p className="text-red-300">{analyzeState.error}</p> : null}
          {analyzeState.provider === "fallback" ? (
            <p className="text-xs text-foreground/60">
              Using the built-in estimator (no API key). Edit before confirming.
            </p>
          ) : null}
          <button className="w-fit rounded-lg bg-mint px-4 py-2 text-background" disabled={analyzing} type="submit">
            {analyzing ? "Analyzing…" : "Analyze meal"}
          </button>
        </form>
      ) : null}

      <form
        action={async (fd) => {
          fd.set("itemsJson", JSON.stringify(items));
          setSaving(true);
          const result = await saveMealAction({} as MealState, fd);
          setSaving(false);
          setSaveState(result);
          if (result.ok) router.push("/dashboard");
        }}
        className="grid gap-3"
      >
        <input type="hidden" name="source" value={tab === "ai" ? "AI" : "MANUAL"} />
        <label className="text-sm">
          Meal
          <select className="mt-1 w-full rounded-md border border-stroke bg-panel px-3 py-2" name="mealType" defaultValue="LUNCH">
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
          </select>
        </label>

        {items.map((item, idx) => (
          <div key={idx} className="grid gap-2 rounded-xl border border-stroke bg-panel p-3 md:grid-cols-6">
            <input className="rounded border border-stroke bg-background px-2 py-1 md:col-span-2" placeholder="Food" value={item.name} onChange={(e) => patch(idx, { ...item, name: e.target.value })} />
            <input className="rounded border border-stroke bg-background px-2 py-1" placeholder="Serving" value={item.serving} onChange={(e) => patch(idx, { ...item, serving: e.target.value })} />
            <input className="rounded border border-stroke bg-background px-2 py-1" type="number" placeholder="kcal" value={item.calories} onChange={(e) => patch(idx, { ...item, calories: Number(e.target.value) })} />
            <input className="rounded border border-stroke bg-background px-2 py-1" type="number" step="0.1" placeholder="P" value={item.proteinG} onChange={(e) => patch(idx, { ...item, proteinG: Number(e.target.value) })} />
            <div className="flex gap-1">
              <input className="w-full rounded border border-stroke bg-background px-2 py-1" type="number" step="0.1" placeholder="C" value={item.carbsG} onChange={(e) => patch(idx, { ...item, carbsG: Number(e.target.value) })} />
              <input className="w-full rounded border border-stroke bg-background px-2 py-1" type="number" step="0.1" placeholder="F" value={item.fatG} onChange={(e) => patch(idx, { ...item, fatG: Number(e.target.value) })} />
              <button className="text-red-300" type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))}>×</button>
            </div>
          </div>
        ))}

        <button className="w-fit text-sm underline" type="button" onClick={() => setItems([...items, emptyItem()])}>
          Add missing item
        </button>

        <p className="text-gold">
          Draft total {Math.round(totals.calories)} kcal · {Math.round(totals.proteinG)}g protein
        </p>
        {saveState.error ? <p className="text-red-300">{saveState.error}</p> : null}
        <button className="w-fit rounded-lg bg-gold px-4 py-2 font-display text-background" disabled={saving} type="submit">
          {saving ? "Saving…" : "Confirm meal"}
        </button>
      </form>
    </div>
  );
}
