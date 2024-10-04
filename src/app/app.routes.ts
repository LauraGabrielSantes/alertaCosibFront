import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./principal/principal.page').then((m) => m.PrincipalPage),
  },
];
