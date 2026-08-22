export type FoodEstimate = {
  name: string;
  serving: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export const FOOD_DB: { keys: string[]; food: FoodEstimate }[] = [
  { keys: ["egg", "eggs"], food: { name: "Egg", serving: "1 large", calories: 70, proteinG: 6, carbsG: 0.5, fatG: 5 } },
  { keys: ["rice", "bowl of rice"], food: { name: "White rice", serving: "1 bowl (150g cooked)", calories: 200, proteinG: 4, carbsG: 45, fatG: 0.4 } },
  { keys: ["chicken", "grilled chicken"], food: { name: "Grilled chicken", serving: "150g", calories: 248, proteinG: 46, carbsG: 0, fatG: 5 } },
  { keys: ["banana"], food: { name: "Banana", serving: "1 medium", calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4 } },
  { keys: ["oat", "oatmeal"], food: { name: "Oatmeal", serving: "1 cup cooked", calories: 166, proteinG: 6, carbsG: 28, fatG: 3.6 } },
  { keys: ["milk"], food: { name: "Milk", serving: "1 cup", calories: 122, proteinG: 8, carbsG: 12, fatG: 5 } },
  { keys: ["bread", "toast"], food: { name: "Bread", serving: "1 slice", calories: 80, proteinG: 3, carbsG: 14, fatG: 1 } },
  { keys: ["apple"], food: { name: "Apple", serving: "1 medium", calories: 95, proteinG: 0.5, carbsG: 25, fatG: 0.3 } },
  { keys: ["salmon"], food: { name: "Salmon", serving: "120g", calories: 250, proteinG: 25, carbsG: 0, fatG: 16 } },
  { keys: ["tofu"], food: { name: "Tofu", serving: "100g", calories: 76, proteinG: 8, carbsG: 2, fatG: 5 } },
  { keys: ["yogurt", "yoghurt"], food: { name: "Greek yogurt", serving: "150g", calories: 130, proteinG: 12, carbsG: 6, fatG: 5 } },
  { keys: ["noodle", "noodles", "pasta"], food: { name: "Pasta", serving: "1 bowl cooked", calories: 220, proteinG: 8, carbsG: 43, fatG: 1.3 } },
  { keys: ["beef"], food: { name: "Beef", serving: "100g", calories: 250, proteinG: 26, carbsG: 0, fatG: 15 } },
  { keys: ["pork"], food: { name: "Pork", serving: "100g", calories: 242, proteinG: 27, carbsG: 0, fatG: 14 } },
  { keys: ["salad"], food: { name: "Mixed salad", serving: "1 bowl", calories: 80, proteinG: 3, carbsG: 10, fatG: 3 } },
  { keys: ["avocado"], food: { name: "Avocado", serving: "1/2 fruit", calories: 120, proteinG: 1.5, carbsG: 6, fatG: 11 } },
  { keys: ["peanut"], food: { name: "Peanut butter", serving: "1 tbsp", calories: 94, proteinG: 4, carbsG: 3, fatG: 8 } },
  { keys: ["coffee"], food: { name: "Black coffee", serving: "1 cup", calories: 2, proteinG: 0.3, carbsG: 0, fatG: 0 } },
];

function qtyFrom(chunk: string) {
  const two = /\btwo\b|\b2\b/i.test(chunk);
  const three = /\bthree\b|\b3\b/i.test(chunk);
  if (three) return 3;
  if (two) return 2;
  const n = chunk.match(/(\d+(\.\d+)?)/);
  if (n) return Math.min(8, Number(n[1]));
  return 1;
}

export function heuristicAnalyze(text: string): FoodEstimate[] {
  const chunks = text
    .toLowerCase()
    .split(/,| and | \+ |;|\n/)
    .map((c) => c.trim())
    .filter(Boolean);
  const items: FoodEstimate[] = [];
  for (const chunk of chunks) {
    const hit = FOOD_DB.find((row) => row.keys.some((k) => chunk.includes(k)));
    const qty = qtyFrom(chunk);
    if (hit) {
      items.push({
        name: hit.food.name,
        serving: qty === 1 ? hit.food.serving : `${qty} × ${hit.food.serving}`,
        calories: Math.round(hit.food.calories * qty),
        proteinG: Math.round(hit.food.proteinG * qty * 10) / 10,
        carbsG: Math.round(hit.food.carbsG * qty * 10) / 10,
        fatG: Math.round(hit.food.fatG * qty * 10) / 10,
      });
    }
  }
  if (items.length === 0) {
    items.push({
      name: text.slice(0, 60) || "Mixed meal",
      serving: "1 serving (estimate)",
      calories: 450,
      proteinG: 25,
      carbsG: 45,
      fatG: 15,
    });
  }
  return items;
}
