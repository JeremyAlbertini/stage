/**
 * Récupère la valeur d'une permission pour un utilisateur donné.
 * @param {number|string} userId - L'ID de l'utilisateur
 * @param {string} permName - Le nom de la permission (ex: "change_perms")
 * @returns {Promise<boolean|null>} La valeur de la permission ou null en cas d'erreur
 */
export async function getUserPerm(userId, permName) {
  try {
    const response = await fetch(`http://localhost:5000/perms/${userId}/${permName}`);
    const data = await response.json();
    if (response.ok && data.success) {
        console.log(`Permission ${permName} for user ${userId}:`, data.value);
      return data.value;
    }
    return null;
  } catch (err) {
    console.error("Erreur lors de la récupération de la permission :", err);
    return null;
  }
}

/**
 * Récupère toutes les données d'un utilisateur (profil, login, permissions).
 * @param {number|string} userId - L'ID de l'utilisateur
 * @returns {Promise<object|null>} Les données de l'utilisateur ou null en cas d'erreur
 */
export async function getUserData(userId) {
  try {
    const response = await fetch(`http://localhost:5000/perm/${userId}`);
    const data = await response.json();
    if (response.ok && data.success) {
      console.log(`Données complètes pour user ${userId}:`, data.agent);
      return data.agent;
    }
    return null;
  } catch (err) {
    console.error("Erreur lors de la récupération des données utilisateur :", err);
    return null;
  }
}

/**
 * Vérifie si un utilisateur possède toutes les permissions demandées.
 * @param {number|string} userId - L'ID de l'utilisateur
 * @param {string[]} permNames - Tableau des noms de permissions à vérifier
 * @returns {Promise<boolean>} true si toutes les permissions sont accordées, sinon false
 */
export async function hasUserPerms(userId, permNames) {
  try {
    const response = await fetch(`http://localhost:5000/perm/${userId}`);
    const data = await response.json();
    if (response.ok && data.success && data.agent) {
      // Vérifie chaque permission dans l'objet perms
      return permNames.every(perm => !!data.agent[perm]);
    }
    return false;
  } catch (err) {
    console.error("Erreur lors de la vérification des permissions :", err);
    return false;
  }
}

/**
 * Vérifie si un utilisateur possède au moins une des permissions demandées.
 * @param {number|string} userId - L'ID de l'utilisateur
 * @param {string[]} permNames - Tableau des noms de permissions à vérifier
 * @returns {Promise<boolean>} true si au moins une permission est accordée, sinon false
 */
export async function hasAnyUserPerm(userId, permNames) {
  try {
    const response = await fetch(`http://localhost:5000/perm/${userId}`);
    const data = await response.json();
    if (response.ok && data.success && data.agent) {
      // Retourne true si au moins une permission est accordée
      return permNames.some(perm => !!data.agent[perm]);
    }
    return false;
  } catch (err) {
    console.error("Erreur lors de la vérification des permissions :", err);
    return false;
  }
}

/**
 * Récupère toutes les permissions d'un utilisateur donné.
 * @param {number|string} userId - L'ID de l'utilisateur
 * @returns {Promise<object|null>} Un objet contenant toutes les permissions ou null en cas d'erreur
 */
export async function getUserPerms(userId) {
  try {
    const response = await fetch(`http://localhost:5000/perms/${userId}`);
    const data = await response.json();
    if (response.ok && data.success && data.perms) {
      // data.perms est l'objet contenant toutes les permissions
      return data.perms;
    }
    return null;
  } catch (err) {
    console.error("Erreur lors de la récupération des permissions utilisateur :", err);
    return null;
  }
}