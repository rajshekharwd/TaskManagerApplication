import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();
  const router = inject(Router);

  if (authToken) {
    const clonedRequest = req.clone({
      params: new HttpParams().set('auth', authToken)
    });
    return next(clonedRequest).pipe(
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          // authService.removeAuthToken();
          router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  } else {

    // authService.removeAuthToken();
    router.navigate(['/login']);
    return next(req).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
};
