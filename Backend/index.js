const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// --- GET all users ---
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id_user");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- GET user by ID ---
app.get("/users/:id", async (req, res) => {
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
});

// --- CREATE user ---
app.post("/users", async (req, res) => {
  const { name, firstname, society, password, email, admin } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, firstname, society, password, email, admin) 
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING *`,
      [name, firstname, society, password, email, admin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- UPDATE user ---
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, firstname, society, password, email, admin } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, firstname=$2, society=$3, password=crypt($4, gen_salt('bf')), 
       email=$5, admin=$6, updated_at=CURRENT_TIMESTAMP 
       WHERE id_user=$7 RETURNING *`,
      [name, firstname, society, password, email, admin, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- DELETE user ---
app.delete("/users/:id", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
