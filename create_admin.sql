INSERT INTO logindata (matricule, password) 
VALUES ('admin', 'admin');

-- Récupérer l'ID nouvellement créé
SET @admin_id = LAST_INSERT_ID();

-- Créer l'entrée correspondante dans agentdata
INSERT INTO agentdata (matricule, email, nom, prenom, user_id, is_admin)
VALUES ('admin', 'admin@example.com', 'Admin', 'System', @admin_id, 1);

-- Vérifier que tout est bien créé
SELECT l.matricule, a.is_admin 
FROM logindata l
JOIN agentdata a ON l.id = a.user_id
WHERE l.matricule = 'admin';