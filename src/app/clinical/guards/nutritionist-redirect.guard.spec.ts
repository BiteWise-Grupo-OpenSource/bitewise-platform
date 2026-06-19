import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../iam/services/auth.service';
import { nutritionistRedirectGuard } from './nutritionist-redirect.guard';

type Role = 'patient' | 'nutritionist';

function configure(role: Role | null, hasValidSession = true): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          hasValidSession: () => hasValidSession,
          user: () => (role ? { role } : null)
        }
      }
    ]
  });
}

function run(): boolean | UrlTree {
  return TestBed.runInInjectionContext(() =>
    nutritionistRedirectGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
  ) as boolean | UrlTree;
}

describe('nutritionistRedirectGuard', () => {
  it('redirects an authenticated nutritionist to /clinical', () => {
    configure('nutritionist');
    const result = run();
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/clinical');
  });

  it('lets a patient stay on the default landing', () => {
    configure('patient');
    expect(run()).toBe(true);
  });

  it('does not redirect when there is no valid session', () => {
    configure('nutritionist', false);
    expect(run()).toBe(true);
  });
});
