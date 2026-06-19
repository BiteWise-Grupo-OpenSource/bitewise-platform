import { Routes } from '@angular/router';
import { authGuard } from '../iam/guards/auth.guard';
import { roleGuard } from '../iam/guards/role.guard';

export const nutritionRoutes: Routes = [
  {
    path: 'patient/plan',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () => import('./pages/patient-plan/patient-plan.page').then((m) => m.PatientPlanPage)
  },
  {
    path: 'patient/log',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () => import('./pages/patient-log/patient-log.page').then((m) => m.PatientLogPage)
  },
  {
    path: 'patient/recipes',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () => import('./pages/patient-recipes/patient-recipes.page').then((m) => m.PatientRecipesPage)
  },
  {
    path: 'professional/plans',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['nutritionist'] },
    loadComponent: () =>
      import('./pages/professional-plans/professional-plans.page').then((m) => m.ProfessionalPlansPage)
  },
  {
    path: '**',
    redirectTo: 'patient/plan'
  }
];

export default nutritionRoutes;
