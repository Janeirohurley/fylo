import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from './loggingInterceptor';
import { authInterceptor } from './authInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loggingInterceptor,authInterceptor]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};


