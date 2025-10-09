import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser } from '../models/authUser';

/**
 * Service d'authentification.
 *
 * Gère la connexion, la déconnexion et la persistance des informations
 * d'utilisateur dans le localStorage. Permet également de vérifier si
 * l'utilisateur est connecté ou administrateur.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * URL de base de l'API utilisée pour les appels d'authentification.
   */
  private apiUrl = 'http://localhost:3000';

  /**
   * Crée une instance de  AuthService.
   * @param http Service Angular pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Effectue la connexion d'un utilisateur.
   *
   * @param name - Nom de l'utilisateur.
   * @param password - Mot de passe de l'utilisateur.
   * @returns Observable contenant le message de l'API et l'utilisateur authentifié.
   *
   * Si la connexion réussit, l'utilisateur est enregistré dans le `localStorage`.
   *
   * @example
   * ```ts
   * authService.login('Dupond', 'mdp123456').subscribe({
   *   next: res => console.log('Connecté', res.user),
   *   error: err => console.error('Erreur', err)
   * });
   * ```
   */
  login(
    name: string,
    password: string
  ): Observable<{ message: string; user: AuthUser }> {
    return this.http
      .post<{ message: string; user: AuthUser }>(`${this.apiUrl}/login`, {
        name,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
  }

  /**
   * Déconnecte l'utilisateur en cours.
   *
   * Supprime le token et l'utilisateur du `localStorage`.
   *
   * @example
   * ```ts
   * authService.logout();
   * ```
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Récupère l'utilisateur actuellement connecté depuis le `localStorage`.
   *
   * @returns L'objet `AuthUser` si un utilisateur est connecté, sinon `null`.
   */
  getUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as AuthUser) : null;
  }

  /**
   * Vérifie si l'utilisateur actuellement connecté est administrateur.
   *
   * @returns `true` si l'utilisateur est admin, sinon `false`.
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.admin === true;
  }
  /**
   * Vérifie si un utilisateur est connecté.
   *
   * @returns `true` si un utilisateur est stocké dans le `localStorage`, sinon `false`.
   */
  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
