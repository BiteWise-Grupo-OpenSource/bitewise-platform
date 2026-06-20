import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { Patient, MealPlan, Message } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl.endpoint('patients'));
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(this.apiUrl.endpoint(`patients/${id}`));
  }

  getPatientMealPlans(id: number): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(this.apiUrl.endpoint(`patients/${id}/meal-plans`));
  }

  getPatientMessages(id: number): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl.endpoint(`patients/${id}/messages`));
  }
}
