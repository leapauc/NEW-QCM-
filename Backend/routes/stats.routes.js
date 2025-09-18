const express = require("express");
const {
  getNbStagiaire,
  getNbQuestionnaire,
  getNbCompletQuestionnaire,
  getNbQuestionRealise,
  getQuestionnairePopulaire,
  getFirstStagiaireActif,
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

module.exports = router;
