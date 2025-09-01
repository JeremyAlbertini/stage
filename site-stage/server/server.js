const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MySQL - utilisez votre utilisateur MySQL réel
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change si nécessaire
  password: "root", // change si nécessaire
  database: "base"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL:", err);
    return;
  }
  console.log("✅ Connecté à MySQL !");
});

// Register user
app.post("/users", async (req, res) => {
  const { matricule, password, name, firstname } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO user (matricule, password, name, firstname) VALUES (?, ?, ?, ?)";
  db.query(sql, [matricule, hashedPassword, name, firstname], (err, result) => {
    if (err) return res.status(400).json({ message: "Error: " + err.message });
    res.json({ id: result.insertId });
  });
});

// Login user
app.post("/login", (req, res) => {
  const { matricule, password } = req.body;

  const sql = "SELECT * FROM user WHERE matricule = ?";
  db.query(sql, [matricule], async (err, results) => {
    if (err) return res.status(400).json({ message: "Error: " + err.message });
    if (results.length === 0) return res.json({ success: false, message: "Utilisateur non trouvé" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ success: true, message: "Connexion réussie" });
    } else {
      res.json({ success: false, message: "Mot de passe invalide" });
    }
  });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});