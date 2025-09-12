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

  // ✅ CORRECTION : Fonction logout améliorée
  const logout = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        console.log("Déconnexion côté serveur réussie");
      } else {
        console.warn("Erreur côté serveur lors de la déconnexion:", res.status);
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      // ✅ Toujours nettoyer l'état utilisateur, même si la requête échoue
      setUser(null);
      console.log("Utilisateur déconnecté côté client");
    }
  }, []);

  // ✅ CORRECTION : Alias pour compatibilité
  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Requête authentifiée
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      credentials: "include",
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
        await logout(); // ✅ Utilisation de await
      }
    }

    return response;
  }, [refreshToken, logout]);

  // Récupérer infos utilisateur
  const refreshUserData = useCallback(async () => {
    try {
      const res = await authenticatedFetch("http://localhost:5000/me");
      console.log('Response from /me:', res);
      if (!res.ok) throw new Error("Non authentifié");
      const data = await res.json();
      console.log('User data received:', data);
      setUser(data.user || null);
    } catch (err) {
      console.error("Erreur lors de la récupération des données utilisateur:", err);
      setUser(null);
    }
  }, [authenticatedFetch]);

  // ✅ CORRECTION : Vérification initiale de l'authentification améliorée
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de l'authentification...");
        const res = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          console.log("Utilisateur non authentifié:", res.status);
          setUser(null);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification d'auth:", err);
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
      handleLogout, // ✅ Ajout de l'alias pour compatibilité
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};