import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { DailyMeal } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class DailyMealService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllDailyMeals(): Observable<DailyMeal[]> {
    return this.http.get<DailyMeal[]>(this.apiUrl.endpoint('daily-meals'));
  }

  getDailyMealsByPlan(mealPlanId: number): Observable<DailyMeal[]> {
    return this.http.get<DailyMeal[]>(this.apiUrl.endpoint(`daily-meals/by-plan/${mealPlanId}`));
  }
}
