USE userdata;

SET FOREIGN_KEY_CHECKS = 0;

-- Supprimer les tables
DROP TABLE IF EXISTS agentdata;
DROP TABLE IF EXISTS logindata;

-- Recréer les tables
CREATE TABLE IF NOT EXISTS logindata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS agentdata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    user_id INT,
    is_admin INT,
    FOREIGN KEY (user_id) REFERENCES logindata(id) ON DELETE CASCADE
);

-- Réactiver les contraintes
SET FOREIGN_KEY_CHECKS = 1;