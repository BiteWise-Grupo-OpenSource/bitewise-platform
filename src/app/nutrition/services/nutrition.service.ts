import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import {
  FoodItem,
  FoodLogEntry,
  MacroTarget,
  MealItem,
  MealKind,
  MealPlan,
  MealPlanDay,
  NutritionGoal,
  Recipe
} from '../model/nutrition.models';

interface BackendPatient {
  id: number;
  name: string;
  email: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  goal?: string;
}

interface BackendRecipe {
  id: number;
  name: string;
  description?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
}

interface BackendMealPlan {
  id: number;
  patient: BackendPatient;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface BackendDailyMeal {
  id: number;
  mealPlan: BackendMealPlan;
  recipe?: BackendRecipe;
  dayOfWeek?: string;
  mealType?: string;
  notes?: string;
}

const ZERO_MACROS: MacroTarget = {
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0
};

const DEFAULT_TARGET: MacroTarget = {
  calories: 1800,
  proteinG: 125,
  carbsG: 185,
  fatG: 58,
  fiberG: 28
};

@Injectable({ providedIn: 'root' })
export class NutritionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  private readonly plansData = signal<MealPlan[]>(this.createPlans());
  private readonly foodsData = signal<FoodItem[]>(this.createFoods());
  private readonly recipesData = signal<Recipe[]>(this.createRecipes());
  private readonly logData = signal<FoodLogEntry[]>([
    this.createLogEntry('food-oats', 'breakfast', '2026-06-19T07:35:00'),
    this.createLogEntry('food-chicken-bowl', 'lunch', '2026-06-19T13:05:00')
  ]);
  private readonly selectedPlanId = signal<string>('plan-andrea');
  private readonly selectedGoal = signal<NutritionGoal | 'all'>('all');

  readonly plans = this.plansData.asReadonly();
  readonly foods = this.foodsData.asReadonly();
  readonly foodLog = this.logData.asReadonly();
  readonly selectedRecipeGoal = this.selectedGoal.asReadonly();

  readonly patientPlan = computed<MealPlan | null>(() => this.plansData().find((plan) => plan.patientId === 'p-001') ?? null);
  readonly selectedPlan = computed<MealPlan | null>(() => {
    const id = this.selectedPlanId();
    return this.plansData().find((plan) => plan.id === id) ?? this.plansData()[0] ?? null;
  });
  readonly recipes = computed(() => {
    const goal = this.selectedGoal();
    return goal === 'all'
      ? this.recipesData()
      : this.recipesData().filter((recipe) => recipe.goal === goal);
  });
  readonly todayTotals = computed(() => this.sumMacros(this.logData().map((entry) => entry.macros)));

  constructor() {
    this.loadBackendData();
  }

  selectPlan(planId: string): void {
    this.selectedPlanId.set(planId);
  }

  filterRecipes(goal: NutritionGoal | 'all'): void {
    this.selectedGoal.set(goal);
  }

  addLogEntry(foodId: string, meal: MealKind): void {
    const entry = this.createLogEntry(foodId, meal, new Date().toISOString());

    this.logData.update((entries) => [...entries, entry]);

    this.http
      .post(this.apiUrl.endpoint('food-logs'), {
        patientId: 1,
        recipeId: this.backendId(foodId),
        loggedAt: entry.loggedAt,
        quantity: 1,
        notes: meal
      })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  dayTotals(day: MealPlanDay): MacroTarget {
    return this.sumMacros(day.items.map((item) => item.macros));
  }

  targetProgress(current: number, target: number): number {
    if (target <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((current / target) * 100));
  }

  private loadBackendData(): void {
    forkJoin({
      recipes: this.http.get<BackendRecipe[]>(this.apiUrl.endpoint('recipes')).pipe(catchError(() => of<BackendRecipe[]>([]))),
      plans: this.http.get<BackendMealPlan[]>(this.apiUrl.endpoint('meal-plans')).pipe(catchError(() => of<BackendMealPlan[]>([]))),
      dailyMeals: this.http.get<BackendDailyMeal[]>(this.apiUrl.endpoint('daily-meals')).pipe(catchError(() => of<BackendDailyMeal[]>([])))
    }).subscribe(({ recipes, plans, dailyMeals }) => {
      if (recipes.length) {
        this.recipesData.set(recipes.map((recipe) => this.mapRecipe(recipe)));
        this.foodsData.set(recipes.map((recipe) => this.mapFood(recipe)));
      }

      if (plans.length) {
        const mappedPlans = plans.map((plan) =>
          this.mapPlan(plan, dailyMeals.filter((meal) => meal.mealPlan.id === plan.id))
        );
        this.plansData.set(mappedPlans);
        this.selectedPlanId.set(mappedPlans[0]?.id ?? this.selectedPlanId());
      }
    });
  }

  private mapPlan(plan: BackendMealPlan, dailyMeals: BackendDailyMeal[]): MealPlan {
    return {
      id: String(plan.id),
      patientId: String(plan.patient.id),
      patientName: plan.patient.name,
      titleKey: plan.title,
      goal: this.toNutritionGoal(plan.patient.goal),
      status: 'active',
      startDate: plan.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: plan.endDate ?? plan.startDate ?? new Date().toISOString().slice(0, 10),
      dailyTarget: this.estimateTarget(dailyMeals),
      adherence: 0,
      assignedBy: 'BiteWise',
      days: this.groupDailyMeals(plan, dailyMeals)
    };
  }

  private groupDailyMeals(plan: BackendMealPlan, dailyMeals: BackendDailyMeal[]): MealPlanDay[] {
    const grouped = new Map<string, BackendDailyMeal[]>();

    for (const meal of dailyMeals) {
      const key = meal.dayOfWeek ?? 'Day';
      grouped.set(key, [...(grouped.get(key) ?? []), meal]);
    }

    return Array.from(grouped.entries()).map(([dayName, meals], index) =>
      this.day(
        `${plan.id}-${dayName}`,
        dayName,
        this.addDays(plan.startDate, index),
        this.estimateTarget(meals),
        meals.map((meal) => this.mapMealItem(meal))
      )
    );
  }

  private mapMealItem(meal: BackendDailyMeal): MealItem {
    const macros = this.recipeMacros(meal.recipe);

    return {
      id: String(meal.id),
      meal: this.toMealKind(meal.mealType),
      foodKey: meal.recipe?.name ?? meal.notes ?? 'Meal',
      portionKey: meal.notes ?? '1 serving',
      calories: macros.calories,
      macros
    };
  }

  private mapRecipe(recipe: BackendRecipe): Recipe {
    return {
      id: `recipe-${recipe.id}`,
      titleKey: recipe.name,
      summaryKey: recipe.description ?? recipe.name,
      goal: 'energy',
      prepMinutes: 20,
      difficulty: 'easy',
      calories: recipe.calories ?? 0,
      macros: this.recipeMacros(recipe),
      tagKeys: ['BiteWise']
    };
  }

  private mapFood(recipe: BackendRecipe): FoodItem {
    const macros = this.recipeMacros(recipe);

    return {
      id: `recipe-${recipe.id}`,
      nameKey: recipe.name,
      servingKey: '1 serving',
      calories: macros.calories,
      macros,
      tags: ['backend']
    };
  }

  private recipeMacros(recipe?: BackendRecipe): MacroTarget {
    return {
      calories: recipe?.calories ?? 0,
      proteinG: Number(recipe?.proteinG ?? 0),
      carbsG: Number(recipe?.carbsG ?? 0),
      fatG: Number(recipe?.fatG ?? 0),
      fiberG: 0
    };
  }

  private estimateTarget(meals: BackendDailyMeal[]): MacroTarget {
    const macros = this.sumMacros(meals.map((meal) => this.recipeMacros(meal.recipe)));
    return macros.calories > 0 ? macros : DEFAULT_TARGET;
  }

  private addDays(date: string | undefined, days: number): string {
    const value = date ? new Date(`${date}T00:00:00`) : new Date();
    value.setDate(value.getDate() + days);
    return value.toISOString().slice(0, 10);
  }

  private toMealKind(value: string | undefined): MealKind {
    const normalized = value?.toLowerCase();
    return normalized === 'breakfast' || normalized === 'lunch' || normalized === 'dinner' || normalized === 'snack'
      ? normalized
      : 'lunch';
  }

  private toNutritionGoal(value: string | undefined): NutritionGoal {
    const normalized = value?.trim().toLowerCase() ?? '';

    if (normalized.includes('muscle')) {
      return 'muscleGain';
    }

    if (normalized.includes('clinical') || normalized.includes('diabetes') || normalized.includes('hypertension')) {
      return 'clinicalNutrition';
    }

    if (normalized.includes('weight') || normalized.includes('loss')) {
      return 'weightLoss';
    }

    return 'energy';
  }

  private backendId(id: string): number | null {
    const match = id.match(/\d+$/);
    return match ? Number(match[0]) : null;
  }

  private sumMacros(macros: MacroTarget[]): MacroTarget {
    return macros.reduce<MacroTarget>(
      (total, value) => ({
        calories: total.calories + value.calories,
        proteinG: total.proteinG + value.proteinG,
        carbsG: total.carbsG + value.carbsG,
        fatG: total.fatG + value.fatG,
        fiberG: total.fiberG + value.fiberG
      }),
      { ...ZERO_MACROS }
    );
  }

  private createLogEntry(foodId: string, meal: MealKind, loggedAt: string): FoodLogEntry {
    const food = this.foodsData().find((item) => item.id === foodId) ?? this.foodsData()[0];

    return {
      id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      foodId: food.id,
      foodKey: food.nameKey,
      meal,
      loggedAt,
      portionKey: food.servingKey,
      calories: food.calories,
      macros: food.macros
    };
  }

  private item(id: string, meal: MealKind, foodKey: string, portionKey: string, macros: MacroTarget): MealItem {
    return {
      id,
      meal,
      foodKey,
      portionKey,
      calories: macros.calories,
      macros
    };
  }

  private day(
    id: string,
    dayKey: string,
    date: string,
    target: MacroTarget,
    items: MealItem[],
    completed = false
  ): MealPlanDay {
    return {
      id,
      dayKey,
      date,
      target,
      items,
      completed
    };
  }

  private createPlans(): MealPlan[] {
    const target1800: MacroTarget = { calories: 1800, proteinG: 125, carbsG: 185, fatG: 58, fiberG: 28 };
    const target2000: MacroTarget = { calories: 2000, proteinG: 150, carbsG: 210, fatG: 62, fiberG: 32 };

    const andreaDays = [
      this.day('andrea-mon', 'nutrition.days.mon', '2026-06-15', target1800, [
        this.item('mon-1', 'breakfast', 'nutrition.foods.oats', 'nutrition.portions.bowl', {
          calories: 390,
          proteinG: 24,
          carbsG: 48,
          fatG: 12,
          fiberG: 9
        }),
        this.item('mon-2', 'lunch', 'nutrition.foods.chickenBowl', 'nutrition.portions.plate', {
          calories: 540,
          proteinG: 44,
          carbsG: 52,
          fatG: 15,
          fiberG: 8
        }),
        this.item('mon-3', 'dinner', 'nutrition.foods.salmonQuinoa', 'nutrition.portions.plate', {
          calories: 610,
          proteinG: 42,
          carbsG: 50,
          fatG: 24,
          fiberG: 7
        })
      ], true),
      this.day('andrea-tue', 'nutrition.days.tue', '2026-06-16', target1800, [
        this.item('tue-1', 'breakfast', 'nutrition.foods.toast', 'nutrition.portions.twoSlices', {
          calories: 340,
          proteinG: 18,
          carbsG: 36,
          fatG: 14,
          fiberG: 8
        }),
        this.item('tue-2', 'lunch', 'nutrition.foods.lentilStew', 'nutrition.portions.bowl', {
          calories: 520,
          proteinG: 30,
          carbsG: 68,
          fatG: 12,
          fiberG: 18
        }),
        this.item('tue-3', 'snack', 'nutrition.foods.greekYogurt', 'nutrition.portions.cup', {
          calories: 180,
          proteinG: 18,
          carbsG: 18,
          fatG: 4,
          fiberG: 2
        })
      ], true),
      this.day('andrea-wed', 'nutrition.days.wed', '2026-06-17', target1800, [
        this.item('wed-1', 'breakfast', 'nutrition.foods.oats', 'nutrition.portions.bowl', {
          calories: 390,
          proteinG: 24,
          carbsG: 48,
          fatG: 12,
          fiberG: 9
        }),
        this.item('wed-2', 'lunch', 'nutrition.foods.turkeyWrap', 'nutrition.portions.wrap', {
          calories: 480,
          proteinG: 38,
          carbsG: 46,
          fatG: 14,
          fiberG: 7
        }),
        this.item('wed-3', 'dinner', 'nutrition.foods.vegetableCurry', 'nutrition.portions.bowl', {
          calories: 560,
          proteinG: 24,
          carbsG: 70,
          fatG: 19,
          fiberG: 14
        })
      ], true),
      this.day('andrea-thu', 'nutrition.days.thu', '2026-06-18', target1800, [
        this.item('thu-1', 'breakfast', 'nutrition.foods.toast', 'nutrition.portions.twoSlices', {
          calories: 340,
          proteinG: 18,
          carbsG: 36,
          fatG: 14,
          fiberG: 8
        }),
        this.item('thu-2', 'lunch', 'nutrition.foods.chickenBowl', 'nutrition.portions.plate', {
          calories: 540,
          proteinG: 44,
          carbsG: 52,
          fatG: 15,
          fiberG: 8
        }),
        this.item('thu-3', 'snack', 'nutrition.foods.appleAlmonds', 'nutrition.portions.snack', {
          calories: 210,
          proteinG: 6,
          carbsG: 24,
          fatG: 11,
          fiberG: 6
        })
      ], true),
      this.day('andrea-fri', 'nutrition.days.fri', '2026-06-19', target1800, [
        this.item('fri-1', 'breakfast', 'nutrition.foods.oats', 'nutrition.portions.bowl', {
          calories: 390,
          proteinG: 24,
          carbsG: 48,
          fatG: 12,
          fiberG: 9
        }),
        this.item('fri-2', 'lunch', 'nutrition.foods.chickenBowl', 'nutrition.portions.plate', {
          calories: 540,
          proteinG: 44,
          carbsG: 52,
          fatG: 15,
          fiberG: 8
        }),
        this.item('fri-3', 'dinner', 'nutrition.foods.salmonQuinoa', 'nutrition.portions.plate', {
          calories: 610,
          proteinG: 42,
          carbsG: 50,
          fatG: 24,
          fiberG: 7
        })
      ]),
      this.day('andrea-sat', 'nutrition.days.sat', '2026-06-20', target1800, [
        this.item('sat-1', 'breakfast', 'nutrition.foods.greekYogurt', 'nutrition.portions.cup', {
          calories: 180,
          proteinG: 18,
          carbsG: 18,
          fatG: 4,
          fiberG: 2
        }),
        this.item('sat-2', 'lunch', 'nutrition.foods.lentilStew', 'nutrition.portions.bowl', {
          calories: 520,
          proteinG: 30,
          carbsG: 68,
          fatG: 12,
          fiberG: 18
        })
      ]),
      this.day('andrea-sun', 'nutrition.days.sun', '2026-06-21', target1800, [
        this.item('sun-1', 'lunch', 'nutrition.foods.turkeyWrap', 'nutrition.portions.wrap', {
          calories: 480,
          proteinG: 38,
          carbsG: 46,
          fatG: 14,
          fiberG: 7
        }),
        this.item('sun-2', 'dinner', 'nutrition.foods.vegetableCurry', 'nutrition.portions.bowl', {
          calories: 560,
          proteinG: 24,
          carbsG: 70,
          fatG: 19,
          fiberG: 14
        })
      ])
    ];

    return [
      {
        id: 'plan-andrea',
        patientId: 'p-001',
        patientName: 'Andrea Flores',
        titleKey: 'nutrition.plans.mediterranean1800',
        goal: 'weightLoss',
        status: 'active',
        startDate: '2026-06-15',
        endDate: '2026-06-21',
        dailyTarget: target1800,
        adherence: 86,
        assignedBy: 'Dr. Carlos Medina',
        days: andreaDays
      },
      {
        id: 'plan-marco',
        patientId: 'p-002',
        patientName: 'Marco Rios',
        titleKey: 'nutrition.plans.lowCarb1600',
        goal: 'clinicalNutrition',
        status: 'review',
        startDate: '2026-06-17',
        endDate: '2026-06-23',
        dailyTarget: { calories: 1600, proteinG: 120, carbsG: 120, fatG: 66, fiberG: 30 },
        adherence: 64,
        assignedBy: 'Dr. Carlos Medina',
        days: andreaDays.slice(0, 4)
      },
      {
        id: 'plan-lucia',
        patientId: 'p-003',
        patientName: 'Lucia Mendez',
        titleKey: 'nutrition.plans.highProtein2100',
        goal: 'muscleGain',
        status: 'active',
        startDate: '2026-06-16',
        endDate: '2026-06-22',
        dailyTarget: target2000,
        adherence: 91,
        assignedBy: 'Dr. Carlos Medina',
        days: andreaDays.slice(1, 6)
      }
    ];
  }

  private createFoods(): FoodItem[] {
    return [
      {
        id: 'food-oats',
        nameKey: 'nutrition.foods.oats',
        servingKey: 'nutrition.portions.bowl',
        calories: 390,
        macros: { calories: 390, proteinG: 24, carbsG: 48, fatG: 12, fiberG: 9 },
        tags: ['breakfast', 'highFiber']
      },
      {
        id: 'food-chicken-bowl',
        nameKey: 'nutrition.foods.chickenBowl',
        servingKey: 'nutrition.portions.plate',
        calories: 540,
        macros: { calories: 540, proteinG: 44, carbsG: 52, fatG: 15, fiberG: 8 },
        tags: ['lunch', 'protein']
      },
      {
        id: 'food-greek-yogurt',
        nameKey: 'nutrition.foods.greekYogurt',
        servingKey: 'nutrition.portions.cup',
        calories: 180,
        macros: { calories: 180, proteinG: 18, carbsG: 18, fatG: 4, fiberG: 2 },
        tags: ['snack', 'protein']
      },
      {
        id: 'food-apple-almonds',
        nameKey: 'nutrition.foods.appleAlmonds',
        servingKey: 'nutrition.portions.snack',
        calories: 210,
        macros: { calories: 210, proteinG: 6, carbsG: 24, fatG: 11, fiberG: 6 },
        tags: ['snack', 'fiber']
      }
    ];
  }

  private createRecipes(): Recipe[] {
    return [
      {
        id: 'recipe-salmon',
        titleKey: 'nutrition.recipes.items.salmon.title',
        summaryKey: 'nutrition.recipes.items.salmon.summary',
        goal: 'weightLoss',
        prepMinutes: 25,
        difficulty: 'medium',
        calories: 610,
        macros: { calories: 610, proteinG: 42, carbsG: 50, fatG: 24, fiberG: 7 },
        tagKeys: ['nutrition.tags.omega3', 'nutrition.tags.dinner']
      },
      {
        id: 'recipe-lentil',
        titleKey: 'nutrition.recipes.items.lentil.title',
        summaryKey: 'nutrition.recipes.items.lentil.summary',
        goal: 'energy',
        prepMinutes: 35,
        difficulty: 'easy',
        calories: 520,
        macros: { calories: 520, proteinG: 30, carbsG: 68, fatG: 12, fiberG: 18 },
        tagKeys: ['nutrition.tags.highFiber', 'nutrition.tags.batch']
      },
      {
        id: 'recipe-turkey',
        titleKey: 'nutrition.recipes.items.turkey.title',
        summaryKey: 'nutrition.recipes.items.turkey.summary',
        goal: 'muscleGain',
        prepMinutes: 15,
        difficulty: 'easy',
        calories: 480,
        macros: { calories: 480, proteinG: 38, carbsG: 46, fatG: 14, fiberG: 7 },
        tagKeys: ['nutrition.tags.highProtein', 'nutrition.tags.quick']
      },
      {
        id: 'recipe-curry',
        titleKey: 'nutrition.recipes.items.curry.title',
        summaryKey: 'nutrition.recipes.items.curry.summary',
        goal: 'clinicalNutrition',
        prepMinutes: 30,
        difficulty: 'medium',
        calories: 560,
        macros: { calories: 560, proteinG: 24, carbsG: 70, fatG: 19, fiberG: 14 },
        tagKeys: ['nutrition.tags.plantForward', 'nutrition.tags.lowSodium']
      }
    ];
  }
}
