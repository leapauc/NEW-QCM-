import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * Configuration principale de l'application Angular.
 *
 * Cette constante définit les fournisseurs (`providers`) utilisés globalement par l'application.
 * Elle configure notamment :
 * - La détection de changement via `provideZoneChangeDetection`
 * - Le routage via `provideRouter`
 * - Le client HTTP via `provideHttpClient`
 *
 * @constant
 * @type {ApplicationConfig}
 *
 * @see provideZoneChangeDetection
 * @see provideRouter
 * @see provideHttpClient
 * @see routes
 *
 * @example
 * // Utilisée dans main.ts :
 * bootstrapApplication(AppComponent, appConfig);
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
