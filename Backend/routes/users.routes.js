const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const router = express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste des utilisateurs
 *     description: Renvoie tous les utilisateurs présents dans la base de données, triés par ID.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Alice"
 *                   email:
 *                     type: string
 *                     example: "alice@example.com"
 *                   password:
 *                     type: string
 *                     description: "Mot de passe hashé (doit idéalement ne pas être exposé dans la doc publique)"
 *                     example: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36v1hCq6T1eqT8Z."
 *                   last_conn:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-18T12:34:56.789Z"
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
router.get("/", getAllUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     description: Renvoie les informations d'un utilisateur spécifique en fonction de son identifiant.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'identifiant unique de l'utilisateur
 *         example: 1
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Alice"
 *                 email:
 *                   type: string
 *                   example: "alice@example.com"
 *                 password:
 *                   type: string
 *                   description: "Mot de passe hashé (ne pas exposer dans la doc publique)"
 *                   example: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36v1hCq6T1eqT8Z."
 *                 last_conn:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-18T12:34:56.789Z"
 *       404:
 *         description: Utilisateur non trouvé
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
router.get("/:id", getUserById);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Permet de créer un utilisateur avec son nom, prénom, société, email, mot de passe et rôle admin.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - firstname
 *               - password
 *               - email
 *               - admin
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Doe"
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               society:
 *                 type: string
 *                 example: "ACME Corp"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               admin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Doe"
 *                 firstname:
 *                   type: string
 *                   example: "John"
 *                 society:
 *                   type: string
 *                   example: "ACME Corp"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 admin:
 *                   type: boolean
 *                   example: false
 *                 last_conn:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-18T12:34:56.789Z"
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
router.post("/", createUser);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur existant
 *     description: Permet de modifier les informations d'un utilisateur existant, y compris le mot de passe et le rôle admin.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'identifiant unique de l'utilisateur
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Doe"
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               society:
 *                 type: string
 *                 example: "ACME Corp"
 *               password:
 *                 type: string
 *                 example: "NewPassword123"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               admin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Doe"
 *                 firstname:
 *                   type: string
 *                   example: "John"
 *                 society:
 *                   type: string
 *                   example: "ACME Corp"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 admin:
 *                   type: boolean
 *                   example: false
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-18T12:34:56.789Z"
 *       404:
 *         description: Utilisateur non trouvé
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
router.put("/:id", updateUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Permet de supprimer un utilisateur existant à partir de son identifiant unique.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'identifiant unique de l'utilisateur à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Doe"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     society:
 *                       type: string
 *                       example: "ACME Corp"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     admin:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Utilisateur non trouvé
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
router.delete("/:id", deleteUser);

module.exports = router;
