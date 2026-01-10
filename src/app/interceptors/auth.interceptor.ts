import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (
    req.url.includes('/login') ||
    req.url.includes('/refresh-token') ||
    req.url.includes('/register') ||
    req.url.includes('/logout')
  ) {
    return next(req.clone({ withCredentials: true }));
  }

  const authRequest = authService.getToken()
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${authService.getToken()}` },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  return next(authRequest).pipe(
    catchError((error) => {
      if ([401, 403].includes(error.status)) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${authService.getToken()}`,
                },
                withCredentials: true,
              }),
            );
          }),
          catchError((err) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => err);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
