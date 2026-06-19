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
        data: {
          patientPage: {
            eyebrowKey: 'patient.plan.eyebrow',
            titleKey: 'patient.plan.title',
            subtitleKey: 'patient.plan.subtitle',
            primaryKey: 'patient.plan.primary'
          }
        },
        loadComponent: () =>
          import('./pages/placeholder/patient-placeholder.page').then((m) => m.PatientPlaceholderPage)
      },
      {
        path: 'log',
        data: {
          patientPage: {
            eyebrowKey: 'patient.log.eyebrow',
            titleKey: 'patient.log.title',
            subtitleKey: 'patient.log.subtitle',
            primaryKey: 'patient.log.primary'
          }
        },
        loadComponent: () =>
          import('./pages/placeholder/patient-placeholder.page').then((m) => m.PatientPlaceholderPage)
      },
      {
        path: 'recipes',
        data: {
          patientPage: {
            eyebrowKey: 'patient.recipes.eyebrow',
            titleKey: 'patient.recipes.title',
            subtitleKey: 'patient.recipes.subtitle',
            primaryKey: 'patient.recipes.primary'
          }
        },
        loadComponent: () =>
          import('./pages/placeholder/patient-placeholder.page').then((m) => m.PatientPlaceholderPage)
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
        data: {
          patientPage: {
            eyebrowKey: 'patient.messages.eyebrow',
            titleKey: 'patient.messages.title',
            subtitleKey: 'patient.messages.subtitle',
            primaryKey: 'patient.messages.primary'
          }
        },
        loadComponent: () =>
          import('./pages/placeholder/patient-placeholder.page').then((m) => m.PatientPlaceholderPage)
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
