const pool = require("../db");

exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const user = result.rows[0];

    const verify = await pool.query("SELECT crypt($1, $2) = $2 AS match", [
      password,
      user.password,
    ]);

    if (!verify.rows[0].match) {
      return res.status(401).json({ error: "Mot de passe incorrects" });
    }

    const update = await pool.query(
      `UPDATE users SET last_conn = CURRENT_TIMESTAMP
        WHERE name = $1`,
      [name]
    );

    delete user.password;
    res.json({ message: "Connexion réussie", user });
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
