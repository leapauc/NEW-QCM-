const pool = require("../db");

exports.getNbStagiaire = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT count(*) FROM users where admin=false"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getNbQuestionnaire = async (req, res) => {
  try {
    const result = await pool.query("SELECT count(*) FROM qcm");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getNbCompletQuestionnaire = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT count(*) FROM quiz_attempts where completed=true"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getNbQuestionRealise = async (req, res) => {
  try {
    const result = await pool.query("SELECT count(*) FROM quiz_attempts");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getQuestionnairePopulaire = async (req, res) => {
  try {
    const result = await pool.query(`WITH counter AS (
                                    SELECT id_qcm, COUNT(*) AS nb
                                    FROM quiz_attempts
                                    GROUP BY id_qcm
                                    ORDER BY nb DESC
                                    LIMIT 1
                                    )
                                    SELECT q.title
                                    FROM qcm q
                                    JOIN counter c ON c.id_qcm = q.id_qcm`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getFirstStagiaireActif = async (req, res) => {
  try {
    const result = await pool.query(`WITH counter AS (
                                    SELECT id_user, COUNT(*) AS nb
                                    FROM quiz_attempts
                                    GROUP BY id_user
                                    ORDER BY nb DESC
                                    LIMIT 1
                                    )
                                    SELECT u.name,u.firstname
                                    FROM users u
                                    JOIN counter c ON c.id_user = u.id_user`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
