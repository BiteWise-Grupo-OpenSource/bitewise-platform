import { Routes } from '@angular/router';
import { nutritionistMessagesRoute } from '../communication/communication.routes';

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
  nutritionistMessagesRoute
];

export default clinicalRoutes;
