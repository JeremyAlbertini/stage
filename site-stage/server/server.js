const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const secretKey = "ifsuydgyufogifeglfueroiuhmugve";

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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      if (!matricule || !password) {
        return res.status(400).json({
          success: false,
          message: "Le matricule et le mot de passe sont requis."
        });
      }
    
      try {
        const [result] = await db.query(
          "INSERT INTO logindata (matricule, password) VALUES (?, ?)",
          [matricule, hashedPassword]
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

    app.post("/login", async (req, res) => {
      const { matricule, password } = req.body;

      try {
        const [results] = await db.query("SELECT * FROM logindata WHERE matricule = ?", [matricule]);
        if (results.length === 0) {
          return res.json({ success: false, message: "Utilisateur non trouvé" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.json({ success: false, message: "Mot de passe invalide" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, matricule: user.matricule }, secretKey, { expiresIn: "1h" });

        // Set HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production with HTTPS
          sameSite: "strict",
          maxAge: 60 * 60 * 1000
        });

        return res.json({ success: true, message: "Connexion réussie" });
      } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
      }
    });

    // Check current user
    app.get("/me", (req, res) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ loggedIn: false });

      try {
        const decoded = jwt.verify(token, secretKey);
        res.json({ loggedIn: true, user: decoded });
      } catch {
        res.status(401).json({ loggedIn: false });
      }
    });

    // Logout
    app.post("/logout", (req, res) => {
      res.clearCookie("token");
      res.json({ success: true, message: "Déconnecté" });
    });

    // Lancer le serveur
    app.listen(PORT, () =>
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Erreur de connexion MySQL:", err);
  }
}

// Lancer le serveur
startServer();
