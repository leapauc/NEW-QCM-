const express = require("express");
const { login } = require("../controllers/auth.controller");

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     description: Permet à un utilisateur de se connecter avec son nom et son mot de passe. Met à jour la date de dernière connexion.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: alice
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Alice"
 *                     email:
 *                       type: string
 *                       example: "alice@example.com"
 *                     last_conn:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-18T12:34:56.789Z"
 *       401:
 *         description: Identifiants incorrects ou mot de passe invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Identifiants incorrects"
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
router.post("/", login);

module.exports = router;
