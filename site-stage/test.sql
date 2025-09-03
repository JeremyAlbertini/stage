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
    --Personal
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
    -- Contact
    adresse VARCHAR(100) NOT NULL,
    adresse_code VARCHAR(10) NOT NULL,
    adresse_ville VARCHAR(100) NOT NULL,
    tel_perso varchar(15) NOT NULL,
    mail_perso VARCHAR(50) NOT NULL,
    -- Administratif
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
