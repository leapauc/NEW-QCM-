// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttemptQuestion } from '../models/attemptQuestion';
import { AttemptPayload } from '../models/attemptPayload';

/**
 * Service de gestion des tentatives de quiz.
 *
 * Permet de récupérer les tentatives d'un utilisateur, d'accéder aux détails
 * d'une tentative précise, de lister toutes les tentatives et d'enregistrer
 * une nouvelle tentative.
 */
@Injectable({
  providedIn: 'root',
})
export class QuizAttemptsService {
  /**
   * URL de base de l'API pour les opérations sur les tentatives de quiz.
   */
  private apiUrl = 'http://localhost:3000/quizAttempts'; // Adapter selon ton API

  /**
   * Crée une instance de QuizAttemptsService.
   * @param http Service Angular pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les tentatives effectuées par un utilisateur donné.
   *
   * @param id_user - Identifiant unique de l'utilisateur.
   * @returns Observable émettant un tableau de tentatives.
   *
   * @example
   * ```ts
   * quizAttemptsService.getAttemptsByUser(12).subscribe(attempts => console.log(attempts));
   * ```
   */
  getAttemptsByUser(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id_user}`);
  }

  /**
   * Récupère toutes les tentatives (tous utilisateurs confondus).
   *
   * @returns Observable émettant un tableau de toutes les tentatives.
   *
   * @example
   * ```ts
   * quizAttemptsService.getAllAttempts().subscribe(all => console.log(all));
   * ```
   */
  getAllAttempts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère les détails d'une tentative spécifique,
   * y compris les questions et les réponses associées.
   *
   * @param id_attempt - Identifiant unique de la tentative.
   * @returns Observable émettant un objet contenant la liste des questions de la tentative.
   *
   * @example
   * ```ts
   * quizAttemptsService.getAttemptDetails(101).subscribe(details => console.log(details.questions));
   * ```
   */
  getAttemptDetails(
    id_attempt: number
  ): Observable<{ questions: AttemptQuestion[] }> {
    return this.http.get<{ questions: AttemptQuestion[] }>(
      `${this.apiUrl}/attempt_details/${id_attempt}`
    );
  }

  /**
   * Enregistre une nouvelle tentative dans la base de données.
   *
   * @param payload - Objet contenant les informations de la tentative (utilisateur, score, réponses...).
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * const attempt: AttemptPayload = {
   *   userId: 12,
   *   qcmId: 5,
   *   score: 8,
   *   responses: [...]
   * };
   * quizAttemptsService.saveAttempt(attempt).subscribe(result => console.log(result));
   * ```
   */
  saveAttempt(payload: AttemptPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
