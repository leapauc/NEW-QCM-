import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Composant représentant le template principale d'un stagiaire connecté.
 *
 * Ce composant fournit un espace réservé pour le contenu des stagiaires
 * et inclut la possibilité de se déconnecter via la méthode `logout`.
 *
 * @example
 * <app-stagiaire></app-stagiaire>
 */
@Component({
  selector: 'app-stagiaire',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './stagiaire.component.html',
  styleUrl: './stagiaire.component.css',
})
export class StagiaireComponent {
  /** état pour le menu responsive */
  isSidebarOpen = false;

  /**
   * Constructeur du composant.
   *
   * @param authService Service d'authentification pour gérer l'état de connexion
   * @param router Router pour naviguer après déconnexion
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Déconnecte l'utilisateur actuel et redirige vers la page de login.
   *
   * Supprime le token ou l'état de connexion via `AuthService` puis
   * utilise le `Router` pour naviguer vers `/login`.
   */
  logout() {
    this.authService.logout(); // supprime le token ou l'état de connexion
    this.router.navigate(['/login']); // redirige vers la page de login
  }

  /**
   * Afficher/Désafficher la barre de navigation latérale.
   */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  /**
   * Réduit la barre de navigation latérale quand la fenêtre est de petite taille.
   */
  closeSidebar() {
    if (window.innerWidth <= 890) {
      this.isSidebarOpen = false;
    }
  }
}
