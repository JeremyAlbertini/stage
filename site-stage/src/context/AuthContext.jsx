import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rafraîchir le token via cookie
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

  // Requête authentifiée
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      credentials: "include", // ⚡ cookies envoyés
    });

    if (response.status === 401) {
      console.log("Token expiré → tentative de refresh...");
      const refreshed = await refreshToken();
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        console.log("Refresh échoué → déconnexion");
        logout();
      }
    }

    return response;
  }, [refreshToken]);

  // Récupérer infos utilisateur
  const refreshUserData = useCallback(async () => {
    try {
      const res = await authenticatedFetch("http://localhost:5000/me");
      console.log('Response from /me:', res);
      if (!res.ok) throw new Error("Non authentifié");
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  }, [authenticatedFetch]);

  const logout = useCallback(async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      authenticatedFetch,
      refreshUserData,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
