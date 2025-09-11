/**
 * Hook de gestion des permissions utilisateur
 */


export async function getUserPerms(api, userId) {
  try {
    const data = await api.get(`http://localhost:5000/perms/${userId}`);
    console.log("Données des permissions reçues :", data);
    if (data?.success && data.perms) {
      return data.perms;
    }
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
