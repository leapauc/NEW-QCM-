const express = require("express");
const {
  getAllQCM,
  // getQCMById,
  createQCM,
  updateQCM,
  deleteQCM,
  getQuestionResponseOfQCMById,
  getQuestionOfQCMById,
  getAllQuestion,
  createQuestionForAQCM,
  updateQuestionForAQCM,
  deleteQuestionForAQCM,
} = require("../controllers/qcm.controller");

const router = express.Router();

router.get("/", getAllQCM);
// router.get("/:id", getQCMById);
router.post("/", createQCM);
router.put("/:id", updateQCM);
router.delete("/:id", deleteQCM);
router.get("/QcmQuestionsResponses/:id_qcm", getQuestionResponseOfQCMById);
router.get("/QcmQuestions/:id_qcm", getQuestionOfQCMById);
router.get("/questions", getAllQuestion);
router.post("/questions/:id_qcm", createQuestionForAQCM);
router.put("/questions/:id_qcm/:id_question", updateQuestionForAQCM);
router.delete("/questions/:id_question", deleteQuestionForAQCM);

module.exports = router;
