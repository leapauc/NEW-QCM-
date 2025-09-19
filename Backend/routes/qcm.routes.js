const express = require("express");
const {
  getAllQCM,
  getQCMById,
  createQCM,
  createQCMWithQuestion,
  updateQCM,
  updateQCMWithQuestion,
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
 *     summary: Créer un nouveau QCM
 *     description: Permet de créer un QCM avec ses questions et réponses.
 *     tags:
 *       - QCM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction à JavaScript"
 *               description:
 *                 type: string
 *                 example: "QCM pour débutants sur JavaScript"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "JavaScript est un langage ..."
 *                     type:
 *                       type: string
 *                       enum: [single, multiple]
 *                       example: "single"
 *                     responses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           response:
 *                             type: string
 *                             example: "interprété"
 *                           is_correct:
 *                             type: boolean
 *                             example: true
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
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Titre et questions sont obligatoires"
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
 *                   example: "Détails de l'erreur côté serveur"
 */
router.post("/plusQuestion", createQCMWithQuestion);
/**
 * @swagger
 * /qcm/{id}:
 *   put:
 *     summary: Met à jour un QCM existant
 *     description: Met à jour le titre et la description d'un QCM spécifique. Les questions et réponses ne sont pas modifiées pour le moment.
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
 *               questions:
 *                 type: array
 *                 description: Liste des questions avec leurs réponses (non utilisée actuellement)
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_question:
 *                       type: integer
 *                     question:
 *                       type: string
 *                     type:
 *                       type: string
 *                       example: "single"
 *                     responses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_response:
 *                             type: integer
 *                           response:
 *                             type: string
 *                           is_correct:
 *                             type: boolean
 *                           position:
 *                             type: integer
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

router.put("/plusQuestion/:id", updateQCMWithQuestion);
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
 *     summary: Récupérer les questions et réponses d'un QCM
 *     description: Retourne toutes les questions et leurs réponses associées pour un QCM donné. Les réponses, leur validité et leur position sont renvoyées sous forme de chaînes séparées par "|".
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
 *         description: Questions et réponses récupérées avec succès
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
 *                     example: "interprété|compilé|les deux"
 *                   is_correct:
 *                     type: string
 *                     example: "f|f|t"
 *                   position:
 *                     type: string
 *                     example: "1|2|3"
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
 *         description: Le QCM ne comporte aucune question
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
