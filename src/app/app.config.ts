import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideAnimations(),
    provideToastr({
      closeButton: true,
      timeOut: 10000, // 15 seconds
      progressBar: true,
    }), // Toastr providers
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }


  ]
};
