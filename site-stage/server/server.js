const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    // Connexion MySQL avec await (version promise)
    const db = await mysql.createConnection({
      host: "localhost",
      user: "appuser",
      password: "motdepasse",
      database: "userdata"
    });
    
    console.log("✅ Connecté à la base de données MySQL");
    
    // Endpoint pour récupérer tous les utilisateurs
    app.get("/users", async (req, res) => {
      try {
        const [rows] = await db.query("SELECT * FROM logindata");
        res.json(rows);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });
    
    // Endpoint pour créer un utilisateur
    app.post("/users/create", async (req, res) => {
      const { matricule, password } = req.body;
    
      if (!matricule || !password) {
        return res.status(400).json({
          success: false,
          message: "Le matricule et le mot de passe sont requis."
        });
      }
    
      try {
        const [result] = await db.query(
          "INSERT INTO logindata (matricule, password) VALUES (?, ?)",
          [matricule, password]
        );
    
        res.status(201).json({
          success: true,
          message: "Compte créé avec succès.",
          userId: result.insertId
        });
      } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({
            success: false,
            message: "Ce matricule existe déjà"
          });
        }
    
        res.status(500).json({
          success: false,
          message: "Erreur lors de la création de compte"
        });
      }
    });
    
    // Lancer le serveur
    const PORT = 5000;
    app.listen(PORT, () =>
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Erreur de connexion MySQL:", err);
  }
}

// Lancer le serveur
startServer();
