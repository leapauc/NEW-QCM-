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
      where id_user=$1`,
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
exports.submitAttempt = async (req, res) => {
  const { id_user, id_qcm, answers } = req.body;
  // answers = [{ id_question, id_response }]

  if (!id_user || !id_qcm || !answers || !answers.length) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  try {
    // Créer la tentative
    const attemptResult = await pool.query(
      `INSERT INTO quiz_attempts (id_user, id_qcm, score, completed, started_at)
       VALUES ($1, $2, 0, 0, CURRENT_TIMESTAMP)
       RETURNING *`,
      [id_user, id_qcm]
    );

    const attempt = attemptResult.rows[0];

    // Récupérer les réponses correctes depuis la base
    const correctResps = await pool.query(
      `SELECT id_question, id_response
       FROM response_question
       WHERE is_correct = true AND id_question IN (${answers
         .map((a, i) => `$${i + 1}`)
         .join(",")})`,
      answers.map((a) => a.id_question)
    );

    // Calculer score
    let score = 0;
    answers.forEach((a) => {
      const correct = correctResps.rows.find(
        (r) =>
          r.id_question === a.id_question && r.id_response === a.id_response
      );
      if (correct) score++;
    });

    const completed = Math.round((score / answers.length) * 100);

    // Enregistrer les réponses utilisateur
    const insertPromises = answers.map((a) =>
      pool.query(
        `INSERT INTO user_answers (id_attempt, id_question, id_response, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [
          attempt.id_attempt,
          a.id_question,
          a.id_response,
          correctResps.rows.some(
            (r) =>
              r.id_question === a.id_question && r.id_response === a.id_response
          ),
        ]
      )
    );

    await Promise.all(insertPromises);

    // Mettre à jour le score et le taux de remplissage dans quiz_attempts
    await pool.query(
      `UPDATE quiz_attempts
       SET score = $1, completed = $2, ended_at = CURRENT_TIMESTAMP
       WHERE id_attempt = $3`,
      [score, completed, attempt.id_attempt]
    );

    res.status(201).json({ attemptId: attempt.id_attempt, score, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Ajouter une tentative d'un utilisateur en base de données
exports.saveAttempt = async (req, res) => {
  const { id_qcm, id_user, answers, started_at, ended_at } = req.body;

  try {
    const attemptRes = await pool.query(
      `INSERT INTO quiz_attempts (id_qcm, id_user, started_at,ended_at)
       VALUES ($1, $2, $3::timestamptz, $4::timestamptz)
       RETURNING id_attempt`,
      [id_qcm, id_user, started_at, ended_at]
    );
    const id_attempt = attemptRes.rows[0].id_attempt;

    for (const a of answers) {
      await pool.query(
        `INSERT INTO user_answers (id_attempt, id_question, id_response)
         VALUES ($1, $2, $3)`,
        [id_attempt, a.id_question, a.id_response]
      );
    }

    // 3. Calcul des stats
    const totalQ = await pool.query(
      `SELECT COUNT(*) FROM question_qcm WHERE id_qcm=$1`,
      [id_qcm]
    );
    const totalQuestions = parseInt(totalQ.rows[0].count, 10);

    const answeredQ = await pool.query(
      `SELECT COUNT(DISTINCT id_question) FROM user_answers WHERE id_attempt=$1`,
      [id_attempt]
    );
    const answeredCount = parseInt(answeredQ.rows[0].count, 10);

    const correctQ = await pool.query(
      `SELECT COUNT(*) AS correct_questions
       FROM question_qcm q
       WHERE q.id_qcm = $1
       AND NOT EXISTS (
         SELECT 1 FROM response_question r
         LEFT JOIN user_answers ua 
           ON ua.id_question = q.id_question 
          AND ua.id_response = r.id_response
         WHERE r.id_question = q.id_question
         AND (
           (r.is_correct = TRUE AND ua.id_response IS NULL)
           OR (r.is_correct = FALSE AND ua.id_response IS NOT NULL)
         )
       )`,
      [id_qcm]
    );
    const correctCount = parseInt(correctQ.rows[0].correct_questions, 10);

    const completed = (answeredCount / totalQuestions) * 100;
    const score = (correctCount / totalQuestions) * 100;

    // 4. Mettre à jour la tentative
    await pool.query(
      `UPDATE quiz_attempts
       SET completed=$1, score=$2
       WHERE id_attempt=$3`,
      [completed, score, id_attempt]
    );

    res.json({ id_attempt, completed, score });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement de la tentative" });
  }
};
