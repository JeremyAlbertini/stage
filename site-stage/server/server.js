const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const storage = require('./services/storage');
const multer = require("multer");
const upload = multer({ dest: "tmp/uploads/" });
const path = require('path');

const PORT = 5000;
const app = express();
app.use(express.json());
// Mise en Place de cookies pour garder JWT connecté
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Pour l'utilisation des Photos ([~] a possiblement changer pour sécurisation)
app.use(express.static(path.join(__dirname, '../public')));

// Clé JWT
const secretKey = "ifsuydgyufogifeglfueroiuhmugve";

// Connection mysql-promise
async function startServer() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "appuser",
      password: "motdepasse",
      database: "userdata"
    });
    console.log("✅ Connecté à la base de données MySQL");
    
// Commandes BackEnd

    await db.query(`
      CREATE TABLE IF NOT EXISTS conges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type_conge VARCHAR(50) NOT NULL,
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        duree FLOAT NOT NULL,
        commentaire TEXT,
        statut ENUM('En Attente', 'Approuvé', 'Refusé') DEFAULT 'En Attente',
        date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES logindata(id) ON DELETE CASCADE
      )
  ` );

    // Récupération de la liste de tous les utilisateurs
    // Simple requête SQL
    app.get("/users", async (req, res) => {
      try {
        const [rows] = await db.query("SELECT * FROM logindata");
        res.json(rows);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });
    
    // Création d'agent
    // Creation d'une nouvelle entrée dans la base SQL ainsi que Hashage du mot de passe pour éviter de l'avoir écrit en dur dans la DB
    app.post("/users/create", async (req, res) => {
        const {
            matricule, password, nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
          adresse, adresse_code, adresse_ville, tel_perso, mail_perso, statut, grade, poste,
          adresse_pro, stage, tel_fixe, tel_pro, mail_pro, isAdmin, perms
        } = req.body;
      
        if (!matricule || !password) {
            return res.status(400).json({ success: false, message: "Le matricule et le mot de passe sont requis." });
        }
        // Hashage ici
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        try {
            await db.beginTransaction();
        
            const [loginResult] = await db.query(
                "INSERT INTO logindata (matricule, password) VALUES (?, ?)",
                [matricule, hashedPassword]
            );
          
            const userId = loginResult.insertId;
          
            await db.query(
                `INSERT INTO agentdata (
                    matricule, nom, prenom, civilite, date_naiss, lieu_naiss,
                    dpt_naiss, pays_naiss, photo, adresse, adresse_code, adresse_ville,
                    tel_perso, mail_perso, statut, grade, poste, adresse_pro, stage,
                    tel_fixe, tel_pro, mail_pro, user_id, is_admin
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    matricule, nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
                    "ano.jpg", adresse, adresse_code, adresse_ville, tel_perso, mail_perso,
                    statut, grade, poste, adresse_pro, stage, tel_fixe, tel_pro, mail_pro, userId, isAdmin ? 1 : 0
                ]
            );

            if (perms) {
              await db.query(
                `INSERT INTO perms (user_id, change_perms, create_account, request, modify_account, all_users)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                  userId,
                  perms.change_perms || 0,
                  perms.create_account || 0,
                  perms.request || 0,
                  perms.modify_account || 0,
                  perms.all_users || 0
                ]
              );
            }
          
            await db.commit();
          
            res.status(201).json({ success: true, message: "Compte créé avec succès.", userId });
        } catch (err) {
            await db.rollback();
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "Ce matricule existe déjà" });
            }
            res.status(500).json({ success: false, message: "Erreur lors de la création de compte" });
        }
    });

    // Le app.put vient mettre les infos demandé dans la base de donnée
    app.put("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const {
        matricule, password, nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
        adresse, adresse_code, adresse_ville, tel_perso, mail_perso, statut, grade, poste,
        adresse_pro, stage, tel_fixe, tel_pro, mail_pro, isAdmin
      } = req.body;
    
      try {
        await db.beginTransaction();
    
        // Mettre à jour les informations dans la table `logindata`
        if (password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          await db.query(
            "UPDATE logindata SET password = ? WHERE id = ?",
            [hashedPassword, userId]
          );
        }
    
        // Mettre à jour les informations dans la table `agentdata`
        const [result] = await db.query(
          `UPDATE agentdata SET 
            matricule = ?, nom = ?, prenom = ?, civilite = ?, date_naiss = ?, lieu_naiss = ?, 
            dpt_naiss = ?, pays_naiss = ?, adresse = ?, adresse_code = ?, adresse_ville = ?, 
            tel_perso = ?, mail_perso = ?, statut = ?, grade = ?, poste = ?, adresse_pro = ?, 
            stage = ?, tel_fixe = ?, tel_pro = ?, mail_pro = ?, is_admin = ?
          WHERE user_id = ?`,
          [
            matricule, nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
            adresse, adresse_code, adresse_ville, tel_perso, mail_perso, statut, grade, poste,
            adresse_pro, stage, tel_fixe, tel_pro, mail_pro, isAdmin ? 1 : 0, userId
          ]
        );
    
        if (result.affectedRows === 0) {
          throw new Error("Aucune ligne mise à jour. Vérifiez l'ID de l'utilisateur.");
        }
    
        await db.commit();
        res.json({ success: true, message: "Utilisateur modifié avec succès." });
      } catch (err) {
        await db.rollback();
        console.error("Erreur lors de la modification de l'utilisateur :", err);
        res.status(500).json({ success: false, message: "Erreur lors de la modification de l'utilisateur." });
      }
    });

    // Verification pour une connection utilisateur en 3 étapes. 
    // On vérifie le matricule saisie ainsi que le mot de passe et le mot de passe hashé.
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
    
        if (!match) {
          return res.json({ success: false, message: "Mot de passe invalide" });
        }
    
        // ✅ CORRECTION : Génération des tokens uniquement si le mot de passe est correct
        const accessToken = jwt.sign(
          { id: user.id, matricule: user.matricule, isAdmin: user.is_admin === 1 },
          secretKey,
          { expiresIn: "1h" }
        );
    
        const refreshToken = jwt.sign(
          { id: user.id },
          secretKey,
          { expiresIn: "7d" }
        );
    
        // ✅ CORRECTION : Configuration des cookies sécurisés
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // HTTPS en production
          sameSite: "strict",
          maxAge: 60 * 60 * 1000 // 1 heure
        });
    
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });
    
        return res.json({
          success: true,
          message: "Connexion réussie",
          user: {
            id: user.id,
            matricule: user.matricule,
            isAdmin: user.is_admin === 1,
            nom: user.nom,
            prenom: user.prenom
          }
        });
    
      } catch (err) {
        console.error("Erreur de login:", err);
        return res.status(500).json({
          success: false,
          message: "Erreur serveur lors de la connexion"
        });
      }
    });

    
    const authenticateToken = async (req, res, next) => {
      const accessToken = req.cookies.accessToken;
      
      if (!accessToken) {
        // ✅ CORRECTION : Tentative de refresh automatique
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ success: false, message: "Tokens manquants" });
        }
    
        try {
          const decoded = jwt.verify(refreshToken, secretKey);
          
          // Récupérer les infos utilisateur
          const [users] = await db.query(
            "SELECT l.id, l.matricule, a.is_admin FROM logindata l " +
            "LEFT JOIN agentdata a ON l.id = a.user_id " +
            "WHERE l.id = ?",
            [decoded.id]
          );
    
          if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Utilisateur non trouvé" });
          }
    
          const user = users[0];
    
          // Génère un nouveau access token
          const newAccessToken = jwt.sign(
            { 
              id: user.id, 
              matricule: user.matricule, 
              isAdmin: user.is_admin === 1 
            },
            secretKey,
            { expiresIn: "1h" }
          );
    
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
          });
    
          req.user = { 
            id: user.id, 
            matricule: user.matricule, 
            isAdmin: user.is_admin === 1 
          };
          
          return next();
          
        } catch (err) {
          return res.status(401).json({ success: false, message: "Tokens invalides" });
        }
      }
    
      try {
        const decoded = jwt.verify(accessToken, secretKey);
        req.user = decoded;
        next();
      } catch (err) {
        // ✅ CORRECTION : Si access token expiré, tentative avec refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ success: false, message: "Access token invalide" });
        }
    
        try {
          const decodedRefresh = jwt.verify(refreshToken, secretKey);
          
          const [users] = await db.query(
            "SELECT l.id, l.matricule, a.is_admin FROM logindata l " +
            "LEFT JOIN agentdata a ON l.id = a.user_id " +
            "WHERE l.id = ?",
            [decodedRefresh.id]
          );
    
          if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Utilisateur non trouvé" });
          }
    
          const user = users[0];
    
          const newAccessToken = jwt.sign(
            { 
              id: user.id, 
              matricule: user.matricule, 
              isAdmin: user.is_admin === 1 
            },
            secretKey,
            { expiresIn: "1h" }
          );
    
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
          });
    
          req.user = { 
            id: user.id, 
            matricule: user.matricule, 
            isAdmin: user.is_admin === 1 
          };
          
          return next();
          
        } catch (refreshErr) {
          return res.status(401).json({ success: false, message: "Tous les tokens sont invalides" });
        }
      }
    };
    
    // Corriger l'endpoint /refresh
    app.post("/refresh", async (req, res) => {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Pas de refresh token" });
      }
    
      try {
        const decoded = jwt.verify(refreshToken, secretKey);
        
        // Récupérer les infos utilisateur pour le nouveau token
        const [users] = await db.query(
          "SELECT l.id, l.matricule, a.is_admin FROM logindata l " +
          "LEFT JOIN agentdata a ON l.id = a.user_id " +
          "WHERE l.id = ?",
          [decoded.id]
        );
    
        if (users.length === 0) {
          return res.status(403).json({ success: false, message: "Utilisateur non trouvé" });
        }
    
        const user = users[0];
    
        // Génère un nouveau access token avec toutes les infos nécessaires
        const newAccessToken = jwt.sign(
          { 
            id: user.id, 
            matricule: user.matricule, 
            isAdmin: user.is_admin === 1 
          },
          secretKey,
          { expiresIn: "1h" }
        );
    
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000
        });
    
        return res.json({ success: true });
      } catch (err) {
        return res.status(403).json({ success: false, message: "Refresh token invalide" });
      }
    });
    

    // Verification sur le reste des pages de qui est connecté via le JWT stocké dans les cookies.
    app.get("/me", async (req, res) => {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;
      
      if (!accessToken && !refreshToken) {
        return res.status(401).json({ loggedIn: false });
      }
    
      try {
        let decoded;
        
        // ✅ CORRECTION : Essayer d'abord avec l'access token
        if (accessToken) {
          try {
            decoded = jwt.verify(accessToken, secretKey);
          } catch (err) {
            // Si access token invalide, essayer avec refresh token
            if (refreshToken) {
              const refreshDecoded = jwt.verify(refreshToken, secretKey);
              
              // Récupérer les infos complètes de l'utilisateur
              const [users] = await db.query(
                "SELECT l.id, l.matricule, a.is_admin FROM logindata l " +
                "LEFT JOIN agentdata a ON l.id = a.user_id " +
                "WHERE l.id = ?",
                [refreshDecoded.id]
              );
    
              if (users.length === 0) {
                return res.status(401).json({ loggedIn: false });
              }
    
              const user = users[0];
              
              // Générer un nouveau access token
              const newAccessToken = jwt.sign(
                { 
                  id: user.id, 
                  matricule: user.matricule, 
                  isAdmin: user.is_admin === 1 
                },
                secretKey,
                { expiresIn: "1h" }
              );
    
              res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
              });
    
              decoded = { 
                id: user.id, 
                matricule: user.matricule, 
                isAdmin: user.is_admin === 1 
              };
            } else {
              return res.status(401).json({ loggedIn: false });
            }
          }
        } else if (refreshToken) {
          // Si pas d'access token, utiliser le refresh token directement
          const refreshDecoded = jwt.verify(refreshToken, secretKey);
          
          const [users] = await db.query(
            "SELECT l.id, l.matricule, a.is_admin FROM logindata l " +
            "LEFT JOIN agentdata a ON l.id = a.user_id " +
            "WHERE l.id = ?",
            [refreshDecoded.id]
          );
    
          if (users.length === 0) {
            return res.status(401).json({ loggedIn: false });
          }
    
          const user = users[0];
          
          const newAccessToken = jwt.sign(
            { 
              id: user.id, 
              matricule: user.matricule, 
              isAdmin: user.is_admin === 1 
            },
            secretKey,
            { expiresIn: "1h" }
          );
    
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
          });
    
          decoded = { 
            id: user.id, 
            matricule: user.matricule, 
            isAdmin: user.is_admin === 1 
          };
        }
    
        // Récupérer la photo de profil
        const [rows] = await db.query(
          "SELECT photo FROM agentdata WHERE user_id = ?",
          [decoded.id]
        );
    
        const photo = rows.length > 0 ? rows[0].photo : 'ano.jpg';
    
        return res.json({
          loggedIn: true,
          user: {
            id: decoded.id,
            matricule: decoded.matricule,
            isAdmin: decoded.isAdmin,
            avatar: photo !== 'ano.jpg' ? `/uploads/profiles/${photo}` : '/ano.jpg'
          }
        });
      } catch (err) {
        console.error("Erreur dans /me:", err);
        res.status(401).json({ loggedIn: false });
      }
    });

    app.post("/logout", (req, res) => {
      // ✅ CORRECTION : Nettoyer tous les cookies liés à l'authentification
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict"
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict"
      });
      
      // Nettoyer aussi l'ancien cookie "token" au cas où
      res.clearCookie("token");
      
      res.json({ success: true, message: "Déconnecté avec succès" });
    });
    
    // Corriger l'endpoint /perm/profile pour utiliser accessToken
    app.get("/perm/profile", async (req, res) => {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;
      
      if (!accessToken && !refreshToken) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }
    
      try {
        let decoded;
        
        if (accessToken) {
          try {
            decoded = jwt.verify(accessToken, secretKey);
          } catch (err) {
            // Fallback sur refresh token
            if (refreshToken) {
              decoded = jwt.verify(refreshToken, secretKey);
            } else {
              throw err;
            }
          }
        } else {
          decoded = jwt.verify(refreshToken, secretKey);
        }
        
        const [rows] = await db.query(
          "SELECT * FROM agentdata WHERE user_id = ?",
          [decoded.id]
        );
        
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Profil non trouvé" });
        }
        
        res.json({ success: true, agentData: rows[0] });
      } catch (err) {
        console.error("Erreur dans /perm/profile:", err);
        res.status(401).json({ success: false, message: "Token invalide" });
      }
    });

    // Exemple d'utilisation du middleware authenticateToken
    app.post('/upload/profile', authenticateToken, upload.single('photo'), async (req, res) => {
      try {
        const userId = req.user.id; // Utiliser req.user du middleware
        
        if (!req.file) {
          return res.status(400).json({ success: false, message: "Aucune photo fournie" });
        }
        
        const [rows] = await db.query("SELECT photo FROM agentdata WHERE user_id = ?", [userId]);
        const oldPhoto = rows.length > 0 ? rows[0].photo : null;
        
        const filename = await storage.saveProfileImage(userId, req.file);
        
        await db.query("UPDATE agentdata SET photo = ? WHERE user_id = ?", [filename, userId]);
        
        if (oldPhoto && oldPhoto !== 'ano.jpg') {
          await storage.deleteProfileImage(oldPhoto);
        }
        
        res.json({ 
          success: true, 
          message: "Photo de profil mise à jour", 
          imageUrl: storage.getImageUrl(filename)
        });
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        res.status(500).json({ success: false, message: "Erreur lors de l'upload" });
      }
    });
    
    // Et de même pour delete profile photo
    app.post('/delete/profile-photo', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        
        const [rows] = await db.query("SELECT photo FROM agentdata WHERE user_id = ?", [userId]);
        
        if (rows.length > 0 && rows[0].photo) {
            const currentPhoto = rows[0].photo;
            
            if (currentPhoto !== 'ano.jpg') {
                await storage.deleteProfileImage(currentPhoto);
            }
        }
        
        await db.query("UPDATE agentdata SET photo = 'ano.jpg' WHERE user_id = ?", [userId]);
        
        res.json({
            success: true,
            message: "Photo de profil supprimée"
        });
      } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          res.status(500).json({ success: false, message: "Erreur lors de la suppression" });
      }
    });

    app.get("/agents", async (req, res) => {
      const { page = 1, limit = 20, search = "", civilite = "", poste = "", adresse_pro = "", stage = "" } = req.query;
      const offset = (page - 1) * limit;
    
      try {
        // Requête principale pour récupérer les agents avec les filtres
        let query = `SELECT * FROM agentdata WHERE (nom LIKE ? OR prenom LIKE ? OR matricule LIKE ?)`;
        const params = [`%${search}%`, `%${search}%`, `%${search}%`];
    
        if (civilite) {
          query += ` AND civilite = ?`;
          params.push(civilite);
        }
    
        if (poste) {
          query += ` AND poste = ?`;
          params.push(poste);
        }
    
        if (adresse_pro) {
          query += ` AND adresse_pro = ?`;
          params.push(adresse_pro);
        }
    
        if (stage) {
          query += ` AND stage = ?`;
          params.push(stage);
        }
    
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));
    
        const [rows] = await db.query(query, params);
    
        // Requête pour calculer le total des agents avec les mêmes filtres
        let countQuery = `SELECT COUNT(*) as total FROM agentdata WHERE (nom LIKE ? OR prenom LIKE ? OR matricule LIKE ?)`;
        const countParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    
        if (civilite) {
          countQuery += ` AND civilite = ?`;
          countParams.push(civilite);
        }
    
        if (poste) {
          countQuery += ` AND poste = ?`;
          countParams.push(poste);
        }
    
        if (adresse_pro) {
          countQuery += ` AND adresse_pro = ?`;
          countParams.push(adresse_pro);
        }
    
        if (stage) {
          countQuery += ` AND stage = ?`;
          countParams.push(stage);
        }
    
        const [[{ total }]] = await db.query(countQuery, countParams);
    
        res.json({
          data: rows,
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / limit),
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des agents:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.get("/perms/:id/:nameofperms", async (req, res) => {
      const { id, nameofperms } = req.params;
      const allowedPerms = [
        "change_perms",
        "create_account",
        "request",
        "modify_account",
        "all_users"
      ];
    
      if (!allowedPerms.includes(nameofperms)) {
        return res.status(400).json({ success: false, message: "Permission inconnue" });
      }
    
      try {
        const [rows] = await db.query(
          `SELECT ?? FROM perms WHERE user_id = ?`,
          [nameofperms, id]
        );
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Utilisateur ou permission non trouvée" });
        }
        res.json({ success: true, value: rows[0][nameofperms] });
      } catch (err) {
        console.error("Erreur lors de la récupération des permissions:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.get("/perm/:id", async (req, res) => {
      const userId = req.params.id;
      try {
        const [rows] = await db.query(`
          SELECT 
            a.*, 
            l.password, 
            p.change_perms, p.create_account, p.request, p.modify_account, p.all_users
          FROM agentdata a
          LEFT JOIN logindata l ON a.user_id = l.id
          LEFT JOIN perms p ON a.user_id = p.user_id
          WHERE a.user_id = ?
          LIMIT 1
        `, [userId]);
    
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Agent non trouvé" });
        }
    
        res.json({
          success: true,
          agent: rows[0]
        });
      } catch (err) {
        console.error("Erreur /perm/:id :", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    // Ajoute ce endpoint dans ton serveur Express
    app.get("/perms/:id", async (req, res) => {
      try {
        const [rows] = await db.query("SELECT * FROM perms WHERE user_id = ?", [req.params.id]);
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        res.json({ success: true, perms: rows[0] });
      } catch (err) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    // Ajoute ce endpoint dans ton serveur Express
    app.put("/perms/:id", async (req, res) => {
      try {
        await db.query("UPDATE perms SET ? WHERE user_id = ?", [req.body, req.params.id]);
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.get("/agents/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const [rows] = await db.query(
          `SELECT 
            a.*, 
            p.change_perms, p.create_account, p.request, p.modify_account, p.all_users
          FROM agentdata a
          LEFT JOIN perms p ON a.user_id = p.user_id
          WHERE a.user_id = ?
          LIMIT 1`,
          [id]
        );
    
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Agent non trouvé" });
        }
    
        res.json({ success: true, agent: rows[0] });
      } catch (err) {
        console.error("Erreur /agents/:id :", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });
        // ---------------- Contrats Management ----------------
      
    // Get all contracts for a given matricule
    app.get("/contrats/:matricule", async (req, res) => {
      try {
        const { matricule } = req.params;

        const [rows] = await db.query(
          "SELECT * FROM contrats WHERE matricule = ? ORDER BY date_debut DESC",
          [matricule]
        );

        res.json(rows);
      } catch (err) {
        console.error("Erreur lors de la récupération des contrats:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });
    
    // Create a new contract
// Replace your contract creation endpoint in server.js with this:

  app.post("/contrats", authenticateToken, async (req, res) => {
    try {
      const {
        matricule,
        type_contrat,
        date_debut,
        date_fin,
        ca = 0,
        cf = 0,
        js = 0,
        rca = 0,
        heure = 0
      } = req.body;

      if (!matricule || !type_contrat || !date_debut || !date_fin) {
        return res.status(400).json({ success: false, message: "Champs requis manquants" });
      }

      const duree_contrat = Math.ceil(
        (new Date(date_fin) - new Date(date_debut)) / (1000 * 60 * 60 * 24)
      );

      await db.query(
        `INSERT INTO contrats 
          (matricule, type_contrat, date_debut, date_fin, duree_contrat, ca, cf, js, rca, heure, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [matricule, type_contrat, date_debut, date_fin, duree_contrat, ca, cf, js, rca, heure, req.user.id] // ✅ req.user.id vient du middleware
      );

      res.status(201).json({ success: true, message: "Contrat créé avec succès" });
    } catch (err) {
      console.error("Erreur lors de la création du contrat:", err);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  });

    
    // Update contract values (CA, CF, JS, heures, etc.)
    app.put("/contrats/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { ca, cf, js, rca, heure } = req.body;
      
        await db.query(
          `UPDATE contrats SET ca = ?, cf = ?, js = ?, rca = ?, heure = ? WHERE id = ?`,
          [ca, cf, js, rca, heure, id]
        );
      
        res.json({ success: true, message: "Contrat mis à jour" });
      } catch (err) {
        console.error("Erreur lors de la mise à jour du contrat:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    // Contrat Actif
    app.patch("/contrats/:id/activate", async (req, res) => {
      try {
        const { id } = req.params;
        await db.query(`UPDATE contrats SET statut = 'Actif' WHERE id = ?`, [id]);
        res.json({ success: true, message: "Contrat activé" });
      } catch (err) {
        console.error("Erreur lors de l'activation du contrat:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });
    
    // Archive a contract
    app.patch("/contrats/:id/archive", async (req, res) => {
      try {
        const { id } = req.params;
        await db.query(`UPDATE contrats SET statut = 'Inactif' WHERE id = ?`, [id]);
        res.json({ success: true, message: "Contrat archivé" });
      } catch (err) {
        console.error("Erreur lors de l'archivage du contrat:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });
    
    // Delete a contract
    app.delete("/contrats/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await db.query("DELETE FROM contrats WHERE id = ?", [id]);
        res.json({ success: true, message: "Contrat supprimé" });
      } catch (err) {
        console.error("Erreur lors de la suppression du contrat:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.get("/api/conges", authenticateToken, async (req, res) => {
      try {
        console.log("Requête GET /conges reçue, utilisateur:", req.user);

        if(!req.user || !req.user.id) {
          console.log("Utilisateur non authentifié");
          return res.status(401).json({ success: false, message: "Non autorisé" });
        }

        const [rows] = await db.query(`
          SELECT * FROM conges
          WHERE user_id = ?
          ORDER BY date_demande DESC
        `, [req.user.id]);

        console.log(`Congés trouvers pour l'utilisateur ${req.user.id}:`, rows.length);
        res.json(rows);
      } catch (err) {
        console.error("Erreur lors de la récupération des congés:", err);
        res.status(500).json({
          success: false,
          message: "Erreur serveur",
          error: err.message
        });
      }
    });

    app.post("/api/conges", authenticateToken,  async (req, res) => {
      try {
        const { type_conge, date_debut, date_fin, commentaire, duree } = req.body;

        if (!type_conge || !date_debut || !date_fin || !duree) {
          return res.status(400).json({
            sucess: false,
            message: "Informations manquantes pour la demande de congé"
          });
      }

        await db.query(
          `INSERT INTO conges (user_id, type_conge, date_debut, date_fin, duree, commentaire, statut, date_demande)
          VALUES (?, ?, ?, ?, ?, ?, 'En Attente', NOW())`,
          [req.user.id, type_conge, date_debut, date_fin, duree, commentaire || ""]
        );

        res.status(201).json({ success: true, message: "Demande de congé créée avec succès" });
      } catch (err) {
        console.error("Erreur lors de la création de la demande de congé:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.put("/api/conges/:id", authenticateToken, async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
          "UPDATE conges SET statut = ? WHERE id = ?",
          [status, id]
        );

        res.json({ success: true, message: "Statut de la demande mis à jour" });
      } catch (err) {
        console.error("Erreur lors de la mise à jour du statut:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.delete("/api/conges/:id", authenticateToken, async (req, res) => {
      try {
        const { id } = req.params;

        const [rows] = await db.query(
          "SELECT * FROM conges WHERE id = ? AND user_id = ?",
          [id, req.user.id]
        );

        if (rows.length === 0) {
          return res.status(403).json({
            success: false,
            message: "Vous n'êtes pas autorisé à annuler cette demande"
          });
        }

        if (rows[0].statut !== "En Attente") {
          return res.status(400).json({
            success: false,
            message: "Seules les demandes en attente peuvent être annulées"
          });
        }

        await db.query("DELETE FROM conges WHERE id = ?", [id]);

        res.json({ success: true, message: "Demande de congé annulée" });
      } catch (err) {
        console.error("Erreur lors de l'annulation de la demande:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    });

    app.get("/admin/conges", authenticateToken, async (req, res) => {
      try {
        if (!req.user.isAdmin) {
          return res.status(403).json({
            success: false,
            message: "Accès non autorisé"
          });
        }

        const [rows] = await db.query(`
          SELECT c.*, a.nom, a.prenom, a.matricule
          FROM conges c
          JOIN agentdata a ON c.user_id = a.user_id
          ORDER BY c.date_demande DESC
        `);

        res.json(rows);
      } catch (err) {
        console.error("Erreur lors de la récupératoin des demandes de congés:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
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
