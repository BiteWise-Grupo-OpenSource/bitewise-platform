import { TestBed } from '@angular/core/testing';
import { NutritionService } from './nutrition.service';

describe('NutritionService', () => {
  let service: NutritionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NutritionService);
  });

  it('calculates day totals from planned meal items', () => {
    const day = service.patientPlan()?.days[0];

    expect(day).toBeDefined();
    const totals = service.dayTotals(day!);
    const expectedCalories = day!.items.reduce((sum, item) => sum + item.calories, 0);

    expect(totals.calories).toBe(expectedCalories);
    expect(totals.proteinG).toBeGreaterThan(0);
    expect(totals.fiberG).toBeGreaterThan(0);
  });

  it('adds mock food log entries and updates daily totals', () => {
    const initialCount = service.foodLog().length;
    const initialCalories = service.todayTotals().calories;
    const food = service.foods()[2];

    service.addLogEntry(food.id, 'snack');

    expect(service.foodLog().length).toBe(initialCount + 1);
    expect(service.todayTotals().calories).toBe(initialCalories + food.calories);
  });

  it('filters recipes by nutrition goal', () => {
    service.filterRecipes('muscleGain');

    expect(service.recipes().length).toBeGreaterThan(0);
    expect(service.recipes().every((recipe) => recipe.goal === 'muscleGain')).toBe(true);

    service.filterRecipes('all');
    expect(service.recipes().length).toBeGreaterThan(1);
  });
});
