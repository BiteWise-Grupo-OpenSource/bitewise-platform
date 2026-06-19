import { Routes } from '@angular/router';
import { authGuard } from '../iam/guards/auth.guard';
import { roleGuard } from '../iam/guards/role.guard';

export const patientRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () => import('./pages/shell/patient-shell.page').then((m) => m.PatientShellPage),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/patient-dashboard.page').then((m) => m.PatientDashboardPage)
      },
      {
        path: 'plan',
        loadComponent: () =>
          import('../nutrition/pages/patient-plan/patient-plan.page').then((m) => m.PatientPlanPage)
      },
      {
        path: 'log',
        loadComponent: () =>
          import('../nutrition/pages/patient-log/patient-log.page').then((m) => m.PatientLogPage)
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('../nutrition/pages/patient-recipes/patient-recipes.page').then((m) => m.PatientRecipesPage)
      },
      {
        path: 'progress',
        data: {
          patientPage: {
            eyebrowKey: 'patient.progress.eyebrow',
            titleKey: 'patient.progress.title',
            subtitleKey: 'patient.progress.subtitle',
            primaryKey: 'patient.progress.primary'
          }
        },
        loadComponent: () =>
          import('./pages/placeholder/patient-placeholder.page').then((m) => m.PatientPlaceholderPage)
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('../communication/pages/patient-messages/patient-messages.page').then((m) => m.PatientMessagesPage)
      },
      {
        path: 'settings',
        data: {
          patientPage: {
            eyebrowKey: 'patient.settings.eyebrow',
            titleKey: 'patient.settings.title',
            subtitleKey: 'patient.settings.subtitle',
            primaryKey: 'patient.settings.primary'
          }
        },
        loadComponent: () =>
          import('./pages/placeholder/patient-placeholder.page').then((m) => m.PatientPlaceholderPage)
      }
    ]
  }
];
