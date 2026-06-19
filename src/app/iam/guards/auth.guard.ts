import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasValidSession()) {
    const nextRoute = auth.nextRouteFor();
    if (nextRoute === '/auth/onboarding' && state.url !== '/auth/onboarding') {
      return router.createUrlTree([nextRoute]);
    }

    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
