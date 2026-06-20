import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import {
  MealPlan,
  DailyMeal,
  FoodLog,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
  CreateDailyMealRequest,
  UpdateDailyMealRequest,
  CreatePlanTrackingRequest
} from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class MealPlanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(this.apiUrl.endpoint('meal-plans'));
  }

  createMealPlan(request: CreateMealPlanRequest): Observable<MealPlan> {
    return this.http.post<MealPlan>(this.apiUrl.endpoint('meal-plans'), request);
  }

  getMealPlanById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(this.apiUrl.endpoint(`meal-plans/${id}`));
  }

  updateMealPlan(id: number, request: UpdateMealPlanRequest): Observable<MealPlan> {
    return this.http.put<MealPlan>(this.apiUrl.endpoint(`meal-plans/${id}`), request);
  }

  deleteMealPlan(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl.endpoint(`meal-plans/${id}`));
  }

  getEntries(id: number): Observable<DailyMeal[]> {
    return this.http.get<DailyMeal[]>(this.apiUrl.endpoint(`meal-plans/${id}/entries`));
  }

  createEntry(id: number, request: CreateDailyMealRequest): Observable<DailyMeal> {
    return this.http.post<DailyMeal>(this.apiUrl.endpoint(`meal-plans/${id}/entries`), request);
  }

  updateEntry(id: number, entryId: number, request: UpdateDailyMealRequest): Observable<DailyMeal> {
    return this.http.put<DailyMeal>(this.apiUrl.endpoint(`meal-plans/${id}/entries/${entryId}`), request);
  }

  getTracking(id: number): Observable<FoodLog[]> {
    return this.http.get<FoodLog[]>(this.apiUrl.endpoint(`meal-plans/${id}/tracking`));
  }

  createTracking(id: number, request: CreatePlanTrackingRequest): Observable<FoodLog> {
    return this.http.post<FoodLog>(this.apiUrl.endpoint(`meal-plans/${id}/tracking`), request);
  }
}
