import { Routes } from '@angular/router';

/**
 * Routes for the clinical (professional) bounded context.
 *
 * Mounted lazily under `/clinical` from `app.routes.ts`, already protected by
 * `authGuard` + `roleGuard` (role: `nutritionist`).
 */
export const clinicalRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/workspace/clinical-workspace.page').then((m) => m.ClinicalWorkspacePage)
  },
  {
    path: 'nutrition',
    loadComponent: () =>
      import('../nutrition/pages/professional-plans/professional-plans.page').then((m) => m.ProfessionalPlansPage)
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('../communication/pages/professional-messages/professional-messages.page').then((m) => m.ProfessionalMessagesPage)
  }
];

export default clinicalRoutes;
