/**
 * Représente un utilisateur authentifié dans l'application.
 *
 * Cette interface est utilisée notamment dans le service `AuthService`
 * pour stocker les informations de l'utilisateur connecté.
 */
export interface AuthUser {
  /**
   * Identifiant unique de l'utilisateur.
   */
  id_user: number;
  /**
   * Nom complet ou identifiant de l'utilisateur.
   */
  name: string;
  /**
   * Indique si l'utilisateur possède les droits d'administration.
   * - `true` → administrateur
   * - `false` → utilisateur classique
   */
  admin: boolean;
}
