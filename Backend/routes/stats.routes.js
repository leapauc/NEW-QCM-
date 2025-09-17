const express = require("express");
const {
  getNbStagiaire,
  getNbQuestionnaire,
  getNbCompletQuestionnaire,
  getNbQuestionRealise,
  getQuestionnairePopulaire,
  getFirstStagiaireActif,
} = require("../controllers/stats.controller");

const router = express.Router();

router.get("/nbStagiaire", getNbStagiaire);
router.get("/nbQuestionnaire", getNbQuestionnaire);
router.get("/nbCompletQuestionnaire", getNbCompletQuestionnaire);
router.get("/nbRealisedQuestionnaire", getNbQuestionRealise);
router.get("/questionnairePopulaire", getQuestionnairePopulaire);
router.get("/firstActivStagiaire", getFirstStagiaireActif);

module.exports = router;
