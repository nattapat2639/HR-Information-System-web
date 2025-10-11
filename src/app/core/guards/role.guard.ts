import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthContextService } from '../services/auth-context.service';

function canAccess(route: Route, auth: AuthContextService): boolean {
  const requiredRoles = route.data?.['requiredRoles'] as string[] | string | undefined;
  const requiredPermission = route.data?.['requiredPermission'] as string | undefined;

  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    return false;
  }

  if (!requiredRoles) {
    return true;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.some((role) => auth.hasRole(role));
}

export const roleGuard: CanMatchFn = (route: Route, _segments: UrlSegment[]) => {
  const auth = inject(AuthContextService);
  return canAccess(route, auth);
};
