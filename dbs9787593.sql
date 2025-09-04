-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Hôte : db5011609404.hosting-data.io
-- Généré le : mar. 02 sep. 2025 à 12:37
-- Version du serveur : 8.0.36
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `dbs9787593`
--

-- --------------------------------------------------------

--
-- Structure de la table `competences`
--

CREATE TABLE `competences` (
  `id` int NOT NULL,
  `matricule` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `cp_piano` int NOT NULL,
  `cp_guitare` int NOT NULL,
  `cp_basse` int NOT NULL,
  `cp_batterie` int NOT NULL,
  `cp_musique` int NOT NULL,
  `cp_cuisine` int NOT NULL,
  `cp_tir_arc` int NOT NULL,
  `cp_escalade` int NOT NULL,
  `cp_photo` int NOT NULL,
  `cp_video` int NOT NULL,
  `cp_studio` int NOT NULL,
  `cp_graph` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competences`
--

INSERT INTO `competences` (`id`, `matricule`, `cp_piano`, `cp_guitare`, `cp_basse`, `cp_batterie`, `cp_musique`, `cp_cuisine`, `cp_tir_arc`, `cp_escalade`, `cp_photo`, `cp_video`, `cp_studio`, `cp_graph`) VALUES
(1, 'm121837', 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1),
(2, 'm123', 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0),
(5, 'm145783', 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0),
(6, 'm99', 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `conges`
--

CREATE TABLE `conges` (
  `id` int NOT NULL,
  `matricule` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `conges_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `conges_nbjour` double NOT NULL,
  `conges_debut` date NOT NULL,
  `conges_fin` date NOT NULL,
  `conges_validation` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `conges_date` date NOT NULL,
  `conges_com` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conges`
--

INSERT INTO `conges` (`id`, `matricule`, `conges_type`, `conges_nbjour`, `conges_debut`, `conges_fin`, `conges_validation`, `conges_date`, `conges_com`) VALUES
(5, 'm121837', 'CA', 12, '2025-02-03', '2025-02-18', 'non', '2025-02-01', ''),
(6, 'm121837', 'CA', 5, '2023-02-13', '2023-02-17', 'oui', '2023-02-13', ''),
(7, 'm121837', 'CA', 5, '2023-04-03', '2023-04-07', 'oui', '2023-04-03', ''),
(8, 'm121837', 'CA', 1, '2023-06-20', '2023-06-20', 'non', '2023-06-20', ''),
(9, 'm121837', 'CA', 5, '2023-08-28', '2023-09-01', 'oui', '2023-08-28', ''),
(10, 'm121837', 'CA', 2, '2023-12-07', '2023-12-08', 'non', '2023-08-28', ''),
(15, 'm121837', 'RCA', 3, '2024-03-06', '2024-03-08', 'oui', '2024-02-13', ''),
(17, 'm121837', 'CA', 1, '2024-02-06', '2024-02-06', 'oui', '0000-00-00', ''),
(20, 'm121837', 'CA', 5, '2026-02-10', '2026-02-13', 'non', '0000-00-00', ''),
(21, 'm121837', 'CF', 1, '2023-04-09', '2023-04-09', 'non', '2025-02-06', ''),
(22, 'm121837', 'JS', 1, '2025-02-14', '2025-02-14', 'oui', '2025-02-06', ''),
(29, 'm121837', 'CA', 1, '2025-02-20', '2025-02-20', 'oui', '2025-02-06', ''),
(38, 'm121837', 'JS', 1, '2025-04-17', '2025-04-17', 'oui', '2025-02-06', ''),
(39, 'm121837', 'JS', 3, '2025-06-04', '2025-06-06', 'non', '2025-02-06', ''),
(40, 'm121837', 'RCA', 1, '2025-03-12', '2025-03-12', 'oui', '2025-02-06', ''),
(41, 'm99', 'CA', 1, '2025-02-07', '2025-02-07', 'oui', '2025-02-06', ''),
(42, 'm121837', 'CA', 5, '2024-07-08', '2024-07-12', 'oui', '2025-02-06', ''),
(43, 'm121837', 'RCA', 4, '2024-12-30', '2025-01-03', 'oui', '2025-02-06', ''),
(44, 'm123', 'CA', 1, '2025-02-07', '2025-02-07', 'oui', '2025-02-07', ''),
(45, 'm123', 'CA', 1, '2025-02-07', '2025-02-07', 'oui', '2025-02-07', ''),
(46, 'm121837', 'CA', 6, '2025-10-09', '2025-10-16', 'att', '2025-02-12', ''),
(47, 'm121837', 'CA', 6, '2025-02-13', '2025-02-20', 'oui', '2025-02-12', ''),
(48, 'm121837', 'JS', 1, '2025-02-25', '2025-02-25', 'oui', '2025-02-25', ''),
(53, 'm121837', 'CA', 2, '2025-03-05', '2025-03-06', 'oui', '2025-03-05', ''),
(54, 'm121837', 'CA', 2, '2025-03-05', '2025-03-06', 'oui', '2025-03-05', ''),
(55, 'm121837', 'CA', 2, '2025-03-05', '2025-03-06', 'oui', '2025-03-05', ''),
(56, 'm121837', 'CA', 2, '2027-03-05', '2027-03-06', 'att', '2025-03-05', ''),
(57, 'm121837', 'CA', 2, '2026-03-05', '2026-03-06', 'oui', '2025-03-05', ''),
(58, 'm121837', 'CA', 2, '2023-03-05', '2023-03-06', 'oui', '2025-03-05', ''),
(59, 'm121837', 'JS', 1, '2024-03-06', '2024-03-06', 'att', '2025-03-05', ''),
(60, 'm121837', 'JS', 1, '2025-04-17', '2025-04-17', 'oui', '2025-03-05', ''),
(69, 'm121837', 'CF', 1, '2025-03-10', '2025-03-10', 'non', '2025-03-09', ''),
(70, 'm121837', 'CF', 1, '2025-03-10', '2025-03-10', 'non', '2025-03-09', ''),
(71, 'm121837', 'CF', 1, '2025-03-10', '2025-03-10', 'non', '2025-03-09', ''),
(72, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(73, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(74, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(75, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(76, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(77, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(78, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(79, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(80, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(81, 'm99', 'CA', 1, '2025-03-17', '2025-03-17', 'att', '2025-03-09', ''),
(82, 'm99', 'JS', 1, '2025-03-08', '2025-03-08', 'att', '2025-03-09', ''),
(83, 'm99', 'RCA', 1, '2025-03-05', '2025-03-05', 'att', '2025-03-09', ''),
(84, 'm99', 'RCA', 1, '2025-03-05', '2025-03-05', 'att', '2025-03-09', ''),
(85, 'm99', 'RCA', 1, '2025-03-05', '2025-03-05', 'att', '2025-03-09', ''),
(86, 'm99', 'RCA', 1, '2025-03-05', '2025-03-05', 'att', '2025-03-09', ''),
(87, 'm99', 'RCA', 1, '2025-03-05', '2025-03-05', 'att', '2025-03-09', ''),
(88, 'm99', 'RCA', 1, '2025-03-05', '2025-03-05', 'att', '2025-03-09', ''),
(89, 'm99', 'CF', 1, '2025-03-09', '2025-03-09', 'att', '2025-03-09', ''),
(90, 'm99', 'CF', 1, '2025-03-09', '2025-03-09', 'att', '2025-03-09', ''),
(91, 'm99', 'JS', 1, '2025-03-24', '2025-03-24', 'att', '2025-03-09', ''),
(92, 'm123', 'CA', 1, '2025-03-09', '2025-03-09', 'oui', '2025-03-09', ''),
(93, 'm123', 'JS', 1, '2025-03-03', '2025-03-03', 'att', '2025-03-09', ''),
(94, 'm123', 'JS', 1, '2025-03-03', '2025-03-03', 'att', '2025-03-09', ''),
(95, 'm123', 'JS', 1, '2025-03-03', '2025-03-03', 'att', '2025-03-09', ''),
(96, 'm123', 'CF', 1, '2025-03-09', '2025-03-09', 'att', '2025-03-09', ''),
(97, 'm121837', 'RCA', 1, '2025-04-16', '2025-04-16', 'att', '2025-04-16', ''),
(98, 'm145783', 'CA', 3, '2023-03-22', '2023-03-10', 'oui', '2025-04-22', ''),
(99, 'm145783', 'CA', 1, '2023-09-08', '2023-09-08', 'oui', '2025-04-22', ''),
(100, 'm145783', 'RCA', 4, '2024-01-02', '2024-01-05', 'att', '2025-04-22', ''),
(101, 'm121837', 'CA', 1, '2025-04-23', '2025-04-23', 'oui', '2025-04-23', ''),
(102, 'm121837', 'CET', 2, '2025-04-24', '2025-04-25', 'oui', '2025-04-24', ''),
(103, 'm121837', 'CET', 4, '2025-03-04', '2025-03-07', 'att', '2025-04-24', ''),
(104, 'm121837', 'CET', 1, '2023-01-20', '2023-01-20', 'non', '2025-04-24', '');

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE `contact` (
  `id` int NOT NULL,
  `matricule` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_prenom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_tel1` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_tel2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contact_mail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `lien_contact` varchar(15) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `contrat`
--

CREATE TABLE `contrat` (
  `id` int NOT NULL,
  `matricule` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `contrat_debut` date NOT NULL,
  `contrat_fin` date NOT NULL,
  `contrat_type` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `contrat_encours` varchar(3) COLLATE utf8mb4_general_ci NOT NULL,
  `CA` double DEFAULT NULL,
  `CF` double DEFAULT NULL,
  `JS` double DEFAULT NULL,
  `base_heure` int DEFAULT NULL,
  `CA_RCA` double NOT NULL,
  `CF_RCA` double NOT NULL,
  `JS_RCA` double NOT NULL,
  `CET` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contrat`
--

INSERT INTO `contrat` (`id`, `matricule`, `contrat_debut`, `contrat_fin`, `contrat_type`, `contrat_encours`, `CA`, `CF`, `JS`, `base_heure`, `CA_RCA`, `CF_RCA`, `JS_RCA`, `CET`) VALUES
(1, 'm121837', '2025-01-01', '2025-12-31', 'F.P.T. Titulaire', 'non', 25, 0, 3, 96420, 5, 0, 0, 0),
(2, 'm121837', '2024-01-01', '2024-12-31', 'F.P.T. Titulaire', 'non', 25, 2, 3, 96420, 19, 2, 2, 7),
(5, 'm123', '2025-01-01', '2025-12-31', 'F.P.T. Titulaire', 'oui', 25, 2, 3, 84862, 22, 1, 0, 0),
(6, 'm121837', '2023-01-01', '2023-12-31', 'F.P.T. Titulaire', 'non', 25, 2, 3, 96420, 8, 2, 3, 6),
(9, 'm99', '2025-01-01', '2025-12-31', 'F.P.T. Titulaire', 'oui', 25, 2, 3, 96420, 0, 0, 0, 0),
(10, 'm123', '2026-01-01', '2026-12-31', 'F.P.T. Titulaire', 'non', NULL, NULL, NULL, NULL, 0, 0, 0, 0),
(13, 'm145783', '2025-01-01', '2025-12-31', 'F.P.T. Titulaire', 'oui', 31, 2, 3, 96420, 0, 0, 0, 0),
(14, 'm121837', '2026-01-01', '2026-12-31', 'F.P.T. Titulaire', 'non', 25, 2, 3, 96420, 10, 0, 0, 0),
(15, 'm123', '2027-01-01', '2027-12-31', 'F.P.T. Titulaire', 'non', NULL, NULL, NULL, NULL, 0, 0, 0, 0),
(16, 'm121837', '2027-01-05', '2028-01-04', 'F.P.T. Titulaire', 'oui', 25, 2, 3, 96420, 0, 0, 0, 0),
(38, 'm145783', '2019-09-23', '2020-09-22', 'F.P.T. Contractuel', 'non', 25, 2, 0, 96420, 0, 0, 0, 0),
(39, 'm145783', '2020-09-23', '2021-07-31', 'F.P.T. Contractuel', 'non', 21.5, 2, 0, 82140, 0, 0, 0, 0),
(41, 'm99', '2026-01-09', '2026-12-31', 'F.P.T. Titulaire', 'non', 25, 2, 3, 96420, 0, 0, 0, 0),
(42, 'm123', '2024-01-01', '2024-12-31', 'F.P.T. Titulaire', 'non', NULL, NULL, NULL, NULL, 0, 0, 0, 0),
(46, 'm121837', '2022-01-01', '2022-12-31', 'F.P.T. Contractuel', 'non', 25, 2, 3, 96420, 0, 0, 0, 5),
(48, 'm145783', '2024-01-01', '2024-12-31', 'F.P.T. Titulaire', 'non', 30, 2, 3, 96420, 0, 0, 0, 0),
(49, 'm145783', '2023-01-01', '2023-12-31', 'F.P.T. Titulaire', 'non', 29, 2, 3, 96420, 0, 0, 0, 0),
(50, 'm145783', '2022-08-01', '2022-12-31', 'F.P.T. Titulaire', 'non', 10.5, 1, 0, 40140, 0, 0, 0, 0),
(51, 'm145783', '2021-08-01', '2022-07-31', 'F.P.T. Stagiaire', 'non', 25, 2, 0, 96420, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `diplomes`
--

CREATE TABLE `diplomes` (
  `id` int NOT NULL,
  `matricule` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `bafa` int NOT NULL,
  `bafa_form` int NOT NULL,
  `bafd` int NOT NULL,
  `bafd_form` int NOT NULL,
  `bp_ltp` int NOT NULL,
  `bp_apt` int NOT NULL,
  `uc_dir` int NOT NULL,
  `SB` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `diplomes`
--

INSERT INTO `diplomes` (`id`, `matricule`, `bafa`, `bafa_form`, `bafd`, `bafd_form`, `bp_ltp`, `bp_apt`, `uc_dir`, `SB`) VALUES
(1, 'm121837', 0, 1, 1, 0, 1, 1, 1, 1),
(2, 'm123', 1, 0, 0, 0, 0, 1, 1, 1),
(5, 'm145783', 0, 1, 0, 0, 0, 1, 1, 0),
(6, 'm99', 1, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `horaires`
--

CREATE TABLE `horaires` (
  `id` int NOT NULL,
  `matricule` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `H_debut` int NOT NULL,
  `H_fin` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `horaires`
--

INSERT INTO `horaires` (`id`, `matricule`, `date`, `H_debut`, `H_fin`) VALUES
(1, 'm121837', '2025-05-01', 120, 480);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `matricule` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `civilite` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `date_naiss` date NOT NULL,
  `lieu_naiss` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `dpt_naiss` varchar(5) NOT NULL,
  `pays_naiss` varchar(25) NOT NULL,
  `statut` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `grade` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `poste` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tel_fixe` varchar(15) NOT NULL,
  `tel_pro` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tel_perso` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `mail_pro` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `mail_perso` varchar(100) NOT NULL,
  `adresse` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `adresse_code` varchar(10) NOT NULL,
  `adresse_ville` varchar(100) NOT NULL,
  `adresse_pro` varchar(100) NOT NULL,
  `photo` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `profil` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(100) NOT NULL,
  `administrateur` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `matricule`, `civilite`, `nom`, `prenom`, `date_naiss`, `lieu_naiss`, `dpt_naiss`, `pays_naiss`, `statut`, `grade`, `poste`, `tel_fixe`, `tel_pro`, `tel_perso`, `mail_pro`, `mail_perso`, `adresse`, `adresse_code`, `adresse_ville`, `adresse_pro`, `photo`, `profil`, `password`, `administrateur`) VALUES
(1, 'm121837', 'Monsieur', 'GUILLOT', 'Cédric', '1978-01-02', 'Nice', '06', 'France', 'F.P.T. Titulaire', 'Animateur Territorial', 'Animateur', '0497134746', '0683979143', '0662493243', 'cedric.guillot@ville-nice.fr', 'cedric.guillot@ville-nice.fr', '74 avenue Général de Gaulle', '06340', 'Drap', 'Néo, 106 boulevard René Cassin, 06200 Nice', 'CG.png', '', '$2y$10$YBjcoj3ZgD01lI9PlsDvn.iT1tuF31c1lX013TLmNzHfagwgNCK7m', 1),
(2, 'm123', 'Monsieur', 'LAVILLE', 'Philippe', '1978-12-20', 'Nice', '06', 'France', 'Vacataire', 'Animateur Territorial', 'Animateur', '', '', '098787667655', '', 'cedruy@jkdlk.fr', 'route de la biere', '06340', 'la trinité', '31, Boulevard Impératrice Eugénie, 06200 Nice', 'ano.jpg', '', '$2y$10$9xoSszyZDGS0pFB5CsaSWeZRiffa3pL.7U1GoTp6a4FATtgfVPf5i', 0),
(5, 'm145783', 'Monsieur', 'FONDARD', 'Yan', '1994-04-09', 'Nice', '06', 'France', 'F.P.T. Titulaire', 'Adjoint animation', 'Animateur', '04 97 13 33 70', '06 40 29 75 89', '06 20 04 46 21', 'yan.fondard@ville-nice.fr', 'yanfondard@hotmail.fr', '1, place Général Goiran', '06100', 'Nice', 'Néo, 106 boulevard René Cassin, 06200 Nice', 'YF.jfif', '', '$2y$10$rNbeHzG4V0L0CJmO2NsbMOrQYXHLgj8NsyujMjvnK2jmgIdpXhtCy', 0),
(6, 'm99', 'Madame', 'GUILLOT', 'Emilie', '1983-08-03', 'Nice', '06', 'France', 'Vacataire', '', 'Animateur', '', '', '', '', '', 'Drap', '06340', 'DRAP', 'Néo, 106 boulevard René Cassin, 06200 Nice', 'ano.jpg', '', '$2y$10$rernKZFEZ1NLePGZdqdMIu7OdFoqfrt8KwmecPD87Spl.5zexpY9C', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `competences`
--
ALTER TABLE `competences`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `conges`
--
ALTER TABLE `conges`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contrat`
--
ALTER TABLE `contrat`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `diplomes`
--
ALTER TABLE `diplomes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `horaires`
--
ALTER TABLE `horaires`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `competences`
--
ALTER TABLE `competences`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `conges`
--
ALTER TABLE `conges`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT pour la table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat`
--
ALTER TABLE `contrat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT pour la table `diplomes`
--
ALTER TABLE `diplomes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `horaires`
--
ALTER TABLE `horaires`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
