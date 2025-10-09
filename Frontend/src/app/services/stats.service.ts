// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service de statistiques.
 *
 * Permet de récupérer des données agrégées sur les stagiaires,
 * les questionnaires, les résultats et le temps passé.
 * Idéal pour alimenter des tableaux de bord et visualisations.
 */
@Injectable({
  providedIn: 'root',
})
export class StatsService {
  /**
   * URL de base de l'API pour les statistiques.
   */
  private apiUrl = 'http://localhost:3000/stats'; // adapter si nécessaire

  /**
   * Crée une instance de UserService.
   * @param http Service Angular pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère le nombre total de stagiaires.
   *
   * @returns Observable émettant le nombre de stagiaires.
   *
   * @example
   * ```ts
   * statsService.getNbStagiaire().subscribe(nb => console.log('Stagiaires :', nb));
   * ```
   */
  getNbStagiaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbStagiaire`);
  }

  /**
   * Récupère le nombre total de questionnaires.
   *
   * @returns Observable émettant le nombre de questionnaires.
   */
  getNbQuestionnaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbQuestionnaire`);
  }

  /**
   * Récupère le nombre de questionnaires complétés.
   *
   * @returns Observable émettant le nombre de questionnaires complétés.
   */
  getNbCompletQuestionnaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbCompletQuestionnaire`);
  }

  /**
   * Récupère le nombre de questionnaires réalisés (toutes tentatives confondues).
   *
   * @returns Observable émettant le nombre de questionnaires réalisés.
   */
  getNbQuestionRealise(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbRealisedQuestionnaire`);
  }

  /**
   * Récupère le questionnaire le plus populaire.
   *
   * @returns Observable émettant les données sur le plus questionnaire populaire.
   */
  getQuestionnairePopulaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questionnairePopulaire`);
  }

  /**
   * Récupère le stagiaire le plus actif.
   *
   * @returns Observable émettant les informations du stagiaire le plus actif.
   */
  getFirstStagiaireActif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/firstActivStagiaire`);
  }

  /**
   * Récupère la liste du nombre de questionnaires par stagiaire.
   *
   * @returns Observable émettant une liste [stagiaire, nbQuestionnaires].
   */
  getNbQuestionnaireList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbQuestionnaireList`);
  }

  /**
   * Récupère le nombre de questionnaires complétés par un utilisateur spécifique.
   *
   * @param id_user - Identifiant unique de l'utilisateur.
   * @returns Observable émettant le nombre de questionnaires complétés.
   */
  getNbQuestionnaireByUser(id_user: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbQuestionnaireByUser/${id_user}`);
  }

  /**
   * Récupère les statistiques globales (score max, min et moyenne) par utilisateur.
   *
   * @returns Observable émettant un objet contenant max, min et moyenne.
   */
  getMaxMinAvgScoreList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/maxMinAvgScoreList`);
  }

  /**
   * Récupère les statistiques (score max, min et moyenne) pour un utilisateur.
   *
   * @param id_user - Identifiant unique de l'utilisateur.
   * @returns Observable émettant un objet contenant max, min et moyenne pour cet utilisateur.
   */
  getMaxMinAvgScoreByUser(id_user: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/maxMinAvgScoreByUser/${id_user}`);
  }

  /**
   * Récupère la répartition (distribution) des scores de tous les utilisateurs.
   *
   * @returns Observable émettant une liste de plages de scores.
   */
  getRangeList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rangeList`);
  }

  /**
   * Récupère la répartition (distribution) des scores pour un utilisateur donné.
   *
   * @param id_user - Identifiant unique de l'utilisateur.
   * @returns Observable émettant une liste de plages de scores pour cet utilisateur.
   */
  getRangeByUser(id_user: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rangeByUser/${id_user}`);
  }

  /**
   * Récupère le temps moyen passé sur les questionnaires (tous utilisateurs confondus).
   *
   * @returns Observable émettant le temps moyen.
   */
  getAvgTimeList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/avgTimeList`);
  }

  /**
   * Récupère le temps moyen passé sur les questionnaires pour un utilisateur.
   *
   * @param id_user - Identifiant unique de l'utilisateur.
   * @returns Observable émettant le temps moyen pour cet utilisateur.
   */
  getAvgTimeByUser(id_user: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/avgTimeByUser/${id_user}`);
  }
}
