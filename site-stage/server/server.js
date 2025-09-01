const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MySQL - utilisez votre utilisateur MySQL réel
const db = mysql.createConnection({
  host: "localhost",
  user: "appuser",        // remplacez par votre utilisateur MySQL
  password: "monpassword",        // remplacez par votre mot de passe
  database: "epytodo"
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
  db.query("SELECT * FROM user", (err, results) => { // Correction: utilisez "user" et non "users"
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Route pour ajouter un utilisateur
app.post("/users", (req, res) => {
  const { email, password, name, firstname } = req.body;
  
  const query = "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)";
  db.query(query, [email, password, name, firstname], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json({ id: result.insertId, message: "Utilisateur créé avec succès" });
  });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});