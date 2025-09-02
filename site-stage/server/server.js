const express = require("express");
const mysql = require("mysql2/promise"); // <-- version promesse
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "appuser",
      password: "motdepasse",
      database: "userdata"
    });
    console.log("✅ Connecté à MySQL !");
  } catch (err) {
    console.error("Erreur MySQL:", err);
  }
})();

// Endpoint pour récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM logindata");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
);
