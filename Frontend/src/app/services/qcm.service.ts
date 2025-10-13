import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';
import { QCM } from '../models/qcm';

/**
 * Service de gestion des QCM.
 *
 * Permet de récupérer, créer, mettre à jour et supprimer des QCM,
 * ainsi que de récupérer les questions associées (avec ou sans réponses).
 */
@Injectable({
  providedIn: 'root',
})
export class QcmService {
  /**
   * URL de base de l'API pour les opérations liées aux QCM.
   */
  private apiUrl = 'http://localhost:3000/qcm'; // adapte si ton backend a un autre port

  /**
   * Crée une instance de QcmService.
   * @param http Service Angular pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère l'ensemble des QCM disponibles.
   *
   * @returns Observable émettant un tableau de QCM.
   *
   * @example
   * ```ts
   * qcmService.getAllQCM().subscribe(qcms => console.log(qcms));
   * ```
   */
  getAllQCM(): Observable<QCM[]> {
    return this.http.get<QCM[]>(`${this.apiUrl}`);
  }

  /**
   * Crée un nouveau QCM.
   *
   * @param qcm - Objet QCM à enregistrer.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * qcmService.createQCM({ title: 'Nouveau QCM', questions: [] }).subscribe();
   * ```
   */
  createQCM(qcm: QCM): Observable<any> {
    return this.http.post(`${this.apiUrl}`, qcm);
  }

  /**
   * Crée un nouveau QCM complet incluant ses questions et leurs réponses.
   *
   * Cette méthode envoie une requête HTTP POST vers l'API backend
   * afin d'enregistrer un questionnaire (QCM) avec toutes ses questions et options de réponse associées.
   *
   * L’API ciblée correspond à l’endpoint :
   * `POST {apiUrl}/plusQuestion`
   *
   * @param qcm - Objet conforme à l’interface {@link QCM} contenant :
   *  - les informations générales du QCM (titre, description, auteur)
   *  - la liste des questions (`questions[]`)
   *  - pour chaque question, la liste des réponses (`responses[]`)
   *
   * @returns Observable contenant la réponse HTTP du serveur (par exemple `{ message: string, qcmId: number }`)
   *
   * @example
   * ```ts
   * const newQCM: QCM = {
   *   title: 'QCM sur Perl',
   *   description: 'Testez vos connaissances sur Perl',
   *   created_by: 1,
   *   questions: [
   *     {
   *       question: 'Quel symbole est utilisé pour déclarer une variable scalaire ?',
   *       type: 'single',
   *       responses: [
   *         { response: '$', is_correct: true },
   *         { response: '@', is_correct: false },
   *         { response: '%', is_correct: false }
   *       ]
   *     },
   *     {
   *       question: 'Quelle fonction affiche du texte en Perl ?',
   *       type: 'single',
   *       responses: [
   *         { response: 'print', is_correct: true },
   *         { response: 'echo', is_correct: false }
   *       ]
   *     }
   *   ]
   * };
   *
   * qcmService.createQCMQuestionsWithResponses(newQCM).subscribe({
   *   next: (res) => console.log('✅ QCM créé avec succès', res),
   *   error: (err) => console.error('❌ Erreur lors de la création du QCM', err)
   * });
   * ```
   */
  createQCMQuestionsWithResponses(qcm: QCM): Observable<any> {
    return this.http.post(`${this.apiUrl}/plusQuestion`, qcm);
  }

  /**
   * Récupère un QCM spécifique par son identifiant.
   *
   * @param id - Identifiant unique du QCM.
   * @returns Observable émettant le QCM correspondant.
   *
   * @example
   * ```ts
   * qcmService.getQCMById(1).subscribe(qcm => console.log(qcm));
   * ```
   */
  getQCMById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Met à jour un QCM existant.
   *
   * @param id - Identifiant du QCM à mettre à jour.
   * @param qcm - Objet QCM contenant les nouvelles données.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * qcmService.updateQCM(1, updatedQcm).subscribe();
   * ```
   */
  updateQCM(id: number, qcm: QCM): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, qcm);
  }

  /**
   * Supprime un QCM existant.
   *
   * @param id - Identifiant du QCM à supprimer.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * qcmService.deleteQCM(1).subscribe();
   * ```
   */
  deleteQCM(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère les questions d'un QCM avec leurs réponses associées.
   *
   * @param qcmId - Identifiant du QCM.
   * @returns Observable émettant un tableau de questions avec réponses.
   *
   * @example
   * ```ts
   * qcmService.getQcmQuestionsWithResponses(1).subscribe(questions => console.log(questions));
   * ```
   */
  getQcmQuestionsWithResponses(qcmId: number): Observable<Question[]> {
    return this.http.get<Question[]>(
      `${this.apiUrl}/QcmQuestionsResponses/${qcmId}`
    );
  }

  /**
   * Récupère uniquement les questions d'un QCM (sans réponses).
   *
   * @param qcmId - Identifiant du QCM.
   * @returns Observable émettant un tableau de questions.
   *
   * @example
   * ```ts
   * qcmService.getQcmQuestions(1).subscribe(questions => console.log(questions));
   * ```
   */
  getQcmQuestions(qcmId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/QcmQuestions/${qcmId}`);
  }

  /**
   * Met à jour un QCM en y ajoutant une question.
   *
   * @param id - Identifiant du QCM.
   * @param qcm - Objet QCM contenant la question à ajouter.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * qcmService.updateQCM_Question(1, updatedQcm).subscribe();
   * ```
   */
  updateQCM_Question(id: number, qcm: QCM): Observable<any> {
    return this.http.put(`${this.apiUrl}/plusQuestion/${id}`, qcm);
  }
}
