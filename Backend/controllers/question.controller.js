const pool = require("../db");

// Accéder à la liste de toutes les questions avec leur qcm affilié
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

// Ajouter une question
exports.createQuestionForAQCM = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_qcm, question, position, responses } = req.body;

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

    // Déterminer le type automatiquement selon le nombre de réponses correctes
    const correctCount = responses.filter((r) => r.is_correct).length;
    const questionType = correctCount > 1 ? "multiple" : "single";

    await client.query("BEGIN");

    // Insérer la question
    const questionResult = await client.query(
      `INSERT INTO question_qcm (id_qcm, question, type, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_qcm, question, questionType, position || null]
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

// Accéder à une question
exports.getQuestionResponseById = async (req, res) => {
  const id = parseInt(req.params.id_question, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const result = await pool.query(
      `SELECT rq.*,qq.question FROM response_question rq
      JOIN question_qcm qq ON rq.id_question=qq.id_question
      WHERE rq.id_question = $1`,
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
