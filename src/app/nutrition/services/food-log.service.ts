import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { FoodLog, CreateFoodLogRequest } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class FoodLogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllFoodLogs(): Observable<FoodLog[]> {
    return this.http.get<FoodLog[]>(this.apiUrl.endpoint('food-logs'));
  }

  createFoodLog(request: CreateFoodLogRequest): Observable<FoodLog> {
    return this.http.post<FoodLog>(this.apiUrl.endpoint('food-logs'), request);
  }
}
