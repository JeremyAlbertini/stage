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
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.static(path.join(__dirname, '../public')));

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
        const {
            matricule, password, isAdmin,
            nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
            adresse, adresse_code, adresse_ville,
            tel_perso, mail_perso, statut, grade, poste, tel_fixe, tel_pro, mail_pro
        } = req.body;
      
        if (!matricule || !password) {
            return res.status(400).json({ success: false, message: "Le matricule et le mot de passe sont requis." });
        }
      
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
                    tel_perso, mail_perso, statut, grade, poste, tel_fixe, tel_pro,
                    mail_pro, user_id, is_admin
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    matricule, nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
                    "ano.jpg", adresse, adresse_code, adresse_ville, tel_perso, mail_perso,
                    statut, grade, poste, tel_fixe, tel_pro, mail_pro, userId, isAdmin ? 1 : 0
                ]
            );
          
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

    app.put("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const {
        matricule, password, nom, prenom, civilite, date_naiss, lieu_naiss, dpt_naiss, pays_naiss,
        adresse, adresse_code, adresse_ville, tel_perso, mail_perso, statut, grade, poste,
        adresse_pro, stage, tel_fixe, tel_pro, mail_pro, isAdmin
      } = req.body;
    
      console.log("Requête reçue pour modifier l'utilisateur :", userId);
      console.log("Données reçues :", req.body);
    
      try {
        await db.beginTransaction();
    
        // Mettre à jour les informations dans la table `logindata`
        if (password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          console.log("Mise à jour du mot de passe pour l'utilisateur :", userId);
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
    
        console.log("Résultat de la mise à jour :", result);
    
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
          const token = jwt.sign({ id: user.id, matricule: user.matricule, isAdmin: user.is_admin === 1 }, secretKey, { expiresIn: "1h" });
      
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
          });
      
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
      } catch (err) {
      console.error("Erreur de login:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Erreur serveur lors de la connexion" 
      });
    }
  });

    // Check current user
    app.get("/me", async (req, res) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ loggedIn: false });

      try {
        const decoded = jwt.verify(token, secretKey);

        const [rows] = await db.query(
          "SELECT photo FROM agentdata WHERE user_id = ?",
          [decoded.id]
        );

        const photo = rows.length > 0 ? rows[0].photo : 'ano.jpg';

        return res.json({
          loggedIn: true,
          user:{
            id: decoded.id,
            matricule: decoded.matricule,
            isAdmin: decoded.isAdmin,
            avatar: photo !== 'ano.jpg' ? `/uploads/profiles/${photo}` : '/ano.jpg'
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

    app.get("/perm/profile", async (req, res) => {
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

    app.post('/upload/profile', upload.single('photo'), async (req, res) => {
      try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Non authentifié" });
    
        if (!req.file) {
          return res.status(400).json({ success: false, message: "Aucune photo fournie" });
        }
    
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id;
        
        const [rows] = await db.query("SELECT photo FROM agentdata WHERE user_id = ?", [userId]);
        const oldPhoto = rows.length > 0 ? rows[0].photo : null;
        
        const filename = await storage.saveProfileImage(userId, req.file);
        
        await db.query("UPDATE agentdata SET photo = ? WHERE user_id = ?", [filename, userId]);
        
        if (oldPhoto && oldPhoto !== 'ano.jpg') {
          await storage.deleteProfileImage(oldPhoto);
          console.log(`Ancienne photo supprimée: ${oldPhoto}`);
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

    app.post('/delete/profile-photo', async (req, res) => {
      try {
          const token = req.cookies.token;
          if (!token) return res.status(401).json({ success: false, message: "Non authentifié" });
          
          const decoded = jwt.verify(token, secretKey);
          const userId = decoded.id;
          
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
