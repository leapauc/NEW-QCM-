const pool = require("../db");

exports.getAllQCM = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM qcm ORDER BY id_qcm");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// exports.getQCMById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("SELECT * FROM qcm WHERE id_qcm = $1", [
//       id,
//     ]);
//     if (result.rows.length === 0)
//       return res.status(404).json({ error: "Utilisateur non trouvé" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };

exports.createQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, description, created_by, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "Titre et questions sont obligatoires" });
    }

    await client.query("BEGIN");

    // 1️⃣ Insérer le QCM
    const qcmResult = await client.query(
      `INSERT INTO qcm (title, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id_qcm`,
      [title, description, created_by]
    );
    const qcmId = qcmResult.rows[0].id_qcm;

    // 2️⃣ Insérer les questions + réponses
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionResult = await client.query(
        `INSERT INTO question_qcm (id_qcm, question, type, position)
         VALUES ($1, $2, $3, $4)
         RETURNING id_question`,
        [qcmId, q.question, q.type || "single", i + 1]
      );
      const questionId = questionResult.rows[0].id_question;

      // 3️⃣ Insérer les réponses
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

exports.updateQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const qcmId = req.params.id;
    const { title, description, questions } = req.body;

    await client.query("BEGIN");

    // 1️⃣ Update du QCM
    await client.query(
      `UPDATE qcm 
       SET title=$1, description=$2, updated_at=NOW() 
       WHERE id_qcm=$3`,
      [title, description, qcmId]
    );

    // 2️⃣ Update des questions existantes
    for (const q of questions) {
      await client.query(
        `UPDATE question_qcm
         SET question=$1, type=$2
         WHERE id_question=$3 AND id_qcm=$4`,
        [q.question, q.type, q.id_question, qcmId]
      );

      // 3️⃣ Update des réponses existantes
      for (const r of q.responses) {
        await client.query(
          `UPDATE response_question
           SET response=$1, is_correct=$2, position=$3
           WHERE id_response=$4 AND id_question=$5`,
          [r.response, r.is_correct, r.position, r.id_response, q.id_question]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "QCM et questions/réponses mis à jour avec succès" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  } finally {
    client.release();
  }
};

exports.deleteQCM = async (req, res) => {
  const id = req.params.id;

  const client = await pool.connect();
  console.log("test1");
  try {
    await client.query("BEGIN");
    console.log("test2");
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

exports.getQuestionResponseOfQCMById = async (req, res) => {
  const id = parseInt(req.params.id_qcm, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const result = await pool.query(
      `SELECT qq.*,STRING_AGG(rq.response::text,'|') as response,
       STRING_AGG(rq.is_correct::text,'|') as is_correct,
       STRING_AGG(rq.position::text,'|') as position FROM question_qcm qq 
       JOIN response_question rq ON rq.id_question=qq.id_question
       WHERE qq.id_qcm = $1 
       GROUP BY qq.id_question`,
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

exports.getAllQuestion = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT qq.*,qcm.title FROM question_qcm qq 
      JOIN qcm ON qcm.id_qcm=qq.id_qcm`
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Accéder à une question
exports.getQuestionById = async (req, res) => {
  const id = parseInt(req.params.id_question, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const result = await pool.query(
      `SELECT qq.*,qcm.title FROM question_qcm qq 
      JOIN qcm ON qcm.id_qcm=qq.id_qcm
      WHERE id_question = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Question non trouvé" });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// Ajouter une question
exports.createQuestionForAQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_qcm, question, type, position, responses } = req.body;

    if (!id_qcm || !question) {
      return res.status(400).json({ error: "id_qcm et question sont requis" });
    }

    // Vérifier qu'il y a au moins 2 réponses valides
    if (!Array.isArray(responses) || responses.length < 2) {
      return res.status(400).json({
        error: "Une question doit avoir au moins deux réponses",
      });
    }

    // Vérifier que chaque réponse contient un texte
    const incomplete = responses.some(
      (r) => !r.response || r.response.trim() === ""
    );
    if (incomplete) {
      return res.status(400).json({
        error: "Toutes les réponses doivent avoir un texte",
      });
    }

    await client.query("BEGIN");

    // Insérer la question
    const questionResult = await client.query(
      `INSERT INTO question_qcm (id_qcm, question, type, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_qcm, question, type || "single", position || null]
    );

    const newQuestion = questionResult.rows[0];

    // Insérer les réponses
    const insertResponseQuery = `
      INSERT INTO response_question (id_question, response, is_correct, position)
      VALUES ($1, $2, $3, $4)
    `;
    for (const r of responses) {
      await client.query(insertResponseQuery, [
        newQuestion.id_question,
        r.response,
        r.is_correct,
        r.position || null,
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Question et réponses créées avec succès",
      question: newQuestion,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la question" });
  } finally {
    client.release();
  }
};

// Modifier une question
exports.updateQuestionForAQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_question } = req.params;
    const { question, type, position, responses } = req.body;

    // Vérifier qu'il y a au moins 2 réponses si responses est présent
    if (Array.isArray(responses)) {
      if (responses.length < 2) {
        return res.status(400).json({
          error: "Une question doit avoir au moins deux réponses",
        });
      }

      const incomplete = responses.some(
        (r) => !r.response || r.response.trim() === ""
      );
      if (incomplete) {
        return res.status(400).json({
          error: "Toutes les réponses doivent avoir un texte",
        });
      }
    }

    await client.query("BEGIN");

    // 1. Modifier la question
    const questionResult = await client.query(
      `UPDATE question_qcm
      SET question = COALESCE($1, question),
          type = COALESCE($2, type),
          position = COALESCE($3, position)
      WHERE id_question = $4
      RETURNING *`,
      [question, type, position, id_question]
    );

    if (questionResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Question non trouvée" });
    }

    // 2. Supprimer et réinsérer les réponses si fournies
    if (Array.isArray(responses)) {
      await client.query(
        "DELETE FROM response_question WHERE id_question = $1",
        [id_question]
      );

      const insertResponseQuery = `
        INSERT INTO response_question (id_question, response, is_correct, position)
        VALUES ($1, $2, $3, $4)
      `;
      for (const r of responses) {
        await client.query(insertResponseQuery, [
          id_question,
          r.response,
          r.is_correct,
          r.position || null,
        ]);
      }
    }

    await client.query("COMMIT");

    res.json({
      message: "Question et réponses mises à jour avec succès",
      question: questionResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification de la question" });
  } finally {
    client.release();
  }
};

// Supprimer une question
exports.deleteQuestionForAQCM = async (req, res) => {
  try {
    const { id_question } = req.params;

    // Supprimer les réponses liées avant de supprimer la question
    await pool.query("DELETE FROM response_question WHERE id_question = $1", [
      id_question,
    ]);

    const result = await pool.query(
      "DELETE FROM question_qcm WHERE id_question = $1 RETURNING *",
      [id_question]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question non trouvée" });
    }

    res.json({ message: "Question supprimée avec succès" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la question" });
  }
};
