import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withHashLocation,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Configuration } from './api/generated';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { AppStateService } from './services/app-state.service';
// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);
bootstrapApplication(AppComponent, {
  providers: [
    AppStateService,
    {
      provide: Configuration,
      useFactory: () =>
        new Configuration({
          basePath: environment.apiUrl,
        }),
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),

    provideNoopAnimations(),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});
