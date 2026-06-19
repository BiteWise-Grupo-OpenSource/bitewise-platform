import { Routes } from '@angular/router';
import { nutritionistRedirectGuard } from './clinical/guards/nutritionist-redirect.guard';
import { authGuard } from './iam/guards/auth.guard';
import { guestGuard } from './iam/guards/guest.guard';
import { roleGuard } from './iam/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'session'
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./iam/pages/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./iam/pages/register/register.page').then((m) => m.RegisterPage)
  },
  {
    path: 'auth/onboarding',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () => import('./iam/pages/onboarding/onboarding.page').then((m) => m.OnboardingPage)
  },
  {
    path: 'clinical',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['nutritionist'] },
    loadChildren: () => import('./clinical/clinical.routes').then((m) => m.clinicalRoutes)
  },
  {
    path: 'session',
    canActivate: [authGuard, nutritionistRedirectGuard],
    loadComponent: () => import('./iam/pages/session/session.page').then((m) => m.SessionPage)
  },
  {
    path: '**',
    redirectTo: 'session'
  }
];
