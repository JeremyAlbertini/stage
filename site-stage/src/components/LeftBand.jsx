import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajustez le chemin selon votre structure

export default function LeftBand() {
  const { user, loading } = useAuth();

  if (loading) {
    return <nav style={{ padding: "1rem" }}>Chargement...</nav>;
  }

  const items = [
    { name: "Accueil", path: "/" },
    { name: "Utilisateurs", path: "/users" },
    { name: "Calendrier", path: "/calendar" },
    { name: "Mes Congés", path: "/conges" },
    { name: "Fiches Horaires", path: "/horaire" },
    { name: "Mes Contrats", path: "/contrat" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        width: "18%",
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