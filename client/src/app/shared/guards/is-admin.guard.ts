import { inject } from '@angular/core';
import { UserService } from './../services/user.service';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {

  const userService= inject(UserService);
  const router = inject(Router);

  return userService.getUserProfile().pipe(
    map(user =>{
      if((user as any).role === 'admin'){
        return true;
      } else{
        router.navigate(['/']);
        return false;
      }
    }),
    catchError(()=>{
      router.navigate(['/']);
      return of(false);
    })
  );
};
