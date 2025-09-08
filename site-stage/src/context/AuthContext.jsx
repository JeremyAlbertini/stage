import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- AJOUT
  const navigate = useNavigate();

  const refreshUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/me", {
        credentials: "include"
      });
      const data = await response.json();
      if (data.loggedIn) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
    }
  };

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null);
      navigate("/login", { replace: true });
    });
  };

  useEffect(() => {
    fetch("http://localhost:5000/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data.loggedIn ? data.user : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // <-- on arrête le "chargement"
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      handleLogout,
      loading,
      refreshUserData
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
