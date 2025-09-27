/**
 * Représente une réponse possible à une question dans le cadre d'une tentative de QCM.
 *
 * Cette interface est généralement utilisée comme élément du tableau
 * `responses` de l'interface `AttemptQuestion`.
 */
export interface AttemptResponse {
  /**
   * 🔑 Identifiant unique de la réponse (correspond à `response_question.id_response` en base).
   */
  id_response: number;
  /**
   * 📝 Texte de la réponse affiché à l'utilisateur.
   */
  response: string;
  /**
   * ✅ Indique si l'utilisateur a sélectionné cette réponse lors de sa tentative.
   * - `true` → réponse choisie par l'utilisateur
   * - `false` → réponse non choisie
   */
  selected: boolean;
}
