const express = require("express");
const {
  getAllQCM,
  getQCMById,
  createQCM,
  createQCMWithQuestion,
  updateQCM,
  updateQCMWithQuestions,
  deleteQCM,
  getQuestionResponseOfQCMById,
  getQuestionResponseByQuestionId,
  getQuestionOfQCMById,
} = require("../controllers/qcm.controller");

const router = express.Router();

/**
 * @swagger
 * /qcm:
 *   get:
 *     summary: Récupérer tous les QCM
 *     description: Retourne la liste de tous les QCM avec l'information du créateur.
 *     tags:
 *       - QCM
 *     responses:
 *       200:
 *         description: Liste des QCM récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_qcm:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Introduction à JavaScript"
 *                   created_by:
 *                     type: integer
 *                     example: 2
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-18T14:23:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-18T14:45:00Z"
 *                   user:
 *                     type: string
 *                     example: "John Doe"
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
router.get("/", getAllQCM);
/**
 * @swagger
 * /qcm/{id}:
 *   get:
 *     summary: Récupérer un QCM par son ID
 *     description: Retourne les détails d'un QCM spécifique en fonction de son identifiant.
 *     tags:
 *       - QCM
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du QCM à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails du QCM récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_qcm:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Introduction à JavaScript"
 *                 description:
 *                   type: string
 *                   example: "QCM pour débutant en JavaScript"
 *                 created_by:
 *                   type: integer
 *                   example: 2
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-18T14:23:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-18T14:45:00Z"
 *       404:
 *         description: QCM non trouvé
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
router.get("/:id", getQCMById);
/**
 * @swagger
 * /qcm:
 *   post:
 *     summary: Créer un nouveau QCM
 *     description: Permet de créer un QCM avec un titre, une description et l'identifiant de l'utilisateur créateur.
 *     tags:
 *       - QCM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - created_by
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction à Java"
 *                 description: Titre du QCM (obligatoire)
 *               description:
 *                 type: string
 *                 example: "QCM sur les bases de Java"
 *                 description: Description du QCM
 *               created_by:
 *                 type: integer
 *                 example: 1
 *                 description: ID de l'utilisateur créateur (obligatoire)
 *     responses:
 *       201:
 *         description: QCM créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QCM créé avec succès"
 *                 qcmId:
 *                   type: integer
 *                   example: 10
 *                   description: ID du QCM créé
 *       400:
 *         description: "Requête invalide (ex: titre manquant)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Titre est obligatoire"
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
 *                 details:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */
router.post("/", createQCM);

/**
 * @swagger
 * /qcm/plusQuestion:
 *   post:
 *     summary: Créer un QCM avec ses questions et réponses
 *     description: >
 *       Permet de créer un QCM complet avec plusieurs questions,
 *       chacune ayant plusieurs propositions de réponses.
 *       Chaque question peut être de type `single` (une seule bonne réponse)
 *       ou `multiple` (plusieurs bonnes réponses).
 *     tags:
 *       - QCM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du QCM
 *                 example: "QCM de culture générale"
 *               description:
 *                 type: string
 *                 description: Description du QCM
 *                 example: "Testez vos connaissances sur différents domaines."
 *               created_by:
 *                 type: integer
 *                 description: ID de l'utilisateur créateur
 *                 example: 1
 *               questions:
 *                 type: array
 *                 description: Liste des questions du QCM
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - responses
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: Texte de la question
 *                       example: "Quelle est la capitale de la France ?"
 *                     type:
 *                       type: string
 *                       enum: [single, multiple]
 *                       description: Type de question (une seule ou plusieurs réponses correctes)
 *                       example: "single"
 *                     responses:
 *                       type: array
 *                       description: Liste des réponses possibles
 *                       items:
 *                         type: object
 *                         required:
 *                           - response
 *                           - is_correct
 *                         properties:
 *                           response:
 *                             type: string
 *                             description: Texte de la réponse
 *                             example: "Paris"
 *                           is_correct:
 *                             type: boolean
 *                             description: Indique si la réponse est correcte
 *                             example: true
 *           examples:
 *             QCMCultureGenerale:
 *               summary: Exemple complet de création d'un QCM
 *               value:
 *                 title: "QCM de culture générale"
 *                 description: "Testez vos connaissances sur différents domaines."
 *                 created_by: 1
 *                 questions:
 *                   - question: "Quelle est la capitale de la France ?"
 *                     type: "single"
 *                     responses:
 *                       - response: "Paris"
 *                         is_correct: true
 *                       - response: "Lyon"
 *                         is_correct: false
 *                       - response: "Marseille"
 *                         is_correct: false
 *                   - question: "Lesquels de ces animaux sont des mammifères ?"
 *                     type: "multiple"
 *                     responses:
 *                       - response: "Dauphin"
 *                         is_correct: true
 *                       - response: "Serpent"
 *                         is_correct: false
 *                       - response: "Chauve-souris"
 *                         is_correct: true
 *     responses:
 *       201:
 *         description: QCM créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QCM créé avec succès"
 *                 qcmId:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: Données invalides (titre ou questions manquants)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Titre et questions sont obligatoires"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 *                 details:
 *                   type: string
 *                   example: "Détails de l'erreur côté serveur"
 */
router.post("/plusQuestion", createQCMWithQuestion);
/**
 * @swagger
 * /qcm/{id}:
 *   put:
 *     summary: Met à jour un QCM existant
 *     description: Met à jour le titre et la description d'un QCM spécifique.
 *     tags:
 *       - QCM
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du QCM à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Titre mis à jour"
 *                 description: Nouveau titre du QCM
 *               description:
 *                 type: string
 *                 example: "Description mise à jour"
 *                 description: Nouvelle description du QCM
 *     responses:
 *       200:
 *         description: QCM mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QCM et questions/réponses mis à jour avec succès"
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Requête invalide"
 *       404:
 *         description: QCM non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "QCM non trouvé"
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
 *                 details:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */
router.put("/:id", updateQCM);
/**
 * @swagger
 * /qcm/plusQuestion/{id}:
 *   put:
 *     summary: Mettre à jour un QCM existant avec ses questions et réponses
 *     description: >
 *       Permet de mettre à jour un QCM existant, y compris ses questions et leurs réponses associées.
 *       Chaque question peut être de type `single` (une seule bonne réponse) ou `multiple` (plusieurs bonnes réponses).
 *     tags:
 *       - QCM
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du QCM à mettre à jour
 *         schema:
 *           type: integer
 *           example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nouveau titre du QCM
 *                 example: "QCM de culture générale - Version révisée"
 *               description:
 *                 type: string
 *                 description: Nouvelle description du QCM
 *                 example: "Version mise à jour du QCM de culture générale."
 *               questions:
 *                 type: array
 *                 description: Liste des questions du QCM à mettre à jour
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_question
 *                     - question
 *                     - responses
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                       description: ID unique de la question à mettre à jour
 *                       example: 32
 *                     question:
 *                       type: string
 *                       description: Texte mis à jour de la question
 *                       example: "Quelle est la capitale de la France ?"
 *                     type:
 *                       type: string
 *                       enum: [single, multiple]
 *                       description: Type de la question
 *                       example: "single"
 *                     responses:
 *                       type: array
 *                       description: Liste des réponses à mettre à jour pour la question
 *                       items:
 *                         type: object
 *                         required:
 *                           - response
 *                           - is_correct
 *                         properties:
 *                           response:
 *                             type: string
 *                             description: Texte de la réponse
 *                             example: "Paris"
 *                           is_correct:
 *                             type: boolean
 *                             description: Indique si la réponse est correcte
 *                             example: true
 *                           position:
 *                             type: integer
 *                             description: Position d'affichage de la réponse
 *                             example: 1
 *           examples:
 *             UpdateQCMExample:
 *               summary: Exemple complet de mise à jour d’un QCM
 *               value:
 *                 title: "QCM de culture générale - Version révisée"
 *                 description: "Version mise à jour du QCM de culture générale."
 *                 questions:
 *                   - id_question: 33
 *                     question: "Quelle est la capitale de la France ?"
 *                     type: "single"
 *                     responses:
 *                       - response: "Paris"
 *                         is_correct: true
 *                         position: 1
 *                       - response: "Lyon"
 *                         is_correct: false
 *                         position: 2
 *                   - id_question: 34
 *                     question: "Lesquels de ces animaux sont des mammifères ?"
 *                     type: "multiple"
 *                     responses:
 *                       - response: "Dauphin"
 *                         is_correct: true
 *                         position: 1
 *                       - response: "Serpent"
 *                         is_correct: false
 *                         position: 2
 *                       - response: "Chauve-souris"
 *                         is_correct: true
 *                         position: 3
 *     responses:
 *       200:
 *         description: QCM, questions et réponses mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QCM, questions et réponses mis à jour avec succès"
 *       400:
 *         description: ID QCM invalide ou données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID QCM invalide"
 *       404:
 *         description: QCM non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "QCM non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 *                 details:
 *                   type: string
 *                   example: "Détails de l'erreur côté serveur"
 */
router.put("/plusQuestion/:id", updateQCMWithQuestions);
/**
 * @swagger
 * /qcm/{id}:
 *   delete:
 *     summary: Supprimer un QCM
 *     description: Supprime un QCM existant ainsi que toutes ses questions et réponses associées.
 *     tags:
 *       - QCM
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du QCM à supprimer
 *     responses:
 *       200:
 *         description: QCM supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QCM supprimé avec succès"
 *                 qcm:
 *                   type: object
 *                   properties:
 *                     id_qcm:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Introduction à JavaScript"
 *                     description:
 *                       type: string
 *                       example: "QCM pour débutants sur JavaScript"
 *                     created_by:
 *                       type: integer
 *                       example: 2
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-18T10:15:30Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-18T12:00:00Z"
 *       404:
 *         description: QCM non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "QCM non trouvé"
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
router.delete("/:id", deleteQCM);
/**
 * @swagger
 * /qcm/QcmQuestionsResponses/{id_qcm}:
 *   get:
 *     summary: Récupérer toutes les questions et réponses d'un QCM
 *     description: >
 *       Retourne la liste complète des questions d'un QCM ainsi que leurs réponses associées.
 *       Chaque question contient un tableau `responses` avec les réponses possibles.
 *     tags:
 *       - QCM
 *     parameters:
 *       - name: id_qcm
 *         in: path
 *         required: true
 *         description: ID du QCM dont on veut récupérer les questions et réponses
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Liste des questions et réponses récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_question:
 *                     type: integer
 *                     example: 12
 *                   id_qcm:
 *                     type: integer
 *                     example: 5
 *                   question:
 *                     type: string
 *                     example: "Quelle est la capitale de l'Espagne ?"
 *                   type:
 *                     type: string
 *                     example: "single"
 *                   position:
 *                     type: integer
 *                     example: 1
 *                   responses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_response:
 *                           type: integer
 *                           example: 45
 *                         response:
 *                           type: string
 *                           example: "Madrid"
 *                         is_correct:
 *                           type: boolean
 *                           example: true
 *                         position:
 *                           type: integer
 *                           example: 1
 *       400:
 *         description: Mauvaise requête (ID invalide)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID invalide"
 *       404:
 *         description: Aucun résultat trouvé (pas de question pour ce QCM)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Le QCM comporte aucune question."
 *       500:
 *         description: Erreur interne du serveur lors de la récupération des données
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/QcmQuestionsResponses/:id_qcm", getQuestionResponseOfQCMById);
/**
 * @swagger
 * /qcm/QuestionsResponses/{id_question}:
 *   get:
 *     summary: Récupérer une question et ses réponses
 *     description: Retourne une question spécifique et toutes ses réponses associées. Chaque réponse contient le texte, si elle est correcte et sa position.
 *     tags:
 *       - QCM
 *     parameters:
 *       - in: path
 *         name: id_question
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la question
 *     responses:
 *       200:
 *         description: Question et réponses récupérées avec succès
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
 *                     example: 1
 *                   question:
 *                     type: string
 *                     example: "Java est un langage ..."
 *                   type:
 *                     type: string
 *                     example: "single"
 *                   response:
 *                     type: string
 *                     example: "interprété"
 *                   is_correct:
 *                     type: boolean
 *                     example: false
 *                   position:
 *                     type: integer
 *                     example: 1
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
 *                   example: "Le QCM comporte aucune question."
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
router.get("/QuestionsResponses/:id_question", getQuestionResponseByQuestionId);
/**
 * @swagger
 * /qcm/QcmQuestions/{id_qcm}:
 *   get:
 *     summary: Récupérer toutes les questions d'un QCM
 *     description: Retourne toutes les questions d'un QCM spécifique avec le titre du QCM.
 *     tags:
 *       - QCM
 *     parameters:
 *       - in: path
 *         name: id_qcm
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du QCM
 *     responses:
 *       200:
 *         description: Liste des questions récupérées avec succès
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
 *                     example: 1
 *                   question:
 *                     type: string
 *                     example: "Java est un langage ..."
 *                   type:
 *                     type: string
 *                     example: "single"
 *                   position:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Introduction à Java"
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
 *         description: Aucun question dans ce QCM
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Le QCM comporte aucune question."
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
router.get("/QcmQuestions/:id_qcm", getQuestionOfQCMById);

module.exports = router;
