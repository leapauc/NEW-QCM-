/**
 * Représente un utilisateur de l'application.
 *
 * Cette interface est utilisée dans le service `UserService` pour la
 * gestion des utilisateurs (création, mise à jour, récupération, suppression).
 */
export interface User {
  /**
   * Identifiant unique de l'utilisateur.
   * Optionnel lors de la création d'un nouvel utilisateur.
   * Créé automatiquement par le backend si création d'un nouvel utilisateur
   */
  id_user?: number;
  /**
   * Nom de famille de l'utilisateur.
   */
  name: string;
  /**
   * Prénom de l'utilisateur.
   */
  firstname: string;
  /**
   * Adresse e-mail de l'utilisateur.
   */
  email: string;
  /**
   * Société ou organisation à laquelle appartient l'utilisateur.
   */
  society: string;
  /**
   * Mot de passe de l'utilisateur.
   * Il est conseillé de le stocker haché en base de données.
   */
  password: string;
  /**
   * Indique si l'utilisateur possède les droits d'administration.
   * - `true` → administrateur
   * - `false` → utilisateur classique
   */
  admin: boolean;
}
