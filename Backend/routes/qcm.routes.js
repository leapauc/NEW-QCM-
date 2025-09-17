const express = require("express");
const {
  getAllQCM,
  getQCMById,
  // postQCM,
  // putQCM,
  deleteQCM,
} = require("../controllers/qcm.controller");

const router = express.Router();

router.get("/", getAllQCM);
router.get("/:id", getQCMById);
// router.post("/", postQCM);
// router.put("/:id", putQCM);
router.delete("/:id", deleteQCM);
router.get("/question/:id", getQuestionOfQCMById);

module.exports = router;
