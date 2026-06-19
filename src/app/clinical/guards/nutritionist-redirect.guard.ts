import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../iam/services/auth.service';

/**
 * Routes authenticated nutritionists from the shared IAM landing (`/session`)
 * to their clinical workspace (`/clinical`).
 *
 * It only consumes the IAM `AuthService`; it never mutates the iam context.
 * Any other role (or an anonymous visitor) falls through to the default
 * `/session` experience untouched.
 */
export const nutritionistRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasValidSession() && auth.user()?.role === 'nutritionist') {
    return router.createUrlTree(['/clinical']);
  }

  return true;
};
