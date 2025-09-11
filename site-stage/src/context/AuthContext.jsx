import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

  const [loading, setLoading] = useState(true); // true au départ

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!accessToken && refreshToken) {
          const newToken = await refreshAccessToken();
          setAccessToken(newToken);
        }
  
        const res = await authenticatedFetch("http://localhost:5000/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erreur init auth :", err);
        logout();
      } finally {
        setLoading(false); // toujours mettre loading à false à la fin
      }
    };
  
    initAuth();
  }, []);
  
    

  // Rafraîchir le token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) throw new Error("Pas de refresh token");
    const res = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
      credentials: "include"
    });

    if (!res.ok) throw new Error("Impossible de rafraîchir le token");

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  }, [refreshToken]);

  // Requête authentifiée
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    let token = accessToken;

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : undefined
      },
      credentials: "include"
    });

    if (response.status === 401 && refreshToken) {
      try {
        token = await refreshAccessToken();
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        });
      } catch (err) {
        console.error("Erreur refresh token :", err);
        logout();
      }
    }

    return response;
  }, [accessToken, refreshToken, refreshAccessToken]);

  // Récupérer les infos de l'utilisateur
  const refreshUserData = useCallback(async () => {
    try {
      const res = await authenticatedFetch("http://localhost:5000/me");
      if (!res.ok) throw new Error("Non connecté");
      const data = await res.json();
      setUser(data.user || null);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  }, [authenticatedFetch]);

  const login = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // Au chargement, tenter de récupérer l'utilisateur automatiquement
  useEffect(() => {
    if (refreshToken && !user) {
      refreshUserData().catch(() => logout());
    }
  }, [refreshToken, user, refreshUserData]);

  return (
    <AuthContext.Provider value={{ authenticatedFetch, login, logout, accessToken, user, setUser, loading }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
