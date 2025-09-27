import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

/**
 * Service de gestion des utilisateurs.
 *
 * Permet de récupérer, créer, modifier et supprimer des utilisateurs.
 * Idéal pour l'administration et la gestion des comptes.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * URL de base de l'API pour les opérations liées aux utilisateurs.
   */
  private apiUrl = 'http://localhost:3000/users'; // URL de ton backend Node.js

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les utilisateurs.
   *
   * @returns Observable émettant un tableau d'objets `User`.
   *
   * @example
   * ```ts
   * userService.getAllUsers().subscribe(users => console.log(users));
   * ```
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Récupère un utilisateur spécifique par son identifiant.
   *
   * @param id - Identifiant unique de l'utilisateur.
   * @returns Observable émettant l'objet `User` correspondant.
   *
   * @example
   * ```ts
   * userService.getUserById(1).subscribe(user => console.log(user));
   * ```
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Créé un nouvel utilisateur.
   *
   * @param user - Objet `User` contenant les informations de l'utilisateur à créer.
   * @returns Observable émettant l'utilisateur créé.
   *
   * @example
   * ```ts
   * const newUser: User = { name: 'Alice', email: 'alice@mail.com', admin: false };
   * userService.createUser(newUser).subscribe(created => console.log(created));
   * ```
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Met à jour un utilisateur existant.
   *
   * @param id - Identifiant de l'utilisateur à modifier.
   * @param user - Objet `User` contenant les nouvelles informations.
   * @returns Observable émettant l'utilisateur mis à jour.
   *
   * @example
   * ```ts
   * userService.updateUser(1, { ...user, name: 'Nouveau nom' }).subscribe(updated => console.log(updated));
   * ```
   */
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Supprime un utilisateur existant.
   *
   * @param id - Identifiant de l'utilisateur à supprimer.
   * @returns Observable émettant un objet avec un message et l'utilisateur supprimé.
   *
   * @example
   * ```ts
   * userService.deleteUser(1).subscribe(res => console.log(res.message));
   * ```
   */
  deleteUser(id: number): Observable<{ message: string; user: User }> {
    return this.http.delete<{ message: string; user: User }>(
      `${this.apiUrl}/${id}`
    );
  }
}
