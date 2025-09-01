const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "appuser",
    password: "motdepasse",
    database: "userdata"
  });

db.connect((err) => {
  if (err) {
    console.error("Erreur MySQL:", err);
    return;
  }
  console.log("✅ Connecté à MySQL !");
});

// Endpoint pour récupérer tous les utilisateurs
app.get("http://localhost:5000/users", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM logindata");
      res.json(rows);
    } catch (err) {
      console.error(err); // <-- ça affichera l'erreur exacte
      res.status(500).send("Internal Server Error");
    }
  });
  

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur http://localhost:${PORT}`));
