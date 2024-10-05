import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'emergencia',
  },
  {
    path: 'emergencia',
    loadComponent: () =>
      import('./emergencia/emergencia.page').then((m) => m.EmergenciaPage),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./servicios/servicios.page').then((m) => m.ServiciosPage),
  },
  {
    path: 'configuracion',
    loadComponent: () =>
      import('./configuracion/configuracion.page').then(
        (m) => m.ConfiguracionPage,
      ),
  },
];
