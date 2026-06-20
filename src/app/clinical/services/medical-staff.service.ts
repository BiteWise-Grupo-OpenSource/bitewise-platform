import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { MedicalStaff } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class MedicalStaffService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllMedicalStaff(): Observable<MedicalStaff[]> {
    return this.http.get<MedicalStaff[]>(this.apiUrl.endpoint('medical-staff'));
  }

  getMedicalStaffById(id: number): Observable<MedicalStaff> {
    return this.http.get<MedicalStaff>(this.apiUrl.endpoint(`medical-staff/${id}`));
  }

  searchMedicalStaff(specialty?: string, active?: boolean): Observable<MedicalStaff[]> {
    const params = new URLSearchParams();
    if (specialty) params.append('specialty', specialty);
    if (active !== undefined) params.append('active', String(active));
    
    const url = params.toString()
      ? `${this.apiUrl.endpoint('medical-staff/search')}?${params.toString()}`
      : this.apiUrl.endpoint('medical-staff/search');
    
    return this.http.get<MedicalStaff[]>(url);
  }

  createMedicalStaff(medicalStaff: MedicalStaff): Observable<MedicalStaff> {
    return this.http.post<MedicalStaff>(this.apiUrl.endpoint('medical-staff'), medicalStaff);
  }

  updateMedicalStaff(id: number, medicalStaff: MedicalStaff): Observable<MedicalStaff> {
    return this.http.put<MedicalStaff>(this.apiUrl.endpoint(`medical-staff/${id}`), medicalStaff);
  }

  deleteMedicalStaff(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl.endpoint(`medical-staff/${id}`));
  }
}
