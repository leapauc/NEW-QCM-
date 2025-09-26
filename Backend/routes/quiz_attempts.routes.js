const express = require("express");
const {
  getAllAttempts,
  getAttemptsByUser,
  getAttemptDetailsById,
  saveAttempt,
} = require("../controllers/quiz_attempts.controller");

const router = express.Router();

/**
 * @swagger
 * /quizAttempts:
 *   get:
 *     summary: Récupérer toutes les tentatives de QCM
 *     description: >
 *       Retourne la liste complète des tentatives de QCM,
 *       incluant les informations sur l'utilisateur (nom) et le QCM (titre).
 *     tags:
 *       - Quiz Attempts
 *     responses:
 *       200:
 *         description: Liste des tentatives de QCM
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_attempt:
 *                     type: integer
 *                     example: 1
 *                   id_qcm:
 *                     type: integer
 *                     example: 3
 *                   id_user:
 *                     type: integer
 *                     example: 4
 *                   started_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-16T16:45:18.452Z"
 *                   ended_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-16T16:55:35.457Z"
 *                   completed:
 *                     type: number
 *                     format: float
 *                     example: 75.0
 *                   score:
 *                     type: number
 *                     format: float
 *                     example: 25.0
 *                   name:
 *                     type: string
 *                     description: Nom de l'utilisateur
 *                     example: "Rivière"
 *                   title:
 *                     type: string
 *                     description: Titre du QCM
 *                     example: "Angular"
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
router.get("", getAllAttempts);
/**
 * @swagger
 * /quizAttempts/{id_user}:
 *   get:
 *     summary: Récupérer les tentatives d'un utilisateur
 *     description: Retourne toutes les tentatives de quiz effectuées par un utilisateur spécifique.
 *     tags:
 *       - QuizAttempts
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 42
 *         description: ID de l'utilisateur dont on veut récupérer les tentatives
 *     responses:
 *       200:
 *         description: Liste des tentatives de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   id_user:
 *                     type: integer
 *                     example: 42
 *                   quiz_id:
 *                     type: integer
 *                     example: 10
 *                   score:
 *                     type: number
 *                     format: float
 *                     example: 7.5
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-21T12:34:56Z"
 *       500:
 *         description: Erreur serveur lors de la récupération des tentatives
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/:id_user", getAttemptsByUser);
/**
 * @swagger
 * /quizAttempts/attempt_details/{id_attempt}:
 *   get:
 *     summary: Récupérer les détails d'une tentative de quiz
 *     description: Retourne toutes les questions et réponses associées à une tentative spécifique, ainsi que les réponses sélectionnées par l'utilisateur.
 *     tags:
 *       - QuizAttempts
 *     parameters:
 *       - in: path
 *         name: id_attempt
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID de la tentative dont on veut récupérer les détails
 *     responses:
 *       200:
 *         description: Détails de la tentative de quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_question:
 *                         type: integer
 *                         example: 1
 *                       question:
 *                         type: string
 *                         example: "Quelle est la capitale de la France ?"
 *                       type:
 *                         type: string
 *                         example: "QCM"
 *                       responses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_response:
 *                               type: integer
 *                               example: 10
 *                             response:
 *                               type: string
 *                               example: "Paris"
 *                             selected:
 *                               type: boolean
 *                               example: true
 *       500:
 *         description: Erreur serveur lors de la récupération des détails de la tentative
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/attempt_details/:id_attempt", getAttemptDetailsById);

/**
 * @swagger
 * /quizAttempts:
 *   post:
 *     summary: Enregistrer une nouvelle tentative de quiz
 *     description: Crée une nouvelle tentative pour un QCM, enregistre les réponses de l'utilisateur et calcule le score et le pourcentage de progression.
 *     tags:
 *       - QuizAttempts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_qcm
 *               - id_user
 *               - answers
 *               - started_at
 *               - ended_at
 *             properties:
 *               id_qcm:
 *                 type: integer
 *                 example: 42
 *                 description: ID du QCM sur lequel la tentative est effectuée
 *               id_user:
 *                 type: integer
 *                 example: 7
 *                 description: ID de l'utilisateur qui passe le quiz
 *               answers:
 *                 type: array
 *                 description: Liste des réponses sélectionnées par l'utilisateur
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                       example: 12
 *                     id_response:
 *                       type: integer
 *                       example: 55
 *               started_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-26T14:00:00.000Z"
 *                 description: Date/heure de début de la tentative (format ISO 8601)
 *               ended_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-26T14:10:00.000Z"
 *                 description: Date/heure de fin de la tentative (format ISO 8601)
 *     responses:
 *       200:
 *         description: Tentative enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_attempt:
 *                   type: integer
 *                   example: 101
 *                 completed:
 *                   type: number
 *                   format: float
 *                   example: 100
 *                   description: Pourcentage de questions répondues
 *                 score:
 *                   type: integer
 *                   example: 80
 *                   description: Score final de l'utilisateur en pourcentage
 *       500:
 *         description: Erreur serveur lors de l'enregistrement de la tentative
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de l'enregistrement de la tentative"
 */
router.post("", saveAttempt);

module.exports = router;
