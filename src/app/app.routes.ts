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
  {
    path: 'selecciona',
    loadComponent: () =>
      import('./selecciona/selecciona.page').then((m) => m.SeleccionaPage),
  },
  {
    path: 'send-more-info',
    loadComponent: () =>
      import('./send-more-info/send-more-info.page').then(
        (m) => m.SendMoreInfoPage,
      ),
  },
  {
    path: 'legal',
    loadComponent: () => import('./legal/legal.page').then( m => m.LegalPage)
  },
];
