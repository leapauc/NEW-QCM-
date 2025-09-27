import { ResponseOption } from './responseOption';

/**
 * Représente une question appartenant à un QCM.
 *
 * Cette interface est utilisée dans le service `QcmService` pour gérer
 * les questions d’un QCM, notamment lors de la création, de la récupération
 * ou de la mise à jour des QCM.
 */
export interface Question {
  /**
   * 🔑 Identifiant unique de la question (généré par la base de données).
   * Optionnel lors de la création d’une nouvelle question.
   */
  id_question?: number;
  /**
   * 🔑 Identifiant du QCM auquel cette question appartient.
   * Optionnel si la question est manipulée indépendamment.
   */
  id_qcm?: number;
  /**
   * 📝 Texte de la question.
   * Exemple : "Quel mot-clé permet de définir une classe en Java ?"
   */
  question: string;
  /**
   * 🎯 Type de question :
   * - `"single"` → l'utilisateur ne peut sélectionner qu'une seule réponse
   * - `"multiple"` → plusieurs réponses peuvent être correctes
   */
  type: 'single' | 'multiple';
  /**
   * 📌 Position de la question dans le QCM.
   * Optionnel, utilisé pour ordonner les questions lors de l’affichage.
   */
  position?: number;
  /**
   * 📋 Liste des options de réponse associées à cette question.
   * Chaque élément est un objet `ResponseOption`.
   */
  responses: ResponseOption[];
}
