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

import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { BASE_PATH } from './api/generated';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { AppStateService } from './services/app-state.service';
// Call the element loader before the bootstrapModule/bootstrapApplication call
navigator.serviceWorker.register('./assets/sw.js');
defineCustomElements(window);
bootstrapApplication(AppComponent, {
  providers: [
    AppStateService,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    { provide: BASE_PATH, useValue: environment.apiUrl },
    provideNoopAnimations(),
  ],
});
