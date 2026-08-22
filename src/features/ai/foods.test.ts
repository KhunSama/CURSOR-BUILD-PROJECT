import { describe, expect, it } from "vitest";
import { heuristicAnalyze } from "./foods";

describe("heuristicAnalyze", () => {
  it("splits a classic student meal into foods", () => {
    const items = heuristicAnalyze(
      "I ate two eggs, one bowl of rice and grilled chicken",
    );
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(items.some((i) => /egg/i.test(i.name))).toBe(true);
    expect(items.reduce((a, i) => a + i.calories, 0)).toBeGreaterThan(400);
  });
});
