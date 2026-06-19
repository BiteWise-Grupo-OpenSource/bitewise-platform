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
  }
];

export default clinicalRoutes;
