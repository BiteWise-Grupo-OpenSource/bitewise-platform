import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { PlanHistory, CreatePlanHistoryRequest } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class PlanHistoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllPlanHistory(): Observable<PlanHistory[]> {
    return this.http.get<PlanHistory[]>(this.apiUrl.endpoint('plan-history'));
  }

  createPlanHistory(request: CreatePlanHistoryRequest): Observable<PlanHistory> {
    return this.http.post<PlanHistory>(this.apiUrl.endpoint('plan-history'), request);
  }
}
