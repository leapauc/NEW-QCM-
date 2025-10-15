import { AttemptResponse } from './attemptResponse';

/**
 * Représente une question dans le cadre d'une tentative de QCM.
 *
 * Cette interface est utilisée lorsqu'on récupère les détails d'une tentative
 * (via `QuizAttemptsService.getAttemptDetails`).
 * Elle contient l'énoncé de la question, son type, et les réponses possibles.
 */
export interface AttemptQuestion {
  /**
   * Identifiant unique de la question.
   * Sert à relier les réponses sélectionnées par l'utilisateur.
   */
  id_question: number;
  /**
   * Texte de la question posée à l'utilisateur.
   */
  question: string;
  /**
   * Type de question :
   * - `"single"` → l'utilisateur ne peut sélectionner qu'une seule réponse
   * - `"multiple"` → plusieurs réponses peuvent être correctes
   */
  type: 'single' | 'multiple';
  /**
   * Liste des réponses associées à cette question,
   * représentées par des objets `AttemptResponse`.
   * Chaque élément contient le texte de la réponse et un indicateur de validité.
   */
  responses: AttemptResponse[];
}
