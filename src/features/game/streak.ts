import { daysBetween } from "@/shared/lib/dates";

export function nextStreak(
  lastActiveDate: string | null,
  today: string,
  current: number,
) {
  if (lastActiveDate === today) {
    return { current, longestCandidate: current, isNewDay: false };
  }
  if (lastActiveDate && daysBetween(lastActiveDate, today) === 1) {
    const next = current + 1;
    return { current: next, longestCandidate: next, isNewDay: true };
  }
  return { current: 1, longestCandidate: 1, isNewDay: true };
}
