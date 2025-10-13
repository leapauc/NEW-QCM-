const pool = require("../db");

// Récupérer les informations de tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id_user");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer les informations d'un utilisateur
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
  const { name, firstname, society, password, email, admin } = req.body;

  try {
    const finalSociety = admin === true ? "LECLIENT" : society;

    // Vérifier si le couple name/password existe déjà
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE name = $1 AND password = crypt($2, password)`,
      [name, password]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Un utilisateur avec le même nom et mot de passe existe déjà.",
      });
    }

    // Si pas de conflit, insérer
    const result = await pool.query(
      `INSERT INTO users (name, firstname, society, password, email, admin)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6)
       RETURNING *`,
      [name, firstname, finalSociety, password, email, admin]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, firstname, society, password, email, admin } = req.body;

  if (!password || password.trim() === "") {
    return res.status(400).json({ error: "Le mot de passe est obligatoire." });
  }

  try {
    // Vérifier que l'utilisateur existe
    const { rows: currentUserRows } = await pool.query(
      `SELECT * FROM users WHERE id_user = $1`,
      [id]
    );
    if (currentUserRows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé." });

    // Vérifier le conflit sur name + password
    const { rows: conflictUsers } = await pool.query(
      `SELECT id_user FROM users
       WHERE name = $1
         AND password = crypt($2, password)
         AND id_user <> $3`,
      [name, password, id]
    );

    if (conflictUsers.length > 0) {
      return res.status(409).json({
        error:
          "Conflit : un utilisateur avec ce nom et ce mot de passe existe déjà.",
      });
    }

    // Mise à jour avec hash du nouveau mot de passe
    const result = await pool.query(
      `UPDATE users
       SET name=$1, firstname=$2, society=$3, password=crypt($4, gen_salt('bf')),
           email=$5, admin=$6, updated_at=CURRENT_TIMESTAMP
       WHERE id_user=$7
       RETURNING id_user, name, firstname, society, email, admin, updated_at`,
      [name, firstname, society, password, email, admin, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id_user=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
