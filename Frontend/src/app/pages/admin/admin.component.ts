import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

/**
 * Composant principal de l'administration.
 *
 * @description
 * Ce composant fournit l'interface principale pour l'administration de l'application.
 * Il gère l'affichage conditionnel des sections QCM, Questions, Utilisateurs et Options.
 * Il permet également la déconnexion de l'utilisateur administrateur.
 *
 * @usageNotes
 * ### Importation
 * Ce composant importe :
 * - `RouterOutlet`, `RouterLink`, `RouterLinkActive` pour la navigation interne
 * - `CommonModule` pour les directives Angular communes
 *
 * @example
 * ```html
 * <app-admin></app-admin>
 * ```
 *
 * @selector app-admin
 * @component
 */
@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  /**
   * Détermine si la section QCM est affichée.
   */
  showQcm = false;
  /**
   * Détermine si la section Questions est affichée.
   */
  showQuestions = false;
  /**
   * Détermine si la section Utilisateurs est affichée.
   */
  showUtilisateur = false;
  /**
   * Détermine si la section Options est affichée.
   */
  showOption = false;
  /** état pour le menu responsive */
  isSidebarOpen = false;

  /**
   * Constructeur du composant.
   * @param authService Service d'authentification pour gérer la session de l'administrateur.
   * @param router Router Angular pour la navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Basculer l'affichage de la section QCM.
   */
  toggleQcm() {
    this.showQcm = !this.showQcm;
  }

  /**
   * Basculer l'affichage de la section Questions.
   */
  toggleQuestions() {
    this.showQuestions = !this.showQuestions;
  }

  /**
   * Basculer l'affichage de la section Utilisateurs.
   */
  toggleUtilisateur() {
    this.showUtilisateur = !this.showUtilisateur;
  }

  /**
   * Basculer l'affichage de la section Options.
   */
  toggleOption() {
    this.showOption = !this.showOption;
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

  /**
   * Déconnecte l'utilisateur administrateur et redirige vers la page de login.
   */
  logout() {
    this.authService.logout(); // supprime le token ou l'état de connexion
    this.router.navigate(['/login']); // redirige vers la page de login
  }
}
