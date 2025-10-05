const pool = require("../db");

// Récupérer tous les QCM
exports.getAllQCM = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT qcm.*,users.name as user FROM qcm JOIN users ON users.id_user=qcm.created_by ORDER BY id_qcm`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un QCM par son ids
exports.getQCMById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM qcm WHERE id_qcm = $1", [
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

// Créer un QCM - titre et description
exports.createQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, description, created_by } = req.body;

    // Vérification des champs obligatoires
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Titre et Description sont obligatoires" });
    }

    await client.query("BEGIN");

    // Vérifier si le titre existe déjà
    const checkTitle = await client.query(
      `SELECT id_qcm FROM qcm WHERE LOWER(title) = LOWER($1)`,
      [title]
    );

    if (checkTitle.rows.length > 0) {
      await client.query("ROLLBACK");
      return res
        .status(409) // 409 = Conflict
        .json({ error: "Un QCM avec ce titre existe déjà." });
    }

    // Insérer le nouveau QCM
    const qcmResult = await client.query(
      `INSERT INTO qcm (title, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id_qcm`,
      [title, description, created_by]
    );

    const qcmId = qcmResult.rows[0].id_qcm;

    await client.query("COMMIT");
    res.status(201).json({ message: "QCM créé avec succès", qcmId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  } finally {
    client.release();
  }
};

// Créer un QCM et ces questions/réponses
exports.createQCMWithQuestion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, description, created_by, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "Titre et questions sont obligatoires" });
    }

    await client.query("BEGIN");

    // Insérer le QCM
    const qcmResult = await client.query(
      `INSERT INTO qcm (title, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id_qcm`,
      [title, description, created_by]
    );
    const qcmId = qcmResult.rows[0].id_qcm;

    // Insérer les questions + réponses
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionResult = await client.query(
        `INSERT INTO question_qcm (id_qcm, question, type, position)
         VALUES ($1, $2, $3, $4)
         RETURNING id_question`,
        [qcmId, q.question, q.type || "single", i + 1]
      );
      const questionId = questionResult.rows[0].id_question;

      // Insérer les réponses
      for (let j = 0; j < q.responses.length; j++) {
        const r = q.responses[j];
        await client.query(
          `INSERT INTO response_question (id_question, response, is_correct, position)
           VALUES ($1, $2, $3, $4)`,
          [questionId, r.response, r.is_correct, j + 1]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "QCM créé avec succès", qcmId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  } finally {
    client.release();
  }
};

// Mettre à jour un QCM - titre et description
exports.updateQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const qcmId = req.params.id;
    const { title, description, questions } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Titre et Description sont obligatoires" });
    }

    await client.query("BEGIN");

    // Vérifier si un autre QCM a déjà ce titre
    const checkTitle = await client.query(
      `SELECT id_qcm 
       FROM qcm 
       WHERE LOWER(title) = LOWER($1) AND id_qcm <> $2`,
      [title, qcmId]
    );

    if (checkTitle.rows.length > 0) {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ error: "Un autre QCM avec ce titre existe déjà." });
    }

    // Mise à jour du QCM
    await client.query(
      `UPDATE qcm 
       SET title=$1, description=$2, updated_at=CURRENT_TIMESTAMP 
       WHERE id_qcm=$3`,
      [title, description, qcmId]
    );

    await client.query("COMMIT");
    res.json({ message: "QCM mis à jour avec succès" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  } finally {
    client.release();
  }
};

// Mettre à jour un QCM et ces questions/réponses
exports.updateQCMWithQuestions = async (req, res) => {
  const client = await pool.connect();
  try {
    const qcmId = parseInt(req.params.id, 10);
    const { title, description, questions } = req.body;

    if (isNaN(qcmId)) {
      return res.status(400).json({ error: "ID QCM invalide" });
    }

    await client.query("BEGIN");

    // Mettre à jour le QCM
    await client.query(
      `UPDATE qcm 
       SET title=$1, description=$2, updated_at=CURRENT_TIMESTAMP
       WHERE id_qcm=$3`,
      [title, description, qcmId]
    );

    // Parcourir les questions
    for (const q of questions) {
      // Mettre à jour la question
      await client.query(
        `UPDATE question_qcm
         SET question=$1, type=$2, updated_at=CURRENT_TIMESTAMP
         WHERE id_question=$3 AND id_qcm=$4`,
        [q.question, q.type || "single", q.id_question, qcmId]
      );

      // Supprimer toutes les réponses existantes pour cette question
      await client.query(`DELETE FROM response_question WHERE id_question=$1`, [
        q.id_question,
      ]);

      // Réinsérer toutes les réponses envoyées
      for (const r of q.responses) {
        await client.query(
          `INSERT INTO response_question (id_question, response, is_correct, position)
           VALUES ($1, $2, $3, $4)`,
          [q.id_question, r.response, r.is_correct, r.position]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "QCM, questions et réponses mis à jour avec succès" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  } finally {
    client.release();
  }
};

// Supprimer un QCM par son id
exports.deleteQCM = async (req, res) => {
  const id = req.params.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Supprimer les réponses associées
    await client.query(
      `DELETE FROM response_question 
       WHERE id_question in 
       (SELECT id_question FROM question_qcm WHERE id_qcm = $1)`,
      [id]
    );
    await client.query("DELETE FROM question_qcm WHERE id_qcm = $1", [id]);

    // Supprimer le QCM
    const result = await client.query(
      "DELETE FROM qcm WHERE id_qcm = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "QCM non trouvé" });
    }

    await client.query("COMMIT");
    res.json({ message: "QCM supprimé avec succès", qcm: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
};

// Récupérer un QCM avec ces questions/réponses
exports.getQuestionResponseOfQCMById = async (req, res) => {
  const id = parseInt(req.params.id_qcm, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const resultQuestions = await pool.query(
      `SELECT * FROM question_qcm WHERE id_qcm=$1 ORDER BY position`,
      [id]
    );

    const questions = [];
    for (const q of resultQuestions.rows) {
      const resps = await pool.query(
        `SELECT id_response, response, is_correct, position
         FROM response_question
         WHERE id_question=$1 ORDER BY position`,
        [q.id_question]
      );

      questions.push({
        ...q,
        responses: resps.rows, // Tableau d'objets complet
      });
    }

    res.json(questions); // renvoie [] si pas de question
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer une question avec ces réponses
exports.getQuestionResponseByQuestionId = async (req, res) => {
  const id = parseInt(req.params.id_question, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const result = await pool.query(
      `SELECT qq.id_question,qq.id_qcm,qq.question,qq.type,
       rq.response,rq.is_correct,rq.position
       FROM question_qcm qq 
       JOIN response_question rq ON rq.id_question=qq.id_question
       WHERE qq.id_question = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ error: "Le QCM comporte aucune question." });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer la liste des questions d'un QCM
exports.getQuestionOfQCMById = async (req, res) => {
  const id = parseInt(req.params.id_qcm, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const result = await pool.query(
      `SELECT qq.*,qcm.title FROM question_qcm qq 
      JOIN qcm ON qcm.id_qcm=qq.id_qcm 
      WHERE qq.id_qcm = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ error: "Le QCM comporte aucune question." });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
