import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthContextService } from '../services/auth-context.service';
import { map } from 'rxjs';

function redirectToLogin(router: Router, segments: UrlSegment[]): UrlTree {
  const path = segments.map((segment) => segment.path).join('/');
  const redirect = path ? `/${path}` : '/';
  return router.createUrlTree(['/auth/login'], {
    queryParams: { redirect }
  });
}

export const authGuard: CanMatchFn = (_route: Route, segments: UrlSegment[]) => {
  const auth = inject(AuthContextService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return redirectToLogin(router, segments);
  }

  return auth.ensureSessionUpToDate().pipe(
    map((isValid) => (isValid ? true : redirectToLogin(router, segments)))
  );
};
