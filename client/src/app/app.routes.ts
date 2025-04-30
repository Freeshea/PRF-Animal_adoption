import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { redirectAuthEdGuard } from './shared/guards/redirect-auth-ed.guard';
import { isAdminGuard } from './shared/guards/is-admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./pages/posts/posts.component').then((c) => c.PostsComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (c) => c.RegisterComponent
      ),
    canActivate: [redirectAuthEdGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
    canActivate: [redirectAuthEdGuard],
  },
  {
    path: 'pet-details/:id',
    loadComponent: () =>
      import('./pages/pet-details/pet-details.component').then(
        (c) => c.PetDetailsComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'adoption-requests',
    loadComponent: () =>
      import('./pages/adoption-requests/adoption-requests.component').then(
        (c) => c.AdoptionRequestsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((c) => c.AdminComponent),
    canActivate: [authGuard, isAdminGuard],
  },
  { path: '**', redirectTo: 'home' },
];
