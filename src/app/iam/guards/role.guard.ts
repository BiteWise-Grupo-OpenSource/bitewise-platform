import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../model/auth.models';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data?.['roles'] ?? []) as UserRole[];
  const userRole = auth.user()?.role;

  if (!allowedRoles.length || (userRole && allowedRoles.includes(userRole))) {
    return true;
  }

  return router.createUrlTree([auth.nextRouteFor()]);
};
