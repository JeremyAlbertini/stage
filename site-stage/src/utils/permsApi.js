/**
 * Hook de gestion des permissions utilisateur
 */

export async function getUserPerms(api, userId) {
  try {
    const data = await api.get(`http://localhost:5000/perms/${userId}`);
    if (data?.success && data.perms) {
      console.log("Permissions récupérées pour l'utilisateur", userId, ":", data.perms);
      return data.perms;
    }
    console.warn("Aucune permission trouvée pour l'utilisateur", userId);
    return null;
  } catch (err) {
    console.error("Erreur getUserPerms :", err);
    return null;
  }
}

export async function getUserPerm(api, userId, permName) {
  const perms = await getUserPerms(api, userId);
  if (!perms) return null;
  return !!perms[permName];
}

export async function hasUserPerms(api, userId, permNames) {
  const perms = await getUserPerms(api, userId);
  if (!perms) return false;
  return permNames.every(p => !!perms[p]);
}

export async function hasAnyUserPerm(api, userId, permNames) {
  const perms = await getUserPerms(api, userId);
  if (!perms) return false;
  return permNames.some(p => !!perms[p]);
}

export async function getUserData(api, userId) {
  try {
    const data = await api.get(`http://localhost:5000/perm/${userId}`);
    if (data?.success && data.agent) {
      return data.agent;
    }
    return null;
  } catch (err) {
    console.error("Erreur getUserData :", err);
    return null;
  }
}

export function hasAnyPerm(permissions, permNames) {
  if (!permissions) return false;
  return permNames.some(p => !!permissions[p]);
}

export function hasPerm(permissions, permName) {
  if (!permissions) return false;
  return !!permissions[permName];
}

export  function getPerm(permissions , permName) {
  if (!permissions) return null;
  return !!permissions[permName];
}