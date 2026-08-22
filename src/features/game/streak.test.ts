import { describe, expect, it } from "vitest";
import { nextStreak } from "./streak";

describe("nextStreak", () => {
  it("starts at 1 on the first log", () => {
    expect(nextStreak(null, "2026-08-22", 0)).toEqual({
      current: 1,
      longestCandidate: 1,
      isNewDay: true,
    });
  });

  it("does not increment twice the same day", () => {
    expect(nextStreak("2026-08-22", "2026-08-22", 4).isNewDay).toBe(false);
    expect(nextStreak("2026-08-22", "2026-08-22", 4).current).toBe(4);
  });

  it("increments on consecutive days and resets after a gap", () => {
    expect(nextStreak("2026-08-21", "2026-08-22", 3).current).toBe(4);
    expect(nextStreak("2026-08-20", "2026-08-22", 3).current).toBe(1);
  });
});
