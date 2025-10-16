/**
 * Représente une option de réponse pour une question de QCM.
 *
 * Cette interface est utilisée dans le service `QcmService` et dans
 * l'interface `Question` pour définir les réponses possibles à chaque question.
 */
export interface ResponseOption {
  /**
   * Identifiant unique de la réponse (correspond à `response_question.id_response` en base).
   * Optionnel lors de la création d’une nouvelle réponse.
   */
  id_response?: number;
  /**
   * Identifiant de la question à laquelle cette réponse appartient.
   * Optionnel si la réponse est manipulée indépendamment.
   */
  id_question?: number;
  /**
   * Texte de la réponse affiché à l'utilisateur.
   */
  response: string;
  /**
   * Indique si la réponse est correcte ou non.
   * - `true` → réponse correcte
   * - `false` → réponse incorrecte
   */
  is_correct: boolean;
  /**
   * Position de la réponse dans la liste des réponses pour la question.
   * Optionnel, utile pour l'affichage dans l'ordre défini.
   */
  position?: number;
}
