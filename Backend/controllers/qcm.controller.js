const pool = require("../db");

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
