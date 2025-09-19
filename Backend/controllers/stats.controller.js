const pool = require("../db");
// ----------- Stats Users -----------

// Nombre de stagiaire
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

// ----------- Stats QCM -----------

// Nombre de questionnaire
exports.getNbQuestionnaire = async (req, res) => {
  try {
    const result = await pool.query("SELECT count(*) FROM qcm");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Nombre de questionnaire complété entièrement
exports.getNbCompletQuestionnaire = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT count(*) FROM quiz_attempts where completed=100"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Nombre de questionnaire réalisé
exports.getNbQuestionRealise = async (req, res) => {
  try {
    const result = await pool.query("SELECT count(*) FROM quiz_attempts");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Nombre de questionnaire populaire
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
// Nom du membre le plus actif
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

// ----------- Stats Quiz Attempt -----------

// Compter le nombre de QCMs faits par tous les utilisateurs (y compris 0)
exports.getNbQuestionnaireList = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id_user,
              u.name,
              COALESCE(COUNT(qa.id_attempt), 0) AS nb_questionnaires
       FROM users u
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
       WHERE u.admin = false
       GROUP BY u.id_user, u.name
       ORDER BY u.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Scores max/min/moyenne même pour utilisateurs sans tentative
exports.getMaxMinAvgScoreList = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id_user,
              u.name,
              COALESCE(MAX(qa.score), 0) AS max_score,
              COALESCE(MIN(qa.score), 0) AS min_score,
              COALESCE(AVG(qa.score), 0) AS avg_score
       FROM users u
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
       WHERE u.admin = false
       GROUP BY u.id_user, u.name
       ORDER BY u.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Rang basé sur la moyenne (dernier si aucune tentative)
exports.getRangeList = async (req, res) => {
  try {
    const result = await pool.query(
      `WITH user_scores AS (
         SELECT u.id_user,
                u.name,
                COALESCE(AVG(qa.score), 0) AS avg_score
         FROM users u
         LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
         WHERE u.admin = false
         GROUP BY u.id_user, u.name
       )
       SELECT id_user,
              name,
              avg_score,
              RANK() OVER (ORDER BY avg_score DESC) AS rank
       FROM user_scores
       ORDER BY rank`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Temps moyen passé (affiche '-' si aucune tentative)
exports.getMoyenneTimeList = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id_user,
              u.name,
              CASE 
                WHEN COUNT(qa.id_attempt) = 0 THEN '-' 
                ELSE ROUND(AVG(EXTRACT(EPOCH FROM (qa.ended_at - qa.started_at))) / 60, 2)::TEXT
              END AS avg_time_minutes
       FROM users u
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
       WHERE u.admin = false
       GROUP BY u.id_user, u.name
       ORDER BY u.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Nombre de questionnaires faits par un utilisateur
exports.getNbQuestionnaireByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await pool.query(
      `SELECT COALESCE(COUNT(qa.id_attempt), 0) AS nb_questionnaires
       FROM users u
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
       WHERE u.id_user = $1 AND u.admin = false
       GROUP BY u.id_user, u.name`,
      [id_user]
    );
    res.json(result.rows[0] || { nb_questionnaires: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Min / Max / Moyenne du score d'un utilisateur
exports.getMaxMinAvgScoreByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await pool.query(
      `SELECT COALESCE(MAX(qa.score), 0) AS max_score,
              COALESCE(MIN(qa.score), 0) AS min_score,
              COALESCE(AVG(qa.score), 0) AS avg_score
       FROM users u
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
       WHERE u.id_user = $1 AND u.admin = false
       GROUP BY u.id_user, u.name`,
      [id_user]
    );
    res.json(
      result.rows[0] || {
        max_score: "-",
        min_score: "-",
        avg_score: "-",
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Rang de l'utilisateur (dernier si aucun score)
exports.getRangeByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await pool.query(
      `WITH user_scores AS (
         SELECT u.id_user,
                COALESCE(AVG(qa.score), 0) AS avg_score
         FROM users u
         LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user
         WHERE u.admin = false
         GROUP BY u.id_user
       )
       SELECT avg_score,
              RANK() OVER (ORDER BY avg_score DESC) AS rank
       FROM user_scores
       WHERE id_user = $1`,
      [id_user]
    );

    // Si aucun résultat trouvé (user inexistant ou admin)
    if (result.rows.length === 0) {
      return res.json({ avg_score: 0, rank: "dernier" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Temps moyen passé par l'utilisateur sur les QCM
exports.getMoyenneTimeByUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await pool.query(
      `SELECT CASE
                WHEN COUNT(qa.id_attempt) = 0 THEN '-'
                ELSE ROUND(AVG(EXTRACT(EPOCH FROM (qa.ended_at - qa.started_at))) / 60, 2)::TEXT
              END AS avg_time_minutes
       FROM users u
       LEFT JOIN quiz_attempts qa 
         ON u.id_user = qa.id_user 
        AND qa.started_at IS NOT NULL 
        AND qa.ended_at IS NOT NULL
       WHERE u.id_user = $1 AND u.admin = false
       GROUP BY u.id_user`,
      [id_user]
    );
    res.json(result.rows[0] || { avg_time_minutes: "-" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
