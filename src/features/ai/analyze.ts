import { heuristicAnalyze, type FoodEstimate } from "@/features/ai/foods";
import {
  extractJsonObject,
  nvidiaChat,
  nvidiaConfigured,
} from "@/server/ai/nvidia";

const SYSTEM = `You estimate nutrition for meals from a short description.
Return ONLY JSON: {"items":[{"name":string,"serving":string,"calories":number,"proteinG":number,"carbsG":number,"fatG":number}]}
Values are estimates, not lab measurements. Split into distinct foods. Do not give medical advice.`;

export async function analyzeMealDescription(text: string): Promise<{
  items: FoodEstimate[];
  provider: "nvidia" | "fallback";
}> {
  const trimmed = text.trim();
  if (!trimmed) return { items: [], provider: "fallback" };

  if (!nvidiaConfigured()) {
    return { items: heuristicAnalyze(trimmed), provider: "fallback" };
  }

  try {
    const result = await nvidiaChat({
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: trimmed },
      ],
    });
    if (!result) {
      return { items: heuristicAnalyze(trimmed), provider: "fallback" };
    }
    const jsonText = extractJsonObject(result.content) ?? extractJsonObject(result.reasoning ?? "");
    if (!jsonText) {
      return { items: heuristicAnalyze(trimmed), provider: "fallback" };
    }
    const parsed = JSON.parse(jsonText) as { items?: FoodEstimate[] };
    const items = (parsed.items ?? []).filter(
      (i) => i && i.name && i.calories > 0,
    );
    if (!items.length) {
      return { items: heuristicAnalyze(trimmed), provider: "fallback" };
    }
    return { items, provider: "nvidia" };
  } catch {
    return { items: heuristicAnalyze(trimmed), provider: "fallback" };
  }
}
