const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "appuser",       // change si nécessaire
  password: "monpassword", // change si nécessaire
  database: "mon_projet"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL:", err);
    return;
  }
  console.log("✅ Connecté à MySQL !");
});

// Route pour récupérer tous les utilisateurs
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
