const express = require("express");
const {
  getNbStagiaire,
  getNbQuestionnaire,
  getNbCompletQuestionnaire,
  getNbQuestionRealise,
  getQuestionnairePopulaire,
  getFirstStagiaireActif,
  getNbQuestionnaireList,
  getNbQuestionnaireByUser,
  getMaxMinAvgScoreList,
  getMaxMinAvgScoreByUser,
  getRangeList,
  getRangeByUser,
  getMoyenneTimeList,
  getMoyenneTimeByUser,
} = require("../controllers/stats.controller");

const router = express.Router();

/**
 * @swagger
 * /stats/nbStagiaire:
 *   get:
 *     summary: Nombre de stagiaires
 *     description: Retourne le nombre total d'utilisateurs qui ne sont pas administrateurs.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Nombre de stagiaires récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: string
 *                     example: "42"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/nbStagiaire", getNbStagiaire);
/**
 * @swagger
 * /stats/nbQuestionnaire:
 *   get:
 *     summary: Nombre de questionnaires
 *     description: Retourne le nombre total de questionnaires (QCM) présents dans la base.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Nombre de questionnaires récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: string
 *                     example: "15"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/nbQuestionnaire", getNbQuestionnaire);
/**
 * @swagger
 * /stats/nbCompletQuestionnaire:
 *   get:
 *     summary: Nombre de questionnaires complétés
 *     description: Retourne le nombre total de questionnaires qui ont été complétés par les utilisateurs.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Nombre de questionnaires complétés récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: string
 *                     example: "10"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/nbCompletQuestionnaire", getNbCompletQuestionnaire);
/**
 * @swagger
 * /stats/nbRealisedQuestionnaire:
 *   get:
 *     summary: Nombre total de questionnaires réalisés
 *     description: Retourne le nombre total de questionnaires (tous utilisateurs confondus) qui ont été commencés ou complétés.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Nombre de questionnaires réalisés récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: string
 *                     example: "25"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/nbRealisedQuestionnaire", getNbQuestionRealise);
/**
 * @swagger
 * /stats/questionnairePopulaire:
 *   get:
 *     summary: Questionnaire le plus populaire
 *     description: Retourne le titre du questionnaire (QCM) le plus réalisé par les utilisateurs.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Questionnaire le plus populaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Introduction à Node.js"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/questionnairePopulaire", getQuestionnairePopulaire);
/**
 * @swagger
 * /stats/firstActivStagiaire:
 *   get:
 *     summary: Stagiaire le plus actif
 *     description: Retourne le nom et le prénom du stagiaire ayant réalisé le plus de questionnaires.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Stagiaire le plus actif récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Dupont"
 *                   firstname:
 *                     type: string
 *                     example: "Jean"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/firstActivStagiaire", getFirstStagiaireActif);

/**
 * @swagger
 * /stats/nbQuestionnaireList:
 *   get:
 *     summary: Récupérer le nombre de questionnaires par utilisateur
 *     description: Retourne la liste des utilisateurs (hors administrateurs) avec le nombre de questionnaires qu'ils ont réalisés.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Liste des utilisateurs avec leur nombre de questionnaires complétés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                     example: 42
 *                   name:
 *                     type: string
 *                     example: "Jean Dupont"
 *                   nb_questionnaires:
 *                     type: integer
 *                     example: 5
 *       500:
 *         description: Erreur serveur lors de la récupération des statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/nbQuestionnaireList", getNbQuestionnaireList);
/**
 * @swagger
 * /stats/nbQuestionnaireByUser/{id_user}:
 *   get:
 *     summary: Récupérer le nombre de questionnaires d'un utilisateur
 *     description: Retourne le nombre de questionnaires réalisés par un utilisateur spécifique (hors administrateurs).
 *     tags:
 *       - Statistiques
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *         description: ID de l'utilisateur dont on veut connaître le nombre de questionnaires
 *     responses:
 *       200:
 *         description: Nombre de questionnaires réalisés par l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nb_questionnaires:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Erreur serveur lors de la récupération du nombre de questionnaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/nbQuestionnaireByUser/:id_user", getNbQuestionnaireByUser);
/**
 * @swagger
 * /stats/maxMinAvgScoreList:
 *   get:
 *     summary: Récupérer les scores max, min et moyen pour chaque utilisateur
 *     description: Retourne la liste des utilisateurs (hors administrateurs) avec leur score maximum, minimum et moyen sur l'ensemble de leurs tentatives.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Liste des utilisateurs avec leurs statistiques de scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                     example: 42
 *                   name:
 *                     type: string
 *                     example: "Jean Dupont"
 *                   max_score:
 *                     type: number
 *                     format: float
 *                     example: 9.5
 *                   min_score:
 *                     type: number
 *                     format: float
 *                     example: 5.0
 *                   avg_score:
 *                     type: number
 *                     format: float
 *                     example: 7.2
 *       500:
 *         description: Erreur serveur lors de la récupération des statistiques de scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/maxMinAvgScoreList", getMaxMinAvgScoreList);
/**
 * @swagger
 * /stats/maxMinAvgScoreByUser/{id_user}:
 *   get:
 *     summary: Récupérer les scores max, min et moyen d'un utilisateur
 *     description: Retourne les statistiques (score maximum, minimum et moyen) pour un utilisateur spécifique (hors administrateurs).
 *     tags:
 *       - Statistiques
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *         description: ID de l'utilisateur dont on veut connaître les statistiques de scores
 *     responses:
 *       200:
 *         description: Statistiques de scores pour l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 max_score:
 *                   type: string
 *                   example: "9.5"
 *                 min_score:
 *                   type: string
 *                   example: "5.0"
 *                 avg_score:
 *                   type: string
 *                   example: "7.2"
 *       500:
 *         description: Erreur serveur lors de la récupération des statistiques de scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/maxMinAvgScoreByUser/:id_user", getMaxMinAvgScoreByUser);
/**
 * @swagger
 * /stats/rangeList:
 *   get:
 *     summary: Récupérer le classement des utilisateurs par score moyen
 *     description: Retourne la liste des utilisateurs (hors administrateurs) avec leur score moyen et leur rang dans le classement.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Liste classée des utilisateurs par score moyen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                     example: 42
 *                   name:
 *                     type: string
 *                     example: "Jean Dupont"
 *                   avg_score:
 *                     type: number
 *                     format: float
 *                     example: 7.8
 *                   rank:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Erreur serveur lors de la récupération du classement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/rangeList", getRangeList);
/**
 * @swagger
 * /stats/rangeByUser/{id_user}:
 *   get:
 *     summary: Récupérer le rang et le score moyen d'un utilisateur
 *     description: Retourne le score moyen et le rang dans le classement pour un utilisateur spécifique (hors administrateurs).
 *     tags:
 *       - Statistiques
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *         description: ID de l'utilisateur dont on veut connaître le rang et le score moyen
 *     responses:
 *       200:
 *         description: Rang et score moyen de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avg_score:
 *                   type: number
 *                   format: float
 *                   example: 7.8
 *                 rank:
 *                   oneOf:
 *                     - type: integer
 *                       example: 5
 *                     - type: string
 *                       example: "dernier"
 *       500:
 *         description: Erreur serveur lors de la récupération du rang de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/rangeByUser/:id_user", getRangeByUser);
/**
 * @swagger
 * /stats/avgTimeList:
 *   get:
 *     summary: Récupérer le temps moyen par utilisateur
 *     description: Retourne la liste des utilisateurs (hors administrateurs) avec le temps moyen (en minutes) qu'ils mettent pour compléter un quiz.
 *                  Si un utilisateur n'a pas de tentatives, la valeur renvoyée est "-".
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Liste des utilisateurs avec leur temps moyen par quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                     example: 42
 *                   name:
 *                     type: string
 *                     example: "Jean Dupont"
 *                   avg_time_minutes:
 *                     type: string
 *                     example: "12.50"
 *       500:
 *         description: Erreur serveur lors de la récupération des temps moyens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/avgTimeList", getMoyenneTimeList);
/**
 * @swagger
 * /stats/avgTimeByUser/{id_user}:
 *   get:
 *     summary: Récupérer le temps moyen d'un utilisateur
 *     description: Retourne le temps moyen (en minutes) qu'un utilisateur spécifique met pour compléter un quiz (hors administrateurs).
 *                  Si l'utilisateur n'a pas de tentatives, la valeur renvoyée est "-".
 *     tags:
 *       - Statistiques
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *         description: ID de l'utilisateur dont on veut connaître le temps moyen
 *     responses:
 *       200:
 *         description: Temps moyen de l'utilisateur pour compléter un quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avg_time_minutes:
 *                   type: string
 *                   example: "12.50"
 *       500:
 *         description: Erreur serveur lors de la récupération du temps moyen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/avgTimeByUser/:id_user", getMoyenneTimeByUser);

module.exports = router;
