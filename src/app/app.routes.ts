import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'iglesias',
    loadComponent: () =>
      import('./pages/iglesias/iglesias').then((m) => m.Iglesias),
    canActivate: [AuthGuard]
  },
  {
    path: 'asociaciones',
    loadComponent: () =>
      import('./pages/asociaciones/asociaciones').then((m) => m.Asociaciones),
    canActivate: [AuthGuard]
  },
  {
    path: 'diezmos',
    loadComponent: () =>
      import('./pages/diezmos/diezmos').then((m) => m.Diezmos),
    canActivate: [AuthGuard]
  },
  {
    path: 'miembros',
    loadComponent: () =>
      import('./pages/miembros/miembros').then((m) => m.Miembros),
    canActivate: [AuthGuard]
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./pages/reportes/reportes').then((m) => m.Reportes),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
