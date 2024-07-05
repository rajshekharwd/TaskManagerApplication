import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const isLogin = authService.authRegistered();
  const router = inject(Router);

  if (isLogin) {
    return true;
  } else {
    debugger
    router.navigate(['/login']);
    authService.removeAuthToken();
    return false;
  }
};
