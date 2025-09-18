const express = require("express");
const {
  getAllQuestion,
  getQuestionById,
  getQuestionResponseById,
  createQuestionForAQCM,
  updateQuestionForAQCM,
  deleteQuestionForAQCM,
} = require("../controllers/question.controller");

const router = express.Router();

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Récupérer toutes les questions
 *     description: Retourne la liste complète des questions avec le titre du QCM associé.
 *     tags:
 *       - Questions
 *     responses:
 *       200:
 *         description: Liste des questions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_question:
 *                     type: integer
 *                     example: 1
 *                   id_qcm:
 *                     type: integer
 *                     example: 2
 *                   question:
 *                     type: string
 *                     example: "Quel est le format d'une boucle for en Python ?"
 *                   type:
 *                     type: string
 *                     enum: [single, multiple]
 *                     example: "single"
 *                   position:
 *                     type: integer
 *                     nullable: true
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Introduction à Python"
 *       404:
 *         description: Aucune question trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
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
router.get("/", getAllQuestion);
/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Créer une nouvelle question pour un QCM
 *     description: Permet d'ajouter une question avec ses réponses à un QCM. Le type de question (`single` ou `multiple`) est déterminé automatiquement en fonction du nombre de réponses correctes.
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_qcm:
 *                 type: integer
 *                 example: 2
 *                 description: ID du QCM auquel la question appartient
 *               question:
 *                 type: string
 *                 example: "Quel est le format d'une boucle for en Python ?"
 *                 description: Texte de la question
 *               position:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *                 description: Position de la question dans le QCM
 *               responses:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   properties:
 *                     response:
 *                       type: string
 *                       example: "for i in range(5):"
 *                     is_correct:
 *                       type: boolean
 *                       example: true
 *                     position:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *     responses:
 *       201:
 *         description: Question et réponses créées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question et réponses créées avec succès"
 *                 question:
 *                   type: object
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                       example: 5
 *                     id_qcm:
 *                       type: integer
 *                       example: 2
 *                     question:
 *                       type: string
 *                       example: "Quel est le format d'une boucle for en Python ?"
 *                     type:
 *                       type: string
 *                       enum: [single, multiple]
 *                       example: "single"
 *                     position:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *       400:
 *         description: Requête invalide (champs manquants ou réponses incorrectes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Une question doit avoir au moins deux réponses"
 *       500:
 *         description: Erreur serveur lors de l'ajout de la question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de l'ajout de la question"
 */
router.post("/", createQuestionForAQCM);
/**
 * @swagger
 * /questions/{id_question}:
 *   get:
 *     summary: Récupérer une question par son ID
 *     description: Retourne les détails d'une question spécifique avec le titre du QCM associé.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id_question
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la question à récupérer
 *     responses:
 *       200:
 *         description: Question récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_question:
 *                   type: integer
 *                   example: 1
 *                 id_qcm:
 *                   type: integer
 *                   example: 2
 *                 question:
 *                   type: string
 *                   example: "Quel est le format d'une boucle for en Python ?"
 *                 type:
 *                   type: string
 *                   enum: [single, multiple]
 *                   example: "single"
 *                 position:
 *                   type: integer
 *                   nullable: true
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Introduction à Python"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID invalide"
 *       404:
 *         description: Question non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Question non trouvé"
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
router.get("/:id_question", getQuestionById);
/**
 * @swagger
 * /response/{id_question}:
 *   get:
 *     summary: Récupérer une question et ses réponses
 *     description: Retourne toutes les réponses associées à une question spécifique d'un QCM.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id_question
 *         required: true
 *         description: ID de la question à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Question et ses réponses récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_response:
 *                     type: integer
 *                     example: 1
 *                   id_question:
 *                     type: integer
 *                     example: 1
 *                   response:
 *                     type: string
 *                     example: "Java est interprété"
 *                   is_correct:
 *                     type: boolean
 *                     example: false
 *                   position:
 *                     type: integer
 *                     example: 1
 *                   question:
 *                     type: string
 *                     example: "Java est un langage ..."
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID invalide"
 *       404:
 *         description: Question non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Question non trouvé"
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
router.get("/response/:id_question", getQuestionResponseById);
/**
 * @swagger
 * /questions/{id_question}:
 *   put:
 *     summary: Mettre à jour une question d'un QCM
 *     description: Permet de modifier le texte, le type, la position et les réponses d'une question. Si des réponses sont fournies, elles remplacent les anciennes.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id_question
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *         description: ID de la question à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "Quel est le format d'une boucle for en Python ?"
 *               type:
 *                 type: string
 *                 enum: [single, multiple]
 *                 example: "single"
 *               position:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               responses:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   properties:
 *                     response:
 *                       type: string
 *                       example: "for i in range(5):"
 *                     is_correct:
 *                       type: boolean
 *                       example: true
 *                     position:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *     responses:
 *       200:
 *         description: Question et réponses mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question et réponses mises à jour avec succès"
 *                 question:
 *                   type: object
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                       example: 5
 *                     id_qcm:
 *                       type: integer
 *                       example: 2
 *                     question:
 *                       type: string
 *                       example: "Quel est le format d'une boucle for en Python ?"
 *                     type:
 *                       type: string
 *                       enum: [single, multiple]
 *                       example: "single"
 *                     position:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *       400:
 *         description: Requête invalide (moins de 2 réponses ou texte manquant)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Une question doit avoir au moins deux réponses"
 *       404:
 *         description: Question non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Question non trouvée"
 *       500:
 *         description: Erreur serveur lors de la modification de la question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la modification de la question"
 */
router.put("/:id_question", updateQuestionForAQCM);
/**
 * @swagger
 * /questions/{id_question}:
 *   delete:
 *     summary: Supprimer une question d'un QCM
 *     description: Supprime une question ainsi que toutes ses réponses associées.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id_question
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *         description: ID de la question à supprimer
 *     responses:
 *       200:
 *         description: Question supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question supprimée avec succès"
 *       404:
 *         description: Question non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Question non trouvée"
 *       500:
 *         description: Erreur serveur lors de la suppression de la question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la suppression de la question"
 */
router.delete("/:id_question", deleteQuestionForAQCM);

module.exports = router;
