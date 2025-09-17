const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const userStats = require("./routes/stats.routes");
const userQCM = require("./routes/qcm.routes");

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

// Utilisation des routes
app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/stats", userStats);
app.use("/qcm", userQCM);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
