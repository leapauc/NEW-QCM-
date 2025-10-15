import { Question } from './question';

/**
 * Représente un questionnaire QCM (Questionnaire à Choix Multiples).
 *
 * Cette interface est utilisée dans le service `QcmService` pour la
 * création, la récupération et la mise à jour des QCM.
 */
export interface QCM {
  /**
   * Identifiant unique du QCM (généré par la base de données).
   * Optionnel lors de la création d'un nouveau QCM.
   */
  id_qcm?: number;
  /**
   * Titre du QCM.
   * Exemple : "Java", "Python débutant", "Angular".
   */
  title: string;
  /**
   * Description du QCM.
   * Optionnel, peut contenir des informations sur le contenu ou l'objectif.
   */
  description?: string;
  /**
   * Nom de l'utilisateur qui a créé le QCM.
   * Optionnel, peut être utilisé pour l'affichage dans l'UI.
   */
  user?: string;
  /**
   * Id du créateur du QCM.
   */
  created_by?: string;
  /**
   * Date de création du QCM au format ISO.
   * Optionnel, fourni par la base de données.
   */
  created_at?: string;
  /**
   * Date de dernière mise à jour du QCM au format ISO.
   * Optionnel, fourni par la base de données.
   */
  updated_at?: string;
  /**
   * Liste des questions appartenant à ce QCM.
   * Chaque élément est un objet `Question`.
   */
  questions?: Question[];
}
