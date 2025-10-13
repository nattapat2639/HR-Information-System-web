import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthContextService } from '../services/auth-context.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authContext = inject(AuthContextService);
  const token = authContext.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
