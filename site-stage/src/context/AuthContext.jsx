import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { hasAnyUserPerm } from "../utils/permsApi";
import { useApi } from "../hooks/useApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔹 Rafraîchir le token
  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/refresh", {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch (err) {
      console.error("Erreur refresh token :", err);
      return false;
    }
  }, []);

  // 🔹 Déconnexion
  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
      setUser(null);
      setPermissions({});
    }
  }, []);

  // 🔹 fetch sécurisé avec gestion refresh
  const authenticatedFetch = useCallback(
    async (url, options = {}) => {
      let response = await fetch(url, { ...options, credentials: "include" });
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          response = await fetch(url, { ...options, credentials: "include" });
        } else {
          await logout();
        }
      }
      return response;
    },
    [refreshToken, logout]
  );

  // 🔹 API basée sur authenticatedFetch
  const api = useApi(authenticatedFetch);

  // 🔹 Rafraîchir infos utilisateur + permissions
  const refreshUserData = useCallback(async () => {
    try {
      const res = await api.get("http://localhost:5000/me");
      if (!res.user) throw new Error("Non authentifié");

      setUser(res.user);

      if (res.user?.id) {
        const perms = await hasAnyUserPerm(api, res.user.id, [
          "create_account",
          "all_users",
        ]);
        setPermissions({ admin: perms });
      }
    } catch (err) {
      console.error("Erreur refreshUserData:", err);
      setUser(null);
      setPermissions({});
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 🔹 Vérification initiale au montage
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // 🔹 Vérifier permission depuis le contexte
  const checkPermission = (permKey) => permissions[permKey] || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        permissions,
        checkPermission,
        refreshUserData,
        logout,
        loading,
        authenticatedFetch, // 👈 exposé si tu veux l’utiliser direct
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
