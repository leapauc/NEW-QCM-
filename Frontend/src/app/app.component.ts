import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Composant racine de l'application Angular.
 *
 * Ce composant sert de point d'entrée principal et gère le routage via RouterOutlet.
 * Il est automatiquement chargé par Angular au démarrage de l'app.
 *
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
