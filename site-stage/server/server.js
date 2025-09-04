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
          `INSERT INTO agentdata (
            matricule, nom, prenom, civilite, date_naiss, lieu_naiss, 
            dpt_naiss, pays_naiss, photo, adresse, adresse_code, adresse_ville, 
            tel_perso, mail_perso, statut, grade, poste, tel_fixe, tel_pro, 
            mail_pro, user_id, is_admin
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )`,
          [
            matricule,                          // matricule
            matricule,                          // nom
            "",                                 // prenom
            "Monsieur",                         // civilite
            "1990-01-01",                       // date_naiss
            "Ville",                            // lieu_naiss
            "06",                               // dpt_naiss
            "France",                           // pays_naiss
            "ano.jpg",                          // photo
            "1 rue exemple",                    // adresse
            "06000",                            // adresse_code
            "Nice",                             // adresse_ville
            "0600000000",                       // tel_perso
            matricule + "@perso.com",           // mail_perso
            "Actif",                            // statut
            "Agent",                            // grade
            "Animateur",                        // poste (valeur de l'enum)
            "0400000000",                       // tel_fixe
            "0700000000",                       // tel_pro
            matricule + "@pro.com",             // mail_pro
            userId,                             // user_id
            isAdmin ? 1 : 0                     // is_admin
          ]
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

    app.post("/login", async (req, res) => {
      const { matricule, password } = req.body;
    
      try {
        const [users] = await db.query(
          "SELECT l.id, l.matricule, l.password, a.is_admin, a.nom, a.prenom FROM logindata l " +
          "LEFT JOIN agentdata a ON l.id = a.user_id " +
          "WHERE l.matricule = ?",
          [matricule]
        );
        if (users.length === 0) {
          return res.json({ success: false, message: "Utilisateur non trouvé" });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);


        if (match) {
          // Générer JWT
          const token = jwt.sign({ id: user.id, matricule: user.matricule, isAdmin: user.is_admin === 1 }, secretKey, { expiresIn: "1h" });
      
          // Définir le cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
          });
      
          // UNE SEULE réponse qui contient à la fois les infos utilisateur et le message de succès
          return res.json({
            success: true,
            message: "Connexion réussie",
            user: {
              id: user.id,
              matricule: user.matricule,
              isAdmin: user.is_admin === 1,
              email: user.email,
              nom: user.nom,
              prenom: user.prenom
            }
          });
        } else {
          return res.json({ success: false, message: "Mot de passe invalide" });
        }
        // Supprimer tout code après ce point
      } catch (err) {
      // Gérer l'erreur
      console.error("Erreur de login:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Erreur serveur lors de la connexion" 
      });
    }
  });

    // Check current user
    app.get("/me", (req, res) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ loggedIn: false });

      try {
        const decoded = jwt.verify(token, secretKey);
        return res.json({
          loggedIn: true,
          user:{
            id: decoded.id,
            matricule: decoded.matricule,
            isAdmin: decoded.isAdmin,
          }
        });
      } catch {
        res.status(401).json({ loggedIn: false });
      }
    });

    // Logout
    app.post("/logout", (req, res) => {
      res.clearCookie("token");
      res.json({ success: true, message: "Déconnecté" });
    });

    app.get("/agent/profile", async (req, res) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "Non authentifié "});

      try {
        const decoded = jwt.verify(token, secretKey);
        const [rows] = await db.query(
          "SELECT * FROM agentdata WHERE user_id = ?",
          [decoded.id]
        );

        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Profil non trouvé" });
        }

        res.json({ success: true, agentData: rows[0] });
      } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: "Token invalide" });
      }
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
