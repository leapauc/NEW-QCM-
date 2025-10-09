import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionResponse } from '../models/questionResponse';
import { Question } from '../models/question';

/**
 * Service de gestion des questions.
 *
 * Permet de récupérer, créer, modifier et supprimer des questions,
 * ainsi que de récupérer les réponses associées à une question spécifique.
 */
@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  /**
   * URL de base de l'API pour les opérations sur les questions.
   */
  private apiUrl = 'http://localhost:3000/questions';

  /**
   * Crée une instance de QuestionService.
   * @param http Service Angular pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les questions (tous QCM confondus).
   *
   * @returns Observable émettant un tableau de toutes les questions disponibles.
   *
   * @example
   * ```ts
   * questionService.getAllQuestions().subscribe(questions => console.log(questions));
   * ```
   */
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/`);
  }

  /**
   * Récupère une question spécifique par son identifiant.
   *
   * @param id_question - Identifiant unique de la question.
   * @returns Observable émettant l'objet Question correspondant.
   *
   * @example
   * ```ts
   * questionService.getQuestionById(42).subscribe(q => console.log(q));
   * ```
   */
  getQuestionById(id_question: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id_question}`);
  }

  /**
   * Récupère une question et ses réponses associées par son identifiant.
   *
   * @param id_question - Identifiant unique de la question.
   * @returns Observable émettant un tableau de réponses liées à la question.
   *
   * @example
   * ```ts
   * questionService.getQuestionReponseById(42).subscribe(responses => console.log(responses));
   * ```
   */
  getQuestionReponseById(id_question: number): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(
      `${this.apiUrl}/response/${id_question}`
    );
  }

  /**
   * Crée une nouvelle question.
   *
   * @param question - Objet Question à enregistrer.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * questionService.createQuestion({ text: 'Nouvelle question', qcmId: 1 }).subscribe();
   * ```
   */
  createQuestion(question: Question): Observable<any> {
    return this.http.post(`${this.apiUrl}`, question);
  }

  /**
   * Met à jour une question existante.
   *
   * @param id_question - Identifiant de la question à modifier.
   * @param question - Objet Question contenant les nouvelles données.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * questionService.updateQuestion(42, updatedQuestion).subscribe();
   * ```
   */
  updateQuestion(id_question: number, question: Question): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_question}`, question);
  }

  /**
   * Supprime une question existante.
   *
   * @param id_question - Identifiant de la question à supprimer.
   * @returns Observable de la réponse HTTP.
   *
   * @example
   * ```ts
   * questionService.deleteQuestion(42).subscribe();
   * ```
   */
  deleteQuestion(id_question: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_question}`);
  }
}
