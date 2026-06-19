import { Routes } from '@angular/router';
import { authGuard } from '../iam/guards/auth.guard';
import { roleGuard } from '../iam/guards/role.guard';

export const communicationRoutes: Routes = [
  {
    path: 'patient/messages',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () =>
      import('./pages/patient-messages/patient-messages.page').then((m) => m.PatientMessagesPage)
  },
  {
    path: 'professional/messages',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['nutritionist'] },
    loadComponent: () =>
      import('./pages/professional-messages/professional-messages.page').then((m) => m.ProfessionalMessagesPage)
  },
  {
    path: '**',
    redirectTo: 'patient/messages'
  }
];

export default communicationRoutes;
