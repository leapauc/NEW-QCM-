const express = require("express");
const {
  getAllQCM,
  // getQCMById,
  createQCM,
  updateQCM,
  deleteQCM,
  getQuestionResponseOfQCMById,
  getQuestionResponseByQuestionId,
  getQuestionOfQCMById,
} = require("../controllers/qcm.controller");

const router = express.Router();

router.get("/", getAllQCM);
// router.get("/:id", getQCMById);
router.post("/", createQCM);
router.put("/:id", updateQCM);
router.delete("/:id", deleteQCM);
router.get("/QcmQuestionsResponses/:id_qcm", getQuestionResponseOfQCMById);
router.get("/QuestionsResponses/:id_question", getQuestionResponseByQuestionId);
router.get("/QcmQuestions/:id_qcm", getQuestionOfQCMById);

module.exports = router;
