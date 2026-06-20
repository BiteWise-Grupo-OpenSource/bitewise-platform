import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { Patient } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class BackendAuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  loginPatient(email: string, password: string): Observable<any> {
    return this.http.get<Patient[]>(this.apiUrl.endpoint('patients')).pipe(
      map(patients => {
        const patient = patients.find(p => p.email === email);
        if (!patient) {
          throw new Error('Paciente no encontrado');
        }
        // Por ahora, cualquier password funciona ya que el backend no tiene auth real
        return {
          id: String(patient.id),
          email: patient.email,
          displayName: patient.name,
          role: 'patient',
          onboardingCompleted: true
        };
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Error al conectar con el backend'));
      })
    );
  }

  loginNutritionist(email: string, password: string): Observable<any> {
    // Por ahora, usar mock para nutricionistas hasta que tengamos endpoint real
    if (email === 'dr.carlos@email.com' && password === '123456') {
      return of({
        id: 'nutritionist-demo',
        email: 'dr.carlos@email.com',
        displayName: 'Dr. Carlos Medina',
        role: 'nutritionist',
        onboardingCompleted: true
      });
    }
    return throwError(() => new Error('Credenciales incorrectas'));
  }
}
