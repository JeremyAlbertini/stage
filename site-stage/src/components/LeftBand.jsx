import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LeftBand() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.loggedIn && data.user.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <nav style={{ padding: "1rem" }}>Chargement...</nav>;
  }

  const items = [
    { name: "Accueil", path: "/" },
    { name: "Utilisateurs", path: "/users" },
    ...(isAdmin ? [{ name: "Administration", path: "/admin" }] : []),
    { name: "Paramètres", path: "/settings" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        width: "22%",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
      }}
    >
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          style={({ isActive }) => ({
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: isActive ? "blue" : "transparent",
            color: isActive ? "white" : "black",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}
