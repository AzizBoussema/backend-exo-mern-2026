const express = require("express");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const cors = require("cors");

// ---------VÉRIFICATION DES VARIABLES D'ENVIRONNEMENT--------
const REQUIRED_ENV = ["MONGODB_URI", "SECRET_KEY"];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[ERREUR DÉMARRAGE] Variable d'environnement manquante : ${key}`);
    process.exit(1);
  }
});
if (process.env.SECRET_KEY === "your-secret-key-here-change-in-production") {
  console.warn("[AVERTISSEMENT] SECRET_KEY utilise la valeur par défaut. Changez-la en production !");
}

// ---------APP SETUP--------
const app = express();

// Options CORS explicites (autorise frontend local et variable CLIENT_URL en production)
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// ---------DATABASE--------
connectDB();

// ---------ROUTES--------
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth",        require("./routes/auth.route"));
app.use("/api/users",       require("./routes/user.route"));
app.use("/api/restaurants", require("./routes/restaurant.route"));
app.use("/api/products",    require("./routes/product.route"));
app.use("/api/orders",      require("./routes/order.route"));
app.use((req, res) => res.send("API IS RUNNING"));

// ---------SERVER--------
const PORT = process.env.PORT || 7500;
app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("[ERREUR SERVEUR]", err);
    process.exit(1);
  }
  console.log(`[SERVEUR] Démarré sur le port ${PORT}`);
  console.log(`[SERVEUR] Environnement : ${process.env.NODE_ENV || "development"}`);
});
