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
    // Por ahora, usar mock para pacientes también hasta que el backend esté completamente funcional
    if (email === 'ana@example.com' && password === '123456') {
      return of({
        id: 'patient-demo',
        email: 'ana@example.com',
        displayName: 'Ana García',
        role: 'patient',
        onboardingCompleted: true
      });
    }
    if (email === 'andrea@email.com' && password === '123456') {
      return of({
        id: 'patient-demo-2',
        email: 'andrea@email.com',
        displayName: 'Andrea Flores',
        role: 'patient',
        onboardingCompleted: true
      });
    }
    return throwError(() => new Error('Credenciales incorrectas'));
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
