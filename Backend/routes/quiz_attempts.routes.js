const express = require("express");
const {
  getAllAttempts,
  getAttemptsByUser,
  getAttemptDetailsById,
} = require("../controllers/quiz_attempts.controller");

const router = express.Router();

router.get("/", getAllAttempts);
router.get("/:id_user", getAttemptsByUser);
router.get("/attempt_details/:id_attempt", getAttemptDetailsById);

module.exports = router;
