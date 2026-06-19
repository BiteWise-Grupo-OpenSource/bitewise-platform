export type MealKind = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type MealPlanStatus = 'active' | 'review' | 'draft';
export type NutritionGoal = 'weightLoss' | 'muscleGain' | 'clinicalNutrition' | 'energy';
export type RecipeDifficulty = 'easy' | 'medium';

export interface MacroTarget {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export interface FoodItem {
  id: string;
  nameKey: string;
  servingKey: string;
  calories: number;
  macros: MacroTarget;
  tags: string[];
}

export interface MealItem {
  id: string;
  meal: MealKind;
  foodKey: string;
  portionKey: string;
  calories: number;
  macros: MacroTarget;
}

export interface MealPlanDay {
  id: string;
  dayKey: string;
  date: string;
  target: MacroTarget;
  items: MealItem[];
  completed: boolean;
}

export interface MealPlan {
  id: string;
  patientId: string;
  patientName: string;
  titleKey: string;
  goal: NutritionGoal;
  status: MealPlanStatus;
  startDate: string;
  endDate: string;
  dailyTarget: MacroTarget;
  adherence: number;
  assignedBy: string;
  days: MealPlanDay[];
}

export interface FoodLogEntry {
  id: string;
  foodId: string;
  foodKey: string;
  meal: MealKind;
  loggedAt: string;
  portionKey: string;
  calories: number;
  macros: MacroTarget;
}

export interface Recipe {
  id: string;
  titleKey: string;
  summaryKey: string;
  goal: NutritionGoal;
  prepMinutes: number;
  difficulty: RecipeDifficulty;
  calories: number;
  macros: MacroTarget;
  tagKeys: string[];
}
