const pool = require("../db");

exports.getAllAttempts = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM quiz_attempts`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getAttemptsByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM quiz_attempts where id_user=$1`,
      [id_user]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer une tentative et les réponses de l'utilisateur
exports.getAttemptDetailsById = async (req, res) => {
  const { id_attempt } = req.params;
  try {
    // Récupérer toutes les questions du QCM lié à cette tentative
    const questionsRes = await pool.query(
      `SELECT q.id_question, q.question, q.type
       FROM question_qcm q
       JOIN quiz_attempts qa ON qa.id_qcm = q.id_qcm
       WHERE qa.id_attempt = $1
       ORDER BY q.position`,
      [id_attempt]
    );

    // Pour chaque question, récupérer les réponses possibles
    const questions = await Promise.all(
      questionsRes.rows.map(async (q) => {
        const responsesRes = await pool.query(
          `SELECT r.id_response, r.response
           FROM response_question r
           WHERE r.id_question = $1
           ORDER BY r.position`,
          [q.id_question]
        );

        // Marquer les réponses sélectionnées par l'utilisateur
        const userResponsesRes = await pool.query(
          `SELECT id_response
           FROM user_answers
           WHERE id_attempt = $1 AND id_question = $2`,
          [id_attempt, q.id_question]
        );

        const selectedIds = userResponsesRes.rows.map((r) => r.id_response);

        const responses = responsesRes.rows.map((r) => ({
          ...r,
          selected: selectedIds.includes(r.id_response),
        }));

        return {
          ...q,
          responses,
        };
      })
    );

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
