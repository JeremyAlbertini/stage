CREATE DATABASE IF NOT EXISTS userdata
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE userdata;

CREATE TABLE IF NOT EXISTS logindata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS agentdata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    civilite ENUM('Monsieur', 'Madame', 'Mademoiselle') NOT NULL,
    date_naiss DATE NOT NULL,
    lieu_naiss VARCHAR(100) NOT NULL,
    dpt_naiss VARCHAR(5) NOT NULL,
    pays_naiss VARCHAR(25) NOT NULL,
    photo VARCHAR (50) NOT NULL DEFAULT 'ano.jpg',
    adresse VARCHAR(100) NOT NULL,
    adresse_code VARCHAR(10) NOT NULL,
    adresse_ville VARCHAR(100) NOT NULL,
    tel_perso varchar(15) NOT NULL,
    mail_perso VARCHAR(50) NOT NULL,
    statut varchar(25) NOT NULL,
    grade varchar(100) NOT NULL,
    poste ENUM('Chef de Service', 'Direction', 'Coordinateur', 'Directeur', 'Adjoint de Direction', 'Animateur') NOT NULL,
    adresse_pro ENUM('Néo', 'Impé', 'Sclos', 'Auberge'),
    stage ENUM('Terra', 'Mare', 'Boulega', 'Nice Chef', 'Découverte', 'Ski'),
    tel_fixe varchar(15) NOT NULL,
    tel_pro varchar(15) NOT NULL,
    mail_pro varchar(50) NOT NULL,
    user_id INT,
    is_admin INT,
    FOREIGN KEY (user_id) REFERENCES logindata(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contrats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL,
    type_contrat ENUM('Vacataire', 'Stage', 'Titulaire', 'Contractuel', 'Stagiaire', 'CDI') NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    duree_contrat INT NOT NULL,
    ca INT NOT NULL DEFAULT 0,
    cf INT NOT NULL DEFAULT 0,
    js INT NOT NULL DEFAULT 0,
    rca INT NOT NULL DEFAULT 0,
    heure INT NOT NULL DEFAULT 0,
    statut ENUM('Actif', 'Inactif') NOT NULL DEFAULT 'Actif',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES logindata(id) ON DELETE CASCADE,
    FOREIGN KEY (matricule) REFERENCES agentdata(matricule) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_conge ENUM('CA', 'CF', 'JS', 'RCA', 'CET', 'Congé Exceptionnel', 'Congé Enfant Malade') NOT NULL,
    commentaire TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    duree INT NOT NULL,
    statut ENUM('En Attente', 'Approuvé', 'Rejeté') NOT NULL DEFAULT 'En Attente',
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES logindata(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS perms (
    user_id INT AUTO ICREMENT,
    change_perms BOOLEAN DEFAULT FALSE,
    create_account BOOLEAN DEFAULT FALSE,
    request BOOLEAN DEFAULT FALSE,
    modify_account BOOLEAN DEFAULT FALSE,
    all_users BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES agentdata(user_id)
);