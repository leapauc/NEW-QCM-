const express = require("express");
const {
  getAllQCM,
  // getQCMById,
  // postQCM,
  // putQCM,
  deleteQCM,
  getQuestionResponseOfQCMById,
  getQuestionOfQCMById,
  getAllQuestion,
} = require("../controllers/qcm.controller");

const router = express.Router();

router.get("/", getAllQCM);
// router.get("/:id", getQCMById);
// router.post("/", postQCM);
// router.put("/:id", putQCM);
router.delete("/:id", deleteQCM);
router.get("/questions_responses/:id", getQuestionResponseOfQCMById);
router.get("/questions/:id", getQuestionOfQCMById);
router.get("/questions", getAllQuestion);

module.exports = router;
