const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

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
      const { matricule, password, isAdmin } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      if (!matricule || !password) {
        return res.status(400).json({
          success: false,
          message: "Le matricule et le mot de passe sont requis."
        });
      }
    
      try {
        await db.beginTransaction();

        const [loginResult] = await db.query(
          "INSERT INTO logindata (matricule, password) VALUES (?, ?)",
          [matricule, hashedPassword],
        );
    
        const userId = loginResult.insertId;

        await db.query(
          "INSERT INTO agentdata (matricule, email, nom, prenom, user_id, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
          [matricule, matricule + "@example.com", matricule, "", userId, isAdmin ? 1 : 0]
        );

        await db.commit();

        res.status(201).json({
          success: true,
          message: "Compte créé avec succès.",
          userId: loginResult.insertId
        });
      } catch (err) {
        await db.rollback();
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

    // Login user
    app.post("/login", async (req, res) => {
      const { matricule, password } = req.body;

      try {
        const [results] = await db.query("SELECT * FROM logindata WHERE matricule = ?", [matricule]);
        if (results.length === 0) {
          return res.json({ success: false, message: "Utilisateur non trouvé" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          res.json({ success: true, message: "Connexion réussie" });
        } else {
          res.json({ success: false, message: "Mot de passe invalide" });
        }
      } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
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
