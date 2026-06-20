export interface Patient {
  id: number;
  name: string;
  email: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  goal?: string;
  createdAt?: string;
}

export interface MealPlan {
  id: number;
  patient: Patient;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  createdAt?: string;
}

export interface Message {
  id: number;
  patient: Patient;
  sender?: string;
  content: string;
  sentAt?: string;
}

export interface DailyMeal {
  id: number;
  mealPlan: MealPlan;
  recipe?: Recipe;
  dayOfWeek?: string;
  mealType?: string;
  notes?: string;
  createdAt?: string;
}

export interface FoodLog {
  id: number;
  patient: Patient;
  recipe?: Recipe;
  loggedAt?: string;
  quantity?: number;
  notes?: string;
}

export interface PlanHistory {
  id: number;
  patient: Patient;
  mealPlan: MealPlan;
  reason: string;
  changedAt?: string;
}

export interface MedicalStaff {
  id: number;
  name: string;
  email: string;
  specialty: string;
  phone?: string;
  licenseNumber?: string;
  isActive: boolean;
  createdAt?: string;
}

// DTOs para crear/actualizar recursos
export interface CreateMealPlanRequest {
  patientId: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateMealPlanRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateDailyMealRequest {
  recipeId?: number;
  dayOfWeek?: string;
  mealType?: string;
  notes?: string;
}

export interface UpdateDailyMealRequest {
  recipeId?: number;
  dayOfWeek?: string;
  mealType?: string;
  notes?: string;
}

export interface CreateRecipeRequest {
  name: string;
  description?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
}

export interface CreateFoodLogRequest {
  patientId: number;
  recipeId?: number;
  quantity?: number;
  notes?: string;
}

export interface CreatePlanHistoryRequest {
  patientId: number;
  mealPlanId: number;
  reason: string;
}

export interface CreatePlanTrackingRequest {
  patientId: number;
  recipeId?: number;
  quantity?: number;
  notes?: string;
}
