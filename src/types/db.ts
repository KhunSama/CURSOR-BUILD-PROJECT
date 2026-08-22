export type MealItemView = {
  id: string;
  name: string;
  serving: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type MealView = {
  id: string;
  mealType: string;
  source: string;
  items: MealItemView[];
};

export type CoachMessageView = {
  id: string;
  role: string;
  content: string;
};

export type AchievementRow = { key: string };
export type QuestRow = { questKey: string; completed: boolean };
export type WeightRow = { id: string; loggedOn: string; kg: number };
