const pool = require("../db");

// Récupérer toutes les tentatives
exports.getAllAttempts = async (req, res) => {
  try {
    const result =
      await pool.query(`SELECT *,users.name,qcm.title,ended_at - started_at as duration FROM quiz_attempts qa
      JOIN users ON users.id_user = qa.id_user
      JOIN qcm ON qcm.id_qcm = qa.id_qcm`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer les tentatives d'un l'utilisateur
exports.getAttemptsByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await pool.query(
      `SELECT *,qcm.title,ended_at - started_at as duration 
      FROM quiz_attempts qa
      JOIN qcm ON qcm.id_qcm = qa.id_qcm 
      where id_user=$1
      ORDER BY ended_at DESC`,
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

// Ajouter une tentative d'un utilisateur en base de données
exports.saveAttempt = async (req, res) => {
  const { id_qcm, id_user, answers, started_at, ended_at } = req.body;

  try {
    // Insérer la tentative
    const attemptRes = await pool.query(
      `INSERT INTO quiz_attempts (id_qcm, id_user, started_at, ended_at)
       VALUES ($1, $2, $3::timestamptz, $4::timestamptz)
       RETURNING id_attempt`,
      [id_qcm, id_user, started_at, ended_at]
    );
    const id_attempt = attemptRes.rows[0].id_attempt;

    // Insérer les réponses de l'utilisateur
    for (const a of answers) {
      await pool.query(
        `INSERT INTO user_answers (id_attempt, id_question, id_response)
         VALUES ($1, $2, $3)`,
        [id_attempt, a.id_question, a.id_response]
      );
    }

    // Calcul du total de questions pour ce QCM
    const totalQRes = await pool.query(
      `SELECT COUNT(*) AS total FROM question_qcm WHERE id_qcm=$1`,
      [id_qcm]
    );
    const totalQuestions = parseInt(totalQRes.rows[0].total, 10);

    // Calcul des questions répondues (au moins une réponse)
    const answeredRes = await pool.query(
      `SELECT COUNT(DISTINCT id_question) AS answered
       FROM user_answers
       WHERE id_attempt=$1`,
      [id_attempt]
    );
    const answeredCount = parseInt(answeredRes.rows[0].answered, 10);

    // Calcul des questions correctes
    // Une question est correcte si toutes les bonnes réponses sont sélectionnées et aucune mauvaise n'est sélectionnée
    const correctRes = await pool.query(
      `SELECT COUNT(DISTINCT q.id_question) AS correct_count
       FROM question_qcm q
       LEFT JOIN response_question r ON r.id_question = q.id_question
       LEFT JOIN user_answers ua 
         ON ua.id_question = q.id_question AND ua.id_response = r.id_response AND ua.id_attempt = $1
       WHERE q.id_qcm = $2
       GROUP BY q.id_question
       HAVING bool_and(
         (r.is_correct = TRUE AND ua.id_response IS NOT NULL)
         OR
         (r.is_correct = FALSE AND ua.id_response IS NULL)
       )`,
      [id_attempt, id_qcm]
    );

    const correctCount = correctRes.rows.length; // Nombre de questions entièrement correctes

    // Calcul des pourcentages
    const completed = Math.min(100, (answeredCount / totalQuestions) * 100);
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Mise à jour de la tentative avec les valeurs finales
    await pool.query(
      `UPDATE quiz_attempts
       SET completed=$1, score=$2
       WHERE id_attempt=$3`,
      [completed, score, id_attempt]
    );

    // Retourner les résultats
    res.json({ id_attempt, completed, score });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement de la tentative" });
  }
};
