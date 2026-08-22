export const XP = {
  LOG_MEAL: 10,
  CALORIE_GOAL: 50,
  PROTEIN_GOAL: 50,
  STREAK_DAY: 10,
  QUEST_PROTEIN_HUNTER: 100,
  QUEST_CONSISTENT_TRACKER: 50,
  QUEST_CALORIE_BALANCE: 100,
} as const;

export const XP_PER_LEVEL = 1000;

export const QUESTS = [
  {
    key: "protein_hunter",
    name: "Protein Hunter",
    description: "Reach your daily protein target.",
    xp: XP.QUEST_PROTEIN_HUNTER,
  },
  {
    key: "consistent_tracker",
    name: "Consistent Tracker",
    description: "Log breakfast, lunch, and dinner today.",
    xp: XP.QUEST_CONSISTENT_TRACKER,
  },
  {
    key: "calorie_balance",
    name: "Calorie Balance",
    description: "Stay within 90–110% of your calorie target.",
    xp: XP.QUEST_CALORIE_BALANCE,
  },
] as const;

export const ACHIEVEMENTS = [
  { key: "first_meal", name: "First Meal", description: "Log your first meal." },
  { key: "streak_7", name: "7-Day Streak", description: "Track meals for 7 consecutive days." },
  { key: "protein_master", name: "Protein Master", description: "Hit your protein goal on 5 days." },
  { key: "data_collector", name: "Data Collector", description: "Log 50 meals." },
  { key: "level_10", name: "Level 10", description: "Reach level 10." },
  { key: "consistency_king", name: "Consistency King", description: "Reach a 30-day streak." },
] as const;

export function levelFromXp(totalXp: number) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const into = totalXp % XP_PER_LEVEL;
  return { level, into, next: XP_PER_LEVEL, totalXp };
}

export function titleForLevel(level: number) {
  if (level >= 20) return "Nutrition Legend";
  if (level >= 10) return "Nutrition Warrior";
  if (level >= 5) return "Meal Ranger";
  return "Novice Tracker";
}
