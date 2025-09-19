const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerOptions");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const userStats = require("./routes/stats.routes");
const userQCM = require("./routes/qcm.routes");
const questionQCM = require("./routes/question.routes");
const quizAttempts = require("./routes/quiz_attempts.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Utilisation des routes
app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/stats", userStats);
app.use("/qcm", userQCM);
app.use("/questions", questionQCM);
app.use("/quizAttempts", quizAttempts);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
