/**
 * Représente une réponse à une question, avec toutes les informations nécessaires.
 *
 * Cette interface est utilisée notamment dans le service `QuestionService`
 * pour récupérer une question avec ses réponses et savoir quelles réponses
 * sont correctes.
 */
export interface QuestionResponse {
  /**
   * 🔑 Identifiant unique de la réponse (correspond à `response_question.id_response` en base).
   */
  id_response: number;
  /**
   * 🔑 Identifiant de la question à laquelle cette réponse appartient.
   */
  id_question: number;
  /**
   * 📝 Texte de la réponse affiché à l'utilisateur.
   */
  response: string;
  /**
   * ✅ Indique si cette réponse est correcte ou non.
   * - `true` → réponse correcte
   * - `false` → réponse incorrecte
   */
  is_correct: boolean;
  /**
   * 📌 Position de la réponse dans la liste des réponses pour cette question.
   * Utile pour l’affichage dans le même ordre que défini dans la base.
   */
  position: number;
  /**
   * 📝 Texte de la question associée.
   * Utile lorsque l’on récupère une liste de réponses pour afficher
   * la question avec ses réponses dans l’UI.
   */
  question: string;
}
