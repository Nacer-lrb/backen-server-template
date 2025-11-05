const express = require("express");
require("dotenv").config();
const connectToMongoDB = require("./utils/db");
const swaggerUi = require("swagger-ui-express");
const loadDocs = require("./utils/loadDocs");

// Créer l’app Express
const app = express();

// Middleware JSON
app.use(express.json());

// Connexion à MongoDB
connectToMongoDB(process.env.DB_URL);

// Charger les routes
require("./utils/routes")(app);

// Charger la documentation Swagger (fusionnée)
const swaggerSpec = loadDocs();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Port (variable d’environnement ou 5000 par défaut)
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(` Backend server is running on port ::${PORT} ...`);
});
