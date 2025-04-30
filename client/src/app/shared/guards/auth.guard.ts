import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAuth().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/home');
        return false;
      }
      return true;
    }),
    catchError((error) => {
      console.error('Auth check failed:', error);
      router.navigateByUrl('/home');
      return of(false);
    })
  );
};
