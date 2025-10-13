const pool = require("../db");

// appel pour connection d'un utilisateur
exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Vérifie directement le couple name + mot de passe
    const result = await pool.query(
      `
      SELECT * 
      FROM users
      WHERE name = $1 
        AND password = crypt($2, password)
      `,
      [name, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const user = result.rows[0];

    // Met à jour la dernière connexion
    await pool.query(
      "UPDATE users SET last_conn = CURRENT_TIMESTAMP WHERE id_user = $1",
      [user.id_user]
    );

    delete user.password;

    res.json({ message: "Connexion réussie", user });
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
