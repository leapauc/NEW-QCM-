/**
 * Représente la réponse donnée par un utilisateur pour une question d’un QCM.
 *
 * Cette interface est utilisée dans le service `QuizAttemptsService`
 * lors de l’envoi du payload d’une tentative (`AttemptPayload`).
 */
export interface UserAnswer {
  /**
   * Identifiant de la question à laquelle l'utilisateur a répondu.
   */
  id_question: number;

  /**
   * Identifiant de la réponse sélectionnée par l'utilisateur.
   * Correspond à `response_question.id_response` en base de données.
   */
  id_response: number;
}
