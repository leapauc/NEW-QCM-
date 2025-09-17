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

// exports.createQCM = async (req, res) => {
//   const { name, firstname, society, password, email, admin } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO users (name, firstname, society, password, email, admin)
//        VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING *`,
//       [name, firstname, society, password, email, admin]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };

// exports.updateQCM = async (req, res) => {
//   const { id } = req.params;
//   const { name, firstname, society, password, email, admin } = req.body;
//   try {
//     const result = await pool.query(
//       `UPDATE users SET name=$1, firstname=$2, society=$3, password=crypt($4, gen_salt('bf')),
//        email=$5, admin=$6, updated_at=CURRENT_TIMESTAMP
//        WHERE id_user=$7 RETURNING *`,
//       [name, firstname, society, password, email, admin, id]
//     );
//     if (result.rows.length === 0)
//       return res.status(404).json({ error: "Utilisateur non trouvé" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };

exports.deleteQCM = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

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
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const result = await pool.query(
      `SELECT qq.*,STRING_AGG(rq.response::text,'|') as response,
                                    STRING_AGG(rq.is_correct::text,'|') as is_correct,
                                    STRING_AGG(rq.position::text,'|') as position FROM question_qcm qq 
                                    JOIN response_question rq ON rq.id_question=qq.id_question
                                    WHERE qq.id_qcm = $1 GROUP BY qq.id_question`,
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
  const id = parseInt(req.params.id, 10);
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
