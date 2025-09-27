import { UserAnswer } from './userAnswer';

/**
 * Représente la charge utile (payload) envoyée au backend
 * lorsqu'un utilisateur termine un QCM.
 *
 * Cette interface est utilisée lors de l'appel à l'API pour
 * sauvegarder une tentative (`QuizAttemptsService.saveAttempt`).
 */
export interface AttemptPayload {
  /**
   * 🔑 Identifiant unique de l'utilisateur qui a tenté le QCM.
   * Sert à associer la tentative à un utilisateur dans la base de données.
   */
  id_user: number;
  /**
   * Identifiant unique du QCM qui a été tenté.
   * Permet de lier la tentative au questionnaire correspondant.
   */
  id_qcm: number;
  /**
   * ⏱ Date/heure de début de la tentative au format ISO (ex: `2025-09-16T17:14:15.452Z`).
   * Utilisé pour calculer la durée totale passée sur le QCM.
   */
  started_at: string;
  /**
   * ⏱ Date/heure de fin de la tentative au format ISO (ex: `2025-09-16T17:27:17.145Z`).
   * Utilisé pour savoir quand l'utilisateur a soumis ses réponses.
   */
  ended_at: string;
  /**
   * 📋 Liste des réponses de l'utilisateur pour chaque question du QCM.
   * Chaque élément de ce tableau correspond à un `UserAnswer` (id_question + id_response).
   */
  answers: UserAnswer[];
}
